import subprocess
import sys
import os

# Fix Windows encoding
if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
    except Exception:
        pass

def main():
    print("=" * 60)
    print("MOIL MINING INTELLIGENCE // AUTOMATED ML PIPELINE")
    print("=" * 60)

    # 1. Generate Synthetic Datasets
    print("\n[STEP 1/3] Generating Synthetic Datasets...")
    import data.synthetic.generate_synthetic_data as gen
    gen.ensure_dirs()
    gen.generate_production_history()
    gen.generate_equipment_logs()
    gen.generate_reserve_data()

    # 2. Train Alert Model
    print("\n[STEP 2/3] Training Alert & Shortfall Prediction Model...")
    import model_alert.train_alert_model as alert_trainer
    alert_trainer.train()

    # 3. Train Reserve Model
    print("\n[STEP 3/3] Training Reserve Radar & Grade Estimation Model...")
    import model_reserve.train_reserve_model as reserve_trainer
    reserve_trainer.train()

    print("\n" + "=" * 60)
    print("[SUCCESS] ALL ML MODELS GENERATED & SERIALIZED SUCCESSFULLY!")
    print("=" * 60)

if __name__ == "__main__":
    main()
