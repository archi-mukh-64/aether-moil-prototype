import os
import pickle
import pandas as pd
import numpy as np

class EquipmentPredictor:
    def __init__(self, model_path="models/equipment/equipment_model.pkl"):
        if not os.path.exists(model_path):
            raise FileNotFoundError(f"Model artifact not found at {model_path}. Run train_equipment.py first.")
        
        with open(model_path, "rb") as f:
            artifact = pickle.load(f)
        
        self.clf = artifact["classifier"]
        self.reg_health = artifact["reg_health"]
        self.reg_rul = artifact["reg_rul"]
        self.features = artifact["features"]
        self.feature_importances = artifact["feature_importances"]

    def predict(self, input_data: dict) -> dict:
        row = {}
        for col in self.features:
            row[col] = [input_data.get(col, 0.0)]
        df = pd.DataFrame(row)

        fail_prob = float(self.clf.predict_proba(df)[0, 1])
        health = float(self.reg_health.predict(df)[0])
        health = round(min(99.0, max(15.0, health)), 1)
        rul = int(self.reg_rul.predict(df)[0])
        rul = max(8, rul)

        risk_level = "CRITICAL" if fail_prob >= 0.65 or health < 60 else "ELEVATED" if fail_prob >= 0.35 or health < 78 else "OPTIMAL"

        drivers = {}
        for feat, imp in list(self.feature_importances.items())[:5]:
            drivers[feat] = round(imp * 100, 1)

        return {
            "failure_probability": round(fail_prob, 4),
            "failure_probability_pct": f"{fail_prob * 100:.1f}%",
            "health_score": health,
            "estimated_RUL_hours": rul,
            "risk_level": risk_level,
            "status": "Warning" if risk_level != "OPTIMAL" else "Optimal",
            "model_version": "EQUIPMENT-GBM v1.0",
            "top_drivers": drivers
        }

if __name__ == "__main__":
    predictor = EquipmentPredictor()
    sample = {
        "operating_hours": 3200,
        "engine_temperature": 94.5,
        "vibration_rms": 4.8,
        "hydraulic_pressure": 155.0,
        "fuel_rate": 42.0,
        "utilization": 65.0,
        "availability": 72.0,
        "maintenance_age": 420,
        "vibration_zscore": 2.6,
        "temperature_anomaly": 18.2,
        "utilization_change": -12.0
    }
    res = predictor.predict(sample)
    print("Sample Equipment Prediction:", res)
