import os
import sys
import pandas as pd
import numpy as np

# Fix Windows encoding
if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
    except Exception:
        pass

def process_and_engineer_features():
    print("=" * 65)
    print("MOIL DATA PIPELINE // CLEANING & FEATURE ENGINEERING")
    print("=" * 65)

    os.makedirs("data/processed", exist_ok=True)
    os.makedirs("data/processed/train", exist_ok=True)
    os.makedirs("data/processed/validation", exist_ok=True)
    os.makedirs("data/processed/test", exist_ok=True)

    # -------------------------------------------------------------
    # 1. Production Features
    # -------------------------------------------------------------
    print("\n[STEP 1/6] Processing Production Features...")
    prod_df = pd.read_csv("data/raw/production_history.csv")
    prod_df["date"] = pd.to_datetime(prod_df["date"])
    prod_df = prod_df.sort_values(by=["mine_id", "date"]).reset_index(drop=True)

    # Groupby mine rolling calculations
    prod_df["production_trend_7d"] = prod_df.groupby("mine_id")["actual_tonnage"].transform(lambda s: s.rolling(7, min_periods=1).mean()).round(1)
    prod_df["production_trend_30d"] = prod_df.groupby("mine_id")["actual_tonnage"].transform(lambda s: s.rolling(30, min_periods=1).mean()).round(1)
    prod_df["shortfall_rate"] = prod_df.groupby("mine_id")["shortfall_percentage"].transform(lambda s: s.ewm(span=7).mean()).round(2)
    prod_df["target_deviation"] = ((prod_df["actual_tonnage"] - prod_df["planned_tonnage"]) / prod_df["planned_tonnage"]).round(4)
    prod_df["rolling_downtime_7d"] = prod_df.groupby("mine_id")["downtime_hours"].transform(lambda s: s.rolling(7, min_periods=1).sum()).round(1)

    prod_out = "data/processed/production_features.csv"
    prod_df.to_csv(prod_out, index=False)
    print(f"  [OK] Saved {len(prod_df)} records to {prod_out}")

    # -------------------------------------------------------------
    # 2. Equipment Features
    # -------------------------------------------------------------
    print("\n[STEP 2/6] Processing Equipment Features...")
    eq_df = pd.read_csv("data/raw/equipment_logs.csv")
    eq_df["timestamp"] = pd.to_datetime(eq_df["timestamp"])
    eq_df = eq_df.sort_values(by=["equipment_id", "timestamp"]).reset_index(drop=True)

    # Vibration Z-Score by equipment type
    mean_vib = eq_df.groupby("equipment_type")["vibration_rms"].transform("mean")
    std_vib = eq_df.groupby("equipment_type")["vibration_rms"].transform("std")
    eq_df["vibration_zscore"] = ((eq_df["vibration_rms"] - mean_vib) / (std_vib + 1e-4)).round(2)

    # Temperature anomaly
    mean_temp = eq_df.groupby("equipment_type")["engine_temperature"].transform("mean")
    eq_df["temperature_anomaly"] = (eq_df["engine_temperature"] - mean_temp).round(1)

    # Utilization change
    eq_df["utilization_change"] = eq_df.groupby("equipment_id")["utilization"].diff().fillna(0).round(1)

    # Equipment Health Score (0 - 100)
    health_score = 100.0 - (eq_df["vibration_zscore"].clip(0, 5) * 8.5) - (eq_df["temperature_anomaly"].clip(0, 40) * 0.45) - (eq_df["operating_hours"] / 80.0)
    eq_df["equipment_health_score"] = health_score.clip(20.0, 99.0).round(1)

    eq_out = "data/processed/equipment_features.csv"
    eq_df.to_csv(eq_out, index=False)
    print(f"  [OK] Saved {len(eq_df)} records to {eq_out}")

    # -------------------------------------------------------------
    # 3. Weather & Hydrology Features
    # -------------------------------------------------------------
    print("\n[STEP 3/6] Processing Weather & Hydrology Features...")
    rain_df = pd.read_csv("data/raw/rainfall_data.csv")
    rain_df["date"] = pd.to_datetime(rain_df["date"])
    rain_df = rain_df.sort_values(by=["mine_id", "date"]).reset_index(drop=True)

    # Monsoon intensity index
    doy = rain_df["date"].dt.dayofyear
    rain_df["monsoon_intensity"] = np.where((doy >= 160) & (doy <= 260), np.sin((doy - 160) / 100.0 * np.pi), 0.0).round(3)
    rain_df["cumulative_monsoon_rain"] = rain_df.groupby("mine_id")["rainfall_mm"].cumsum().round(1)

    rain_out = "data/processed/weather_features.csv"
    rain_df.to_csv(rain_out, index=False)
    print(f"  [OK] Saved {len(rain_df)} records to {rain_out}")

    # -------------------------------------------------------------
    # 4. Satellite Remote Sensing Features
    # -------------------------------------------------------------
    print("\n[STEP 4/6] Processing Satellite Features...")
    sat_df = pd.read_csv("data/raw/satellite_features.csv")
    sat_df["date"] = pd.to_datetime(sat_df["date"])
    sat_df = sat_df.sort_values(by=["mine_id", "date"]).reset_index(drop=True)

    sat_df["ndvi_change"] = sat_df.groupby("mine_id")["ndvi"].diff().fillna(0).round(3)
    sat_df["ndwi_change"] = sat_df.groupby("mine_id")["ndwi"].diff().fillna(0).round(3)
    sat_df["vegetation_loss"] = sat_df["ndvi_change"].apply(lambda v: max(0.0, -v)).round(3)
    sat_df["water_expansion"] = sat_df["ndwi_change"].apply(lambda w: max(0.0, w)).round(3)

    sat_out = "data/processed/satellite_features.csv"
    sat_df.to_csv(sat_out, index=False)
    print(f"  [OK] Saved {len(sat_df)} records to {sat_out}")

    # -------------------------------------------------------------
    # 5. Geology & Exploration Features
    # -------------------------------------------------------------
    print("\n[STEP 5/6] Processing Geology & Exploration Features...")
    exp_df = pd.read_csv("data/raw/exploration_samples.csv")

    def classify_depth_zone(d):
        if d < 50: return "Zone-0_Overburden"
        elif d < 110: return "Zone-1_Schist"
        elif d <= 220: return "Zone-2_GonditeReef"
        elif d <= 290: return "Zone-3_Breccia"
        else: return "Zone-4_Basement"

    exp_df["depth_zone"] = exp_df["depth_m"].apply(classify_depth_zone)
    mean_grade = exp_df.groupby("mine_id")["mn_grade"].transform("mean")
    exp_df["grade_anomaly"] = (exp_df["mn_grade"] - mean_grade).round(1)
    exp_df["lineament_proximity_score"] = (1.0 - (exp_df["lineament_distance"] / 2000.0)).clip(0.05, 1.0).round(3)

    exp_out = "data/processed/exploration_features.csv"
    exp_df.to_csv(exp_out, index=False)
    print(f"  [OK] Saved {len(exp_df)} records to {exp_out}")

    # -------------------------------------------------------------
    # 6. Chronological Train / Validation / Test Splits (No Data Leakage)
    # -------------------------------------------------------------
    print("\n[STEP 6/6] Generating Chronological Train/Val/Test Splits...")

    # Time series datasets (Production & Weather) split temporally: 70% Train, 15% Val, 15% Test
    for name, df, date_col in [
        ("production", prod_df, "date"),
        ("weather", rain_df, "date"),
        ("equipment", eq_df, "timestamp"),
        ("satellite", sat_df, "date")
    ]:
        sorted_df = df.sort_values(by=date_col).reset_index(drop=True)
        n = len(sorted_df)
        n_train = int(n * 0.70)
        n_val = int(n * 0.85)

        train_df = sorted_df.iloc[:n_train]
        val_df = sorted_df.iloc[n_train:n_val]
        test_df = sorted_df.iloc[n_val:]

        train_df.to_csv(f"data/processed/train/{name}_train.csv", index=False)
        val_df.to_csv(f"data/processed/validation/{name}_val.csv", index=False)
        test_df.to_csv(f"data/processed/test/{name}_test.csv", index=False)
        print(f"  * {name:<12}: Train ({len(train_df)}) | Val ({len(val_df)}) | Test ({len(test_df)})")

    # Spatial / Exploration datasets split with stratified prospectivity
    from sklearn.model_selection import train_test_split
    exp_train, exp_temp = train_test_split(exp_df, test_size=0.30, random_state=42, stratify=exp_df["prospectivity_label"])
    exp_val, exp_test = train_test_split(exp_temp, test_size=0.50, random_state=42, stratify=exp_temp["prospectivity_label"])

    exp_train.to_csv("data/processed/train/exploration_train.csv", index=False)
    exp_val.to_csv("data/processed/validation/exploration_val.csv", index=False)
    exp_test.to_csv("data/processed/test/exploration_test.csv", index=False)
    print(f"  * exploration : Train ({len(exp_train)}) | Val ({len(exp_val)}) | Test ({len(exp_test)})")

    print("\n" + "=" * 65)
    print("[SUCCESS] DATA PROCESSING & FEATURE ENGINEERING COMPLETED!")
    print("=" * 65)

if __name__ == "__main__":
    process_and_engineer_features()
