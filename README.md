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
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx               # Enterprise command bar & active mine switcher
│   │   │   ├── Hero.jsx                 # Topographic radar canvas & coordinate HUD
│   │   │   ├── MetricStrip.jsx          # Live KPI metrics (Target, Yield, Risk, Fleet)
│   │   │   ├── DigitalMine.jsx          # 2.5D Isometric topographic digital twin
│   │   │   ├── IntelligenceEngines.jsx  # 6 core intelligence engine cards
│   │   │   ├── RiskCenterPreview.jsx    # Real-time operational risk matrix
│   │   │   ├── ForecastPreview.jsx      # 14-day production forecast & confidence envelope
│   │   │   ├── TrustScorePreview.jsx    # Multi-pillar AI governance trust gauge
│   │   │   ├── CommandDrawer.jsx        # Live pitch scenario injection console
│   │   │   └── Footer.jsx               # PSU credentials, coordinates, and version
│   │   ├── pages/
│   │   │   ├── Home.jsx                 # Executive Command Center landing
│   │   │   ├── CommandCenterPage.jsx    # Multi-mine dispatch & telemetry feed
│   │   │   ├── ReserveRadarPage.jsx     # GIS Exploration & virtual core drill probe
│   │   │   ├── AlertEnginePage.jsx      # Shortfall forecasting & SHAP waterfall
│   │   │   ├── ProtocolPage.jsx         # Prescriptive optimization & dispatch logger
│   │   │   ├── EquipmentPage.jsx        # HEMM fleet health, vibration & RUL
│   │   │   └── AnalyticsPage.jsx        # Ore grade blending & trust calibration
│   │   ├── context/
│   │   │   └── AppContext.jsx           # Global state (Mine, Language, Simulation)
│   │   ├── data/
│   │   │   ├── mockMines.js             # Authentic MOIL mine profiles
│   │   │   ├── mockTelemetry.js         # Sensor streams, KPIs & risk logs
│   │   │   └── mockEngines.js           # Engine specifications
│   │   ├── i18n/
│   │   │   └── translations.js          # Trilingual dictionary (EN, HI, OR)
│   │   ├── App.jsx                      # Router configuration
│   │   ├── main.jsx                     # Application entrypoint
│   │   └── index.css                    # Industrial dark theme tokens
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
└── README.md
```

---

## ⚙️ Target Mines Modeled
1. **Balaghat Mine (MP)**: Asia's premier deep shaft manganese mine (Holmes, Bharveli, Western shafts, 44.2% Mn grade, -185m depth).
2. **Dongri Buzurg Mine (MH)**: Premier opencast bench-cut mine producing battery-grade peroxide dioxide ore (48.5% MnO₂).
3. **Gumgaon Mine (MH)**: Strategic underground incline operation in the Sausar geological belt.
4. **Tirodi Mine (MP)**: Historic lease featuring extensive strike-length benches with ongoing geophysical exploration.
5. **Ukwa Mine (MP)**: Underground adit mining producing premium low-phosphorus manganese ore.
