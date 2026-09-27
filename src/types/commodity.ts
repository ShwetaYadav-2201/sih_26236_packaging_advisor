import { EvidentiaryValue } from './evidence';

export type CommodityCategory = 'fresh_produce' | 'dry_food' | 'processed';

export interface CommodityProfile {
  id: string;
  name: string;
  category: CommodityCategory;
  cultivarOrForm: string;
  maturityStage?: string;
  image: string;
  description: string;

  // Fresh produce respiration parameters (if applicable)
  respirationRate20C?: EvidentiaryValue<number>; // nmol/(kg*s) or mg CO2/(kg*h)
  q10Respiration?: EvidentiaryValue<number>; // Temperature coefficient (typically 2.0 - 2.5)
  respiratoryQuotient?: EvidentiaryValue<number>; // RQ = CO2 produced / O2 consumed

  // Gas atmospheric bounds
  minO2Percent?: EvidentiaryValue<number>; // Lower aerobic limit (%)
  maxCO2Percent?: EvidentiaryValue<number>; // Upper injury limit (%)
  targetO2Range?: [number, number]; // Optimum MAP range
  targetCO2Range?: [number, number];

  // Dry food moisture parameters (if applicable)
  initialMoisturePercent?: EvidentiaryValue<number>; // wet basis %
  criticalMoisturePercent?: EvidentiaryValue<number>; // moisture content at crispness/quality failure
  waterActivityLimit?: EvidentiaryValue<number>; // aw limit e.g. 0.40 for chips

  // Temperature & ethylene properties
  optimumTempRangeC: [number, number];
  chillingInjuryThresholdC?: number;
  ethyleneProductionRate: 'very_low' | 'low' | 'moderate' | 'high' | 'very_high';
  ethyleneSensitivity: 'low' | 'moderate' | 'high' | 'extremely_high';

  // Default packaging assumptions
  defaultPackWeightKg: number;
  defaultHeadspaceRatio: number; // Headspace volume / pack volume ratio
  defaultDesiredShelfLifeDays: number;
}
