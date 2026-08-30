from fastapi import APIRouter, Body
from pydantic import BaseModel, Field
from typing import Optional, Dict, Any, List
from ..database.database import record_feedback, log_decision, get_recent_feedback, get_recent_audit_decisions

router = APIRouter(prefix="/feedback", tags=["Human-in-the-Loop Feedback & Audit Ledger"])

class FeedbackSubmitRequest(BaseModel):
    mine_id: str
    prediction_type: str
    predicted_value: str
    actual_observed_value: Optional[str] = None
    operator_rating: Optional[int] = 5
    operator_comment: Optional[str] = None
    operator_name: Optional[str] = "Shift Controller"
    shift_id: Optional[str] = "SHIFT-A"
    model_version: Optional[str] = "1.0.0"

class DecisionAuditRequest(BaseModel):
    decision_id: str = Field(..., example="LOG-2026-9814")
    mine_id: str = Field(..., example="balaghat")
    operator_decision: str = Field(..., example="APPROVED")
    operator_name: str = Field(..., example="Er. R. K. Sharma")
    scenario_type: Optional[str] = "HEAVY_MONSOON"
    severity: Optional[str] = "HIGH"
    detected_signal: Optional[str] = "Precipitation 98mm / Sump Level Critical"
    prediction_summary: Optional[str] = "Shortfall Risk 88% (-1,100 T)"
    action_id: Optional[str] = "PROTO-BAL-01"
    action_title: Optional[str] = "Dynamic Dewatering & Dual-Corridor Haulage Re-route"
    operator_role: Optional[str] = "Mines Manager"
    operator_notes: Optional[str] = "Authorized auxiliary submersible dispatch."
    realized_impact: Optional[str] = "+920 T Protected"

@router.post("", response_model=Dict[str, Any])
def submit_operator_feedback(req: FeedbackSubmitRequest):
    """
    Records operator accuracy evaluations and field notes on model predictions.
    """
    return record_feedback(
        mine_id=req.mine_id,
        prediction_type=req.prediction_type,
        predicted_value=req.predicted_value,
        actual_observed_value=req.actual_observed_value,
        operator_rating=req.operator_rating,
        operator_comment=req.operator_comment,
        operator_name=req.operator_name,
        shift_id=req.shift_id,
        model_version=req.model_version
    )

@router.get("", response_model=List[Dict[str, Any]])
@router.get("/history", response_model=List[Dict[str, Any]])
def list_operator_feedback(limit: int = 50):
    """
    Returns recent operator feedback submissions.
    """
    return get_recent_feedback(limit)

@router.post("/decision", response_model=Dict[str, Any])
def record_operator_decision(req: DecisionAuditRequest):
    """
    Records human-in-the-loop dispatch authorizations for DGMS statutory audit traceability.
    """
    return log_decision(
        decision_id=req.decision_id,
        mine_id=req.mine_id,
        operator_decision=req.operator_decision,
        operator_name=req.operator_name,
        scenario_type=req.scenario_type,
        severity=req.severity,
        detected_signal=req.detected_signal,
        prediction_summary=req.prediction_summary,
        action_id=req.action_id,
        action_title=req.action_title,
        operator_role=req.operator_role,
        operator_notes=req.operator_notes,
        realized_impact=req.realized_impact
    )

@router.get("/decisions", response_model=List[Dict[str, Any]])
def list_audit_decisions(limit: int = 50):
    """
    Returns immutable audit trail entries of operator dispatch decisions.
    """
    return get_recent_audit_decisions(limit)
