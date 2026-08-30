import os
import sys
import pickle
import pandas as pd
import numpy as np
from sklearn.ensemble import IsolationForest

# Fix Windows encoding
if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
    except Exception:
        pass

def train_anomaly_detector():
    print("=" * 65)
    print("TRAINING MODEL 4: MULTI-VARIATE ANOMALY DETECTOR (ISOLATION FOREST)")
    print("=" * 65)

    prod_df = pd.read_csv("data/processed/production_features.csv")
    eq_df = pd.read_csv("data/processed/equipment_features.csv")

    # Construct unified operational feature matrix
    min_len = min(len(prod_df), len(eq_df))
    features_df = pd.DataFrame({
        "rainfall_mm": prod_df["rainfall_mm"].iloc[:min_len],
        "vibration_rms": eq_df["vibration_rms"].iloc[:min_len],
        "engine_temperature": eq_df["engine_temperature"].iloc[:min_len],
        "downtime_hours": prod_df["downtime_hours"].iloc[:min_len],
        "shortfall_percentage": prod_df["shortfall_percentage"].iloc[:min_len]
    })

    model = IsolationForest(
        n_estimators=150,
        contamination=0.08,
        random_state=42
    )
    model.fit(features_df)

    # Predictions (-1 for anomaly, 1 for normal)
    preds = model.predict(features_df)
    scores = model.decision_function(features_df)

    anomaly_count = (preds == -1).sum()
    anomaly_pct = round((anomaly_count / len(preds)) * 100, 2)

    print(f"\n[UNSUPERVISED ANOMALY EVALUATION]")
    print(f"  * Total Samples:    {len(features_df)}")
    print(f"  * Detected Anomalies: {anomaly_count} ({anomaly_pct}%)")
    print(f"  * Mean Decision Score: {scores.mean():.4f}")
    print(f"  * Min Anomaly Score:  {scores.min():.4f}")

    os.makedirs("models/anomaly", exist_ok=True)
    model_path = "models/anomaly/anomaly_model.pkl"
    with open(model_path, "wb") as f:
        pickle.dump({
            "model": model,
            "feature_cols": list(features_df.columns),
            "threshold": float(model.offset_),
            "metrics": {
                "contamination": 0.08,
                "detected_anomaly_pct": anomaly_pct,
                "total_samples": len(features_df)
            }
        }, f)
    print(f"\n[OK] Model serialized to {model_path}")

    return {
        "model_name": "operational_anomaly_iforest_v1",
        "algorithm": "IsolationForest",
        "metrics": {"contamination": 0.08, "anomaly_rate": f"{anomaly_pct}%"},
        "feature_cols": list(features_df.columns)
    }

if __name__ == "__main__":
    train_anomaly_detector()
