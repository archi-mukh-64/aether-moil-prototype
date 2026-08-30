import os
import sys
import pickle
import json
import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier, GradientBoostingRegressor
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, r2_score

# Fix Windows encoding
if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
    except Exception:
        pass

def train_prospectivity_model():
    print("=" * 65)
    print("TRAINING MODEL 2: EXPLORATION & RESERVE PROSPECTIVITY (RF)")
    print("=" * 65)

    train_df = pd.read_csv("data/processed/train/exploration_train.csv")
    val_df = pd.read_csv("data/processed/validation/exploration_val.csv")
    test_df = pd.read_csv("data/processed/test/exploration_test.csv")

    features = [
        "depth_m",
        "mn_grade",
        "assay_confidence",
        "lineament_distance",
        "terrain_score",
        "spectral_signal",
        "lineament_proximity_score",
        "grade_anomaly"
    ]

    X_train = train_df[features]
    y_train = train_df["prospectivity_label"]

    X_test = test_df[features]
    y_test = test_df["prospectivity_label"]

    # Target continuous score for regression
    score_map = {
        "HIGH PROSPECT (UNFC-111 Proved)": 88.0,
        "MEDIUM PROSPECT (UNFC-122 Probable)": 64.0,
        "LOW PROSPECT (UNFC-333 Reconnaissance)": 28.0
    }
    y_score_train = y_train.map(score_map)
    y_score_test = y_test.map(score_map)

    # Train Classifier
    clf = RandomForestClassifier(n_estimators=120, max_depth=6, random_state=42)
    clf.fit(X_train, y_train)

    # Train Score Regressor
    reg = GradientBoostingRegressor(n_estimators=100, max_depth=4, random_state=42)
    reg.fit(X_train, y_score_train)

    # Evaluate
    y_pred = clf.predict(X_test)
    acc = accuracy_score(y_test, y_pred)
    prec = precision_score(y_test, y_pred, average="weighted", zero_division=0)
    rec = recall_score(y_test, y_pred, average="weighted", zero_division=0)
    f1 = f1_score(y_test, y_pred, average="weighted", zero_division=0)
    r2 = r2_score(y_score_test, reg.predict(X_test))

    print("\n[TEST SET EVALUATION]")
    print(f"  * Classification Accuracy: {acc * 100:.2f}%")
    print(f"  * Precision (Weighted):    {prec * 100:.2f}%")
    print(f"  * Recall (Weighted):       {rec * 100:.2f}%")
    print(f"  * F1-Score (Weighted):     {f1:.4f}")
    print(f"  * Prospectivity Score R2:  {r2:.4f}")

    # Top drivers
    ranked = sorted(zip(features, clf.feature_importances_), key=lambda x: x[1], reverse=True)
    print("\nTop 5 Prospectivity Drivers:")
    for rank, (feat, imp) in enumerate(ranked[:5], 1):
        print(f"  {rank}. {feat:<28}: {imp * 100:.1f}%")

    # Serialize
    os.makedirs("models/reserve", exist_ok=True)
    model_path = "models/reserve/prospectivity_model.pkl"
    with open(model_path, "wb") as f:
        pickle.dump({
            "classifier": clf,
            "regressor": reg,
            "features": features,
            "classes": list(clf.classes_),
            "metrics": {
                "accuracy": round(acc, 4),
                "f1_weighted": round(f1, 4),
                "r2": round(r2, 4)
            },
            "feature_importances": {feat: round(float(imp), 4) for feat, imp in ranked}
        }, f)
    print(f"\n[OK] Model serialized to {model_path}")

    # Generate Spatial GeoJSON
    geojson_features = []
    full_df = pd.read_csv("data/processed/exploration_features.csv")
    for _, row in full_df.head(60).iterrows():
        sample_x = row[features].values.reshape(1, -1)
        pred_label = clf.predict(sample_x)[0]
        pred_score = round(float(reg.predict(sample_x)[0]), 1)
        
        geojson_features.append({
            "type": "Feature",
            "properties": {
                "sample_id": row["sample_id"],
                "mine_id": row["mine_id"],
                "depth": f"-{int(row['depth_m'])}m",
                "prospectivity_score": f"{pred_score}%",
                "prospectivity_class": pred_label,
                "mn_grade": f"{row['mn_grade']}% Mn",
                "spectral_signal": f"{row['spectral_signal']} SWIR Index"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [row["longitude"], row["latitude"]]
            }
        })

    geojson_path = "models/reserve/reserve_predictions.geojson"
    with open(geojson_path, "w", encoding="utf-8") as f:
        json.dump({"type": "FeatureCollection", "features": geojson_features}, f, indent=2)
    print(f"[OK] Spatial predictions saved to {geojson_path}")

    return {
        "model_name": "exploration_prospectivity_rf_v1",
        "algorithm": "RandomForest + GradientBoosting",
        "metrics": {"accuracy": round(acc, 4), "f1": round(f1, 4), "r2": round(r2, 4)},
        "features": features
    }

if __name__ == "__main__":
    train_prospectivity_model()
