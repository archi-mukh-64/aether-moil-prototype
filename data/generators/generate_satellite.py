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

def generate_satellite_features(output_path="data/raw/satellite_features.csv", timesteps=60, seed=42):
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    np.random.seed(seed)

    mines = [
        ("balaghat", 21.8045, 80.1852, 320, 14.5),
        ("dongri-buzurg", 21.5432, 79.7214, 380, 22.0),
        ("gumgaon", 21.3850, 79.0120, 290, 8.5),
        ("tirodi", 21.6880, 79.7060, 340, 18.0),
        ("ukwa", 21.9670, 80.4670, 360, 11.0)
    ]

    records = []
    start_date = datetime(2025, 1, 1)

    for mine_id, lat, lon, elev, slope in mines:
        for t in range(timesteps):
            curr_date = start_date + timedelta(days=t * 6)
            doy = curr_date.timetuple().tm_yday

            # Monsoon seasonality
            is_monsoon = 160 <= doy <= 260
            monsoon_wetness = np.sin((doy - 160) / 100 * np.pi) if is_monsoon else 0.0

            # Mining excavation footprint expanding over time
            mining_expansion = t / float(timesteps)

            # NDVI (Vegetation index: drops with mining and dry season, rises with monsoon surrounding buffer)
            ndvi = round(np.clip(0.55 - (mining_expansion * 0.18) + (monsoon_wetness * 0.14) + np.random.normal(0, 0.03), 0.12, 0.85), 3)

            # NDWI (Water index: rises strongly during monsoon)
            ndwi = round(np.clip(-0.25 + (monsoon_wetness * 0.45) + np.random.normal(0, 0.04), -0.45, 0.55), 3)

            # NDMI (Moisture index)
            ndmi = round(np.clip(ndvi * 0.7 + ndwi * 0.5, -0.3, 0.6), 3)

            # EVI (Enhanced Vegetation Index)
            evi = round(np.clip(ndvi * 0.85 + np.random.normal(0, 0.02), 0.10, 0.75), 3)

            # Change scores
            vegetation_change = round(np.random.normal(-0.04 * mining_expansion, 0.02), 3)
            water_change = round(ndwi - (-0.25), 3)
            surface_change_score = round(np.clip(abs(vegetation_change) * 4.0 + abs(water_change) * 2.5, 0.05, 0.98), 3)
            disturbed_area_score = round(np.clip(0.20 + (mining_expansion * 0.45) + (surface_change_score * 0.25), 0.15, 0.95), 3)

            records.append({
                "date": curr_date.strftime("%Y-%m-%d"),
                "mine_id": mine_id,
                "latitude": lat,
                "longitude": lon,
                "ndvi": ndvi,
                "ndwi": ndwi,
                "ndmi": ndmi,
                "evi": evi,
                "surface_change_score": surface_change_score,
                "vegetation_change": vegetation_change,
                "water_change": water_change,
                "disturbed_area_score": disturbed_area_score,
                "terrain_slope": slope,
                "elevation": elev,
                "land_surface_change_confidence": round(np.random.uniform(0.88, 0.98), 3)
            })

    df = pd.DataFrame(records)
    df.to_csv(output_path, index=False)
    print(f"[OK] Satellite features generated: {len(df)} records saved to {output_path}")
    return df

if __name__ == "__main__":
    generate_satellite_features()
