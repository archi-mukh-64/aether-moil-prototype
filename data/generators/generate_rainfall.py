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

def generate_rainfall_data(output_path="data/raw/rainfall_data.csv", days=500, seed=42):
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    np.random.seed(seed)

    mines = [
        ("balaghat", 18.0, 1.35),
        ("dongri-buzurg", 14.0, 0.90),
        ("gumgaon", 15.0, 1.15),
        ("tirodi", 12.0, 0.75),
        ("ukwa", 13.0, 0.65)
    ]

    records = []
    start_date = datetime(2025, 1, 1)

    for mine_id, base_rain, rain_sens in mines:
        rain_history = []

        for d in range(days):
            current_date = start_date + timedelta(days=d)
            day_of_year = current_date.timetuple().tm_yday

            is_monsoon = 160 <= day_of_year <= 260
            monsoon_intensity = np.exp(-((day_of_year - 210) ** 2) / (2 * (28 ** 2))) if is_monsoon else 0.0

            if is_monsoon:
                daily_rain = np.round(np.random.gamma(shape=2.2, scale=12.0) * monsoon_intensity * rain_sens, 1)
            else:
                daily_rain = np.round(np.random.exponential(scale=0.8) if np.random.rand() > 0.85 else 0.0, 1)

            rain_history.append(daily_rain)

            # Rolling 7d
            rain_7d = np.round(sum(rain_history[max(0, d - 6):d + 1]), 1)
            baseline_expected = base_rain * (monsoon_intensity * 3.5 + 0.2)
            rainfall_anomaly = np.round((daily_rain - baseline_expected) / (baseline_expected + 1e-3), 2)

            # Water Risk Index & Soil Saturation
            soil_saturation = np.round(np.clip((rain_7d / 180.0) * rain_sens, 0.05, 1.0), 3)
            water_risk_index = np.round(np.clip(soil_saturation * 0.6 + (daily_rain / 100.0) * 0.4, 0.02, 0.99), 3)

            records.append({
                "date": current_date.strftime("%Y-%m-%d"),
                "mine_id": mine_id,
                "rainfall_mm": daily_rain,
                "rainfall_7d_mm": rain_7d,
                "rainfall_anomaly": rainfall_anomaly,
                "water_risk_index": water_risk_index,
                "soil_saturation_index": soil_saturation
            })

    df = pd.DataFrame(records)
    df.to_csv(output_path, index=False)
    print(f"[OK] Rainfall data generated: {len(df)} records saved to {output_path}")
    return df

if __name__ == "__main__":
    generate_rainfall_data()
