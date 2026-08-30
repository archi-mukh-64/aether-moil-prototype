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

def generate_risk_events(output_path="data/raw/risk_events.csv", total_events=250, seed=42):
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    np.random.seed(seed)

    mines = ["balaghat", "dongri-buzurg", "gumgaon", "tirodi", "ukwa"]
    event_types = ["MONSOON", "CRUSHER_FAILURE", "EQUIPMENT_FAILURE", "PRODUCTION_SHORTFALL", "MULTI_RISK"]
    severities = ["LOW", "MEDIUM", "HIGH", "CRITICAL"]

    records = []
    start_date = datetime(2025, 1, 15, 8, 30, 0)

    for i in range(total_events):
        curr_time = start_date + timedelta(hours=i * 38)
        mine_id = mines[i % len(mines)]
        event_type = event_types[i % len(event_types)]
        severity = severities[np.random.choice([0, 1, 2, 3], p=[0.25, 0.35, 0.25, 0.15])]

        sev_mult = 1.45 if severity == "CRITICAL" else 1.0 if severity == "HIGH" else 0.65 if severity == "MEDIUM" else 0.35

        # Feature physics
        if event_type == "MONSOON":
            rainfall = round(np.random.uniform(45, 115) * sev_mult, 1)
            equip_health = round(np.random.uniform(70, 88), 1)
            prod_impact = f"-{int(380 * sev_mult)} T Deficit"
            detected = 1 if rainfall > 50.0 else 0
            actual_outcome = "Auxiliary pumps engaged; sump protected" if detected else "Minor ponding in ditch"
        elif event_type == "CRUSHER_FAILURE":
            rainfall = round(np.random.uniform(0, 15), 1)
            equip_health = round(np.clip(75.0 - 28 * sev_mult, 35.0, 80.0), 1)
            prod_impact = f"-{int(280 * sev_mult)} T Deficit"
            detected = 1 if equip_health < 72.0 else 0
            actual_outcome = "Throughput throttled to 70%; bearing saved" if detected else "Nominal operation"
        elif event_type == "EQUIPMENT_FAILURE":
            rainfall = round(np.random.uniform(0, 20), 1)
            equip_health = round(np.clip(80.0 - 25 * sev_mult, 40.0, 85.0), 1)
            prod_impact = f"-{int(220 * sev_mult)} T Deficit"
            detected = 1 if equip_health < 70.0 else 0
            actual_outcome = "Dumpers diverted to short-haul staging" if detected else "Normal cycle"
        elif event_type == "PRODUCTION_SHORTFALL":
            rainfall = round(np.random.uniform(10, 45), 1)
            equip_health = round(np.random.uniform(75, 90), 1)
            prod_impact = f"-{int(320 * sev_mult)} T Deficit"
            detected = 1 if sev_mult > 0.5 else 0
            actual_outcome = "Stockpile blend ratio updated to 55:45" if detected else "Target met within margin"
        else: # MULTI_RISK
            rainfall = round(np.random.uniform(65, 120) * sev_mult, 1)
            equip_health = round(np.clip(68.0 - 22 * sev_mult, 30.0, 75.0), 1)
            prod_impact = f"-{int(580 * sev_mult)} T Deficit"
            detected = 1
            actual_outcome = "Coordinated multi-vector mitigation protocol activated"

        records.append({
            "timestamp": curr_time.strftime("%Y-%m-%d %H:%M:%S"),
            "mine_id": mine_id,
            "event_type": event_type,
            "severity": severity,
            "rainfall": rainfall,
            "equipment_health": equip_health,
            "production_impact": prod_impact,
            "detected": detected,
            "actual_outcome": actual_outcome
        })

    df = pd.DataFrame(records)
    df.to_csv(output_path, index=False)
    print(f"[OK] Risk events history generated: {len(df)} records saved to {output_path}")
    return df

if __name__ == "__main__":
    generate_risk_events()
