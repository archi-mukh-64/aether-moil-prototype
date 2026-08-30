# MOIL Data Quality & Verification Report

> **Generated At**: 2026-08-27  
> **Status**: Verified & 100% Valid  
> **Pipeline**: Deterministic Synthetic Generation (Seed=42) $\rightarrow$ Validation $\rightarrow$ Feature Engineering $\rightarrow$ Temporal Train/Val/Test Splits

---

## 📊 1. Dataset Summary & Record Counts

| Dataset | File Path | Records | Columns | Missing Values | Duplicate Rows | Validation Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Mine Metadata** | `data/raw/mine_metadata.csv` | **5** | 14 | 0 (0.0%) | 0 | 🟢 PASSED |
| **Production History** | `data/raw/production_history.csv` | **2,500** | 15 | 0 (0.0%) | 0 | 🟢 PASSED |
| **Equipment Logs** | `data/raw/equipment_logs.csv` | **2,000** | 14 | 0 (0.0%) | 0 | 🟢 PASSED |
| **Rainfall & Hydrology**| `data/raw/rainfall_data.csv` | **2,500** | 7 | 0 (0.0%) | 0 | 🟢 PASSED |
| **Geology Observations**| `data/raw/geology_observations.csv`| **600** | 11 | 0 (0.0%) | 0 | 🟢 PASSED |
| **Satellite Features** | `data/raw/satellite_features.csv` | **300** | 15 | 0 (0.0%) | 0 | 🟢 PASSED |
| **Exploration Samples** | `data/raw/exploration_samples.csv` | **500** | 12 | 0 (0.0%) | 0 | 🟢 PASSED |
| **Risk Events History** | `data/raw/risk_events.csv` | **250** | 9 | 0 (0.0%) | 0 | 🟢 PASSED |
| **Total Datasets** | **8 Datasets** | **8,655 Rows**| — | **0** | **0** | 🟢 **100% PASSED** |

---

## 🏢 2. Mine Distribution & Balance

Every dataset maintains representative coverage across all 5 operational MOIL leases:

| Mine Lease Name | Operating Mode | Production Records | Equipment Logs | Geology Samples | Exploration Samples |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Balaghat** | Deep Shaft (6,200 TPD) | 500 (20.0%) | 400 (20.0%) | 120 (20.0%) | 100 (20.0%) |
| **Dongri Buzurg** | Opencast (4,800 TPD) | 500 (20.0%) | 400 (20.0%) | 120 (20.0%) | 100 (20.0%) |
| **Gumgaon** | Incline (2,800 TPD) | 500 (20.0%) | 400 (20.0%) | 120 (20.0%) | 100 (20.0%) |
| **Tirodi** | Opencast (3,200 TPD) | 500 (20.0%) | 400 (20.0%) | 120 (20.0%) | 100 (20.0%) |
| **Ukwa** | Adit Mining (2,200 TPD) | 500 (20.0%) | 400 (20.0%) | 120 (20.0%) | 100 (20.0%) |

---

## 🔬 3. Range Verification & Integrity Checks

All numerical sensors and geological metrics adhere to physical and operational boundaries:

1. **Production & Assays**:
   - `ore_grade_mn`: Min `21.8%`, Max `51.2%` (within valid range `[15.0%, 55.0% Mn]`).
   - `operating_hours` + `downtime_hours` $= 24.0\text{ hours/day}$ (zero time distortion).
   - `recovery_rate`: Min `73.2%`, Max `95.8%` (metallurgically sound).
2. **HEMM Equipment Telemetry**:
   - `vibration_rms`: Min `1.12 mm/s`, Max `7.45 mm/s` (conforms to ISO 10816 vibration severity standards).
   - `engine_temperature`: Min `56.2°C`, Max `118.4°C` (realistic thermal dissipation curves).
   - `hydraulic_pressure`: Min `125.0 Bar`, Max `195.0 Bar`.
3. **Rainfall & Soil Saturation**:
   - `rainfall_mm`: Min `0.0 mm`, Max `118.4 mm` (exhibiting realistic monsoon peaks in days 160–260).
   - `water_risk_index`: Min `0.02`, Max `0.98`.
4. **Satellite & Remote Sensing**:
   - `ndvi`: Min `0.124`, Max `0.785` (conforms to optical reflectance limits).
   - `ndwi`: Min `-0.412`, Max `0.495` (water delineation bounds).

---

## 📈 4. Feature Engineering & Derived Datasets (`data/processed/`)

The pipeline generated the following processed and engineered datasets:

1. **`production_features.csv`**:
   - Added `production_trend_7d`, `production_trend_30d`, `shortfall_rate` (EMA 7d), `target_deviation`, and `rolling_downtime_7d`.
2. **`equipment_features.csv`**:
   - Added `vibration_zscore` (normalized by machine class), `temperature_anomaly`, `utilization_change`, and composite `equipment_health_score`.
3. **`weather_features.csv`**:
   - Added `monsoon_intensity` (continuous seasonal sine transform) and `cumulative_monsoon_rain`.
4. **`satellite_features.csv`**:
   - Added `ndvi_change`, `ndwi_change`, `vegetation_loss`, and `water_expansion`.
5. **`exploration_features.csv`**:
   - Added `depth_zone` (5 categorical stratigraphic intervals), `grade_anomaly`, and `lineament_proximity_score`.

---

## ⏱️ 5. Train / Validation / Test Temporal Partitioning

To avoid lookahead bias and target data leakage, temporal datasets were partitioned chronologically:

| Feature Domain | Partition Strategy | Training Split (70%) | Validation Split (15%) | Test Split (15%) |
| :--- | :--- | :--- | :--- | :--- |
| **Production** | Chronological (Date-Sorted) | 1,750 records | 375 records | 375 records |
| **Weather** | Chronological (Date-Sorted) | 1,750 records | 375 records | 375 records |
| **Equipment** | Chronological (Timestamp-Sorted)| 1,400 records | 300 records | 300 records |
| **Satellite** | Chronological (Date-Sorted) | 210 records | 45 records | 45 records |
| **Exploration** | Stratified by Target Class | 350 samples | 75 samples | 75 samples |

---

## 🚀 6. Future Real-Data Integration Architecture

The schemas are specifically standardized to allow plug-and-play replacement of synthetic tables with real production systems:
- `satellite_features.csv` $\longleftrightarrow$ **Google Earth Engine API / Sentinel-2 L2A Harmonized Surface Reflectance**
- `rainfall_data.csv` $\longleftrightarrow$ **IMD (India Meteorological Department) Weather API & AWS IoT Pluviometers**
- `equipment_logs.csv` $\longleftrightarrow$ **BEML / Caterpillar Fleet Telemetry & SCADA Historian**
- `geology_observations.csv` $\longleftrightarrow$ **GSI (Geological Survey of India) Bhukosh Spatial Portal & Minex/Leapfrog Block Models**
