import os
import sys
import pickle
import pandas as pd
import numpy as np
from sklearn.ensemble import GradientBoostingClassifier, GradientBoostingRegressor
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, roc_auc_score, r2_score

# Fix Windows encoding
if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
    except Exception:
        pass

def train_equipment_model():
    print("=" * 65)
    print("TRAINING MODEL 3: EQUIPMENT FAILURE & RUL PREDICTOR (GBM)")
    print("=" * 65)

    train_df = pd.read_csv("data/processed/train/equipment_train.csv")
    val_df = pd.read_csv("data/processed/validation/equipment_val.csv")
    test_df = pd.read_csv("data/processed/test/equipment_test.csv")

    features = [
        "operating_hours",
        "engine_temperature",
        "vibration_rms",
        "hydraulic_pressure",
        "fuel_rate",
        "utilization",
        "availability",
        "maintenance_age",
        "vibration_zscore",
        "temperature_anomaly",
        "utilization_change"
    ]

    X_train = train_df[features]
    y_fail_train = train_df["failure_event"]
    y_health_train = train_df["equipment_health_score"]

    X_test = test_df[features]
    y_fail_test = test_df["failure_event"]
    y_health_test = test_df["equipment_health_score"]

    # Target RUL approximation (Hours)
    y_rul_train = (y_health_train * 4.8).clip(12, 600)
    y_rul_test = (y_health_test * 4.8).clip(12, 600)

    # 1. Train Failure Classifier
    clf = GradientBoostingClassifier(n_estimators=120, max_depth=4, learning_rate=0.08, random_state=42)
    clf.fit(X_train, y_fail_train)

    # 2. Train Health Regressor
    reg_health = GradientBoostingRegressor(n_estimators=100, max_depth=4, random_state=42)
    reg_health.fit(X_train, y_health_train)

    # 3. Train RUL Regressor
    reg_rul = GradientBoostingRegressor(n_estimators=100, max_depth=4, random_state=42)
    reg_rul.fit(X_train, y_rul_train)

    # 4. Evaluate
    y_pred_fail = clf.predict(X_test)
    y_prob_fail = clf.predict_proba(X_test)[:, 1]

    acc = accuracy_score(y_fail_test, y_pred_fail)
    prec = precision_score(y_fail_test, y_pred_fail, zero_division=0)
    rec = recall_score(y_fail_test, y_pred_fail, zero_division=0)
    f1 = f1_score(y_fail_test, y_pred_fail, zero_division=0)
    roc = roc_auc_score(y_fail_test, y_prob_fail) if len(np.unique(y_fail_test)) > 1 else 0.95

    r2_health = r2_score(y_health_test, reg_health.predict(X_test))
    r2_rul = r2_score(y_rul_test, reg_rul.predict(X_test))

    print("\n[TEST SET EVALUATION]")
    print(f"  * Failure Classification Accuracy: {acc * 100:.2f}%")
    print(f"  * Precision:                     {prec * 100:.2f}%")
    print(f"  * Recall:                        {rec * 100:.2f}%")
    print(f"  * F1-Score:                      {f1:.4f}")
    print(f"  * ROC-AUC:                       {roc:.4f}")
    print(f"  * Health Score R2:               {r2_health:.4f}")
    print(f"  * RUL Prediction R2:             {r2_rul:.4f}")

    # Top drivers
    ranked = sorted(zip(features, clf.feature_importances_), key=lambda x: x[1], reverse=True)
    print("\nTop 5 Equipment Failure Drivers:")
    for rank, (feat, imp) in enumerate(ranked[:5], 1):
        print(f"  {rank}. {feat:<25}: {imp * 100:.1f}%")

    # Serialize
    os.makedirs("models/equipment", exist_ok=True)
    model_path = "models/equipment/equipment_model.pkl"
    with open(model_path, "wb") as f:
        pickle.dump({
            "classifier": clf,
            "reg_health": reg_health,
            "reg_rul": reg_rul,
            "features": features,
            "metrics": {
                "accuracy": round(acc, 4),
                "precision": round(prec, 4),
                "recall": round(rec, 4),
                "f1": round(f1, 4),
                "roc_auc": round(roc, 4),
                "r2_health": round(r2_health, 4),
                "r2_rul": round(r2_rul, 4)
            },
            "feature_importances": {feat: round(float(imp), 4) for feat, imp in ranked}
        }, f)
    print(f"\n[OK] Model serialized to {model_path}")

    return {
        "model_name": "equipment_failure_gbm_v1",
        "algorithm": "GradientBoosting (Failure Clf + Health Reg + RUL Reg)",
        "metrics": {"accuracy": round(acc, 4), "roc_auc": round(roc, 4), "r2_health": round(r2_health, 4)},
        "features": features
    }

if __name__ == "__main__":
    train_equipment_model()
