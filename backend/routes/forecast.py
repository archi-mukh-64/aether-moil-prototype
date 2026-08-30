from fastapi import APIRouter, Path, Query
from typing import Dict, Any
from backend.schemas.forecast import ForecastRequest, ForecastResponse
from backend.services.forecast_service import ForecastService

router = APIRouter(prefix="/forecast", tags=["14-Day Production Forecast Engine"])

@router.post("/14-day", summary="Compute 14-Day Production Yield Forecast")
def compute_14_day_forecast(request: ForecastRequest) -> Dict[str, Any]:
    return ForecastService.calculate_14_day_forecast(request)

@router.get("/14-day/{mine_id}", summary="Get Baseline 14-Day Forecast for Mine")
def get_mine_14_day_forecast(
    mine_id: str = Path(..., description="Canonical mine ID"),
    scenario: str = Query("BASELINE", description="Scenario stress identifier")
) -> Dict[str, Any]:
    req = ForecastRequest(mine_id=mine_id, scenario_id=scenario)
    return ForecastService.calculate_14_day_forecast(req)
