# MOIL Data Dictionary & Schema Specification

> **Status**: SYNTHETIC DEMONSTRATION DATA (Calibrated to GSI & MOIL Public Operational Baselines)  
> **Target Assets**: Balaghat, Dongri Buzurg, Gumgaon, Tirodi, Ukwa

---

## 1. Production History (`data/raw/production_history.csv`)

| Column Name | Data Type | Unit | Valid Range | Description & Meaning | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `date` | `string (YYYY-MM-DD)` | Date | 2025-01-01 to 2026-05-15 | Operational shift production date | Synthetic |
| `mine_id` | `string` | ID | 5 MOIL mines | Unique mine lease identifier | Standard |
| `mine_name` | `string` | Name | Categorical | Human-readable mine title | Standard |
| `planned_tonnage` | `integer` | Tonnes/day | `1,000 - 10,000` | Target production quota for the shift | Synthetic Baseline |
| `actual_tonnage` | `integer` | Tonnes/day | `0 - 10,000` | Realized gross extraction output | Synthetic Simulated |
| `ore_grade_mn` | `float` | % Mn | `15.0 - 55.0` | Run-of-Mine manganese assay percentage | Synthetic Simulated |
| `recovery_rate` | `float` | % | `50.0 - 100.0` | Metallurgical recovery efficiency | Synthetic Simulated |
| `crusher_utilization`| `float` | % | `0.0 - 100.0` | Primary crushing plant operational load | Synthetic Simulated |
| `fleet_availability` | `float` | % | `0.0 - 100.0` | Active haulage truck fleet uptime | Synthetic Simulated |
| `operating_hours` | `float` | Hours | `0.0 - 24.0` | Active extraction production hours | Synthetic Simulated |
| `downtime_hours` | `float` | Hours | `0.0 - 24.0` | Unscheduled stoppage and maintenance | Synthetic Simulated |
| `rainfall_mm` | `float` | mm/day | `0.0 - 400.0` | Measured catchment precipitation | Synthetic Simulated |
| `shortfall_tonnes` | `integer` | Tonnes | `0 - 10,000` | Production deficit below planned quota | Derived |
| `shortfall_percentage`| `float` | % | `0.0 - 100.0` | Relative deficit percentage | Derived |
| `shortfall_event` | `integer (0/1)` | Binary | `0 or 1` | 1 if shortfall exceeds 10% threshold | Binary Target |

---

## 2. Equipment Telemetry (`data/raw/equipment_logs.csv`)

| Column Name | Data Type | Unit | Valid Range | Description & Meaning | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `timestamp` | `string` | ISO Timestamp| 2025-06-01+ | IoT telemetry transmission timestamp | Synthetic |
| `mine_id` | `string` | ID | 5 MOIL mines | Assigned mine location | Standard |
| `equipment_id` | `string` | ID | E.g. `CR-BAL-01` | Unique asset machine code | Standard |
| `equipment_type` | `string` | Type | 6 Machine Classes | Crusher, Haul Truck, Excavator, Drill, Dozer, Loader | Standard |
| `operating_hours` | `integer` | Hours | `0 - 100,000` | Cumulative lifetime engine operating hours | Synthetic |
| `engine_temperature`| `float` | °C | `30.0 - 130.0` | Operating motor / drive temperature | Synthetic IoT |
| `vibration_rms` | `float` | mm/s | `0.0 - 15.0` | FFT Root Mean Square vibration amplitude | Synthetic IoT |
| `hydraulic_pressure`| `float` | Bar | `50.0 - 250.0` | Main manifold hydraulic circuit pressure | Synthetic IoT |
| `fuel_rate` | `float` | L/h | `0.0 - 80.0` | Real-time fuel consumption rate | Synthetic IoT |
| `utilization` | `float` | % | `0.0 - 100.0` | Percentage of active shift loading time | Synthetic IoT |
| `availability` | `float` | % | `0.0 - 100.0` | Machine uptime readiness | Synthetic IoT |
| `maintenance_age` | `integer` | Hours | `0 - 500` | Hours elapsed since last preventive lube | Derived |
| `fault_code` | `string` | Enum | E.g. `ERR_BEARING` | Active onboard diagnostic fault code | Synthetic Diagnostic |
| `failure_event` | `integer (0/1)` | Binary | `0 or 1` | Unscheduled breakdown occurrence | Target Label |

---

## 3. Weather & Hydrology (`data/raw/rainfall_data.csv`)

| Column Name | Data Type | Unit | Valid Range | Description & Meaning | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `date` | `string` | Date | 2025-01-01+ | Meteorological observation date | Synthetic |
| `mine_id` | `string` | ID | 5 MOIL mines | Target mine lease | Standard |
| `rainfall_mm` | `float` | mm/day | `0.0 - 400.0` | 24-hour surface rain gauge reading | Synthetic Weather |
| `rainfall_7d_mm` | `float` | mm | `0.0 - 1,200.0` | Cumulative 7-day precipitation volume | Derived Feature |
| `rainfall_anomaly` | `float` | Ratio | `-1.0 to 10.0` | Deviation from seasonal baseline | Derived Feature |
| `water_risk_index` | `float` | Index | `0.0 - 1.0` | Sump flood probability score | Derived Feature |
| `soil_saturation_index`| `float`| Index | `0.0 - 1.0` | Ground moisture & haul road drag index | Derived Feature |

---

## 4. Geological Stratigraphy (`data/raw/geology_observations.csv`)

| Column Name | Data Type | Unit | Valid Range | Description & Meaning | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `mine_id` | `string` | ID | 5 MOIL mines | Mine lease identifier | Standard |
| `sample_id` | `string` | ID | E.g. `GEO-BAL-001`| Borehole core sample code | Standard |
| `x` (Longitude) | `float` | Degrees | `78.5 - 81.0` | WGS84 geographic coordinate | Synthetic GIS |
| `y` (Latitude) | `float` | Degrees | `21.0 - 22.5` | WGS84 geographic coordinate | Synthetic GIS |
| `elevation` | `float` | Meters (RL) | `-200 to +450` | Reduced Level elevation | Synthetic GIS |
| `depth_m` | `integer` | Meters | `0 - 500` | Depth from surface datum | Synthetic Drilling |
| `lithology` | `string` | Formation | 5 Geological Zones | Stratigraphic layer name | Synthetic Geology |
| `mn_grade` | `float` | % Mn | `0.0 - 60.0` | Manganese assay concentration | Synthetic Assay |
| `fe_grade` | `float` | % Fe | `0.0 - 30.0` | Iron impurity concentration | Synthetic Assay |
| `density` | `float` | g/cm³ | `1.8 - 5.0` | Ore and rock specific gravity | Synthetic Physical |
| `geological_confidence`| `float`| Ratio | `0.0 - 1.0` | Kriging / GSI confidence metric | Synthetic |

---

## 5. Remote Sensing Satellite Features (`data/raw/satellite_features.csv`)

| Column Name | Data Type | Unit | Valid Range | Description & Meaning | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `date` | `string` | Date | 2025-01-01+ | Satellite pass observation date | Sentinel-2 Schema |
| `mine_id` | `string` | ID | 5 MOIL mines | Mine lease identifier | Standard |
| `latitude` | `float` | Degrees | `21.0 - 22.5` | Central pit latitude | Standard |
| `longitude` | `float` | Degrees | `78.5 - 81.0` | Central pit longitude | Standard |
| `ndvi` | `float` | Index | `-1.0 to +1.0` | Normalized Difference Vegetation Index | Synthetic Remote Sensing |
| `ndwi` | `float` | Index | `-1.0 to +1.0` | Normalized Difference Water Index | Synthetic Remote Sensing |
| `ndmi` | `float` | Index | `-1.0 to +1.0` | Normalized Difference Moisture Index | Synthetic Remote Sensing |
| `evi` | `float` | Index | `-1.0 to +1.5` | Enhanced Vegetation Index | Synthetic Remote Sensing |
| `surface_change_score`| `float` | Index | `0.0 - 1.0` | Pixel-wise temporal spectral shift | Derived Feature |
| `vegetation_change` | `float` | $\Delta$ Index | `-1.0 to +1.0` | Vegetative canopy delta | Derived Feature |
| `water_change` | `float` | $\Delta$ Index | `-1.0 to +1.0` | Sump and pit ponding expansion | Derived Feature |
| `disturbed_area_score`| `float` | Index | `0.0 - 1.0` | Cumulative excavation footprint | Derived Feature |
| `terrain_slope` | `float` | Degrees | `0.0 - 45.0` | DEM topographical gradient | Synthetic Topo |
| `elevation` | `float` | Meters | `100 - 500` | Surface ground elevation | Synthetic Topo |
| `land_surface_change_confidence` | `float` | Ratio | `0.0 - 1.0` | Cloud-free optical confidence | Synthetic Quality |

---

## 6. Exploration Core Samples (`data/raw/exploration_samples.csv`)

| Column Name | Data Type | Unit | Valid Range | Description & Meaning | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `mine_id` | `string` | ID | 5 MOIL mines | Target exploration lease | Standard |
| `sample_id` | `string` | ID | E.g. `EXP-BAL-001`| Borehole core sample code | Standard |
| `latitude` | `float` | Degrees | `21.0 - 22.5` | Drillhole GPS latitude | Synthetic |
| `longitude` | `float` | Degrees | `78.5 - 81.0` | Drillhole GPS longitude | Synthetic |
| `depth_m` | `integer` | Meters | `0 - 500` | Core intersection depth | Synthetic |
| `lithology` | `string` | Formation | 5 Zones | Intersected formation | Synthetic |
| `mn_grade` | `float` | % Mn | `0.0 - 60.0` | XRF core assay result | Synthetic |
| `assay_confidence` | `float` | Ratio | `0.0 - 1.0` | Core recovery and QA rating | Synthetic |
| `lineament_distance`| `float` | Meters | `0 - 5,000` | Distance to regional Sausar shear fault | Synthetic GIS |
| `terrain_score` | `float` | Ratio | `0.0 - 1.0` | Access and drill-pad feasibility | Synthetic |
| `spectral_signal` | `float` | Index | `0.0 - 1.5` | SWIR Band 11/12 Mn oxide absorption | Synthetic |
| `prospectivity_label`| `string` | Class | UNFC 111/122/333 | Ground truth exploration target class | Target Label |

---

## 7. Central Mine Metadata (`data/raw/mine_metadata.csv`)

| Column Name | Data Type | Unit | Description |
| :--- | :--- | :--- | :--- |
| `mine_id` | `string` | ID | Unique identifier (`balaghat`, `dongri-buzurg`, `gumgaon`, `tirodi`, `ukwa`) |
| `mine_name` | `string` | Name | Official mine facility title |
| `state` | `string` | State | Indian State (Madhya Pradesh / Maharashtra) |
| `latitude` | `float` | Degrees | GPS Latitude |
| `longitude` | `float` | Degrees | GPS Longitude |
| `mine_type` | `string` | Type | Underground Deep Shaft / Opencast / Incline / Adit |
| `baseline_daily_target` | `integer` | Tonnes/day | Budgeted daily production quota (2,200 to 6,200 TPD) |
| `average_mn_grade` | `float` | % Mn | Benchmark ore grade (36.2% to 48.5% Mn) |
| `crusher_capacity` | `integer` | TPH | Primary crushing plant throughput |
| `fleet_count` | `integer` | Units | Total HEMM haul truck count (18 to 45 units) |
| `average_fleet_availability`| `float` | % | Benchmark mechanical fleet uptime |
| `rainfall_sensitivity` | `float` | Multiplier | Hydrological vulnerability (0.65x to 1.35x) |
| `equipment_sensitivity`| `float` | Multiplier | Machine stress sensitivity (0.80x to 1.30x) |
| `geological_complexity`| `float` | Score (0-1) | Folding and fault structural complexity |
| `data_quality_score` | `float` | Score (0-1) | Baseline IoT sensor network reliability |

---

## 8. Historical Risk Events (`data/raw/risk_events.csv`)

| Column Name | Data Type | Description |
| :--- | :--- | :--- |
| `timestamp` | `string` | Date and time of the incident |
| `mine_id` | `string` | Facility lease where event occurred |
| `event_type` | `enum` | `MONSOON`, `CRUSHER_FAILURE`, `EQUIPMENT_FAILURE`, `PRODUCTION_SHORTFALL`, `MULTI_RISK` |
| `severity` | `enum` | `LOW`, `MEDIUM`, `HIGH`, `CRITICAL` |
| `rainfall` | `float` | 24-hour rainfall at time of event |
| `equipment_health`| `float` | Fleet / Crusher health score |
| `production_impact`| `string` | Quantified tonnage deficit |
| `detected` | `integer (0/1)` | Whether AI Early Warning triggered before incident |
| `actual_outcome` | `string` | Realized field response and operational status |
