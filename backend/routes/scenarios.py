from fastapi import APIRouter, Path
from typing import Dict, Any, List
from ..services.scenario_service import scenario_service
from ..schemas.scenario import ScenarioSimulateRequest, ScenarioSimulateResponse

router = APIRouter(prefix="/scenarios", tags=["Scenario Simulation Engine"])

@router.get("", summary="Get Available Scenarios Catalog")
@router.get("/", summary="Get Available Scenarios Catalog", include_in_schema=False)
@router.get("/catalog", summary="Get Available Scenarios Catalog Alias")
def get_scenarios_catalog() -> Dict[str, Any]:
    """
    Returns catalog of available operational scenarios (HEAVY_MONSOON, CRUSHER_SEIZURE, MULTI_RISK, BASELINE).
    """
    return {
        "scenarios": [
            {
                "id": "BASELINE",
                "name": "Normal / Baseline Operations",
                "description": "Standard operating shift with nominal environmental & mechanical conditions.",
                "category": "Nominal"
            },
            {
                "id": "MONSOON",
                "name": "Heavy Monsoon Influx (95mm Burst)",
                "description": "High precipitation event with deep sump flooding and haul road traction degradation.",
                "category": "Environmental Crisis"
            },
            {
                "id": "CRUSHER",
                "name": "Crusher Bearing Seizure (Harmonic Drift)",
                "description": "Primary jaw/gyratory crusher bearing overheating with catastrophic failure hazard.",
                "category": "Electromechanical Crisis"
            },
            {
                "id": "MULTI_RISK",
                "name": "Multi-Risk Crisis (Cascading Failure)",
                "description": "Compounded multi-front shock: severe rainfall flooding combined with crusher lockout.",
                "category": "Compounded Multi-Vector Crisis"
            }
        ]
    }

@router.get("/{scenario_id}", summary="Get Scenario Details")
def get_scenario_detail(scenario_id: str = Path(..., description="Scenario ID")) -> Dict[str, Any]:
    catalog = get_scenarios_catalog()["scenarios"]
    for s in catalog:
        if s["id"].upper() == scenario_id.upper():
            return s
    return {
        "id": scenario_id.upper(),
        "name": f"Scenario {scenario_id.upper()}",
        "description": "Custom parameter simulation scenario.",
        "category": "Custom Simulation"
    }

@router.post("/simulate", response_model=ScenarioSimulateResponse)
def simulate_scenario(req: ScenarioSimulateRequest):
    """
    Simulates operational crises (HEAVY_MONSOON, CRUSHER_SEIZURE, MULTI_RISK_CRISIS, BASELINE_RESET)
    specifically calculated from the selected mine's baseline parameters.
    """
    return scenario_service.simulate_scenario(
        mine_id=req.mine_id,
        scenario_type=req.scenario_type,
        severity=req.severity or "HIGH",
        time_horizon=req.time_horizon or "24 HOURS",
        custom_params=req.custom_parameters
    )
