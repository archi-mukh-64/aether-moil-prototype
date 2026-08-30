import os
import pickle
import pandas as pd
import numpy as np

class ReservePredictor:
    def __init__(self, model_path="models/reserve/prospectivity_model.pkl"):
        if not os.path.exists(model_path):
            raise FileNotFoundError(f"Model artifact not found at {model_path}. Run train_prospectivity.py first.")
        
        with open(model_path, "rb") as f:
            artifact = pickle.load(f)
        
        self.clf = artifact["classifier"]
        self.reg = artifact["regressor"]
        self.features = artifact["features"]
        self.classes = artifact["classes"]
        self.feature_importances = artifact["feature_importances"]

    def predict(self, input_data: dict) -> dict:
        row = {}
        for col in self.features:
            row[col] = [input_data.get(col, 0.0)]
        df = pd.DataFrame(row)

        pred_class = self.clf.predict(df)[0]
        pred_score = float(self.reg.predict(df)[0])
        pred_score = round(min(98.5, max(15.0, pred_score)), 1)

        probs = self.clf.predict_proba(df)[0]
        max_prob = float(max(probs))
        confidence = round(max_prob * 100, 1)

        drivers = {}
        for feat, imp in list(self.feature_importances.items())[:5]:
            drivers[feat] = round(imp * 100, 1)

        # Simplified UNFC label mapping
        unfc = (
            "UNFC-111 (Proved Mineral Reserve)" if "UNFC-111" in pred_class or pred_score >= 78.0
            else "UNFC-122 (Probable Mineral Reserve)" if "UNFC-122" in pred_class or pred_score >= 52.0
            else "UNFC-333 (Reconnaissance Target)"
        )

        return {
            "prospectivity_score": pred_score,
            "prospectivity_score_formatted": f"{pred_score}%",
            "prospectivity_class": pred_class,
            "unfc_category": unfc,
            "confidence": f"{confidence}%",
            "model_version": "RESERVE-RF v1.0",
            "top_drivers": drivers
        }

if __name__ == "__main__":
    predictor = ReservePredictor()
    sample = {
        "depth_m": 145,
        "mn_grade": 45.6,
        "assay_confidence": 0.94,
        "lineament_distance": 240.0,
        "terrain_score": 0.88,
        "spectral_signal": 0.820,
        "lineament_proximity_score": 0.88,
        "grade_anomaly": 4.2
    }
    res = predictor.predict(sample)
    print("Sample Prospectivity Prediction:", res)
