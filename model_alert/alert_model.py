import os
import pickle
import pandas as pd
import numpy as np

class AlertModel:
    """
    MOIL Shortfall Risk & Anomaly Inference Engine
    """
    def __init__(self, model_path="model_alert/alert_model.pkl"):
        if not os.path.exists(model_path):
            raise FileNotFoundError(f"Model file not found at {model_path}. Train the model first.")
        
        with open(model_path, "rb") as f:
            artifact = pickle.load(f)
            self.model = artifact["model"]
            self.feature_cols = artifact["feature_cols"]
            self.metrics = artifact["metrics"]
            self.feature_importances = artifact["feature_importances"]

    def predict(self, sensor_data: dict) -> dict:
        """
        Runs real-time inference on input telemetry features.
        """
        input_df = pd.DataFrame([{
            "rainfall_mm": sensor_data.get("rainfall_mm", 0.0),
            "sump_inflow_m3h": sensor_data.get("sump_inflow_m3h", 12.0),
            "crusher_vibration_mms": sensor_data.get("crusher_vibration_mms", 2.2),
            "fleet_availability_pct": sensor_data.get("fleet_availability_pct", 92.0),
            "grade_mn_pct": sensor_data.get("grade_mn_pct", 44.2)
        }])

        prob = float(self.model.predict_proba(input_df)[0, 1])
        is_shortfall = bool(prob > 0.50)

        # Risk categorization
        if prob > 0.80:
            risk_level = "CRITICAL"
        elif prob > 0.60:
            risk_level = "HIGH"
        elif prob > 0.35:
            risk_level = "ELEVATED"
        else:
            risk_level = "NOMINAL"

        # Local feature impact estimation
        contributions = {}
        for feat in self.feature_cols:
            val = float(input_df[feat].iloc[0])
            imp = self.feature_importances.get(feat, 0.2)
            contributions[feat] = round(imp * 100, 1)

        return {
            "shortfall_probability": round(prob, 4),
            "shortfall_probability_pct": f"{round(prob * 100, 1)}%",
            "shortfall_detected": is_shortfall,
            "risk_level": risk_level,
            "confidence": f"{round(self.metrics['accuracy'] * 100, 1)}%",
            "feature_contributions": contributions
        }

if __name__ == "__main__":
    model = AlertModel()
    sample = {
        "rainfall_mm": 88.4,
        "sump_inflow_m3h": 38.6,
        "crusher_vibration_mms": 2.4,
        "fleet_availability_pct": 62.0,
        "grade_mn_pct": 44.2
    }
    result = model.predict(sample)
    print("Sample Prediction Result:", result)
