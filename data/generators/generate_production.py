import os
import sys
import numpy as np
import pandas as pd
from datetime import datetime, timedelta

# Fix Windows encoding
if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
    except Exception:
        pass

def generate_production_history(output_path="data/raw/production_history.csv", days=500, seed=42):
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    np.random.seed(seed)

    from generate_mine_metadata import generate_mine_metadata
    meta_df = generate_mine_metadata()

    records = []
    start_date = datetime(2025, 1, 1)

    for _, mine in meta_df.iterrows():
        mine_id = mine["mine_id"]
        mine_name = mine["mine_name"]
        target = mine["baseline_daily_target"]
        base_grade = mine["average_mn_grade"]
        base_avail = mine["average_fleet_availability"]
        rain_sens = mine["rainfall_sensitivity"]

        for d in range(days):
            current_date = start_date + timedelta(days=d)
            day_of_year = current_date.timetuple().tm_yday

            # Seasonal monsoon peak centered between day 160 and 260 (June - September)
            is_monsoon = 160 <= day_of_year <= 260
            monsoon_intensity = np.exp(-((day_of_year - 210) ** 2) / (2 * (30 ** 2))) if is_monsoon else 0.0

            # Deterministic seeded noise
            rain_rand = np.random.gamma(shape=2.0, scale=8.0) if is_monsoon else np.random.exponential(scale=1.5)
            rainfall_mm = np.round((rain_rand * monsoon_intensity * rain_sens * 4.5) + (0.5 if is_monsoon else 0.0), 1)

            # Equipment and Fleet Availability
            fleet_noise = np.random.normal(0, 2.5)
            rain_fleet_penalty = np.clip(rainfall_mm * 0.28, 0, 35)
            fleet_availability = np.round(np.clip(base_avail + fleet_noise - rain_fleet_penalty, 40.0, 99.0), 1)

            # Crusher Utilization & Downtime
            is_crusher_anomaly = (d % 47 == 0 and d > 0)
            downtime_hours = np.round(np.random.uniform(0.5, 2.0) + (6.5 if is_crusher_anomaly else 0.0) + (rainfall_mm * 0.06), 1)
            downtime_hours = np.clip(downtime_hours, 0.0, 16.0)
            operating_hours = np.round(24.0 - downtime_hours, 1)

            crusher_util = np.round(np.clip((operating_hours / 24.0) * 100 - np.random.uniform(0, 8), 30.0, 98.0), 1)

            # Ore Grade with occasional quartzite intrusion
            is_grade_dip = (d % 63 == 0 and d > 0)
            grade_noise = np.random.normal(0, 0.6) - (4.2 if is_grade_dip else 0.0)
            ore_grade_mn = np.round(np.clip(base_grade + grade_noise, 22.0, 52.0), 1)

            # Recovery Rate
            recovery_rate = np.round(np.clip(88.0 + (ore_grade_mn - base_grade) * 0.6 - np.random.uniform(0, 3), 72.0, 96.0), 1)

            # Actual Tonnage calculation
            capacity_factor = (operating_hours / 24.0) * (fleet_availability / 100.0) * (recovery_rate / 90.0)
            actual_tonnage = int(target * capacity_factor * np.random.uniform(0.96, 1.03))
            
            # Shortfall metrics
            shortfall_tonnes = max(0, target - actual_tonnage)
            shortfall_pct = np.round((shortfall_tonnes / target) * 100, 1)
            shortfall_event = 1 if shortfall_pct >= 10.0 else 0

            records.append({
                "date": current_date.strftime("%Y-%m-%d"),
                "mine_id": mine_id,
                "mine_name": mine_name,
                "planned_tonnage": target,
                "actual_tonnage": actual_tonnage,
                "ore_grade_mn": ore_grade_mn,
                "recovery_rate": recovery_rate,
                "crusher_utilization": crusher_util,
                "fleet_availability": fleet_availability,
                "operating_hours": operating_hours,
                "downtime_hours": downtime_hours,
                "rainfall_mm": rainfall_mm,
                "shortfall_tonnes": shortfall_tonnes,
                "shortfall_percentage": shortfall_pct,
                "shortfall_event": shortfall_event
            })

    df = pd.DataFrame(records)
    df.to_csv(output_path, index=False)
    print(f"[OK] Production history generated: {len(df)} records saved to {output_path}")
    return df

if __name__ == "__main__":
    generate_production_history()
