import { CompatibilityFinding } from '../types/mixedLoad';
import { CommodityProfile } from '../types/commodity';

export function evaluateMixedLoadPair(
  commA: CommodityProfile,
  commB: CommodityProfile,
  sharedAir: boolean
): CompatibilityFinding {
  let ethSeverity: 'critical_hazard' | 'moderate_caution' | 'compatible' | 'not_assessed' = 'compatible';
  let hasEthConflict = false;
  let producer = '';
  let sensitive = '';
  let ethMechanism = '';
  let ethMitigation = '';

  // Check Ethylene Conflict
  const isAProducerHigh = commA.ethyleneProductionRate === 'high' || commA.ethyleneProductionRate === 'very_high';
  const isBProducerHigh = commB.ethyleneProductionRate === 'high' || commB.ethyleneProductionRate === 'very_high';
  const isASensitive = commA.ethyleneSensitivity === 'high' || commA.ethyleneSensitivity === 'extremely_high';
  const isBSensitive = commB.ethyleneSensitivity === 'high' || commB.ethyleneSensitivity === 'extremely_high';

  if (sharedAir) {
    if (isAProducerHigh && isBSensitive) {
      hasEthConflict = true;
      ethSeverity = 'critical_hazard';
      producer = commA.name;
      sensitive = commB.name;
      ethMechanism = `${commA.name} is a high climacteric ethylene producer. Emitted C2H4 triggers accelerated senescent spot formation, chlorophyll degradation, and physiological breakdown in sensitive ${commB.name}.`;
      ethMitigation = `Physically isolate airflow with independent refrigeration chambers or integrate inline catalytic ethylene scrubbers / 1-MCP treatment.`;
    } else if (isBProducerHigh && isASensitive) {
      hasEthConflict = true;
      ethSeverity = 'critical_hazard';
      producer = commB.name;
      sensitive = commA.name;
      ethMechanism = `${commB.name} releases elevated ethylene gas, causing severe browning, russet spotting, or texture loss in sensitive ${commA.name}.`;
      ethMitigation = `Store in segregated reefer units with separate air handling systems.`;
    } else if (commA.ethyleneProductionRate === 'moderate' && isBSensitive) {
      hasEthConflict = true;
      ethSeverity = 'moderate_caution';
      producer = commA.name;
      sensitive = commB.name;
      ethMechanism = `Moderate ethylene production from ${commA.name} may reduce shelf-life of ${commB.name} over extended transit times (>7 days).`;
      ethMitigation = `Monitor gas levels and maintain maximum ventilation rates.`;
    }
  } else {
    ethMechanism = 'Airflow is physically isolated between commodities. Ethylene cross-exposure risk is negligible.';
    ethMitigation = 'Ensure seal integrity of individual cargo compartments.';
  }

  // Check Temperature Conflict
  let tempSeverity: 'critical_hazard' | 'moderate_caution' | 'compatible' | 'not_assessed' = 'compatible';
  let hasTempConflict = false;
  let tempChillingRisk = '';
  let tempMitigation = '';

  const minOptA = commA.optimumTempRangeC[0];
  const maxOptA = commA.optimumTempRangeC[1];
  const minOptB = commB.optimumTempRangeC[0];
  const maxOptB = commB.optimumTempRangeC[1];

  // Overlap test
  const overlapMin = Math.max(minOptA, minOptB);
  const overlapMax = Math.min(maxOptA, maxOptB);

  if (overlapMin > overlapMax) {
    hasTempConflict = true;
    const gap = Math.abs(minOptA - minOptB);

    if (gap >= 8.0) {
      tempSeverity = 'critical_hazard';
      tempChillingRisk = `Incompatible storage temperatures: ${commA.name} optimum is ${minOptA}-${maxOptA}°C, while ${commB.name} optimum is ${minOptB}-${maxOptB}°C. Setting thermostat low causes chilling injury in ${minOptA > minOptB ? commA.name : commB.name}; setting it high causes rapid spoilage in the other.`;
      tempMitigation = `Requires multi-temperature multi-zone transport container or separate transport trucks.`;
    } else {
      tempSeverity = 'moderate_caution';
      tempChillingRisk = `Temperature compromise required. Optimum ranges differ by ${gap.toFixed(1)}°C.`;
      tempMitigation = `Set compromise thermostat temperature at ~${((overlapMin + overlapMax)/2).toFixed(1)}°C and accept reduced shelf-life margin.`;
    }
  } else {
    tempChillingRisk = `Thermal compatibility verified. Shared optimum storage range: ${overlapMin.toFixed(1)}°C to ${overlapMax.toFixed(1)}°C.`;
    tempMitigation = `Set container thermostat within ${overlapMin.toFixed(1)}°C - ${overlapMax.toFixed(1)}°C.`;
  }

  // Determine overall status
  let overall: 'critical_hazard' | 'moderate_caution' | 'compatible' | 'not_assessed' = 'compatible';
  if (ethSeverity === 'critical_hazard' || tempSeverity === 'critical_hazard') {
    overall = 'critical_hazard';
  } else if (ethSeverity === 'moderate_caution' || tempSeverity === 'moderate_caution') {
    overall = 'moderate_caution';
  }

  return {
    commodityA: commA,
    commodityB: commB,
    sharedAirEnclosed: sharedAir,
    ethyleneConflict: {
      hasConflict: hasEthConflict,
      severity: ethSeverity,
      producerCommodity: producer,
      sensitiveCommodity: sensitive,
      mechanism: ethMechanism,
      mitigation: ethMitigation,
      sourceId: 'ucdavis_lettuce'
    },
    temperatureConflict: {
      hasConflict: hasTempConflict,
      severity: tempSeverity,
      tempA: commA.optimumTempRangeC,
      tempB: commB.optimumTempRangeC,
      chillingRisk: tempChillingRisk,
      mitigation: tempMitigation,
      sourceId: 'ucdavis_banana'
    },
    overallStatus: overall
  };
}
