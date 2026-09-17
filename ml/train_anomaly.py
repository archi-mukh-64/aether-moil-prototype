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

    # Format dates for relational merge to ensure true physical alignment of mine & equipment
    prod_df["date"] = pd.to_datetime(prod_df["date"]).dt.strftime("%Y-%m-%d")
    eq_df["date"] = pd.to_datetime(eq_df["timestamp"]).dt.strftime("%Y-%m-%d")

    # Relational merge on [mine_id, date] guarantees physical alignment
    merged = pd.merge(eq_df, prod_df, on=["mine_id", "date"], suffixes=("_eq", "_prod"))

    features_df = pd.DataFrame({
        "rainfall_mm": merged["rainfall_mm"],
        "vibration_rms": merged["vibration_rms"],
        "engine_temperature": merged["engine_temperature"],
        "downtime_hours": merged["downtime_hours"],
        "shortfall_percentage": merged["shortfall_percentage"]
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
