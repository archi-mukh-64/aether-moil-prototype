import os
import sys
import pickle
import json
import pandas as pd
import numpy as np
from sklearn.ensemble import GradientBoostingClassifier, GradientBoostingRegressor
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, roc_auc_score, mean_absolute_error, r2_score

# Fix Windows encoding
if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
    except Exception:
        pass

def train_shortfall_model():
    print("=" * 65)
    print("TRAINING MODEL 1: PRODUCTION SHORTFALL FORECASTER (GBM)")
    print("=" * 65)

    # 1. Load train / val / test
    train_df = pd.read_csv("data/processed/train/production_train.csv")
    val_df = pd.read_csv("data/processed/validation/production_val.csv")
    test_df = pd.read_csv("data/processed/test/production_test.csv")

    feature_cols = [
        "planned_tonnage",
        "ore_grade_mn",
        "recovery_rate",
        "crusher_utilization",
        "fleet_availability",
        "operating_hours",
        "downtime_hours",
        "rainfall_mm",
        "production_trend_7d",
        "production_trend_30d",
        "shortfall_rate",
        "target_deviation",
        "rolling_downtime_7d"
    ]

    X_train = train_df[feature_cols]
    y_clf_train = train_df["shortfall_event"]
    y_reg_train = train_df["actual_tonnage"]

    X_val = val_df[feature_cols]
    y_clf_val = val_df["shortfall_event"]
    y_reg_val = val_df["actual_tonnage"]

    X_test = test_df[feature_cols]
    y_clf_test = test_df["shortfall_event"]
    y_reg_test = test_df["actual_tonnage"]

    print(f"Dataset split: Train ({len(X_train)}), Val ({len(X_val)}), Test ({len(X_test)})")

    # 2. Train Classifier
    clf = GradientBoostingClassifier(
        n_estimators=140,
        learning_rate=0.07,
        max_depth=4,
        random_state=42
    )
    clf.fit(X_train, y_clf_train)

    # 3. Train Regressor for Tonnage Prediction
    reg = GradientBoostingRegressor(
        n_estimators=140,
        learning_rate=0.07,
        max_depth=4,
        random_state=42
    )
    reg.fit(X_train, y_reg_train)

    # 4. Evaluate Classifier on Test
    y_pred_clf = clf.predict(X_test)
    y_prob_clf = clf.predict_proba(X_test)[:, 1]

    acc = accuracy_score(y_clf_test, y_pred_clf)
    prec = precision_score(y_clf_test, y_pred_clf, zero_division=0)
    rec = recall_score(y_clf_test, y_pred_clf, zero_division=0)
    f1 = f1_score(y_clf_test, y_pred_clf, zero_division=0)
    roc = roc_auc_score(y_clf_test, y_prob_clf)

    # 5. Evaluate Regressor on Test
    y_pred_reg = reg.predict(X_test)
    mae = mean_absolute_error(y_reg_test, y_pred_reg)
    r2 = r2_score(y_reg_test, y_pred_reg)

    print("\n[TEST SET EVALUATION]")
    print(f"  * Classification Accuracy: {acc * 100:.2f}%")
    print(f"  * Precision:               {prec * 100:.2f}%")
    print(f"  * Recall:                  {rec * 100:.2f}%")
    print(f"  * F1-Score:                {f1:.4f}")
    print(f"  * ROC-AUC:                 {roc:.4f}")
    print(f"  * Regression MAE:          {mae:.1f} Tonnes")
    print(f"  * Regression R2:           {r2:.4f}")

    # 6. Feature Importances
    importances = clf.feature_importances_
    ranked = sorted(zip(feature_cols, importances), key=lambda x: x[1], reverse=True)
    print("\nTop 5 Shortfall Drivers:")
    for rank, (feat, imp) in enumerate(ranked[:5], 1):
        print(f"  {rank}. {feat:<25}: {imp * 100:.1f}%")

    # 7. Serialize Artifact
    os.makedirs("models/alert", exist_ok=True)
    model_path = "models/alert/shortfall_model.pkl"
    with open(model_path, "wb") as f:
        pickle.dump({
            "classifier": clf,
            "regressor": reg,
            "feature_cols": feature_cols,
            "metrics": {
                "accuracy": round(acc, 4),
                "precision": round(prec, 4),
                "recall": round(rec, 4),
                "f1": round(f1, 4),
                "roc_auc": round(roc, 4),
                "mae": round(mae, 2),
                "r2": round(r2, 4)
            },
            "feature_importances": {feat: round(float(imp), 4) for feat, imp in ranked}
        }, f)
    print(f"\n[OK] Model serialized to {model_path}")

    return {
        "model_name": "production_shortfall_gbm_v1",
        "algorithm": "GradientBoosting (Classifier + Regressor)",
        "metrics": {
            "accuracy": round(acc, 4),
            "precision": round(prec, 4),
            "recall": round(rec, 4),
            "f1": round(f1, 4),
            "roc_auc": round(roc, 4),
            "mae": round(mae, 2),
            "r2": round(r2, 4)
        },
        "feature_cols": feature_cols
    }

if __name__ == "__main__":
    train_shortfall_model()
