from datetime import datetime, timezone
from typing import Dict, Any
from ..utils.model_loader import model_registry
from ..utils.validation import normalize_mine_id
from .mine_service import mine_service

class ReserveService:
    @staticmethod
    def predict_reserve_prospectivity(data: Dict[str, Any]) -> Dict[str, Any]:
        mine_id = normalize_mine_id(data.get("mine_id", "balaghat"))
        mine = mine_service.get_mine_by_id(mine_id)
        
        predictor = model_registry.get_model("reserve")
        ts = datetime.now(timezone.utc).isoformat()
        
        features = {
            "depth_m": data.get("depth_m", 145),
            "mn_grade": data.get("mn_grade", mine["baseGradeNum"]),
            "assay_confidence": data.get("assay_confidence", 0.94),
            "lineament_distance": data.get("lineament_distance", 240.0),
            "terrain_score": data.get("terrain_score", 0.88),
            "spectral_signal": data.get("spectral_signal", 0.820),
            "lineament_proximity_score": data.get("lineament_proximity_score", 0.88),
            "grade_anomaly": data.get("grade_anomaly", 4.2)
        }
        
        if predictor is not None:
            raw_pred = predictor.predict(features)
            return {
                "metadata": {
                    "mine_id": mine_id,
                    "model": "exploration_prospectivity",
                    "model_version": "RESERVE-RF v1.0",
                    "mode": "ML_INFERENCE",
                    "confidence": raw_pred.get("confidence", "98.0%"),
                    "timestamp": ts,
                    "features_used": list(features.keys())
                },
                "prediction": raw_pred
            }
        else:
            depth = features["depth_m"]
            score = round(max(20.0, min(96.0, 92.0 - (depth / 400.0) * 25.0)), 1)
            return {
                "metadata": {
                    "mine_id": mine_id,
                    "model": "exploration_prospectivity",
                    "model_version": "RESERVE-HEURISTIC v1.0",
                    "mode": "DEMO_FALLBACK",
                    "confidence": "88.0%",
                    "timestamp": ts,
                    "features_used": list(features.keys())
                },
                "prediction": {
                    "prospectivity_score": score,
                    "prospectivity_score_formatted": f"{score}%",
                    "prospectivity_class": "UNFC-111 (Proved Mineral Reserve)",
                    "unfc_category": "UNFC-111 (Proved Mineral Reserve)",
                    "confidence": "88.0%",
                    "top_drivers": {
                        "SWIR Band 11/12 Mineral Absorption": 45.0,
                        "Lineament Proximity": 30.0,
                        "Lithological Contact": 25.0
                    }
                }
            }

    @staticmethod
    def get_mine_reserve_detail(mine_id: str) -> Dict[str, Any]:
        mine = mine_service.get_mine_by_id(mine_id)
        pred = ReserveService.predict_reserve_prospectivity({"mine_id": mine_id, "depth_m": 145})
        return {
            "mine_id": mine["id"],
            "mine_name": mine["name"],
            "unfc_status": mine.get("unfcStatus", "UNFC-111"),
            "proved_tonnes": mine["reserve"]["provedTonnes"],
            "probable_tonnes": mine["reserve"]["probableTonnes"],
            "strike_length_km": mine["reserve"]["strikeLengthKm"],
            "dip_angle": mine["reserve"]["dipAngle"],
            "prospectivity_assessment": pred["prediction"]
        }

reserve_service = ReserveService()
