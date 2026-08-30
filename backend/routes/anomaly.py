from fastapi import APIRouter
from ..services.anomaly_service import anomaly_service
from ..schemas.prediction import AnomalyDetectRequest, AnomalyDetectResponse

router = APIRouter(prefix="/anomaly", tags=["ML Prediction: Operational Anomaly Detection"])

@router.post("/detect", response_model=AnomalyDetectResponse)
def detect_anomaly(req: AnomalyDetectRequest):
    """
    Detects operational sensor deviations using Isolation Forest algorithms.
    """
    return anomaly_service.detect_anomaly(req.model_dump())
