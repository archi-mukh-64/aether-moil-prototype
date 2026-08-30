from fastapi import APIRouter
from ..services.equipment_service import equipment_service
from ..schemas.prediction import EquipmentPredictRequest, EquipmentPredictResponse

router = APIRouter(prefix="/equipment", tags=["ML Prediction: Equipment Diagnostics & RUL"])

@router.post("/predict", response_model=EquipmentPredictResponse)
def predict_equipment_health(req: EquipmentPredictRequest):
    """
    Predicts machinery failure probability, operating health index, and Remaining Useful Life (RUL).
    """
    return equipment_service.predict_equipment_health(req.model_dump())
