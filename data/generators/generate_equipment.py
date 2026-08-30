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

def generate_equipment_logs(output_path="data/raw/equipment_logs.csv", records_per_mine=400, seed=42):
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    np.random.seed(seed)

    mines = ["balaghat", "dongri-buzurg", "gumgaon", "tirodi", "ukwa"]
    eq_types = [
        ("CR", "Primary Jaw Crusher", 1),
        ("DP", "Heavy Haul Truck (35T)", 4),
        ("EX", "Face Shovel Excavator", 2),
        ("DR", "Rotary Blast Drill", 1),
        ("DZ", "Tracked Bulldozer", 1),
        ("LD", "Wheel Loader", 1)
    ]

    records = []
    start_time = datetime(2025, 6, 1, 0, 0, 0)

    for mine_id in mines:
        # Generate fleet IDs
        fleet = []
        for prefix, name, count in eq_types:
            for c in range(1, count + 1):
                fleet.append({
                    "id": f"{prefix}-{mine_id[:3].upper()}-{c:02d}",
                    "type": name,
                    "base_age": np.random.randint(150, 4200)
                })

        for i in range(records_per_mine):
            curr_time = start_time + timedelta(hours=i * 2)
            unit = fleet[i % len(fleet)]

            # Degradation physics
            age = unit["base_age"] + i * 2
            age_factor = age / 5000.0

            # Baseline vibrations by machine type
            is_crusher = "Crusher" in unit["type"]
            is_truck = "Truck" in unit["type"]

            base_vib = 2.2 if is_crusher else 1.6 if is_truck else 1.2
            vib_noise = np.random.exponential(scale=0.4)
            vibration_rms = np.round(base_vib + (age_factor * 1.8) + vib_noise, 2)

            # Temperature
            base_temp = 72.0 if is_crusher else 80.0 if is_truck else 68.0
            temp_noise = np.random.normal(0, 3.5)
            engine_temp = np.round(base_temp + (vibration_rms * 4.2) + temp_noise, 1)

            # Hydraulic Pressure (Bar)
            hyd_pressure = np.round(180.0 - (age_factor * 25.0) + np.random.normal(0, 5.0), 1)

            # Fuel Rate (L/h)
            fuel_rate = np.round(35.0 + (age_factor * 12.0) + np.random.uniform(0, 6.0), 1) if not is_crusher else 0.0

            # Availability & Utilization
            utilization = np.round(np.clip(88.0 - (vibration_rms * 4.5) + np.random.normal(0, 3), 40.0, 98.0), 1)
            availability = np.round(np.clip(96.0 - (age_factor * 15.0) - (vibration_rms * 2.0), 50.0, 99.0), 1)

            # Failure logic
            is_critical_vib = vibration_rms > 4.5
            is_critical_temp = engine_temp > 95.0
            failure_event = 1 if (is_critical_vib and is_critical_temp and np.random.rand() > 0.4) else 0

            fault_code = "NONE"
            if failure_event:
                fault_code = "ERR_BEARING_SEIZURE" if is_crusher else "ERR_HYDRAULIC_BURST" if is_truck else "ERR_THERMAL_OVERLOAD"
            elif is_critical_vib:
                fault_code = "WARN_HARMONIC_VIB"
            elif is_critical_temp:
                fault_code = "WARN_THERMAL_DRIFT"

            records.append({
                "timestamp": curr_time.strftime("%Y-%m-%d %H:%M:%S"),
                "mine_id": mine_id,
                "equipment_id": unit["id"],
                "equipment_type": unit["type"],
                "operating_hours": age,
                "engine_temperature": engine_temp,
                "vibration_rms": vibration_rms,
                "hydraulic_pressure": hyd_pressure,
                "fuel_rate": fuel_rate,
                "utilization": utilization,
                "availability": availability,
                "maintenance_age": age % 500,
                "fault_code": fault_code,
                "failure_event": failure_event
            })

    df = pd.DataFrame(records)
    df.to_csv(output_path, index=False)
    print(f"[OK] Equipment logs generated: {len(df)} records saved to {output_path}")
    return df

if __name__ == "__main__":
    generate_equipment_logs()
