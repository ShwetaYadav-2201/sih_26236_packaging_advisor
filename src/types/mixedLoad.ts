import { CommodityProfile } from './commodity';

export type ConflictSeverity = 'critical_hazard' | 'moderate_caution' | 'compatible' | 'not_assessed';

export interface CompatibilityFinding {
  commodityA: CommodityProfile;
  commodityB: CommodityProfile;
  sharedAirEnclosed: boolean;
  ethyleneConflict: {
    hasConflict: boolean;
    severity: ConflictSeverity;
    producerCommodity: string;
    sensitiveCommodity: string;
    mechanism: string; // e.g., "Bananas produce 10-100 µL/kg·h C2H4 inducing russet spotting in lettuce"
    mitigation: string;
    sourceId: string;
  };
  temperatureConflict: {
    hasConflict: boolean;
    severity: ConflictSeverity;
    tempA: [number, number];
    tempB: [number, number];
    chillingRisk: string;
    mitigation: string;
    sourceId: string;
  };
  overallStatus: ConflictSeverity;
}
