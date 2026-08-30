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

def generate_geology_observations(output_path="data/raw/geology_observations.csv", samples_per_mine=120, seed=42):
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    np.random.seed(seed)

    mines = [
        ("balaghat", 21.8045, 80.1852, 320, 175, 47.4),
        ("dongri-buzurg", 21.5432, 79.7214, 380, 65, 49.5),
        ("gumgaon", 21.3850, 79.0120, 290, 130, 41.8),
        ("tirodi", 21.6880, 79.7060, 340, 95, 39.4),
        ("ukwa", 21.9670, 80.4670, 360, 115, 44.8)
    ]

    records = []

    for mine_id, base_lat, base_lon, base_elev, peak_depth, max_mn in mines:
        for s in range(samples_per_mine):
            depth_m = int(np.random.uniform(15, 350))
            delta_depth = abs(depth_m - peak_depth)
            gaussian = np.exp(-((delta_depth / 50.0) ** 2))

            # Coordinates with local grid offsets
            x_offset = np.random.uniform(-0.015, 0.015)
            y_offset = np.random.uniform(-0.015, 0.015)
            lat = round(base_lat + y_offset, 5)
            lon = round(base_lon + x_offset, 5)
            elev = round(base_elev - depth_m + np.random.normal(0, 2), 1)

            # Lithology classification by depth
            if depth_m < 45:
                lithology = "Surface Lateritic Overburden"
                mn_base = 22.0
                fe_grade = round(np.random.uniform(6.5, 9.5), 1)
                density = round(np.random.uniform(2.4, 2.8), 2)
                confidence = round(np.random.uniform(0.65, 0.80), 2)
            elif 45 <= depth_m < 110:
                lithology = "Mansar Quartz-Mica Schist"
                mn_base = 31.0
                fe_grade = round(np.random.uniform(5.5, 7.5), 1)
                density = round(np.random.uniform(2.8, 3.2), 2)
                confidence = round(np.random.uniform(0.75, 0.88), 2)
            elif 110 <= depth_m <= 220:
                lithology = "Gondite Manganese Reef Horizon"
                mn_base = max_mn
                fe_grade = round(np.random.uniform(4.5, 6.2), 1)
                density = round(np.random.uniform(3.4, 4.1), 2)
                confidence = round(np.random.uniform(0.88, 0.98), 2)
            elif 220 < depth_m <= 290:
                lithology = "Hydrothermal Manganiferous Breccia"
                mn_base = 35.0
                fe_grade = round(np.random.uniform(5.8, 8.0), 1)
                density = round(np.random.uniform(3.0, 3.5), 2)
                confidence = round(np.random.uniform(0.70, 0.85), 2)
            else:
                lithology = "Tirodi Crystalline Gneiss Basement"
                mn_base = 24.0
                fe_grade = round(np.random.uniform(7.0, 10.5), 1)
                density = round(np.random.uniform(2.6, 3.0), 2)
                confidence = round(np.random.uniform(0.60, 0.75), 2)

            mn_grade = round(np.clip(mn_base * (0.8 + 0.25 * gaussian) + np.random.normal(0, 1.2), 16.0, 52.0), 1)

            records.append({
                "mine_id": mine_id,
                "sample_id": f"GEO-{mine_id[:3].upper()}-{s+1:04d}",
                "x": lon,
                "y": lat,
                "elevation": elev,
                "depth_m": depth_m,
                "lithology": lithology,
                "mn_grade": mn_grade,
                "fe_grade": fe_grade,
                "density": density,
                "geological_confidence": confidence
            })

    df = pd.DataFrame(records)
    df.to_csv(output_path, index=False)
    print(f"[OK] Geology observations generated: {len(df)} records saved to {output_path}")
    return df

if __name__ == "__main__":
    generate_geology_observations()
