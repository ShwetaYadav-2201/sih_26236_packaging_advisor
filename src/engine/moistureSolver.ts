import { PackageStructure } from '../types/material';
import { JourneyScenario, SimulationResult, TrajectoryPoint } from '../types/simulation';

/**
 * Dry Food Moisture Gain & Sorption Budget Solver
 * Calculates cumulative moisture ingress based on WVTR, film area, fill weight, temperature, and RH gradient.
 */
export function solveMoistureGainBudget(
  scenario: JourneyScenario,
  material: PackageStructure
): SimulationResult {
  const comm = scenario.commodity;
  const massKg = scenario.fillMassKg;
  const areaM2 = scenario.packageAreaM2;
  const totalDays = scenario.transitDurationDays;
  const tempC = scenario.productTemperatureC;
  const ambientRH = scenario.ambientRHPercent;

  const initMoisture = comm.initialMoisturePercent?.value ?? 1.5;
  const critMoisture = comm.criticalMoisturePercent?.value ?? 2.5;

  // WVTR measured at 38°C, 90% RH
  // Apply Arrhenius temperature scaling factor for water vapor permeability
  const wvtrStandard = material.wvtr.value;
  const tempScaling = Math.pow(1.04, tempC - 38.0); // ~4% change per °C
  const rhGradientFactor = Math.max(0.1, (ambientRH - 10.0) / 90.0);
  const dailyWvtrGramsPerM2 = wvtrStandard * tempScaling * rhGradientFactor;

  // Total daily moisture gain in grams
  const dailyWaterGainGrams = dailyWvtrGramsPerM2 * areaM2;
  // Convert to % moisture increase relative to dry product mass (massKg * 1000g)
  const dailyMoisturePercentIncrease = (dailyWaterGainGrams / (massKg * 1000.0)) * 100.0;

  const trajectories: TrajectoryPoint[] = [];
  let currMoisture = initMoisture;
  let moistureBreachedDay: number | undefined = undefined;
  let isFeasible = true;
  let limitingFactor = 'None (Moisture barrier sufficient to maintain crispness)';

  for (let day = 0; day <= totalDays; day++) {
    trajectories.push({
      day,
      o2Percent: 20.9,
      co2Percent: 0.04,
      n2Percent: 79.0,
      moistureContentPercent: Number(currMoisture.toFixed(2)),
      qualityStatus: currMoisture > critMoisture ? 'spoiled' :
                    currMoisture > critMoisture - 0.3 ? 'warning' : 'optimal'
    });

    if (day === totalDays) break;

    currMoisture += dailyMoisturePercentIncrease;

    if (currMoisture > critMoisture && moistureBreachedDay === undefined) {
      moistureBreachedDay = day + 1;
      isFeasible = false;
      limitingFactor = `Loss of Crispness / Textural Failure: Moisture content reached ${currMoisture.toFixed(2)}% on Day ${day + 1} (exceeded threshold ${critMoisture}%).`;
    }
  }

  return {
    scenarioId: scenario.id,
    candidateId: material.id,
    materialName: material.name,
    trajectories,
    moistureLimitBreachedDay: moistureBreachedDay,
    effectiveShelfLifeDays: moistureBreachedDay ?? totalDays,
    limitingConstraint: limitingFactor,
    isFeasible,
    modelType: 'moisture_sorption_budget',
    confidenceRating: 'high_reviewed'
  };
}
