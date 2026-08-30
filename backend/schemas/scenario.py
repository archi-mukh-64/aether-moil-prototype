from pydantic import BaseModel, Field
from typing import Optional, Dict, Any, List

class ScenarioSimulateRequest(BaseModel):
    mine_id: str = Field(..., example="balaghat")
    scenario_type: str = Field(..., example="HEAVY_MONSOON", description="HEAVY_MONSOON, CRUSHER_SEIZURE, MULTI_RISK_CRISIS, BASELINE_RESET")
    severity: Optional[str] = Field("HIGH", example="HIGH", description="LOW, MEDIUM, HIGH, CRITICAL")
    time_horizon: Optional[str] = Field("24 HOURS", example="24 HOURS", description="6 HOURS, 24 HOURS, 7 DAYS")
    custom_parameters: Optional[Dict[str, Any]] = None

class ScenarioSimulateResponse(BaseModel):
    scenario_id: str
    scenario_type: str
    mine_id: str
    mine_name: str
    severity: str
    time_horizon: str
    status_variant: str
    is_detected: bool
    headline: str
    
    # Impacted operational parameters
    baseline_production_target: int
    projected_yield_tonnes: int
    predicted_loss_tonnes: int
    shortfall_probability: float
    shortfall_probability_pct: str
    
    # Telemetry Deltas
    effective_rainfall_mm: float
    effective_sump_inflow_m3h: float
    crusher_vibration_mms: float
    crusher_utilization_pct: float
    fleet_health_pct: float
    equipment_failure_probability: float
    anomaly_score: float
    overall_risk_level: str
    composite_trust_score: str
    
    # Explanations & Evidence
    evidence_factors: List[Dict[str, Any]]
    causal_chain: List[str]
    
    # Prescriptive Countermeasures
    recommendation: Dict[str, Any]
    optimization_options: List[Dict[str, Any]]
