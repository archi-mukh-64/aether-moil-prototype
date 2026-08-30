from datetime import datetime, timezone
from typing import Dict, Any, List
from ..utils.model_loader import model_registry
from ..utils.validation import normalize_mine_id
from .mine_service import mine_service

class EquipmentService:
    @staticmethod
    def predict_equipment_health(data: Dict[str, Any]) -> Dict[str, Any]:
        mine_id = normalize_mine_id(data.get("mine_id", "balaghat"))
        mine = mine_service.get_mine_by_id(mine_id)
        
        predictor = model_registry.get_model("equipment")
        ts = datetime.now(timezone.utc).isoformat()
        
        features = {
            "operating_hours": data.get("operating_hours", 3200),
            "engine_temperature": data.get("engine_temperature", mine["crusherTempBase"]),
            "vibration_rms": data.get("vibration_rms", mine["crusherVibBase"]),
            "hydraulic_pressure": data.get("hydraulic_pressure", 172.0),
            "fuel_rate": data.get("fuel_rate", 35.0),
            "utilization": data.get("utilization", 88.5),
            "availability": data.get("availability", mine["fleetAvailabilityBase"]),
            "maintenance_age": data.get("maintenance_age", 180),
            "vibration_zscore": data.get("vibration_zscore", 0.4),
            "temperature_anomaly": data.get("temperature_anomaly", 2.0),
            "utilization_change": data.get("utilization_change", 0.0)
        }
        
        if predictor is not None:
            raw_pred = predictor.predict(features)
            return {
                "metadata": {
                    "mine_id": mine_id,
                    "model": "equipment_failure_rul",
                    "model_version": "EQUIPMENT-GBM v1.0",
                    "mode": "ML_INFERENCE",
                    "confidence": "96.4%",
                    "timestamp": ts,
                    "features_used": list(features.keys())
                },
                "prediction": raw_pred
            }
        else:
            vib = features["vibration_rms"]
            temp = features["engine_temperature"]
            
            fail_prob = min(0.95, max(0.05, (vib / 6.0) * 0.5 + (temp / 110.0) * 0.4))
            health = round(max(20.0, min(98.0, 100.0 - fail_prob * 80.0)), 1)
            rul = max(12, int(180 - fail_prob * 160))
            
            return {
                "metadata": {
                    "mine_id": mine_id,
                    "model": "equipment_failure_rul",
                    "model_version": "EQUIPMENT-HEURISTIC v1.0",
                    "mode": "DEMO_FALLBACK",
                    "confidence": "86.0%",
                    "timestamp": ts,
                    "features_used": list(features.keys())
                },
                "prediction": {
                    "failure_probability": round(fail_prob, 4),
                    "failure_probability_pct": f"{fail_prob * 100:.1f}%",
                    "health_score": health,
                    "estimated_RUL_hours": rul,
                    "risk_level": "OPTIMAL" if health >= 80 else "ELEVATED" if health >= 60 else "CRITICAL",
                    "status": "Optimal" if health >= 75 else "Warning",
                    "top_drivers": {
                        "Bearing Vibration FFT": 52.0,
                        "Thermal Dissipation Drift": 28.0,
                        "Operating Age": 20.0
                    }
                }
            }

    @staticmethod
    def get_mine_equipment_fleet(mine_id: str) -> List[Dict[str, Any]]:
        mine = mine_service.get_mine_by_id(mine_id)
        pfx = (mine["shortName"] or "MIN")[:3].upper()
        
        # 4 Primary Assets for the Mine
        return [
            {
                "id": f"CR-{pfx}-01",
                "name": f"{mine['shortName']} Primary Jaw Crusher ({mine['crusherCapacityTPH']} TPH)",
                "type": "Crushing & Sizing Unit",
                "health": mine["crusherHealthBase"],
                "status": "Optimal",
                "vibration": f"{mine['crusherVibBase']} mm/s",
                "temp": f"{mine['crusherTempBase']}°C",
                "rulHours": 240,
                "availability": f"{mine['fleetAvailabilityBase']}%"
            },
            {
                "id": f"DP-{pfx}-101",
                "name": f"Heavy Haul Dumper Fleet ({mine['fleetCount']} Units)",
                "type": "Haulage Fleet Unit",
                "health": 92,
                "status": "Optimal",
                "vibration": "1.8 mm/s",
                "temp": "82°C",
                "rulHours": 480,
                "availability": f"{mine['fleetAvailabilityBase']}%"
            },
            {
                "id": f"EX-{pfx}-01",
                "name": f"{mine['shortName']} Loading Face Shovel",
                "type": "Excavator & Skip Unit",
                "health": 88,
                "status": "Optimal",
                "vibration": "1.4 mm/s",
                "temp": "74°C",
                "rulHours": 320,
                "availability": "94.0%"
            },
            {
                "id": f"PU-{pfx}-01",
                "name": f"{mine['shortName']} Deep Sump Pumping Matrix ({mine['maxDrainageCapacityM3h']} m³/h)",
                "type": "Hydrogeological Drainage Unit",
                "health": 96,
                "status": "Optimal",
                "vibration": "1.2 mm/s",
                "temp": "62°C",
                "rulHours": 600,
                "availability": "98.5%"
            }
        ]

equipment_service = EquipmentService()
