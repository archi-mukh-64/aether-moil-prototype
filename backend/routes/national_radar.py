"""
MOIL National Mining Intelligence Platform
API Route: National Radar Intelligence Engine
"""

from fastapi import APIRouter, Query
from typing import Optional, Dict, Any, List
from backend.services.national_radar_engine import NationalRadarEngine, NATIONAL_RADAR_MODES

router = APIRouter(prefix="/national-radar", tags=["National Radar Intelligence"])

@router.get("/modes")
def get_national_radar_modes() -> Dict[str, Any]:
    """Returns available analytical modes and their driver weights."""
    return {"modes": NATIONAL_RADAR_MODES}

@router.get("/analyze")
def analyze_national_radar(
    mode: str = Query("NATIONAL_PERFORMANCE", description="One of the 7 National Radar modes"),
    scenario: Optional[str] = Query(None, description="Active stress scenario")
) -> Dict[str, Any]:
    """Executes multi-variate national ranking and analysis across all 10 MOIL assets."""
    return NationalRadarEngine.analyze_mode(mode_id=mode, scenario_id=scenario)

@router.get("/correlations")
def get_national_correlations() -> Dict[str, Any]:
    """Returns cross-mine Pearson correlations across operational and geological metrics."""
    return {"correlations": NationalRadarEngine.get_correlations()}

@router.get("/what-if")
def simulate_capital_allocation(
    invest_crores: int = Query(100, ge=10, le=1000, description="Capital allocation in ₹ Crores")
) -> Dict[str, Any]:
    """Simulates portfolio-wide operational upside from capital deployment."""
    return NationalRadarEngine.simulate_capital(invest_cr=invest_crores)
