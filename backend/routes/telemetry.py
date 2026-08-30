from fastapi import APIRouter, Query
from typing import Dict, Any
from ..services.telemetry_service import telemetry_service
from ..schemas.telemetry import TelemetrySnapshot

router = APIRouter(prefix="/telemetry", tags=["Telemetry Stream"])

@router.get("", response_model=TelemetrySnapshot)
def get_telemetry_snapshot(
    mine_id: str = Query("balaghat", description="Mine ID to stream telemetry for")
):
    """
    Direct endpoint for streaming live IoT sensor telemetry.
    """
    return telemetry_service.get_mine_telemetry(mine_id)
