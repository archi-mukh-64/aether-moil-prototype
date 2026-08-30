import os
import pickle
import pandas as pd
import numpy as np

class AnomalyDetector:
    def __init__(self, model_path="models/anomaly/anomaly_model.pkl"):
        if not os.path.exists(model_path):
            raise FileNotFoundError(f"Model artifact not found at {model_path}. Run train_anomaly.py first.")
        
        with open(model_path, "rb") as f:
            artifact = pickle.load(f)
        
        self.model = artifact["model"]
        self.feature_cols = artifact["feature_cols"]
        self.threshold = artifact["threshold"]

    def detect(self, input_data: dict) -> dict:
        row = {}
        for col in self.feature_cols:
            row[col] = [input_data.get(col, 0.0)]
        df = pd.DataFrame(row)

        pred = self.model.predict(df)[0]
        score = float(self.model.decision_function(df)[0])

        is_anomaly = bool(pred == -1)

        # Infer anomaly type from which signal exceeds its typical baseline
        anomaly_type = "NOMINAL"
        if is_anomaly:
            if input_data.get("rainfall_mm", 0) > 40:
                anomaly_type = "HYDROLOGICAL_INFLUX"
            elif input_data.get("vibration_rms", 0) > 3.8:
                anomaly_type = "HARMONIC_VIBRATION_SPIKE"
            elif input_data.get("engine_temperature", 0) > 92:
                anomaly_type = "THERMAL_EXCURSION"
            elif input_data.get("shortfall_percentage", 0) > 20:
                anomaly_type = "PRODUCTION_DEFICIT"
            else:
                anomaly_type = "MULTI_VARIATE_DEVIATION"

        confidence = round(min(98.0, max(70.0, 70.0 + abs(score) * 60.0)), 1)

        return {
            "is_anomaly": is_anomaly,
            "anomaly_score": round(score, 4),
            "anomaly_type": anomaly_type,
            "confidence": f"{confidence}%",
            "model_version": "ANOMALY-IFOREST v1.0"
        }

if __name__ == "__main__":
    detector = AnomalyDetector()
    sample = {
        "rainfall_mm": 95.0,
        "vibration_rms": 5.2,
        "engine_temperature": 98.0,
        "downtime_hours": 9.5,
        "shortfall_percentage": 34.0
    }
    res = detector.detect(sample)
    print("Sample Anomaly Detection:", res)
