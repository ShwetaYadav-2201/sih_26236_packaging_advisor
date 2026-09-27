from pydantic import BaseModel, Field
from typing import List, Optional, Tuple, Dict, Any

# Evidence Provenance Schema
class EvidenceSourceSchema(BaseModel):
    id: str
    title: str
    authors_or_org: str
    url_or_doi: str
    year: int
    evidence_class: str
    locator: str
    review_status: str
    notes: Optional[str] = None

class EvidentiaryValueSchema(BaseModel):
    value: float
    unit: str
    source_id: str
    evidence_class: str
    notes: Optional[str] = None

# Commodity Profile Schema
class CommodityProfileSchema(BaseModel):
    id: str
    name: str
    category: str
    cultivar_or_form: str
    maturity_stage: Optional[str] = None
    image: str
    description: str
    optimum_temp_range_c: List[float]
    chilling_injury_threshold_c: Optional[float] = None
    ethylene_production_rate: str
    ethylene_sensitivity: str
    default_pack_weight_kg: float
    default_desired_shelf_life_days: int

# Package Material Structure Schema
class PackageStructureSchema(BaseModel):
    id: str
    name: str
    trade_name: str
    category: str
    layer_structure: str
    total_thickness_microns: float
    is_experimental: bool
    is_commercial: bool
    recyclability_rating: str
    otr_value: float
    wvtr_value: float
    co2tr_value: Optional[float] = None
    heat_seal_window_c: List[float]
    indicative_cost_per_1k_usd: float
    supplier: str

# Scenario Request Schema
class ScenarioRequestSchema(BaseModel):
    commodity_id: str
    fill_mass_kg: float = Field(..., gt=0)
    package_area_m2: float = Field(0.08, gt=0)
    headspace_volume_l: float = Field(0.4, gt=0)
    transit_duration_days: int = Field(..., gt=0)
    product_temperature_c: float
    ambient_rh_percent: float = 75.0
    initial_o2_percent: float = 20.9
    initial_co2_percent: float = 0.04

# Trajectory & Simulation Response Schema
class TrajectoryPointSchema(BaseModel):
    day: int
    o2_percent: float
    co2_percent: float
    n2_percent: float
    moisture_content_percent: Optional[float] = None
    quality_status: str

class SimulationResultSchema(BaseModel):
    scenario_id: str
    candidate_id: str
    material_name: str
    trajectories: List[TrajectoryPointSchema]
    effective_shelf_life_days: int
    limiting_constraint: str
    is_feasible: bool
    model_type: str

class RecommendationResponseSchema(BaseModel):
    run_id: str
    scenario: ScenarioRequestSchema
    commodity: CommodityProfileSchema
    ranked_candidates: List[Dict[str, Any]]
    top_recommendation: Optional[Dict[str, Any]] = None

# Stress Test Request & Response Schema
class StressTestRequestSchema(BaseModel):
    original_scenario: ScenarioRequestSchema
    temp_offset_c: float = 0.0
    delay_days: int = 0
    mass_offset_kg: float = 0.0
    candidate_id: str

class FeasibilityAdjustmentSchema(BaseModel):
    id: str
    type: str
    title: str
    description: str
    actionable_change: str
    new_effective_shelf_life_days: int
    restores_feasibility: bool

class StressTestResponseSchema(BaseModel):
    original_result: SimulationResultSchema
    stressed_result: SimulationResultSchema
    changed_parameters: List[Dict[str, str]]
    status_changed: bool
    adjustments: List[FeasibilityAdjustmentSchema]

# Mixed Load Request & Response Schema
class MixedLoadRequestSchema(BaseModel):
    commodity_a_id: str
    commodity_b_id: str
    shared_air_enclosed: bool = True

class MixedLoadResponseSchema(BaseModel):
    commodity_a: CommodityProfileSchema
    commodity_b: CommodityProfileSchema
    shared_air: bool
    ethylene_conflict: Dict[str, Any]
    temperature_conflict: Dict[str, Any]
    overall_status: str

# Natural Language AI Request Schema
class AIParseRequestSchema(BaseModel):
    prompt: str

class AIParseResponseSchema(BaseModel):
    parsed_fields: Dict[str, Any]
    explanation: str
