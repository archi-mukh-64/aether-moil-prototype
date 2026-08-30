import os
import sys

# Ensure models directory is accessible
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from alert.alert_predictor import ShortfallPredictor
from reserve.reserve_predictor import ReservePredictor
from equipment.equipment_predictor import EquipmentPredictor
from anomaly.anomaly_detector import AnomalyDetector
from trust.trust_engine import TrustEngine

class MultiRiskIntelligenceEngine:
    def __init__(self):
        try:
            self.shortfall_pred = ShortfallPredictor()
            self.reserve_pred = ReservePredictor()
            self.equip_pred = EquipmentPredictor()
            self.anomaly_det = AnomalyDetector()
            self.trust_eng = TrustEngine()
            self.is_ready = True
        except Exception as e:
            print(f"[WARN] ML Model loading failed: {e}. Falling back to fallback state.")
            self.is_ready = False

    def evaluate_comprehensive_risk(self, input_data: dict) -> dict:
        """
        Synthesizes Shortfall, Equipment, Anomaly, and Environmental signals into unified multi-risk posture.
        """
        if not self.is_ready:
            return {
                "overall_risk": "ELEVATED",
                "risk_level": "ELEVATED",
                "probability": "45.0%",
                "top_drivers": {"Rainfall Baseline": 35.0, "Fleet Drag": 30.0},
                "affected_assets": ["Balaghat Sump -185m"],
                "status": "FALLBACK_DEMO"
            }

        # 1. Individual Model Predictions
        shortfall_res = self.shortfall_pred.predict(input_data)
        equip_res = self.equip_pred.predict(input_data)
        anomaly_res = self.anomaly_det.detect(input_data)
        
        # 2. Weighted Decision Framework
        w_shortfall = 0.40
        w_equip = 0.35
        w_anomaly = 0.25

        shortfall_prob = shortfall_res["shortfall_probability"]
        equip_prob = equip_res["failure_probability"]
        anomaly_prob = 0.85 if anomaly_res["is_anomaly"] else 0.15

        composite_risk_prob = (
            shortfall_prob * w_shortfall +
            equip_prob * w_equip +
            anomaly_prob * w_anomaly
        )

        risk_level = (
            "CRITICAL" if composite_risk_prob >= 0.65
            else "ELEVATED" if composite_risk_prob >= 0.35
            else "OPTIMAL"
        )

        # 3. Aggregate Top Drivers
        combined_drivers = {}
        for k, v in shortfall_res["top_drivers"].items():
            combined_drivers[f"Production: {k}"] = round(v * 0.4, 1)
        for k, v in equip_res["top_drivers"].items():
            combined_drivers[f"Equipment: {k}"] = round(v * 0.35, 1)

        sorted_drivers = dict(sorted(combined_drivers.items(), key=lambda item: item[1], reverse=True)[:5])

        # 4. Identify Affected Assets
        affected = []
        if shortfall_prob > 0.4:
            affected.append(f"{input_data.get('mine_name', 'Balaghat')} Ore Blending Circuit")
        if equip_prob > 0.4:
            affected.append(f"Crusher / Haulage Fleet")
        if anomaly_res["is_anomaly"]:
            affected.append(f"Drainage Catchment & Haul Roads")
        if not affected:
            affected.append("All Mine Systems Nominal")

        # 5. Trust calculation
        trust_res = self.trust_eng.calculate(
            input_data,
            model_conf_pct=float(shortfall_res["confidence"].replace("%", "")),
            anomaly_score=anomaly_res["anomaly_score"]
        )

        return {
            "overall_risk": risk_level,
            "risk_level": risk_level,
            "composite_risk_probability": round(composite_risk_prob, 4),
            "probability": f"{composite_risk_prob * 100:.1f}%",
            "top_drivers": sorted_drivers,
            "affected_assets": affected,
            "shortfall_assessment": shortfall_res,
            "equipment_assessment": equip_res,
            "anomaly_assessment": anomaly_res,
            "trust_assessment": trust_res,
            "mode": "REAL_ML_INFERENCE"
        }

if __name__ == "__main__":
    engine = MultiRiskIntelligenceEngine()
    sample = {
        "mine_name": "Balaghat Deep Shaft",
        "planned_tonnage": 6200,
        "ore_grade_mn": 44.2,
        "recovery_rate": 88.0,
        "crusher_utilization": 52.0,
        "fleet_availability": 65.0,
        "operating_hours": 16.0,
        "downtime_hours": 8.0,
        "rainfall_mm": 85.0,
        "production_trend_7d": 5800.0,
        "production_trend_30d": 6100.0,
        "shortfall_rate": 18.0,
        "target_deviation": -0.12,
        "rolling_downtime_7d": 24.0,
        "vibration_rms": 4.6,
        "engine_temperature": 92.0,
        "hydraulic_pressure": 152.0,
        "fuel_rate": 44.0,
        "utilization": 60.0,
        "availability": 70.0,
        "maintenance_age": 410,
        "vibration_zscore": 2.4,
        "temperature_anomaly": 16.0,
        "utilization_change": -10.0,
        "shortfall_percentage": 28.0
    }
    res = engine.evaluate_comprehensive_risk(sample)
    print("Multi-Risk Evaluation:", res)
