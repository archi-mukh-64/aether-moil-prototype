import os
import sys

# Fix Windows encoding
if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
    except Exception:
        pass

# Ensure generators directory is on path
sys.path.insert(0, os.path.dirname(__file__))

from generate_mine_metadata import generate_mine_metadata
from generate_production import generate_production_history
from generate_equipment import generate_equipment_logs
from generate_rainfall import generate_rainfall_data
from generate_geology import generate_geology_observations
from generate_satellite import generate_satellite_features
from generate_exploration import generate_exploration_samples
from generate_risk_events import generate_risk_events

def generate_all():
    print("=" * 65)
    print("MOIL DATA ENGINE // DETERMINISTIC SYNTHETIC GENERATION")
    print("=" * 65)

    print("\n[1/8] Generating Mine Metadata...")
    generate_mine_metadata()

    print("\n[2/8] Generating Production History...")
    generate_production_history()

    print("\n[3/8] Generating Equipment Telemetry...")
    generate_equipment_logs()

    print("\n[4/8] Generating Rainfall & Hydrology Data...")
    generate_rainfall_data()

    print("\n[5/8] Generating Geological Stratigraphy Observations...")
    generate_geology_observations()

    print("\n[6/8] Generating Remote Sensing Satellite Features...")
    generate_satellite_features()

    print("\n[7/8] Generating Exploration & Diamond Core Samples...")
    generate_exploration_samples()

    print("\n[8/8] Generating Historical Risk Events Matrix...")
    generate_risk_events()

    print("\n" + "=" * 65)
    print("[SUCCESS] ALL RAW DATASETS GENERATED DETERMINISTICALLY!")
    print("=" * 65)

if __name__ == "__main__":
    generate_all()
