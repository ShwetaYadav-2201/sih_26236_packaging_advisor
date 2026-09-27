import { PackageStructure } from '../types/material';
import { JourneyScenario, StressTestComparison, FeasibilityAdjustment } from '../types/simulation';
import { solveGasBalanceHeadspace } from './gasBalanceSolver';
import { solveMoistureGainBudget } from './moistureSolver';

export function runPackStressTest(
  originalScenario: JourneyScenario,
  stressedScenario: JourneyScenario,
  candidate: PackageStructure,
  allCandidates: PackageStructure[]
): StressTestComparison {
  const comm = originalScenario.commodity;

  // Run solver on original vs stressed scenario
  const origResult = comm.category === 'dry_food'
    ? solveMoistureGainBudget(originalScenario, candidate)
    : solveGasBalanceHeadspace(originalScenario, candidate);

  const stressedResult = comm.category === 'dry_food'
    ? solveMoistureGainBudget(stressedScenario, candidate)
    : solveGasBalanceHeadspace(stressedScenario, candidate);

  // Detect changed input parameters
  const changedParams: { parameter: string; originalVal: string; stressedVal: string }[] = [];
  if (originalScenario.productTemperatureC !== stressedScenario.productTemperatureC) {
    changedParams.push({
      parameter: 'Product Temperature (°C)',
      originalVal: `${originalScenario.productTemperatureC}°C`,
      stressedVal: `${stressedScenario.productTemperatureC}°C`
    });
  }
  if (originalScenario.transitDurationDays !== stressedScenario.transitDurationDays) {
    changedParams.push({
      parameter: 'Transit Duration (Days)',
      originalVal: `${originalScenario.transitDurationDays} Days`,
      stressedVal: `${stressedScenario.transitDurationDays} Days`
    });
  }
  if (originalScenario.fillMassKg !== stressedScenario.fillMassKg) {
    changedParams.push({
      parameter: 'Fill Mass (kg)',
      originalVal: `${originalScenario.fillMassKg} kg`,
      stressedVal: `${stressedScenario.fillMassKg} kg`
    });
  }
  if (originalScenario.ambientRHPercent !== stressedScenario.ambientRHPercent) {
    changedParams.push({
      parameter: 'Ambient RH (%)',
      originalVal: `${originalScenario.ambientRHPercent}%`,
      stressedVal: `${stressedScenario.ambientRHPercent}%`
    });
  }

  // Automated Feasibility Adjustments search if stressed result failed
  const adjustments: FeasibilityAdjustment[] = [];

  if (!stressedResult.isFeasible) {
    // Option A: Alternative Material switch
    const altFeasibleMat = allCandidates.find(mat => {
      if (mat.id === candidate.id) return false;
      const res = comm.category === 'dry_food'
        ? solveMoistureGainBudget(stressedScenario, mat)
        : solveGasBalanceHeadspace(stressedScenario, mat);
      return res.isFeasible;
    });

    if (altFeasibleMat) {
      const altRes = comm.category === 'dry_food'
        ? solveMoistureGainBudget(stressedScenario, altFeasibleMat)
        : solveGasBalanceHeadspace(stressedScenario, altFeasibleMat);

      adjustments.push({
        id: 'adj_switch_mat',
        type: 'switch_material',
        title: `Switch to ${altFeasibleMat.name}`,
        description: `Upgrade package film structure to handle higher stress environment.`,
        actionableChange: `Select ${altFeasibleMat.tradeName} (${altFeasibleMat.totalThicknessMicrons.value}µm)`,
        newEffectiveShelfLifeDays: altRes.effectiveShelfLifeDays,
        restoresFeasibility: true,
        suggestedMaterialId: altFeasibleMat.id
      });
    }

    // Option B: Temperature reduction
    if (stressedScenario.productTemperatureC > comm.optimumTempRangeC[1]) {
      const reducedTempScenario = { ...stressedScenario, productTemperatureC: comm.optimumTempRangeC[1] };
      const tempRes = comm.category === 'dry_food'
        ? solveMoistureGainBudget(reducedTempScenario, candidate)
        : solveGasBalanceHeadspace(reducedTempScenario, candidate);

      if (tempRes.isFeasible) {
        adjustments.push({
          id: 'adj_lower_temp',
          type: 'lower_temperature',
          title: `Refrigerate Truck to ${comm.optimumTempRangeC[1]}°C`,
          description: `Lower cargo temperature back within optimum storage boundary to dampen Q10 respiration.`,
          actionableChange: `Adjust reefer thermostat from ${stressedScenario.productTemperatureC}°C down to ${comm.optimumTempRangeC[1]}°C`,
          newEffectiveShelfLifeDays: tempRes.effectiveShelfLifeDays,
          restoresFeasibility: true
        });
      }
    }

    // Option C: Reduce Fill Mass
    const reducedMass = Number((stressedScenario.fillMassKg * 0.8).toFixed(2));
    const reducedMassScenario = { ...stressedScenario, fillMassKg: reducedMass };
    const massRes = comm.category === 'dry_food'
      ? solveMoistureGainBudget(reducedMassScenario, candidate)
      : solveGasBalanceHeadspace(reducedMassScenario, candidate);

    if (massRes.isFeasible) {
      adjustments.push({
        id: 'adj_reduce_mass',
        type: 'reduce_fill_mass',
        title: `Reduce Pack Fill Mass by 20% (${reducedMass} kg)`,
        description: `Decreasing product fill weight increases headspace volume ratio, reducing rate of gas depletion.`,
        actionableChange: `Reduce fill weight from ${stressedScenario.fillMassKg} kg to ${reducedMass} kg per pouch`,
        newEffectiveShelfLifeDays: massRes.effectiveShelfLifeDays,
        restoresFeasibility: true
      });
    }
  }

  return {
    originalScenario,
    originalResult: origResult,
    stressedScenario,
    stressedResult,
    changedParameters: changedParams,
    candidateStatusChanged: origResult.isFeasible !== stressedResult.isFeasible,
    limitingConstraintChanged: origResult.limitingConstraint !== stressedResult.limitingConstraint,
    feasibilityAdjustments: adjustments
  };
}
