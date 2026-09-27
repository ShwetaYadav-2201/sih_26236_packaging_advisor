import { CommodityProfile } from './commodity';
import { PackageStructure } from './material';

export interface JourneyScenario {
  id: string;
  commodity: CommodityProfile;
  fillMassKg: number;
  packageAreaM2: number;
  headspaceVolumeL: number;
  transitDurationDays: number;
  productTemperatureC: number;
  ambientRHPercent: number;
  initialO2Percent: number;
  initialCO2Percent: number;
  storageType: 'ambient_truck' | 'reefer_cold_chain' | 'controlled_atmosphere';
  notes?: string;
}

export interface TrajectoryPoint {
  day: number;
  o2Percent: number;
  co2Percent: number;
  n2Percent: number;
  moistureContentPercent?: number;
  qualityStatus: 'optimal' | 'acceptable' | 'warning' | 'spoiled';
}

export interface SimulationResult {
  scenarioId: string;
  candidateId: string;
  materialName: string;
  trajectories: TrajectoryPoint[];
  aerobicLimitBreachedDay?: number;
  co2InjuryLimitBreachedDay?: number;
  moistureLimitBreachedDay?: number;
  effectiveShelfLifeDays: number;
  limitingConstraint: string;
  isFeasible: boolean;
  modelType: 'gas_balance_differential' | 'moisture_sorption_budget';
  confidenceRating: 'high_reviewed' | 'moderate_extrapolated' | 'low_assumed';
}

export interface StressTestComparison {
  originalScenario: JourneyScenario;
  originalResult: SimulationResult;
  stressedScenario: JourneyScenario;
  stressedResult: SimulationResult;
  changedParameters: {
    parameter: string;
    originalVal: string;
    stressedVal: string;
  }[];
  candidateStatusChanged: boolean;
  limitingConstraintChanged: boolean;
  feasibilityAdjustments?: FeasibilityAdjustment[];
}

export interface FeasibilityAdjustment {
  id: string;
  type: 'switch_material' | 'reduce_fill_mass' | 'lower_temperature' | 'shorten_duration';
  title: string;
  description: string;
  actionableChange: string;
  newEffectiveShelfLifeDays: number;
  restoresFeasibility: boolean;
  suggestedMaterialId?: string;
}
