import { EvidentiaryValue } from './evidence';

export type MaterialCategory = 
  | 'flexible_monolayer' 
  | 'high_barrier_laminate' 
  | 'micro_perforated_map' 
  | 'metallized_film' 
  | 'biodegradable_compostable';

export interface PackageStructure {
  id: string;
  name: string;
  tradeName: string;
  category: MaterialCategory;
  layerStructure: string; // e.g., "PET (12µm) / EVOH (5µm) / LLDPE (40µm)"
  totalThicknessMicrons: EvidentiaryValue<number>;
  isExperimental: boolean;
  isCommercial: boolean;
  recyclabilityRating: 'A+' | 'A' | 'B' | 'C' | 'Non-recyclable';

  // Gas & Vapour Barrier Properties (Measured at standard conditions)
  otr: EvidentiaryValue<number>; // Oxygen Transmission Rate in cm3(STP)/(m2 * 24h * atm) at 23°C, 0% RH
  wvtr: EvidentiaryValue<number>; // Water Vapour Transmission Rate in g/(m2 * 24h) at 38°C, 90% RH
  co2tr?: EvidentiaryValue<number>; // CO2 Transmission Rate in cm3(STP)/(m2 * 24h * atm)
  perforationsCountPerM2?: number; // For micro-perforated MAP films

  // Sealing & Mechanical properties
  heatSealWindowC: [number, number]; // e.g. [110, 140]
  tensileStrengthMPa?: EvidentiaryValue<number>;
  punctureresistanceN?: EvidentiaryValue<number>;

  // Commercial & Sustainability metadata
  indicativeCostPer1kPacksUSD: number; // e.g. $18.50 per 1,000 pouches
  bioBasedContentPercent?: number;
  compostabilityCert?: string;
  foodContactCertified: boolean;
  supplier: string;
}

export interface MaterialScreeningResult {
  material: PackageStructure;
  status: 'passes' | 'fails' | 'insufficient_data';
  passedConstraints: string[];
  failedConstraints: {
    constraint: string;
    targetValue: string;
    measuredValue: string;
    reason: string;
  }[];
  suitabilityScore: number; // 0 to 100 calculated score based on margin of safety & cost
  predictedShelfLifeDays: number;
  limitingFactor: string;
}
