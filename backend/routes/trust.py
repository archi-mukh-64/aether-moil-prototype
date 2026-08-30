from fastapi import APIRouter, Query
from ..services.trust_service import trust_service

router = APIRouter(prefix="/trust", tags=["Responsible AI & Governance"])

@router.get("")
def get_trust_profile(
    mine_id: str = Query("balaghat", description="Mine ID to inspect trust profile for")
):
    """
    Returns Bayesian calibration, TreeSHAP explainability verification, and data quality metrics.
    """
    return trust_service.get_mine_trust_profile(mine_id)
