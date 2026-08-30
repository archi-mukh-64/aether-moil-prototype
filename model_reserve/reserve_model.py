import os
import pickle
import pandas as pd
import numpy as np

class ReserveModel:
    """
    MOIL Reserve Radar & Grade Estimation Inference Engine
    """
    def __init__(self, model_path="model_reserve/reserve_model.pkl"):
        if not os.path.exists(model_path):
            raise FileNotFoundError(f"Model file not found at {model_path}. Train the model first.")
        
        with open(model_path, "rb") as f:
            artifact = pickle.load(f)
            self.grade_model = artifact["grade_model"]
            self.tonnes_model = artifact["tonnes_model"]
            self.features = artifact["features"]
            self.metrics = artifact["metrics"]

    def predict(self, geospatial_data: dict) -> dict:
        """
        Estimates ore grade % Mn and indicated reserve tonnage.
        """
        input_df = pd.DataFrame([{
            "swir_band11": geospatial_data.get("swir_band11", 0.65),
            "swir_band12": geospatial_data.get("swir_band12", 0.58),
            "magnetic_susceptibility_nt": geospatial_data.get("magnetic_susceptibility_nt", 85.0),
            "vein_depth_m": geospatial_data.get("vein_depth_m", 185.0)
        }])

        pred_grade = float(self.grade_model.predict(input_df)[0])
        pred_tonnes = float(self.tonnes_model.predict(input_df)[0])

        unfc = "UNFC-111 (Proved Reserve)" if pred_grade > 42.0 else "UNFC-122 (Probable Reserve)"

        return {
            "predicted_grade_mn": round(pred_grade, 2),
            "predicted_grade_formatted": f"{round(pred_grade, 1)}% Mn",
            "indicated_tonnes": int(pred_tonnes),
            "indicated_tonnes_formatted": f"{int(pred_tonnes):,} T",
            "unfc_classification": unfc,
            "r2_accuracy": f"{round(self.metrics['r2_grade'] * 100, 1)}%"
        }

if __name__ == "__main__":
    model = ReserveModel()
    sample = {
        "swir_band11": 0.842,
        "swir_band12": 0.790,
        "magnetic_susceptibility_nt": 184.0,
        "vein_depth_m": 220.0
    }
    result = model.predict(sample)
    print("Sample Reserve Estimation:", result)
