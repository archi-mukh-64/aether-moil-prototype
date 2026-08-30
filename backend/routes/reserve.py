from fastapi import APIRouter, Path, Query
from typing import Dict, Any, List
from ..services.reserve_service import reserve_service
from ..services.reserve_engine import ReserveEngine
from ..schemas.prediction import ReservePredictRequest, ReservePredictResponse

router = APIRouter(prefix="/reserve", tags=["ML Prediction: Reserve Prospectivity"])

@router.post("/predict", response_model=ReservePredictResponse)
def predict_reserve_prospectivity(req: ReservePredictRequest):
    """
    Predicts remote sensing prospectivity scores and UNFC resource classifications based on drill depth and spectral features.
    """
    return reserve_service.predict_reserve_prospectivity(req.model_dump())

@router.get("/evolution/{mine_id}")
def get_reserve_evolution(
    mine_id: str = Path(..., description="Canonical mine identifier")
) -> Dict[str, Any]:
    """Returns UNFC resource progression and expansion waterfall."""
    steps = ReserveEngine.get_reserve_evolution(mine_id=mine_id)
    return {
        "mineId": mine_id,
        "steps": steps
    }

@router.get("/confidence-grid/{mine_id}")
def get_confidence_grid(
    mine_id: str = Path(..., description="Canonical mine identifier"),
    model_stance: str = Query("BALANCED", description="CONSERVATIVE, BALANCED, AGGRESSIVE"),
    data_density: str = Query("HIGH", description="LOW, MEDIUM, HIGH")
) -> Dict[str, Any]:
    """Returns 24-cell spatial uncertainty and confidence grid."""
    blocks = ReserveEngine.get_confidence_grid(mine_id=mine_id, model_stance=model_stance, data_density=data_density)
    return {
        "mineId": mine_id,
        "modelStance": model_stance,
        "dataDensity": data_density,
        "blockCount": len(blocks),
        "blocks": blocks
    }
