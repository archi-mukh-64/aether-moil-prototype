import os
import sys
import pandas as pd

# Fix Windows encoding
if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
    except Exception:
        pass

def generate_mine_metadata(output_path="data/raw/mine_metadata.csv"):
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    
    records = [
        {
            "mine_id": "balaghat",
            "mine_name": "Balaghat Deep Shaft",
            "state": "Madhya Pradesh",
            "latitude": 21.8045,
            "longitude": 80.1852,
            "mine_type": "Underground Deep Shaft",
            "baseline_daily_target": 6200,
            "average_mn_grade": 44.2,
            "crusher_capacity": 320,
            "fleet_count": 32,
            "average_fleet_availability": 91.5,
            "rainfall_sensitivity": 1.35,
            "equipment_sensitivity": 1.25,
            "geological_complexity": 0.85,
            "data_quality_score": 0.96
        },
        {
            "mine_id": "dongri-buzurg",
            "mine_name": "Dongri Buzurg Opencast",
            "state": "Maharashtra",
            "latitude": 21.5432,
            "longitude": 79.7214,
            "mine_type": "Opencast Bench-Cut",
            "baseline_daily_target": 4800,
            "average_mn_grade": 48.5,
            "crusher_capacity": 280,
            "fleet_count": 45,
            "average_fleet_availability": 95.0,
            "rainfall_sensitivity": 0.90,
            "equipment_sensitivity": 0.85,
            "geological_complexity": 0.55,
            "data_quality_score": 0.98
        },
        {
            "mine_id": "gumgaon",
            "mine_name": "Gumgaon Incline Mine",
            "state": "Maharashtra",
            "latitude": 21.3850,
            "longitude": 79.0120,
            "mine_type": "Underground Incline",
            "baseline_daily_target": 2800,
            "average_mn_grade": 38.6,
            "crusher_capacity": 180,
            "fleet_count": 18,
            "average_fleet_availability": 89.0,
            "rainfall_sensitivity": 1.15,
            "equipment_sensitivity": 1.10,
            "geological_complexity": 0.90,
            "data_quality_score": 0.92
        },
        {
            "mine_id": "tirodi",
            "mine_name": "Tirodi Manganese Lease",
            "state": "Madhya Pradesh",
            "latitude": 21.6880,
            "longitude": 79.7060,
            "mine_type": "Opencast & Semi-Mechanized",
            "baseline_daily_target": 3200,
            "average_mn_grade": 36.2,
            "crusher_capacity": 220,
            "fleet_count": 24,
            "average_fleet_availability": 88.0,
            "rainfall_sensitivity": 0.75,
            "equipment_sensitivity": 1.30,
            "geological_complexity": 0.65,
            "data_quality_score": 0.94
        },
        {
            "mine_id": "ukwa",
            "mine_name": "Ukwa Low-Phosphorus",
            "state": "Madhya Pradesh",
            "latitude": 21.9670,
            "longitude": 80.4670,
            "mine_type": "Underground Adit Mining",
            "baseline_daily_target": 2200,
            "average_mn_grade": 42.0,
            "crusher_capacity": 160,
            "fleet_count": 20,
            "average_fleet_availability": 94.0,
            "rainfall_sensitivity": 0.65,
            "equipment_sensitivity": 0.80,
            "geological_complexity": 0.60,
            "data_quality_score": 0.95
        }
    ]
    
    df = pd.DataFrame(records)
    df.to_csv(output_path, index=False)
    print(f"[OK] Mine metadata generated: {len(df)} records saved to {output_path}")
    return df

if __name__ == "__main__":
    generate_mine_metadata()
