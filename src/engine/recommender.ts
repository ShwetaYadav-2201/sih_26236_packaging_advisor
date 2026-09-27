import { CommodityProfile } from '../types/commodity';
import { PackageStructure, MaterialScreeningResult } from '../types/material';
import { JourneyScenario } from '../types/simulation';
import { solveGasBalanceHeadspace } from './gasBalanceSolver';
import { solveMoistureGainBudget } from './moistureSolver';

export function screenAndRankMaterials(
  scenario: JourneyScenario,
  candidateMaterials: PackageStructure[]
): MaterialScreeningResult[] {
  const comm = scenario.commodity;

  return candidateMaterials.map(mat => {
    const passed: string[] = [];
    const failed: { constraint: string; targetValue: string; measuredValue: string; reason: string }[] = [];

    // 1. Food contact certification check
    if (mat.foodContactCertified) {
      passed.push('FDA / EFSA Food Contact Compliance');
    } else {
      failed.push({
        constraint: 'Food Contact Safety',
        targetValue: 'Certified Food Safe',
        measuredValue: 'Uncertified',
        reason: 'Material lacks documented food-contact safety compliance certification.'
      });
    }

    // 2. Numerical Physics Simulation check (Gas balance vs Moisture)
    const simResult = comm.category === 'dry_food' 
      ? solveMoistureGainBudget(scenario, mat)
      : solveGasBalanceHeadspace(scenario, mat);

    if (simResult.isFeasible) {
      passed.push(`Shelf-Life Target (${scenario.transitDurationDays} days achieved without breach)`);
    } else {
      failed.push({
        constraint: comm.category === 'dry_food' ? 'Moisture Ingress Barrier' : 'Headspace Atmosphere Stability',
        targetValue: `Minimum ${scenario.transitDurationDays} Days`,
        measuredValue: `${simResult.effectiveShelfLifeDays} Days`,
        reason: simResult.limitingConstraint
      });
    }

    // 3. Category-specific heuristic screening
    if (comm.category === 'dry_food') {
      if (mat.wvtr.value <= 3.0) {
        passed.push(`High Water Vapour Barrier (WVTR ${mat.wvtr.value} g/m²·day)`);
      } else {
        failed.push({
          constraint: 'WVTR Barrier Limit',
          targetValue: '≤ 3.0 g/m²·day',
          measuredValue: `${mat.wvtr.value} g/m²·day`,
          reason: 'Excessive water vapour transmission causes rapid loss of snack crispness.'
        });
      }
    } else {
      // Fresh produce
      if (comm.respirationRate20C && comm.respirationRate20C.value > 30.0) {
        // High respiration fruit requires high OTR film
        if (mat.otr.value >= 1000.0) {
          passed.push(`Compatible Gas Permeance (OTR ${mat.otr.value} cm³/m²·day)`);
        } else {
          failed.push({
            constraint: 'Oxygen Transmission Permeance',
            targetValue: '≥ 1,000 cm³/m²·day',
            measuredValue: `${mat.otr.value} cm³/m²·day`,
            reason: 'Low OTR film suffocates high-respiration produce, causing anaerobic fermentation.'
          });
        }
      }
    }

    const isOverallPass = failed.length === 0;

    // Calculate Suitability Score (0-100)
    let score = 50;
    if (isOverallPass) score += 35;
    if (mat.recyclabilityRating === 'A+' || mat.recyclabilityRating === 'A') score += 10;
    if (mat.indicativeCostPer1kPacksUSD < 20.0) score += 5;
    score -= failed.length * 25;
    score = Math.max(0, Math.min(100, score));

    return {
      material: mat,
      status: (isOverallPass ? 'passes' : 'fails') as 'passes' | 'fails' | 'insufficient_data',
      passedConstraints: passed,
      failedConstraints: failed,
      suitabilityScore: score,
      predictedShelfLifeDays: simResult.effectiveShelfLifeDays,
      limitingFactor: simResult.limitingConstraint
    };
  }).sort((a, b) => b.suitabilityScore - a.suitabilityScore);
}
