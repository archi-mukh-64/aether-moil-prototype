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

def validate_dataset(df, name, rules):
    print(f"\n[VALIDATING] {name} ({len(df)} rows, {len(df.columns)} cols)")
    issues = []

    # 1. Null / Missing Values
    null_counts = df.isnull().sum()
    if null_counts.sum() > 0:
        for col, count in null_counts.items():
            if count > 0:
                issues.append(f"  * Null values in column '{col}': {count}")
    else:
        print("  [PASSED] Zero missing values")

    # 2. Duplicate Records
    dup_count = df.duplicated().sum()
    if dup_count > 0:
        issues.append(f"  * Found {dup_count} duplicate rows")
    else:
        print("  [PASSED] Zero duplicate records")

    # 3. Mine IDs Coverage
    if "mine_id" in df.columns:
        expected_mines = {"balaghat", "dongri-buzurg", "gumgaon", "tirodi", "ukwa"}
        present_mines = set(df["mine_id"].unique())
        missing_mines = expected_mines - present_mines
        if missing_mines:
            issues.append(f"  * Missing expected mines: {missing_mines}")
        else:
            print(f"  [PASSED] All 5 MOIL mines present ({len(present_mines)} leases)")

    # 4. Custom Column Range Rules
    for col, (min_val, max_val) in rules.items():
        if col in df.columns:
            actual_min = df[col].min()
            actual_max = df[col].max()
            if actual_min < min_val or actual_max > max_val:
                issues.append(f"  * Range violation on '{col}': [{actual_min}, {actual_max}] exceeds allowed [{min_val}, {max_val}]")
            else:
                print(f"  [PASSED] Range check for '{col}': [{actual_min}, {actual_max}] in [{min_val}, {max_val}]")

    if issues:
        print(f"  [WARNING] {len(issues)} data quality issue(s) detected:")
        for iss in issues:
            print(iss)
        return False
    else:
        print(f"  [SUCCESS] {name} is 100% VALID.")
        return True

def run_all_validations():
    print("=" * 65)
    print("MOIL DATA VALIDATION ENGINE // INTEGRITY & INTEGRATION CHECK")
    print("=" * 65)

    all_valid = True

    # 1. Production History
    prod_path = "data/raw/production_history.csv"
    if os.path.exists(prod_path):
        df = pd.read_csv(prod_path)
        valid = validate_dataset(df, "Production History", {
            "planned_tonnage": (1000, 10000),
            "actual_tonnage": (0, 10000),
            "ore_grade_mn": (15.0, 55.0),
            "recovery_rate": (50.0, 100.0),
            "crusher_utilization": (0.0, 100.0),
            "fleet_availability": (0.0, 100.0),
            "operating_hours": (0.0, 24.0),
            "downtime_hours": (0.0, 24.0),
            "rainfall_mm": (0.0, 400.0),
            "shortfall_percentage": (0.0, 100.0)
        })
        all_valid = all_valid and valid

    # 2. Equipment Logs
    eq_path = "data/raw/equipment_logs.csv"
    if os.path.exists(eq_path):
        df = pd.read_csv(eq_path)
        valid = validate_dataset(df, "Equipment Telemetry Logs", {
            "operating_hours": (0, 100000),
            "engine_temperature": (30.0, 130.0),
            "vibration_rms": (0.0, 15.0),
            "hydraulic_pressure": (50.0, 250.0),
            "utilization": (0.0, 100.0),
            "availability": (0.0, 100.0)
        })
        all_valid = all_valid and valid

    # 3. Rainfall Data
    rain_path = "data/raw/rainfall_data.csv"
    if os.path.exists(rain_path):
        df = pd.read_csv(rain_path)
        valid = validate_dataset(df, "Rainfall & Hydrology Data", {
            "rainfall_mm": (0.0, 400.0),
            "rainfall_7d_mm": (0.0, 1200.0),
            "water_risk_index": (0.0, 1.0),
            "soil_saturation_index": (0.0, 1.0)
        })
        all_valid = all_valid and valid

    # 4. Geology Observations
    geo_path = "data/raw/geology_observations.csv"
    if os.path.exists(geo_path):
        df = pd.read_csv(geo_path)
        valid = validate_dataset(df, "Geological Stratigraphy Observations", {
            "depth_m": (0, 500),
            "mn_grade": (0.0, 60.0),
            "fe_grade": (0.0, 30.0),
            "density": (1.8, 5.0),
            "geological_confidence": (0.0, 1.0)
        })
        all_valid = all_valid and valid

    # 5. Satellite Features
    sat_path = "data/raw/satellite_features.csv"
    if os.path.exists(sat_path):
        df = pd.read_csv(sat_path)
        valid = validate_dataset(df, "Satellite Remote Sensing Features", {
            "ndvi": (-1.0, 1.0),
            "ndwi": (-1.0, 1.0),
            "ndmi": (-1.0, 1.0),
            "evi": (-1.0, 1.5),
            "surface_change_score": (0.0, 1.0),
            "disturbed_area_score": (0.0, 1.0)
        })
        all_valid = all_valid and valid

    # 6. Exploration Samples
    exp_path = "data/raw/exploration_samples.csv"
    if os.path.exists(exp_path):
        df = pd.read_csv(exp_path)
        valid = validate_dataset(df, "Exploration Core Samples", {
            "depth_m": (0, 500),
            "mn_grade": (0.0, 60.0),
            "assay_confidence": (0.0, 1.0),
            "spectral_signal": (0.0, 1.5)
        })
        all_valid = all_valid and valid

    print("\n" + "=" * 65)
    if all_valid:
        print("[SUCCESS] ALL DATASETS PASSED VALIDATION COMPREHENSIVELY!")
    else:
        print("[FAIL] ONE OR MORE DATASETS FAILED VALIDATION.")
    print("=" * 65)
    return all_valid

if __name__ == "__main__":
    run_all_validations()
