import os
import sys
import json
import csv
import random
import math
from datetime import datetime, timedelta

# Fix Windows encoding
if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
    except Exception:
        pass

def ensure_dirs():
    os.makedirs("data/raw", exist_ok=True)
    os.makedirs("data/processed", exist_ok=True)
    os.makedirs("data/synthetic", exist_ok=True)
    os.makedirs("model_alert", exist_ok=True)
    os.makedirs("model_reserve", exist_ok=True)

def generate_production_history():
    print("Generating data/raw/production_history.csv...")
    mines = [
        {"id": "balaghat", "name": "Balaghat Deep Shaft", "target": 6200, "base_grade": 44.2},
        {"id": "dongri-buzurg", "name": "Dongri Buzurg Opencast", "target": 4800, "base_grade": 48.5},
        {"id": "gumgaon", "name": "Gumgaon Incline Mine", "target": 2800, "base_grade": 38.6},
        {"id": "tirodi", "name": "Tirodi Manganese Lease", "target": 3200, "base_grade": 36.2},
        {"id": "ukwa", "name": "Ukwa Low-Phosphorus", "target": 2200, "base_grade": 42.0}
    ]

    start_date = datetime(2025, 1, 1)
    rows = []
    
    for day in range(500):
        current_date = start_date + timedelta(days=day)
        date_str = current_date.strftime("%Y-%m-%d")
        month = current_date.month
        is_monsoon = 6 <= month <= 9

        for mine in mines:
            base_target = mine["target"]
            # Rainfall factor
            if is_monsoon:
                rain_mm = round(max(0, random.gauss(35, 25)), 1)
            else:
                rain_mm = round(max(0, random.gauss(2, 4)), 1)

            # Inflow rate (m3/h)
            sump_inflow = round(10.0 + (rain_mm * 0.35) + random.uniform(-1.5, 2.0), 2)
            
            # Equipment & Crusher metrics
            crusher_vib = round(1.8 + random.uniform(0.1, 0.6) + (0.8 if random.random() < 0.05 else 0), 2)
            fleet_avail = round(max(50.0, min(100.0, 92.0 - (rain_mm * 0.25) - random.uniform(0, 8))), 1)
            
            # Grade % Mn
            grade_mn = round(mine["base_grade"] + random.gauss(0, 1.2), 2)

            # Shortfall calculation
            stress_score = (rain_mm * 0.4) + (sump_inflow * 0.3) + ((100 - fleet_avail) * 0.5) + ((crusher_vib - 2.0) * 15)
            shortfall_prob = min(0.98, max(0.02, 1 / (1 + math.exp(-(stress_score - 28) / 8))))
            
            is_shortfall = 1 if shortfall_prob > 0.65 else 0
            loss_tonnes = round(base_target * (0.15 + (shortfall_prob * 0.25))) if is_shortfall else 0
            actual_tonnes = base_target - loss_tonnes + round(random.uniform(-100, 150))

            rows.append({
                "date": date_str,
                "mine_id": mine["id"],
                "mine_name": mine["name"],
                "target_tonnes": base_target,
                "actual_tonnes": max(0, actual_tonnes),
                "rainfall_mm": rain_mm,
                "sump_inflow_m3h": sump_inflow,
                "crusher_vibration_mms": crusher_vib,
                "fleet_availability_pct": fleet_avail,
                "grade_mn_pct": grade_mn,
                "shortfall_probability": round(shortfall_prob, 4),
                "shortfall_event": is_shortfall
            })

    with open("data/raw/production_history.csv", "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=rows[0].keys())
        writer.writeheader()
        writer.writerows(rows)
    print(f"  [OK] Saved {len(rows)} records to data/raw/production_history.csv")

def generate_equipment_logs():
    print("Generating data/raw/equipment_logs.csv...")
    equipment = [
        {"id": "CR-01", "type": "Primary Jaw Crusher", "mine": "dongri-buzurg"},
        {"id": "CR-02", "type": "Secondary Cone Crusher", "mine": "balaghat"},
        {"id": "PUMP-AP-04", "type": "Auxiliary Submersible Pump", "mine": "balaghat"},
        {"id": "EX-04", "type": "Hydraulic Face Shovel", "mine": "tirodi"},
        {"id": "HOIST-01", "type": "Holmes Shaft Skip Winder", "mine": "balaghat"}
    ]

    rows = []
    for day in range(300):
        for eq in equipment:
            vib = round(random.gauss(2.2, 0.6), 2)
            temp = round(random.gauss(62.0, 8.0), 1)
            pressure = round(random.gauss(3.5, 0.4), 2)
            load = round(random.gauss(72.0, 9.0), 1)
            
            # Anomaly condition
            has_anomaly = 1 if (vib > 3.8 or temp > 85.0 or pressure < 2.2) else 0

            rows.append({
                "log_id": f"EQ-LOG-{10000 + len(rows)}",
                "equipment_id": eq["id"],
                "equipment_type": eq["type"],
                "mine_id": eq["mine"],
                "vibration_mms": max(0.5, vib),
                "temperature_c": max(30.0, temp),
                "lube_pressure_bar": max(1.0, pressure),
                "motor_load_pct": max(20.0, min(100.0, load)),
                "maintenance_flag": has_anomaly
            })

    with open("data/raw/equipment_logs.csv", "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=rows[0].keys())
        writer.writeheader()
        writer.writerows(rows)
    print(f"  [OK] Saved {len(rows)} records to data/raw/equipment_logs.csv")

def generate_reserve_data():
    print("Generating data/raw/satellite_ndvi.csv and data/raw/geology_map.geojson...")
    # Satellite SWIR spectral data
    rows = []
    for i in range(400):
        swir_band11 = round(random.uniform(0.20, 0.88), 3)
        swir_band12 = round(random.uniform(0.18, 0.85), 3)
        magnetic_nt = round(random.gauss(65.0, 35.0), 1)
        depth_m = round(random.uniform(40.0, 320.0), 1)
        
        # Prospectivity grade % Mn
        grade_est = round(32.0 + (swir_band11 * 14.5) + (magnetic_nt * 0.04) - (depth_m * 0.015) + random.gauss(0, 1.2), 2)
        reserve_tonnes = round(max(50000, (grade_est * 45000) + random.uniform(10000, 200000)))

        rows.append({
            "sample_id": f"SWIR-LOC-{1000 + i}",
            "lat": round(21.80 + (random.uniform(-0.15, 0.15)), 6),
            "lon": round(80.18 + (random.uniform(-0.15, 0.15)), 6),
            "swir_band11": swir_band11,
            "swir_band12": swir_band12,
            "magnetic_susceptibility_nt": magnetic_nt,
            "vein_depth_m": depth_m,
            "estimated_grade_mn": min(52.0, max(28.0, grade_est)),
            "indicated_tonnes": reserve_tonnes
        })

    with open("data/raw/satellite_ndvi.csv", "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=rows[0].keys())
        writer.writeheader()
        writer.writerows(rows)
    print(f"  [OK] Saved {len(rows)} records to data/raw/satellite_ndvi.csv")

    # GeoJSON map
    geojson = {
        "type": "FeatureCollection",
        "features": [
            {
                "type": "Feature",
                "properties": {
                    "mine_name": "Balaghat Deep Shaft Lease",
                    "code": "ML-BH-01",
                    "proved_reserves_mt": 14.8,
                    "avg_grade": "44.2% Mn",
                    "status": "Active Underground"
                },
                "geometry": {
                    "type": "Polygon",
                    "coordinates": [[
                        [80.1850, 21.8050],
                        [80.1980, 21.8080],
                        [80.2050, 21.8150],
                        [80.1920, 21.8210],
                        [80.1850, 21.8050]
                    ]]
                }
            },
            {
                "type": "Feature",
                "properties": {
                    "mine_name": "Dongri Buzurg Opencast Lease",
                    "code": "ML-DB-02",
                    "proved_reserves_mt": 11.2,
                    "avg_grade": "48.5% MnO₂",
                    "status": "Active Opencast"
                },
                "geometry": {
                    "type": "Polygon",
                    "coordinates": [[
                        [79.6750, 21.5450],
                        [79.6920, 21.5510],
                        [79.6980, 21.5620],
                        [79.6810, 21.5580],
                        [79.6750, 21.5450]
                    ]]
                }
            }
        ]
    }

    with open("data/raw/geology_map.geojson", "w", encoding="utf-8") as f:
        json.dump(geojson, f, indent=2)
    print("  [OK] Saved data/raw/geology_map.geojson")

if __name__ == "__main__":
    ensure_dirs()
    generate_production_history()
    generate_equipment_logs()
    generate_reserve_data()
    print("\n[OK] All synthetic datasets successfully generated!")
