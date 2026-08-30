from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional

class ForecastRequest(BaseModel):
    mine_id: str = Field(default="balaghat", description="Canonical MOIL mine identifier")
    scenario_id: Optional[str] = Field(default="BASELINE", description="Operational stress scenario")
    rainfall_mm: Optional[float] = Field(default=12.5, ge=0.0, le=250.0, description="Rainfall in mm/day")
    crusher_availability_pct: Optional[float] = Field(default=90.0, ge=10.0, le=100.0, description="Crusher availability %")
    fleet_availability_pct: Optional[float] = Field(default=88.0, ge=20.0, le=100.0, description="Fleet availability %")
    haul_efficiency_pct: Optional[float] = Field(default=92.0, ge=20.0, le=100.0, description="Haul road efficiency %")
    sump_inflow_rate: Optional[float] = Field(default=120.0, ge=10.0, le=1000.0, description="Sump inflow in m3/h")
    pump_capacity_pct: Optional[float] = Field(default=95.0, ge=10.0, le=100.0, description="Dewatering pump capacity %")
    equipment_health_index: Optional[float] = Field(default=92.0, ge=10.0, le=100.0, description="Equipment health index %")

class DailyForecastPoint(BaseModel):
    day_num: int
    day_label: str
    date: str
    target_tpd: float
    baseline_tpd: float
    predicted_yield_tpd: float
    lower_ci_tpd: float
    upper_ci_tpd: float
    shortfall_tpd: float
    shortfall_pct: float
    risk_level: str
    main_driver: str
    event_marker: str = "NORMAL"
    rainfall_mm: float
    crusher_avail_pct: Optional[float] = None
    fleet_avail_pct: Optional[float] = None
    haul_eff_pct: Optional[float] = None
    sump_inflow_m3h: Optional[float] = None
    actual_tpd: Optional[float] = None
    is_historical: bool = False

class ForecastDriver(BaseModel):
    name: str
    category: str
    impact_tpd: float
    current_val: str
    baseline_val: str
    confidence_pct: float
    recommendation: str
    direction: str

class ScenarioTrajectory(BaseModel):
    scenario_id: str
    scenario_name: str
    name: Optional[str] = None
    color: str
    points: List[float]

class ForecastResponse(BaseModel):
    mine_id: str
    mine_name: str
    daily_target: float
    ore_grade: str
    horizon_days: int
    forecast_points: List[DailyForecastPoint]
    waterfall_drivers: List[ForecastDriver]
    net_impact_tpd: float
    scenarios_comparison: List[ScenarioTrajectory]
    generated_alerts: List[Dict[str, Any]]
    models_status: Dict[str, Any]
