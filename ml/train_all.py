import os
import sys
import json
from datetime import datetime

# Fix Windows encoding
if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
    except Exception:
        pass

sys.path.insert(0, os.path.dirname(__file__))

from train_shortfall import train_shortfall_model
from train_prospectivity import train_prospectivity_model
from train_equipment import train_equipment_model
from train_anomaly import train_anomaly_detector

def train_all_models():
    print("=" * 65)
    print("MOIL MACHINE LEARNING PIPELINE // MASTER TRAINING ORCHESTRATOR")
    print("=" * 65)

    timestamp = datetime.utcnow().strftime("%Y-%m-%dT%H:%M:%SZ")

    res_shortfall = train_shortfall_model()
    res_prospectivity = train_prospectivity_model()
    res_equipment = train_equipment_model()
    res_anomaly = train_anomaly_detector()

    registry = {
        "registry_version": "1.0",
        "last_trained_utc": timestamp,
        "models": {
            "production_shortfall": {
                "name": "production_shortfall_v1",
                "version": "1.0.0",
                "training_dataset": "data/processed/train/production_train.csv (1,750 shifts)",
                "algorithm": "GradientBoosting (Classifier + Regressor)",
                "features": res_shortfall["feature_cols"],
                "metrics": res_shortfall["metrics"],
                "status": "DEPLOYED_ACTIVE"
            },
            "exploration_prospectivity": {
                "name": "exploration_prospectivity_v1",
                "version": "1.0.0",
                "training_dataset": "data/processed/train/exploration_train.csv (350 samples)",
                "algorithm": "RandomForest + GradientBoosting",
                "features": res_prospectivity["features"],
                "metrics": res_prospectivity["metrics"],
                "status": "DEPLOYED_ACTIVE"
            },
            "equipment_failure_rul": {
                "name": "equipment_failure_v1",
                "version": "1.0.0",
                "training_dataset": "data/processed/train/equipment_train.csv (1,400 logs)",
                "algorithm": "GradientBoosting (Failure + Health + RUL)",
                "features": res_equipment["features"],
                "metrics": res_equipment["metrics"],
                "status": "DEPLOYED_ACTIVE"
            },
            "operational_anomaly": {
                "name": "operational_anomaly_v1",
                "version": "1.0.0",
                "training_dataset": "data/processed/production_features.csv + equipment_features.csv",
                "algorithm": "IsolationForest (Contamination=0.08)",
                "features": res_anomaly["feature_cols"],
                "metrics": res_anomaly["metrics"],
                "status": "DEPLOYED_ACTIVE"
            }
        }
    }

    registry_path = "models/model_registry.json"
    with open(registry_path, "w", encoding="utf-8") as f:
        json.dump(registry, f, indent=2)
    print(f"\n[OK] Model registry saved to {registry_path}")

    print("\n" + "=" * 65)
    print("[SUCCESS] ALL 4 ML ENGINES TRAINED & REGISTERED SUCCESSFULLY!")
    print("=" * 65)

if __name__ == "__main__":
    train_all_models()
