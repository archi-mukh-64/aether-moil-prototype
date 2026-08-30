from fastapi import APIRouter, Query
from typing import Dict, Any
from ..services.analytics_service import analytics_service

router = APIRouter(prefix="/analytics", tags=["Executive Analytics"])

@router.get("")
def get_analytics(
    mine_id: str = Query("balaghat", description="Mine ID to retrieve executive analytics for")
):
    """
    Returns time-series production curves, Bayesian uncertainty envelopes, and metallurgical recovery profiles.
    """
    return analytics_service.get_mine_analytics(mine_id)
