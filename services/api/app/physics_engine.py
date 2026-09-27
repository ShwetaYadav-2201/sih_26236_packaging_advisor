import math
from typing import Dict, Any, List

def solve_gas_balance_headspace_python(
    commodity: Dict[str, Any],
    material: Dict[str, Any],
    fill_mass_kg: float,
    package_area_m2: float,
    headspace_volume_l: float,
    transit_duration_days: int,
    temp_c: float,
    initial_o2: float = 20.9,
    initial_co2: float = 0.04
) -> Dict[str, Any]:
    """
    Headspace Gas Dynamics Numerical Differential Equation Solver
     dn_O2/dt  = K_O2(T) * Area * (pO2_ext - pO2_in) - mass * r_O2(T, pO2_in)
     dn_CO2/dt = mass * r_CO2(T, pCO2_in) - K_CO2(T) * Area * (pCO2_in - pCO2_ext)
    """
    base_resp_mg = commodity.get("respiration_rate_20c", 20.0)
    q10 = commodity.get("q10_respiration", 2.2)
    resp_temp_factor = math.pow(q10, (temp_c - 20.0) / 10.0)

    daily_o2_consumption_base = (base_resp_mg * 0.085 * resp_temp_factor * fill_mass_kg) / (headspace_volume_l + 0.001)
    rq = commodity.get("respiratory_quotient", 1.05)

    otr_val = material.get("otr_value", 1850.0)
    co2tr_val = material.get("co2tr_value", otr_val * 4.0)

    daily_o2_inflow_factor = (otr_val * package_area_m2 * 0.0001) / (headspace_volume_l + 0.001)
    daily_co2_outflow_factor = (co2tr_val * package_area_m2 * 0.0001) / (headspace_volume_l + 0.001)

    trajectories = []
    curr_o2 = initial_o2
    curr_co2 = initial_co2
    curr_n2 = 100.0 - curr_o2 - curr_co2

    min_o2 = commodity.get("min_o2_percent", 2.5)
    max_co2 = commodity.get("max_co2_percent", 5.0)

    aerobic_breached_day = None
    co2_injured_day = None
    is_feasible = True
    limiting_factor = "None (Optimal MAP gas balance achieved)"

    for day in range(transit_duration_days + 1):
        quality = "optimal"
        if curr_o2 < min_o2 or curr_co2 > max_co2:
            quality = "spoiled"
        elif curr_o2 < min_o2 + 1.0 or curr_co2 > max_co2 - 1.0:
            quality = "warning"

        trajectories.append({
            "day": day,
            "o2_percent": round(max(0.1, curr_o2), 2),
            "co2_percent": round(max(0.1, curr_co2), 2),
            "n2_percent": round(max(0.0, curr_n2), 2),
            "moisture_content_percent": None,
            "quality_status": quality
        })

        if day == transit_duration_days:
            break

        o2_inhibition = curr_o2 / (curr_o2 + 1.2)
        daily_o2_consumed = daily_o2_consumption_base * o2_inhibition
        daily_co2_produced = daily_o2_consumed * rq

        o2_ingress = daily_o2_inflow_factor * (20.9 - curr_o2)
        co2_egress = daily_co2_outflow_factor * (curr_co2 - 0.04)

        curr_o2 = max(0.0, min(20.9, curr_o2 - daily_o2_consumed + o2_ingress))
        curr_co2 = max(0.0, min(30.0, curr_co2 + daily_co2_produced - co2_egress))
        curr_n2 = 100.0 - curr_o2 - curr_co2

        if curr_o2 < min_o2 and aerobic_breached_day is None:
            aerobic_breached_day = day + 1
            is_feasible = False
            limiting_factor = f"Anaerobic Fermentation Risk: Headspace O2 fell to {round(curr_o2, 1)}% on Day {day + 1} (below threshold {min_o2}%)."

        if curr_co2 > max_co2 and co2_injured_day is None:
            co2_injured_day = day + 1
            is_feasible = False
            if "Anaerobic" not in limiting_factor:
                limiting_factor = f"Hypercapnic Tissue Injury: Headspace CO2 reached {round(curr_co2, 1)}% on Day {day + 1} (exceeded threshold {max_co2}%)."

    effective_shelf_life = min(aerobic_breached_day or transit_duration_days, co2_injured_day or transit_duration_days)

    return {
        "trajectories": trajectories,
        "effective_shelf_life_days": effective_shelf_life,
        "limiting_constraint": limiting_factor,
        "is_feasible": is_feasible,
        "model_type": "gas_balance_differential"
    }


def solve_moisture_budget_python(
    commodity: Dict[str, Any],
    material: Dict[str, Any],
    fill_mass_kg: float,
    package_area_m2: float,
    transit_duration_days: int,
    temp_c: float,
    ambient_rh: float = 75.0
) -> Dict[str, Any]:
    """
    Dry Food Moisture Ingress & Sorption Budget Solver
    """
    init_moisture = commodity.get("initial_moisture_percent", 1.2)
    crit_moisture = commodity.get("critical_moisture_percent", 2.5)

    wvtr_standard = material.get("wvtr_value", 0.45)
    temp_scaling = math.pow(1.04, temp_c - 38.0)
    rh_gradient_factor = max(0.1, (ambient_rh - 10.0) / 90.0)
    daily_wvtr = wvtr_standard * temp_scaling * rh_gradient_factor

    daily_water_gain_g = daily_wvtr * package_area_m2
    daily_moisture_percent_increase = (daily_water_gain_g / (fill_mass_kg * 1000.0)) * 100.0

    trajectories = []
    curr_moisture = init_moisture
    moisture_breached_day = None
    is_feasible = True
    limiting_factor = "None (Moisture barrier sufficient to maintain crispness)"

    for day in range(transit_duration_days + 1):
        quality = "optimal"
        if curr_moisture > crit_moisture:
            quality = "spoiled"
        elif curr_moisture > crit_moisture - 0.3:
            quality = "warning"

        trajectories.append({
            "day": day,
            "o2_percent": 20.9,
            "co2_percent": 0.04,
            "n2_percent": 79.0,
            "moisture_content_percent": round(curr_moisture, 2),
            "quality_status": quality
        })

        if day == transit_duration_days:
            break

        curr_moisture += daily_moisture_percent_increase

        if curr_moisture > crit_moisture and moisture_breached_day is None:
            moisture_breached_day = day + 1
            is_feasible = False
            limiting_factor = f"Loss of Crispness / Textural Failure: Moisture content reached {round(curr_moisture, 2)}% on Day {day + 1} (exceeded threshold {crit_moisture}%)."

    return {
        "trajectories": trajectories,
        "effective_shelf_life_days": moisture_breached_day or transit_duration_days,
        "limiting_constraint": limiting_factor,
        "is_feasible": is_feasible,
        "model_type": "moisture_sorption_budget"
    }
