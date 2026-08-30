import os
import sys
import numpy as np
import pandas as pd

# Fix Windows encoding
if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
    except Exception:
        pass

def generate_exploration_samples(output_path="data/raw/exploration_samples.csv", samples_per_mine=100, seed=42):
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    np.random.seed(seed)

    mines = [
        ("balaghat", 21.8045, 80.1852, 175, 47.4),
        ("dongri-buzurg", 21.5432, 79.7214, 65, 49.5),
        ("gumgaon", 21.3850, 79.0120, 130, 41.8),
        ("tirodi", 21.6880, 79.7060, 95, 39.4),
        ("ukwa", 21.9670, 80.4670, 115, 44.8)
    ]

    records = []

    for mine_id, base_lat, base_lon, peak_depth, max_mn in mines:
        for i in range(samples_per_mine):
            lat_off = np.random.uniform(-0.025, 0.025)
            lon_off = np.random.uniform(-0.025, 0.025)
            depth_m = int(np.random.uniform(25, 340))

            # Structural proximity to Sausar shear lineament (meters)
            lineament_dist = round(abs(lat_off * 111000 + lon_off * 95000) % 1800, 1)
            lineament_score = np.clip(1.0 - (lineament_dist / 1800.0), 0.1, 1.0)

            # Geological depth profile factor
            delta_depth = abs(depth_m - peak_depth)
            depth_factor = np.exp(-((delta_depth / 55.0) ** 2))

            # Spectral Signal (SWIR Band 11/12 Mn oxide absorption index)
            spectral_signal = round(np.clip(0.31 + (depth_factor * 0.45) + (lineament_score * 0.20) + np.random.normal(0, 0.03), 0.20, 0.95), 3)

            # Terrain slope score
            terrain_score = round(np.random.uniform(0.65, 0.98), 2)

            # Assay Grade calculation
            mn_grade = round(np.clip(22.0 + (max_mn - 22.0) * (depth_factor * 0.7 + lineament_score * 0.3) + np.random.normal(0, 1.0), 16.0, 52.0), 1)
            assay_conf = round(np.clip(0.72 + depth_factor * 0.24 + np.random.uniform(0, 0.04), 0.65, 0.99), 2)

            # Composite Prospectivity Score (0 - 100%)
            prospectivity_score = (spectral_signal * 0.40 + (mn_grade / 50.0) * 0.35 + lineament_score * 0.25) * 100
            prospectivity_label = (
                "HIGH PROSPECT (UNFC-111 Proved)" if prospectivity_score >= 78.0
                else "MEDIUM PROSPECT (UNFC-122 Probable)" if prospectivity_score >= 52.0
                else "LOW PROSPECT (UNFC-333 Reconnaissance)"
            )

            records.append({
                "mine_id": mine_id,
                "sample_id": f"EXP-{mine_id[:3].upper()}-{i+1:04d}",
                "latitude": round(base_lat + lat_off, 5),
                "longitude": round(base_lon + lon_off, 5),
                "depth_m": depth_m,
                "lithology": "Mansar Gondite Horizon" if depth_factor > 0.6 else "Quartzite Schist" if depth_factor > 0.3 else "Basement Gneiss",
                "mn_grade": mn_grade,
                "assay_confidence": assay_conf,
                "lineament_distance": lineament_dist,
                "terrain_score": terrain_score,
                "spectral_signal": spectral_signal,
                "prospectivity_label": prospectivity_label
            })

    df = pd.DataFrame(records)
    df.to_csv(output_path, index=False)
    print(f"[OK] Exploration samples generated: {len(df)} records saved to {output_path}")
    return df

if __name__ == "__main__":
    generate_exploration_samples()
