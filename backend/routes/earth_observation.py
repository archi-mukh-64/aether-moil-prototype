"""
MOIL National Mining Intelligence Platform
Earth Observation (EO) & Satellite Remote Sensing API Gateway
"""

from fastapi import APIRouter, HTTPException, Query, Path
from typing import Dict, Any, List
from backend.services.earth_observation_service import EarthObservationService
from backend.services.environmental_engine import EnvironmentalEngine

router = APIRouter(prefix="/earth-observation", tags=["Earth Observation"])

@router.get("/status", summary="Earth Observation Connectivity Status")
def get_earth_observation_status() -> Dict[str, Any]:
    """Returns current Copernicus Sentinel-2 / Landsat connection & remote sensing capabilities."""
    return {
        "status": "OPERATIONAL",
        "provider": "Copernicus Sentinel-2 Level-2A / USGS Landsat 8-9 OLI",
        "satellites": ["Sentinel-2A", "Sentinel-2B", "Landsat-8", "Landsat-9"],
        "coverage": "Central Indian Sausar Manganese Corridor",
        "spatialResolutionMeters": 10.0,
        "spectralBands": ["B2 (Blue)", "B3 (Green)", "B4 (Red)", "B8 (NIR)", "B11 (SWIR-1)", "B12 (SWIR-2)"]
    }

@router.get("/national-summary", summary="Corporate National Earth Observation Status")
def get_national_eo_summary() -> Dict[str, Any]:
    """Returns high-level satellite monitoring summary across all 10 MOIL mines."""
    return EarthObservationService.get_national_summary()

@router.get("/environmental/{mine_id}", summary="Environmental Satellite Profile by Year")
def get_environmental_yearly_profile(
    mine_id: str = Path(..., description="Canonical mine ID"),
    year: int = Query(2026, ge=2018, le=2026, description="Satellite acquisition year")
) -> Dict[str, Any]:
    """Returns detailed NDVI, NDWI, disturbance footprint, and Dynamic World land cover."""
    return EnvironmentalEngine.get_yearly_profile(mine_id=mine_id, year=year)

@router.get("/compare-years/{mine_id}", summary="Multi-Temporal Change Comparison")
def compare_satellite_years(
    mine_id: str = Path(..., description="Canonical mine ID"),
    year_before: int = Query(2018, ge=2018, le=2026),
    year_after: int = Query(2026, ge=2018, le=2026)
) -> Dict[str, Any]:
    """Compares two satellite acquisition dates and computes delta areas, NDVI changes, and reclamation."""
    return EnvironmentalEngine.compare_years(mine_id=mine_id, year_before=year_before, year_after=year_after)

@router.get("/{mine_id}", summary="Mine-Specific Earth Observation Profile")
def get_mine_observation(mine_id: str) -> Dict[str, Any]:
    """Returns comprehensive satellite observation data, NDVI, SWIR index, and footprint for a mine."""
    return EarthObservationService.get_mine_observation(mine_id)

@router.get("/{mine_id}/change-detection", summary="Multi-Temporal Change Detection")
def get_mine_change_detection(mine_id: str) -> List[Dict[str, Any]]:
    """Returns detected surface changes, elevation gradients, and area variances."""
    return EarthObservationService.get_change_detection(mine_id)

@router.get("/{mine_id}/vegetation", summary="Vegetation Index & Forest Buffer")
def get_mine_vegetation(mine_id: str) -> Dict[str, Any]:
    """Returns Sentinel-2 NDVI index and vegetation health status for environmental compliance."""
    return EarthObservationService.get_vegetation_index(mine_id)

@router.get("/{mine_id}/moisture", summary="Water Accumulation & Pit Sump Risk")
def get_mine_moisture(mine_id: str) -> Dict[str, Any]:
    """Returns NDWI moisture index and pit floor water accumulation risk."""
    return EarthObservationService.get_moisture_index(mine_id)

@router.get("/{mine_id}/spectral", summary="SWIR Mineral Alteration Signature")
def get_mine_spectral(mine_id: str) -> Dict[str, Any]:
    """Returns Sentinel-2 Band 11/12 Short-Wave Infrared (SWIR) mineral absorption index."""
    return EarthObservationService.get_spectral_signature(mine_id)
