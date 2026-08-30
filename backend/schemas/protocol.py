from pydantic import BaseModel, Field
from typing import Optional, Dict, Any, List

class ProtocolOptimizeRequest(BaseModel):
    mine_id: str = Field(..., example="balaghat")
    scenario_id: Optional[str] = Field("MONSOON", example="MONSOON")
    severity: Optional[str] = Field("HIGH", example="HIGH")
    threat_category: Optional[str] = "HYDROGEOLOGICAL"
    current_shortfall_risk_pct: Optional[float] = 42.0

class ParetoOption(BaseModel):
    id: str
    title: str
    description: str
    expected_loss_pct: str
    expected_loss_tonnes: int
    protected_tonnes: int
    expected_downtime: str
    operational_impact: str
    confidence: str
    cost_estimate: str
    roi: str
    is_ai_recommended: bool

class ProtocolOptimizeResponse(BaseModel):
    mine_id: str
    mine_name: str
    primary_protocol: Dict[str, Any]
    pareto_options: List[ParetoOption]
    audit_trace_id: str
