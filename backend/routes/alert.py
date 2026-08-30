from fastapi import APIRouter, Query
from typing import Optional, Dict, Any
from ..services.alert_service import alert_service
from ..schemas.prediction import (
    AlertPredictRequest, 
    AlertPredictResponse,
    AlertListResponse,
    AlertActionRequest,
    AlertActionResponse
)

router = APIRouter(prefix="/alert", tags=["ML Prediction & Operational Alert Engine"])

@router.post("/predict", response_model=AlertPredictResponse)
def predict_shortfall(req: AlertPredictRequest):
    """
    Predicts production shortfall risk and outputs local TreeSHAP feature attributions.
    """
    return alert_service.predict_shortfall(req.model_dump())

@router.get("/list", response_model=AlertListResponse)
def list_alerts(
    mine_id: Optional[str] = Query(None, description="Filter by MOIL mine ID or 'all'"),
    severity: Optional[str] = Query(None, description="Filter by severity level: CRITICAL, HIGH, ELEVATED, MEDIUM, LOW"),
    status: Optional[str] = Query(None, description="Filter by status: ACTIVE, ACKNOWLEDGED, RESOLVED, ESCALATED"),
    search: Optional[str] = Query(None, description="Search query string across titles and descriptions"),
    scenario: Optional[str] = Query(None, description="Active scenario context (BASELINE, HEAVY_MONSOON, CRUSHER_SEIZURE, MULTI_RISK)"),
    scenario_severity: Optional[str] = Query(None, description="Scenario severity (LOW, MEDIUM, HIGH, CRITICAL)")
):
    """
    Retrieves live operational alerts filtered by mine, severity, status, keyword search, and active scenario.
    """
    return alert_service.get_alerts(
        mine_id=mine_id,
        severity=severity,
        status=status,
        search=search,
        scenario=scenario,
        scenario_severity=scenario_severity
    )

@router.post("/refresh")
def refresh_alerts():
    """
    Refreshes simulation telemetry timestamps across all operational threats.
    """
    return alert_service.refresh_telemetry()

@router.post("/acknowledge", response_model=AlertActionResponse)
def acknowledge_alert(req: AlertActionRequest):
    """
    Acknowledges an active alert with operator signature and optional note.
    """
    return alert_service.acknowledge_alert(alert_id=req.alert_id, operator=req.operator or "DGMS Shift Controller", note=req.note or "")

@router.post("/resolve", response_model=AlertActionResponse)
def resolve_alert(req: AlertActionRequest):
    """
    Resolves an alert and logs the recovery mitigation note.
    """
    return alert_service.resolve_alert(alert_id=req.alert_id, operator=req.operator or "DGMS Shift Controller", note=req.note or "")

@router.post("/escalate", response_model=AlertActionResponse)
def escalate_alert(req: AlertActionRequest):
    """
    Escalates an urgent alert to the DGMS Regional Inspector or General Manager.
    """
    target = req.target or "DGMS Regional Inspector & General Manager"
    return alert_service.escalate_alert(alert_id=req.alert_id, operator=req.operator or "DGMS Shift Controller", target=target)

@router.post("/generate", response_model=AlertActionResponse)
def generate_alert(payload: Dict[str, Any]):
    """
    Injects a real-time sensor or synthetic operational anomaly alert.
    """
    return alert_service.generate_alert(payload)
