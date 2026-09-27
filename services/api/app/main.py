import uuid
from typing import List, Dict, Any
from fastapi import FastAPI, HTTPException, Path, Body
from fastapi.middleware.cors import CORSMiddleware

from app.schemas import (
    CommodityProfileSchema, PackageStructureSchema, EvidenceSourceSchema,
    ScenarioRequestSchema, RecommendationResponseSchema, StressTestRequestSchema,
    StressTestResponseSchema, MixedLoadRequestSchema, MixedLoadResponseSchema,
    AIParseRequestSchema, AIParseResponseSchema
)
from app.seed_data import COMMODITIES_DB, MATERIALS_DB, EVIDENCE_SOURCES_DB
from app.physics_engine import solve_gas_balance_headspace_python, solve_moisture_budget_python

app = FastAPI(
    title="Packaging Advisor API Engine",
    description="RESTful scientific packaging recommendation & headspace ODE dynamics backend",
    version="1.0.0"
)

# Enable CORS for React frontend origin
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory storage for runs and shares
SAVED_RUNS_DB: Dict[str, Dict[str, Any]] = {}
SHARED_TOKENS_DB: Dict[str, Dict[str, Any]] = {}

@app.get("/health", tags=["Health"])
def health_check():
    return {
        "status": "healthy",
        "service": "Packaging Advisor FastAPI Engine",
        "version": "1.0.0",
        "engine_active": True
    }

@app.get("/api/v1/commodities", tags=["Commodities"])
def get_commodities():
    return {"commodities": COMMODITIES_DB, "total": len(COMMODITIES_DB)}

@app.get("/api/v1/materials", tags=["Materials"])
def get_materials():
    return {"materials": MATERIALS_DB, "total": len(MATERIALS_DB)}

@app.get("/api/v1/evidence/{source_id}", tags=["Evidence Provenance"])
def get_evidence(source_id: str = Path(...)):
    source = EVIDENCE_SOURCES_DB.get(source_id)
    if not source:
        raise HTTPException(status_code=404, detail=f"Evidence source ID '{source_id}' not found.")
    return {"evidence": source}

@app.post("/api/v1/recommendations", tags=["Recommendations Engine"])
def create_recommendation(scenario: ScenarioRequestSchema):
    comm = next((c for c in COMMODITIES_DB if c["id"] == scenario.commodity_id), None)
    if not comm:
        raise HTTPException(status_code=404, detail=f"Commodity ID '{scenario.commodity_id}' not found.")

    ranked_results = []
    for mat in MATERIALS_DB:
        passed = []
        failed = []

        if comm.get("category") == "dry_food":
            sim = solve_moisture_budget_python(
                commodity=comm,
                material=mat,
                fill_mass_kg=scenario.fill_mass_kg,
                package_area_m2=scenario.package_area_m2,
                transit_duration_days=scenario.transit_duration_days,
                temp_c=scenario.product_temperature_c,
                ambient_rh=scenario.ambient_rh_percent
            )
        else:
            sim = solve_gas_balance_headspace_python(
                commodity=comm,
                material=mat,
                fill_mass_kg=scenario.fill_mass_kg,
                package_area_m2=scenario.package_area_m2,
                headspace_volume_l=scenario.headspace_volume_l,
                transit_duration_days=scenario.transit_duration_days,
                temp_c=scenario.product_temperature_c,
                initial_o2=scenario.initial_o2_percent,
                initial_co2=scenario.initial_co2_percent
            )

        if sim["is_feasible"]:
            passed.append(f"Shelf Life Target ({scenario.transit_duration_days} days achieved)")
        else:
            failed.append({
                "constraint": "Atmosphere / Moisture Stability",
                "reason": sim["limiting_constraint"]
            })

        is_pass = len(failed) == 0
        score = 85 if is_pass else 35

        ranked_results.append({
            "material": mat,
            "status": "passes" if is_pass else "fails",
            "passed_constraints": passed,
            "failed_constraints": failed,
            "suitability_score": score,
            "simulation": sim
        })

    ranked_results.sort(key=lambda x: x["suitability_score"], reverse=True)

    run_id = f"run-{uuid.uuid4().hex[:8]}"
    run_record = {
        "run_id": run_id,
        "scenario": scenario.dict(),
        "commodity": comm,
        "ranked_candidates": ranked_results,
        "top_recommendation": ranked_results[0] if ranked_results else None
    }
    SAVED_RUNS_DB[run_id] = run_record

    return run_record

@app.post("/api/v1/runs/{run_id}/stress-tests", tags=["Stress Testing Engine"])
def run_stress_test(run_id: str, req: StressTestRequestSchema):
    comm = next((c for c in COMMODITIES_DB if c["id"] == req.original_scenario.commodity_id), None)
    mat = next((m for m in MATERIALS_DB if m["id"] == req.candidate_id), None)
    if not comm or not mat:
        raise HTTPException(status_code=404, detail="Commodity or candidate material not found.")

    orig_sim = solve_gas_balance_headspace_python(
        commodity=comm,
        material=mat,
        fill_mass_kg=req.original_scenario.fill_mass_kg,
        package_area_m2=req.original_scenario.package_area_m2,
        headspace_volume_l=req.original_scenario.headspace_volume_l,
        transit_duration_days=req.original_scenario.transit_duration_days,
        temp_c=req.original_scenario.product_temperature_c
    )

    stressed_temp = req.original_scenario.product_temperature_c + req.temp_offset_c
    stressed_days = req.original_scenario.transit_duration_days + req.delay_days
    stressed_mass = req.original_scenario.fill_mass_kg + req.mass_offset_kg

    stressed_sim = solve_gas_balance_headspace_python(
        commodity=comm,
        material=mat,
        fill_mass_kg=stressed_mass,
        package_area_m2=req.original_scenario.package_area_m2,
        headspace_volume_l=req.original_scenario.headspace_volume_l,
        transit_duration_days=stressed_days,
        temp_c=stressed_temp
    )

    changed_params = []
    if req.temp_offset_c != 0:
        changed_params.append({"parameter": "Temperature", "val": f"+{req.temp_offset_c}°C"})
    if req.delay_days != 0:
        changed_params.append({"parameter": "Transit Delay", "val": f"+{req.delay_days} Days"})

    adjustments = []
    if not stressed_sim["is_feasible"]:
        adjustments.append({
            "id": "adj_reduce_mass",
            "type": "reduce_fill_mass",
            "title": "Reduce Pack Fill Weight by 20%",
            "description": "Lowering fill mass increases headspace volume ratio, slowing down gas depletion.",
            "actionable_change": f"Reduce fill mass to {round(stressed_mass * 0.8, 2)} kg",
            "new_effective_shelf_life_days": stressed_days,
            "restores_feasibility": True
        })

    return {
        "original_result": orig_sim,
        "stressed_result": stressed_sim,
        "changed_parameters": changed_params,
        "status_changed": orig_sim["is_feasible"] != stressed_sim["is_feasible"],
        "adjustments": adjustments
    }

@app.post("/api/v1/mixed-load-checks", tags=["Mixed-Load Compatibility"])
def mixed_load_check(req: MixedLoadRequestSchema):
    comm_a = next((c for c in COMMODITIES_DB if c["id"] == req.commodity_a_id), None)
    comm_b = next((c for c in COMMODITIES_DB if c["id"] == req.commodity_b_id), None)
    if not comm_a or not comm_b:
        raise HTTPException(status_code=404, detail="Commodity pair invalid.")

    eth_conflict = False
    if req.shared_air_enclosed:
        if comm_a["ethylene_production_rate"] in ["high", "very_high"] and comm_b["ethylene_sensitivity"] in ["high", "extremely_high"]:
            eth_conflict = True

    temp_a = comm_a["optimum_temp_range_c"]
    temp_b = comm_b["optimum_temp_range_c"]
    temp_conflict = max(temp_a[0], temp_b[0]) > min(temp_a[1], temp_b[1])

    overall = "critical_hazard" if (eth_conflict or temp_conflict) else "compatible"

    return {
        "commodity_a": comm_a,
        "commodity_b": comm_b,
        "shared_air": req.shared_air_enclosed,
        "ethylene_conflict": {
            "has_conflict": eth_conflict,
            "severity": "critical_hazard" if eth_conflict else "compatible",
            "mechanism": f"Ethylene emission from {comm_a['name']} triggers senescent browning in {comm_b['name']}." if eth_conflict else "No ethylene conflict."
        },
        "temperature_conflict": {
            "has_conflict": temp_conflict,
            "severity": "critical_hazard" if temp_conflict else "compatible",
            "chilling_risk": f"Optimum storage ranges do not overlap: {comm_a['name']} ({temp_a[0]}-{temp_a[1]}°C) vs {comm_b['name']} ({temp_b[0]}-{temp_b[1]}°C)." if temp_conflict else "Compatible temperature range."
        },
        "overall_status": overall
    }

@app.post("/api/v1/ai/parse-input", tags=["Grounded AI Assistant"])
def parse_ai_prompt(req: AIParseRequestSchema):
    prompt_lower = req.prompt.lower()
    comm = COMMODITIES_DB[1] # Strawberry default
    if "tomato" in prompt_lower:
        comm = COMMODITIES_DB[0]
    elif "banana" in prompt_lower:
        comm = COMMODITIES_DB[2]
    elif "lettuce" in prompt_lower:
        comm = COMMODITIES_DB[3]
    elif "chip" in prompt_lower:
        comm = COMMODITIES_DB[4]

    return {
        "parsed_fields": {
            "commodity_id": comm["id"],
            "commodity_name": comm["name"],
            "fill_mass_kg": comm["default_pack_weight_kg"],
            "transit_duration_days": comm["default_desired_shelf_life_days"],
            "product_temperature_c": comm["optimum_temp_range_c"][0]
        },
        "explanation": f"Parsed scenario for '{comm['name']}' at {comm['optimum_temp_range_c'][0]}°C for {comm['default_desired_shelf_life_days']} days transit."
    }

@app.post("/api/v1/runs/{run_id}/shares", tags=["Snapshot Sharing & QR"])
def create_share(run_id: str):
    run = SAVED_RUNS_DB.get(run_id)
    token = f"snap-{uuid.uuid4().hex[:10]}"
    SHARED_TOKENS_DB[token] = {
        "token": token,
        "run_id": run_id,
        "snapshot": run
    }
    return {"share_token": token, "share_url": f"/#snapshot={token}"}

@app.get("/api/v1/shares/{token}", tags=["Snapshot Sharing & QR"])
def get_share(token: str):
    share = SHARED_TOKENS_DB.get(token)
    if not share:
        raise HTTPException(status_code=404, detail="Snapshot token expired or invalid.")
    return share
