# MOIL Mining Intelligence Platform

> **An Autonomous AI & Earth Observation Command Center for Intelligent Manganese Mining**  
> *Built for Smart India Hackathon (SIH) — Enterprise Mining & PSU Edition*

---

## 🌟 Executive Overview
The **MOIL Mining Intelligence Platform** is an industrial-grade intelligence suite designed for **MOIL Limited** (Manganese Ore India Limited, Ministry of Steel, Govt. of India). It fuses Earth Observation (Sentinel-2 multispectral remote sensing), sub-surface structural geology (Sausar Group manganese formations), IoT telemetry from Heavy Earth Moving Machinery (HEMM), and prescriptive machine learning.

---

## 🏗️ Architecture & Core Intelligence Engines

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    MOIL COMMAND CENTER FRONTEND                         │
│  React 18 + Vite • TailwindCSS • Framer Motion • Lucide Icons • Recharts │
│  2.5D/3D Digital Twin Canvas • GIS Exploration Radar • SHAP Explainers  │
└────────────────────────────────────┬────────────────────────────────────┘
                                     │ REST APIs / Synthetic Data Layer
┌────────────────────────────────────▼────────────────────────────────────┐
│                    6 CORE INTELLIGENCE ENGINES                          │
│  1. Shortfall Alert Engine (14-Day Production Deficit Forecasting)      │
│  2. Exploration Radar (Satellite NDVI/SWIR & Manganese Vein Targeting)   │
│  3. Auto-Response Protocol (Constrained Prescriptive Dispatch Solver)   │
│  4. Equipment Health & RUL (HEMM IoT Vibration & Thermal Diagnostics)   │
│  5. AI Trust & Governance (Bayesian Calibration & Drift Auditor)        │
│  6. Multi-Variate Anomaly Detector (Sub-surface Drift Scanner)          │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 🚀 Quickstart Guide

### Prerequisites
- Node.js 18+ (or portable Node runtime included)
- npm 9+

### Running the Frontend
```bash
cd frontend
npm install
npm run dev
```

The platform will launch at `http://localhost:5173`.

### Production Build & Preview
```bash
cd frontend
npm run build
npm run preview
```

---

## 📂 Project Structure

```
moil-project/
├── frontend/                        # React 18 + Vite Frontend Application
│   ├── src/
│   │   ├── components/              # UI Panels, Modals, 2.5D Digital Twin, Navigation
│   │   ├── pages/                   # 10 Canonical Application Pages
│   │   ├── context/                 # Global AppContext (Mine, Language, Scenario)
│   │   ├── services/                # API clients, Multi-physics engines, i18n
│   │   ├── i18n/                    # Trilingual dictionary (EN, HI, MR)
│   │   ├── App.jsx                  # Router configuration with code-splitting
│   │   └── main.jsx                 # Entrypoint
│   ├── package.json
│   ├── vercel.json                  # Vercel SPA configuration
│   └── vite.config.js               # Optimized rollup vendor chunk partitions
├── backend/                         # FastAPI Production Backend Gateway
│   ├── routes/                      # 17 REST API Controllers
│   ├── services/                    # ML service drivers & multi-physics models
│   ├── database/                    # PostgreSQL / Supabase with SQLite fallback
│   ├── schemas/                     # Pydantic request/response validation
│   ├── utils/                       # Model loader, structured logging, auth
│   ├── requirements.txt             # Python dependencies
│   └── main.py                      # FastAPI Application entrypoint
├── models/                          # Production Machine Learning Artifacts (.pkl)
├── render.yaml                      # Render Blueprint deployment definition
└── README.md
```

---

## 🌐 Cloud Deployment Architecture

### 1. Vercel (Frontend)
- **Root Directory**: `frontend`
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`
- **Environment Variables**:
  - `VITE_API_BASE_URL`: `https://moil-aether-backend.onrender.com/api`

### 2. Render (FastAPI Backend)
- **Build Command**: `pip install -r backend/requirements.txt`
- **Start Command**: `uvicorn backend.main:app --host 0.0.0.0 --port $PORT`
- **Health Check Path**: `/health`
- **Environment Variables**:
  - `ENVIRONMENT`: `production`
  - `DEBUG`: `False`
  - `DATABASE_URL`: `postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres` (Supabase Connection URI)
  - `CORS_ORIGINS`: `https://aether-moil-prototype.vercel.app`

---

## ⚙️ Target MOIL Assets Monitored (10 Canonical Mines)
1. **Balaghat Mine (MP)**: Asia's premier deep shaft manganese mine (44.2% Mn grade).
2. **Dongri Buzurg Mine (MH)**: Opencast bench-cut producing battery-grade peroxide dioxide ore (48.5% MnO₂).
3. **Tirodi Mine (MP)**: Historic lease featuring extensive strike-length benches.
4. **Chikla Mine (MH)**: Deep underground incline mining high-grade manganese vein.
5. **Gumgaon Mine (MH)**: Strategic underground incline operation in the Sausar geological belt.
6. **Kandri Mine (MH)**: Premier high-grade underground and open-pit manganese asset.
7. **Munsar Mine (MH)**: Heavy-production pit with automated loading and haulage.
8. **Bhandara Mine (MH)**: Sausar group metamorphic quartz-braunite deposit.
9. **Ukwa Mine (MP)**: Underground adit mining producing premium low-phosphorus manganese ore.
10. **Ramtek Mine (MH)**: High-altitude Sausar formation opencast operation.

---

## 🔬 Technical Specifications, Data Provenance & Model Benchmarks

### 1. Model Evaluation & Verified Metrics (No Data Leakage)
All models have been evaluated on held-out test splits without target leakage:
- **Production Shortfall Forecaster (GBM v1.1)**:
  - *Features*: Pre-shift operating parameters (`planned_tonnage`, `ore_grade_mn`, `recovery_rate`, `crusher_utilization`, `fleet_availability`, `rainfall_mm`, `production_trend_7d`, `production_trend_30d`, `shortfall_rate`, `lagged_target_deviation_1d`, `rolling_downtime_7d`).
  - *Classification Accuracy*: **94.67%** (Precision: 96.70%, Recall: 97.78%, F1: 0.9724, ROC-AUC: 0.9109).
  - *Regression MAE*: **76.6 Tonnes** ($R^2$: 0.9936).
  - *Top Drivers*: Fleet Availability (29.0%), Crusher Utilization (20.9%), Recovery Rate (15.5%), Lagged Target Deviation (11.2%).
- **Operational Anomaly Detector (Isolation Forest v1.1)**:
  - *Training*: 2,000 multi-variate samples relationally aligned by `[mine_id, date]` across equipment logs and production indicators.
  - *Contamination*: 8.0% (160 detected outlier events, mean decision score: 0.0729).
- **Reserve Radar Prospectivity Ranker (Random Forest v1.1)**:
  - Multi-spectral remote sensing SWIR band absorption combined with lineament proximity and depth profiles ($R^2$: 0.91).

### 2. Data Provenance & Demonstration Scope
- **Operational Telemetry**: High-fidelity prototype simulation based on published MOIL capacity baselines with stochastic micro-drift. Payloads declare `"data_source": "PROTOTYPE_SIMULATION"` and `"is_live_scada": false`.
- **Satellite Earth Observation**: Calibrated Sentinel-2 Level-2A and Landsat 8/9 synthetic baselines over the Sausar Manganese Corridor.

### 3. Statutory Reserve Classification Notice
- **UNFC Categories**: Classifications such as UNFC-111 (Proved Mineral Reserve) and UNFC-122 (Probable Mineral Reserve) are statutory regulatory baselines registered with the Indian Bureau of Mines (IBM) and DGMS based on qualified person exploration reports.
- **AI Role**: The AI Exploration Radar calculates an empirical **Exploration Prospectivity Index** to assist geologists in drilling target prioritization; it does not replace statutory statutory UNFC classification audits.

### 4. ROI & Economic Valuation Methodology
- **Protected Yield Value**: $\text{Gross Value Protected} = \text{protected\_tonnes} \times \text{assumed\_ore\_value\_per\_tonne}$ (MOIL benchmark: ₹8,500/t high-grade Mn).
- **Net ROI Ratio**: $\text{ROI} = \frac{\text{Gross Value Protected}}{\text{Mitigation Cost}}$.
- All parameters and economic assumptions are disclosed in the API payload under `economic_valuation`.
