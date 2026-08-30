import os
import sys
import json
import pickle
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import GradientBoostingClassifier
from sklearn.metrics import accuracy_score, roc_auc_score, precision_score, recall_score

# Fix Windows encoding
if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
    except Exception:
        pass

def train():
    print("=" * 60)
    print("MOIL ALERT ENGINE // SHORTFALL PREDICTOR MODEL TRAINING")
    print("=" * 60)

    data_path = "data/raw/production_history.csv"
    if not os.path.exists(data_path):
        raise FileNotFoundError(f"Missing {data_path}. Run generate_synthetic_data.py first.")

    df = pd.read_csv(data_path)
    print(f"Loaded {len(df)} production records from {data_path}")

    # Feature matrix & target
    feature_cols = [
        "rainfall_mm",
        "sump_inflow_m3h",
        "crusher_vibration_mms",
        "fleet_availability_pct",
        "grade_mn_pct"
    ]
    X = df[feature_cols]
    y = df["shortfall_event"]

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)
    print(f"Training set: {len(X_train)} samples | Test set: {len(X_test)} samples")

    # Train Classifier
    model = GradientBoostingClassifier(
        n_estimators=120,
        learning_rate=0.08,
        max_depth=4,
        random_state=42
    )
    model.fit(X_train, y_train)

    # Evaluation
    y_pred = model.predict(X_test)
    y_prob = model.predict_proba(X_test)[:, 1]

    acc = accuracy_score(y_test, y_pred)
    roc = roc_auc_score(y_test, y_prob)
    prec = precision_score(y_test, y_pred)
    rec = recall_score(y_test, y_pred)

    print(f"\nModel Performance Metrics:")
    print(f"  * Accuracy:  {acc * 100:.2f}%")
    print(f"  * ROC-AUC:   {roc:.4f}")
    print(f"  * Precision: {prec * 100:.2f}%")
    print(f"  * Recall:    {rec * 100:.2f}%")

    # Feature Importances (TreeSHAP Equivalent attribution)
    importances = model.feature_importances_
    ranked_features = sorted(zip(feature_cols, importances), key=lambda x: x[1], reverse=True)
    print(f"\nRanked Feature Contributions:")
    for rank, (feat, imp) in enumerate(ranked_features, 1):
        print(f"  {rank:02d}. {feat:<25} : {imp * 100:.1f}%")

    # Save Model Artifact
    os.makedirs("model_alert", exist_ok=True)
    model_path = "model_alert/alert_model.pkl"
    with open(model_path, "wb") as f:
        pickle.dump({
            "model": model,
            "feature_cols": feature_cols,
            "metrics": {
                "accuracy": round(acc, 4),
                "roc_auc": round(roc, 4),
                "precision": round(prec, 4),
                "recall": round(rec, 4)
            },
            "feature_importances": {feat: round(float(imp), 4) for feat, imp in ranked_features}
        }, f)
    print(f"\n[OK] Alert model serialized to {model_path}")

    # Save metrics JSON
    metrics_path = "model_alert/alert_metrics.json"
    with open(metrics_path, "w", encoding="utf-8") as f:
        json.dump({
            "model_type": "GradientBoostingClassifier",
            "accuracy": round(acc, 4),
            "roc_auc": round(roc, 4),
            "feature_importances": {feat: round(float(imp), 4) for feat, imp in ranked_features}
        }, f, indent=2)
    print(f"[OK] Performance metadata saved to {metrics_path}")

if __name__ == "__main__":
    train()
