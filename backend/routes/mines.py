from fastapi import APIRouter, HTTPException, Path
from typing import List, Dict, Any
from ..services.mine_service import mine_service
from ..services.telemetry_service import telemetry_service
from ..services.analytics_service import analytics_service
from ..services.equipment_service import equipment_service
from ..services.reserve_service import reserve_service
from ..services.trust_service import trust_service
from ..schemas.mine import MineListResponse, MineDetail, MineSummary

router = APIRouter(prefix="/mines", tags=["MOIL Mine Registry & Asset Data"])

@router.get("", response_model=MineListResponse)
def list_all_mines():
    """
    Returns the complete list of all 10 official MOIL production mines.
    """
    mines = mine_service.get_all_mines()
    return {
        "total_mines": len(mines),
        "mines": mines
    }

@router.get("/{mine_id}", response_model=MineDetail)
def get_mine_details(
    mine_id: str = Path(..., description="Unique mine slug, e.g. balaghat, tirodi, ukwa, dongri-buzurg")
):
    """
    Returns complete baseline details, telemetry metadata, reserves, and parameters for a specific mine.
    """
    return mine_service.get_mine_by_id(mine_id)

@router.get("/{mine_id}/telemetry")
def get_mine_telemetry(
    mine_id: str = Path(..., description="Unique mine slug, e.g. balaghat, tirodi, ukwa")
):
    """
    Returns real-time IoT sensor telemetry streams, water levels, and equipment status.
    """
    return telemetry_service.get_mine_telemetry(mine_id)

@router.get("/{mine_id}/analytics")
def get_mine_analytics(
    mine_id: str = Path(..., description="Unique mine slug, e.g. balaghat, tirodi, ukwa")
):
    """
    Returns 30-day production history, 14-day forecasts, grade trends, and hydrogeology couplings.
    """
    return analytics_service.get_mine_analytics(mine_id)

@router.get("/{mine_id}/equipment")
def get_mine_equipment(
    mine_id: str = Path(..., description="Unique mine slug, e.g. balaghat, tirodi, ukwa")
):
    """
    Returns machinery diagnostics, FFT bearing vibration harmonics, and Remaining Useful Life (RUL).
    """
    fleet_data = equipment_service.get_mine_equipment_fleet(mine_id)
    return {
        "mine_id": mine_id,
        "fleet": fleet_data,
        "equipment": fleet_data
    }

@router.get("/{mine_id}/reserve")
def get_mine_reserve(
    mine_id: str = Path(..., description="Unique mine slug, e.g. balaghat, tirodi, ukwa")
):
    """
    Returns UNFC reserve classifications, strike length, dip angle, and prospectivity predictions.
    """
    return reserve_service.get_mine_reserve_detail(mine_id)

@router.get("/{mine_id}/trust")
def get_mine_trust(
    mine_id: str = Path(..., description="Unique mine slug, e.g. balaghat, tirodi, ukwa")
):
    """
    Returns Bayesian 5-pillar trust score, ISO 22932 calibration, and data quality metrics.
    """
    return trust_service.get_mine_trust_profile(mine_id)
