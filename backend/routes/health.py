from fastapi import APIRouter
from datetime import datetime, timezone
from ..config import settings
from ..utils.model_loader import model_registry
from ..database.database import get_db_connection
from ..schemas.common import HealthCheckResponse

router = APIRouter(tags=["System Health & Diagnostics"])

@router.get("/health", response_model=HealthCheckResponse)
def get_system_health():
    """
    Returns comprehensive system health status including ML model readiness and DB connection.
    """
    ts = datetime.now(timezone.utc).isoformat()
    
    # Check Database
    db_ok = False
    db_details = {}
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT count(*) FROM audit_decisions")
        audit_count = cursor.fetchone()[0]
        cursor.execute("SELECT count(*) FROM operator_feedback")
        feedback_count = cursor.fetchone()[0]
        conn.close()
        db_ok = True
        db_details = {
            "status": "ONLINE",
            "audit_decisions_recorded": audit_count,
            "feedback_entries_recorded": feedback_count
        }
    except Exception as e:
        db_details = {
            "status": "FALLBACK_MODE",
            "error": str(e)
        }

    models_health = model_registry.get_health_status()
    overall_status = "HEALTHY" if models_health["all_models_operational"] else "DEGRADED"

    return {
        "status": overall_status,
        "app_name": settings.app_name,
        "app_version": settings.app_version,
        "timestamp": ts,
        "models": models_health,
        "database": db_details
    }

@router.get("/health/ready")
def get_readiness():
    """
    Readiness probe for Render / Kubernetes load balancers.
    """
    models_health = model_registry.get_health_status()
    return {
        "status": "READY",
        "ready": True,
        "app_version": settings.app_version,
        "models_ready": models_health["all_models_operational"],
        "timestamp": datetime.now(timezone.utc).isoformat()
    }

@router.get("/health/live")
def get_liveness():
    """
    Liveness probe verifying HTTP event loop responsiveness.
    """
    return {
        "status": "ALIVE",
        "timestamp": datetime.now(timezone.utc).isoformat()
    }
