from typing import Dict, Any, List
from .mine_service import mine_service
from ..utils.validation import normalize_mine_id

class AnalyticsService:
    @staticmethod
    def get_mine_analytics(mine_id: str) -> Dict[str, Any]:
        mine = mine_service.get_mine_by_id(mine_id)
        target = mine["productionTarget"]
        grade = mine["baseGradeNum"]
        sens = mine["rainfallSensitivity"]
        
        # 30-day deterministic history
        prod_history = []
        for i in range(30):
            day = i + 1
            # Deterministic variation using sinusoidal function
            var = 1.0 + 0.04 * ((day * 7) % 11 - 5) / 5.0
            act = int(target * var)
            fc = int(target * (1.0 + 0.03 * ((day * 5) % 7 - 3) / 3.0))
            rain = round(max(0.0, 5.0 + 15.0 * sens * ((day * 3) % 9 - 4) / 4.0), 1)
            
            prod_history.append({
                "day": f"D-{30-i}",
                "actual": act,
                "target": target,
                "forecast": fc,
                "rainfall": rain,
                "quotaPct": round((act / target) * 100, 1)
            })

        # 14-day forward forecast
        forecast_14d = []
        for i in range(14):
            day = i + 1
            var = 1.0 + 0.02 * ((day * 13) % 7 - 3) / 3.0
            predicted = int(target * var)
            lower = int(predicted * 0.94)
            upper = int(predicted * 1.05)
            
            forecast_14d.append({
                "day": f"+{day}d",
                "predicted": predicted,
                "target": target,
                "lowerBound": lower,
                "upperBound": upper,
                "confidence": "94.8%"
            })

        # Grade & Recovery history
        grade_history = []
        for i in range(14):
            day = i + 1
            actual_mn = round(grade + 0.6 * ((day * 3) % 5 - 2) / 2.0, 1)
            rec = round(88.0 + 1.5 * ((day * 7) % 5 - 2) / 2.0, 1)
            grade_history.append({
                "day": f"D-{14-i}",
                "mnGrade": actual_mn,
                "targetGrade": grade,
                "recoveryRate": rec,
                "silica": round(8.4 + 0.3 * ((day * 4) % 3 - 1), 1)
            })

        return {
            "mine_id": mine["id"],
            "mine_name": mine["name"],
            "kpis": {
                "daily_output": f"{target:,} T / Day",
                "quota_achievement": "98.4%",
                "ore_grade": f"{grade}% Mn",
                "recovery_rate": "88.2%",
                "fleet_health": f"{int(mine['fleetAvailabilityBase'])}%",
                "ai_trust_score": "95.8%"
            },
            "production_history_30d": prod_history,
            "forecast_horizon_14d": forecast_14d,
            "grade_quality_history": grade_history,
            "hydrogeology": {
                "water_table_depth": mine["waterTableDepth"],
                "drainage_baseline": f"{mine['drainageBaselineM3h']} m³/h",
                "max_pumping_capacity": f"{mine['maxDrainageCapacityM3h']} m³/h",
                "rainfall_sensitivity": f"{sens}x Sensitivity"
            },
            "mechanical_health": {
                "crusher_tph": mine["crusherCapacityTPH"],
                "vibration_baseline": f"{mine['crusherVibBase']} mm/s",
                "thermal_baseline": f"{mine['crusherTempBase']}°C",
                "estimated_rul_hours": 240
            }
        }

analytics_service = AnalyticsService()
