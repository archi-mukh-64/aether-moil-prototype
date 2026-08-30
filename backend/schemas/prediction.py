from pydantic import BaseModel, Field
from typing import Optional, Dict, Any, List
from .common import ModelMetadata

# 1. Alert Prediction Request & Response
class AlertPredictRequest(BaseModel):
    mine_id: Optional[str] = "balaghat"
    planned_tonnage: Optional[int] = Field(6200, ge=100)
    ore_grade_mn: Optional[float] = Field(44.2, ge=10.0, le=60.0)
    recovery_rate: Optional[float] = Field(88.0, ge=30.0, le=100.0)
    crusher_utilization: Optional[float] = Field(85.0, ge=0.0, le=100.0)
    fleet_availability: Optional[float] = Field(87.5, ge=0.0, le=100.0)
    operating_hours: Optional[float] = Field(16.0, ge=0.0, le=24.0)
    downtime_hours: Optional[float] = Field(2.5, ge=0.0, le=24.0)
    rainfall_mm: Optional[float] = Field(12.5, ge=0.0)
    production_trend_7d: Optional[float] = Field(6150.0, ge=0.0)
    production_trend_30d: Optional[float] = Field(6100.0, ge=0.0)
    shortfall_rate: Optional[float] = Field(5.0, ge=0.0, le=100.0)
    target_deviation: Optional[float] = Field(-0.02, ge=-1.0, le=1.0)
    rolling_downtime_7d: Optional[float] = Field(12.0, ge=0.0)

class AlertPredictResponse(BaseModel):
    metadata: ModelMetadata
    prediction: Dict[str, Any]

# 2. Reserve Prospectivity Request & Response
class ReservePredictRequest(BaseModel):
    mine_id: Optional[str] = "balaghat"
    depth_m: Optional[int] = Field(145, ge=10, le=600)
    mn_grade: Optional[float] = Field(45.6, ge=10.0, le=60.0)
    assay_confidence: Optional[float] = Field(0.94, ge=0.0, le=1.0)
    lineament_distance: Optional[float] = Field(240.0, ge=0.0)
    terrain_score: Optional[float] = Field(0.88, ge=0.0, le=1.0)
    spectral_signal: Optional[float] = Field(0.820, ge=0.0, le=1.0)
    lineament_proximity_score: Optional[float] = Field(0.88, ge=0.0, le=1.0)
    grade_anomaly: Optional[float] = Field(4.2, ge=-20.0, le=30.0)

class ReservePredictResponse(BaseModel):
    metadata: ModelMetadata
    prediction: Dict[str, Any]

# 3. Equipment Failure & RUL Request & Response
class EquipmentPredictRequest(BaseModel):
    mine_id: Optional[str] = "balaghat"
    asset_id: Optional[str] = "CR-BAL-01"
    operating_hours: Optional[int] = Field(3200, ge=0)
    engine_temperature: Optional[float] = Field(68.0, ge=20.0, le=150.0)
    vibration_rms: Optional[float] = Field(2.1, ge=0.0, le=25.0)
    hydraulic_pressure: Optional[float] = Field(172.0, ge=0.0, le=300.0)
    fuel_rate: Optional[float] = Field(35.0, ge=0.0)
    utilization: Optional[float] = Field(88.5, ge=0.0, le=100.0)
    availability: Optional[float] = Field(96.2, ge=0.0, le=100.0)
    maintenance_age: Optional[int] = Field(180, ge=0)
    vibration_zscore: Optional[float] = Field(0.4, ge=-5.0, le=10.0)
    temperature_anomaly: Optional[float] = Field(2.0, ge=-20.0, le=50.0)
    utilization_change: Optional[float] = Field(0.0, ge=-100.0, le=100.0)

class EquipmentPredictResponse(BaseModel):
    metadata: ModelMetadata
    prediction: Dict[str, Any]

# 4. Anomaly Detection Request & Response
class AnomalyDetectRequest(BaseModel):
    mine_id: Optional[str] = "balaghat"
    rainfall_mm: Optional[float] = Field(12.0, ge=0.0)
    vibration_rms: Optional[float] = Field(2.1, ge=0.0)
    engine_temperature: Optional[float] = Field(68.0, ge=0.0)
    downtime_hours: Optional[float] = Field(1.5, ge=0.0)
    shortfall_percentage: Optional[float] = Field(4.0, ge=0.0, le=100.0)

class AnomalyDetectResponse(BaseModel):
    metadata: ModelMetadata
    prediction: Dict[str, Any]

# 5. Operational Alert Management Schemas
class AlertItem(BaseModel):
    id: str
    mine_id: str
    mine_name: str
    state: Optional[str] = "Madhya Pradesh"
    title: str
    description: str
    severity: str # 'CRITICAL', 'HIGH', 'ELEVATED', 'MEDIUM', 'LOW'
    status: str # 'ACTIVE', 'ACKNOWLEDGED', 'RESOLVED', 'ESCALATED'
    category: str # 'Environmental', 'Equipment', 'Production', 'Geotechnical', 'Hydrogeological', 'Electrical'
    source: str # 'SCADA Sensor', 'TreeSHAP Model', 'Sentinel-2 Remote Sensing', 'DGMS Sensor'
    sensor_type: Optional[str] = "SCADA Telemetry"
    sensor_id: Optional[str] = "SEN-01"
    risk_score: float # 0 to 100
    probability: Optional[str] = "75%"
    affected_system: Optional[str] = "General Mining System"
    affected_equipment: Optional[str] = "Standard HEMM Asset"
    production_impact_tpd: Optional[int] = 0
    financial_exposure: Optional[str] = "₹0.00 Cr"
    impact: Optional[str] = "Operational pacing risk"
    recommended_action: str
    detected_at: Optional[str] = None
    last_updated: Optional[str] = None
    timestamp: str
    acknowledgement_state: Optional[bool] = False
    escalation_state: Optional[bool] = False
    acknowledged_at: Optional[str] = None
    acknowledged_by: Optional[str] = None
    resolved_at: Optional[str] = None
    resolved_by: Optional[str] = None
    resolution_action: Optional[str] = None
    escalated_to: Optional[str] = None
    escalated_at: Optional[str] = None
    metadata: Optional[Dict[str, Any]] = None

class AlertListResponse(BaseModel):
    total: int
    active_count: int
    critical_count: int
    high_count: Optional[int] = 0
    elevated_count: Optional[int] = 0
    medium_count: Optional[int] = 0
    low_count: Optional[int] = 0
    total_production_at_risk_tpd: Optional[int] = 0
    active_scenario: Optional[str] = "BASELINE"
    active_severity: Optional[str] = "HIGH"
    alerts: List[AlertItem]

class AlertActionRequest(BaseModel):
    alert_id: str
    operator: Optional[str] = "DGMS Shift Controller"
    note: Optional[str] = ""
    target: Optional[str] = None

class AlertActionResponse(BaseModel):
    status: str
    message: str
    alert: Optional[AlertItem] = None
