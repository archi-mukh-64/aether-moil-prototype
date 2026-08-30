import os
import sys
import json
import pickle
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor
from sklearn.metrics import r2_score, mean_absolute_error

# Fix Windows encoding
if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
    except Exception:
        pass

def train():
    print("=" * 60)
    print("MOIL RESERVE RADAR // GEOSPATIAL RESERVE & GRADE ESTIMATOR")
    print("=" * 60)

    data_path = "data/raw/satellite_ndvi.csv"
    if not os.path.exists(data_path):
        raise FileNotFoundError(f"Missing {data_path}. Run generate_synthetic_data.py first.")

    df = pd.read_csv(data_path)
    print(f"Loaded {len(df)} remote sensing samples from {data_path}")

    features = [
        "swir_band11",
        "swir_band12",
        "magnetic_susceptibility_nt",
        "vein_depth_m"
    ]
    X = df[features]
    y_grade = df["estimated_grade_mn"]
    y_tonnes = df["indicated_tonnes"]

    # Split
    X_train, X_test, yg_train, yg_test = train_test_split(X, y_grade, test_size=0.2, random_state=42)

    # Train Grade Model
    grade_model = GradientBoostingRegressor(n_estimators=100, learning_rate=0.1, max_depth=3, random_state=42)
    grade_model.fit(X_train, yg_train)

    yg_pred = grade_model.predict(X_test)
    r2_grade = r2_score(yg_test, yg_pred)
    mae_grade = mean_absolute_error(yg_test, yg_pred)

    print(f"\nGrade Estimation Model:")
    print(f"  * R2 Score: {r2_grade:.4f}")
    print(f"  * MAE:      {mae_grade:.2f}% Mn")

    # Train Tonnes Model
    tonnes_model = RandomForestRegressor(n_estimators=80, max_depth=4, random_state=42)
    tonnes_model.fit(X, y_tonnes)

    # Save Model Artifact
    os.makedirs("model_reserve", exist_ok=True)
    model_path = "model_reserve/reserve_model.pkl"
    with open(model_path, "wb") as f:
        pickle.dump({
            "grade_model": grade_model,
            "tonnes_model": tonnes_model,
            "features": features,
            "metrics": {
                "r2_grade": round(r2_grade, 4),
                "mae_grade": round(mae_grade, 4)
            }
        }, f)
    print(f"\n[OK] Reserve model serialized to {model_path}")

    # Generate predictions GeoJSON
    features_geojson = []
    for idx, row in df.head(30).iterrows():
        features_geojson.append({
            "type": "Feature",
            "properties": {
                "sample_id": row["sample_id"],
                "predicted_grade": f"{row['estimated_grade_mn']:.1f}% Mn",
                "indicated_tonnes": int(row["indicated_tonnes"]),
                "depth": f"-{row['vein_depth_m']:.0f}m Level",
                "unfc_category": "UNFC-111 (Proved)" if row["estimated_grade_mn"] > 42.0 else "UNFC-122 (Probable)"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [row["lon"], row["lat"]]
            }
        })

    geojson_path = "model_reserve/reserve_predictions.geojson"
    with open(geojson_path, "w", encoding="utf-8") as f:
        json.dump({"type": "FeatureCollection", "features": features_geojson}, f, indent=2)
    print(f"[OK] Reserve predictions GeoJSON saved to {geojson_path}")

if __name__ == "__main__":
    train()
