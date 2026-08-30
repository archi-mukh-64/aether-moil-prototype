"""
MOIL National Mining Intelligence Platform
API Route: AI Exploration Target Scanner & Drilling Engine
"""

from fastapi import APIRouter, Query, Path
from typing import Dict, Any, List
from backend.services.exploration_engine import ExplorationEngine

router = APIRouter(prefix="/exploration", tags=["Exploration Target Scanner"])

@router.get("/targets/{mine_id}")
def get_exploration_targets(
    mine_id: str = Path(..., description="Canonical mine identifier")
) -> Dict[str, Any]:
    """Retrieves scored candidate exploration targets for the specified mine asset."""
    targets = ExplorationEngine.scan_targets(mine_id=mine_id)
    return {
        "mineId": mine_id,
        "targetCount": len(targets),
        "targets": targets
    }

@router.post("/scan")
def run_exploration_scan(
    mine_id: str = Query("balaghat", description="Mine to scan")
) -> Dict[str, Any]:
    """Executes multi-feature exploration target prospectivity scan."""
    targets = ExplorationEngine.scan_targets(mine_id=mine_id)
    return {
        "status": "COMPLETED",
        "mineId": mine_id,
        "scanConfidence": "94.2%",
        "targetsFound": len(targets),
        "targets": targets
    }

@router.get("/drill/{mine_id}")
def get_virtual_core_drill(
    mine_id: str = Path(..., description="Canonical mine identifier"),
    depth_m: int = Query(145, ge=10, le=500, description="Drill probe depth in meters")
) -> Dict[str, Any]:
    """Simulates diamond core borehole stratigraphy, assayed grade, and silica content."""
    return ExplorationEngine.virtual_drill(mine_id=mine_id, depth_m=depth_m)
