from pydantic import BaseModel, Field
from typing import Optional, Dict, Any, List

class TelemetrySnapshot(BaseModel):
    mine_id: str
    mine_name: str
    timestamp: str
    shift: str = "SHIFT-A (06:00 - 14:00)"
    rainfall_mm: float = Field(..., ge=0.0)
    sump_inflow_m3h: float = Field(..., ge=0.0)
    crusher_vibration_mms: float = Field(..., ge=0.0)
    crusher_temperature_c: float = Field(..., ge=0.0)
    crusher_utilization_pct: float = Field(..., ge=0.0, le=100.0)
    fleet_availability_pct: float = Field(..., ge=0.0, le=100.0)
    grade_mn_pct: float = Field(..., ge=0.0, le=100.0)
    silica_sio2_pct: float = Field(..., ge=0.0, le=100.0)
    water_table_depth: str
    active_fleet_status: str
    hoist_status: str
    sensor_nodes: List[Dict[str, Any]]
