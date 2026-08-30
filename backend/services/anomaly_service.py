from datetime import datetime, timezone
from typing import Dict, Any
from ..utils.model_loader import model_registry
from ..utils.validation import normalize_mine_id
from .mine_service import mine_service

class AnomalyService:
    @staticmethod
    def detect_anomaly(data: Dict[str, Any]) -> Dict[str, Any]:
        mine_id = normalize_mine_id(data.get("mine_id", "balaghat"))
        mine = mine_service.get_mine_by_id(mine_id)
        
        detector = model_registry.get_model("anomaly")
        ts = datetime.now(timezone.utc).isoformat()
        
        features = {
            "rainfall_mm": data.get("rainfall_mm", 12.0),
            "vibration_rms": data.get("vibration_rms", mine["crusherVibBase"]),
            "engine_temperature": data.get("engine_temperature", mine["crusherTempBase"]),
            "downtime_hours": data.get("downtime_hours", 1.5),
            "shortfall_percentage": data.get("shortfall_percentage", 4.0)
        }
        
        if detector is not None:
            raw_pred = detector.detect(features)
            return {
                "metadata": {
                    "mine_id": mine_id,
                    "model": "operational_anomaly",
                    "model_version": "ANOMALY-IFOREST v1.0",
                    "mode": "ML_INFERENCE",
                    "confidence": raw_pred.get("confidence", "92.0%"),
                    "timestamp": ts,
                    "features_used": list(features.keys())
                },
                "prediction": raw_pred
            }
        else:
            rainfall = features["rainfall_mm"]
            vib = features["vibration_rms"]
            is_anomaly = rainfall > 45.0 or vib > 3.8
            score = -0.18 if is_anomaly else 0.12
            
            return {
                "metadata": {
                    "mine_id": mine_id,
                    "model": "operational_anomaly",
                    "model_version": "ANOMALY-HEURISTIC v1.0",
                    "mode": "DEMO_FALLBACK",
                    "confidence": "85.0%",
                    "timestamp": ts,
                    "features_used": list(features.keys())
                },
                "prediction": {
                    "is_anomaly": is_anomaly,
                    "anomaly_score": score,
                    "anomaly_type": "HYDROLOGICAL_INFLUX" if rainfall > 45.0 else "HARMONIC_VIBRATION_SPIKE" if vib > 3.8 else "NOMINAL",
                    "confidence": "85.0%"
                }
            }

anomaly_service = AnomalyService()
