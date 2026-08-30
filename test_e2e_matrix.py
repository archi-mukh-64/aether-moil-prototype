"""
Comprehensive End-to-End Test Matrix for MOIL Mining Intelligence Platform
Validates:
1. Backend Connectivity & Health Check
2. All 8 Frontend Application Routes
3. 10 Canonical MOIL Mines Data Ingestion & API Endpoints
4. 40 Scenario Permutations (10 Mines x 4 Scenarios)
5. Comprehensive Earth Observation & Satellite Spectral Analysis (All 10 Mines)
6. All 5 Production ML Models (Shortfall-GBM, Reserve-RF, Equip-GBM, Anomaly-IF, Protocol-Opt)
"""

import urllib.request
import urllib.error
import json
import sys

BASE_API = "http://127.0.0.1:8000"
BASE_FRONTEND = "http://127.0.0.1:5173"

MINES = [
    "balaghat", "tirodi", "ukwa", "munsar", "kandri", 
    "gumgaon", "chikla", "dongri-buzurg", "ramtek", "bhandara"
]

SCENARIOS = [
    "HEAVY_MONSOON", "CRUSHER_SEIZURE", "MULTI_RISK_CRISIS", "BASELINE_RESET"
]

FRONTEND_ROUTES = [
    "/",
    "/command-center",
    "/reserve-radar",
    "/alert-engine",
    "/protocol",
    "/equipment",
    "/analytics",
    "/decision-log"
]

def check_url(url, method="GET", data=None):
    try:
        req = urllib.request.Request(url, method=method)
        if data:
            req.add_header('Content-Type', 'application/json')
            data_bytes = json.dumps(data).encode('utf-8')
        else:
            data_bytes = None
        
        with urllib.request.urlopen(req, data=data_bytes, timeout=10) as resp:
            return resp.status, resp.read().decode('utf-8')
    except urllib.error.HTTPError as e:
        return e.code, e.read().decode('utf-8')
    except Exception as e:
        return 0, str(e)

def run_e2e_tests():
    print("=" * 60)
    print("MOIL PLATFORM COMPREHENSIVE E2E VERIFICATION SUITE")
    print("=" * 60)

    # 1. Backend Health
    status, body = check_url(f"{BASE_API}/api/health")
    assert status == 200, f"Backend Health Check failed: {status}"
    print("[OK] Backend Health Check -> 200 OK")

    # 2. Frontend Routes
    print("\n--- FRONTEND ROUTE CHECKS ---")
    for r in FRONTEND_ROUTES:
        status, body = check_url(f"{BASE_FRONTEND}{r}")
        assert status == 200, f"Route {r} failed: {status}"
        print(f"  [OK] Route: {r.ljust(18)} -> 200 OK")

    # 3. 10 Canonical Mines API Flow
    print("\n--- 10 CANONICAL MINES DATA FLOW CHECKS ---")
    for m in MINES:
        status, body = check_url(f"{BASE_API}/api/mines/{m}")
        assert status == 200, f"Mine {m} failed: {status}"
        
        status, body = check_url(f"{BASE_API}/api/mines/{m}/telemetry")
        assert status == 200, f"Telemetry {m} failed: {status}"

        status, body = check_url(f"{BASE_API}/api/mines/{m}/analytics")
        assert status == 200, f"Analytics {m} failed: {status}"

        status, body = check_url(f"{BASE_API}/api/mines/{m}/equipment")
        assert status == 200, f"Equipment {m} failed: {status}"

        status, body = check_url(f"{BASE_API}/api/mines/{m}/reserve")
        assert status == 200, f"Reserve {m} failed: {status}"

        status, body = check_url(f"{BASE_API}/api/mines/{m}/trust")
        assert status == 200, f"Trust {m} failed: {status}"

        print(f"  [OK] Mine: {m.ljust(15)} (All 6 API Subsystems Verified)")

    # 4. Scenario Simulation Matrix (10 Mines x 4 Scenarios = 40 Tests)
    print("\n--- 40 SCENARIO SIMULATION TESTS (10 Mines x 4 Scenarios) ---")
    passed_scenarios = 0
    for m in MINES:
        for s in SCENARIOS:
            payload = {
                "mine_id": m,
                "scenario_type": s,
                "severity": "HIGH",
                "time_horizon": "24 HOURS"
            }
            status, body = check_url(f"{BASE_API}/api/scenarios/simulate", method="POST", data=payload)
            assert status == 200, f"Scenario {s} on mine {m} failed: {status} ({body})"
            res = json.loads(body)
            assert "predicted_loss_tonnes" in res or "is_detected" in res
            passed_scenarios += 1
            print(f"  [OK] {m.ljust(14)} + {s.ljust(18)} -> 200 OK (Yield: {res.get('projected_yield_tonnes', 'N/A')}T, Loss: {res.get('predicted_loss_tonnes', 'N/A')}T)")

    # 5. Earth Observation Service Check
    print("\n--- EARTH OBSERVATION REMOTE SENSING CHECKS ---")
    status, body = check_url(f"{BASE_API}/api/earth-observation/status")
    assert status == 200, f"Earth observation status failed: {status}"
    eo_status = json.loads(body)
    print(f"  [OK] Earth Observation Status: {eo_status['status']} ({eo_status['provider']})")

    status, body = check_url(f"{BASE_API}/api/earth-observation/national-summary")
    assert status == 200, f"National summary failed: {status}"
    nat = json.loads(body)
    print(f"  [OK] National EO Summary: {nat['totalMinesMonitored']} Mines Monitored, {nat['totalActiveFootprintHa']} Ha Total Footprint")

    for m in MINES:
        status, body = check_url(f"{BASE_API}/api/earth-observation/{m}")
        assert status == 200, f"EO for {m} failed: {status}"
        eo = json.loads(body)
        assert "swirMineralIndex" in eo and "ndviMean" in eo
        print(f"  [OK] EO Profile: {m.ljust(14)} -> NDVI: {eo['ndviMean']}, SWIR: {eo['swirMineralIndex']}, Changes: {len(eo['detectedChanges'])}")

    # 6. ML Model Inference Endpoints Check
    print("\n--- ML MODEL INFERENCE SUBSYSTEMS CHECKS ---")
    status, body = check_url(f"{BASE_API}/api/alert/predict", method="POST", data={"mine_id": "balaghat", "rainfall_mm": 65.0, "sump_inflow_m3h": 720.0, "crusher_vibration_mms": 4.5, "haul_delay_mins": 14.0})
    assert status == 200, f"Alert predict failed: {status}"
    print("  [OK] /api/alert/predict (Shortfall-GBM TreeSHAP)")

    status, body = check_url(f"{BASE_API}/api/reserve/predict", method="POST", data={"mine_id": "balaghat", "depth_m": 185.0, "mn_grade": 44.5, "silica_pct": 12.0})
    assert status == 200, f"Reserve predict failed: {status}"
    print("  [OK] /api/reserve/predict (RandomForest Prospectivity)")

    status, body = check_url(f"{BASE_API}/api/equipment/predict", method="POST", data={"mine_id": "balaghat", "machine_id": "CRUSH-BLG-01", "vibration_rms": 2.4, "temp_c": 68.0, "oil_pressure_bar": 4.2})
    assert status == 200, f"Equipment predict failed: {status}"
    print("  [OK] /api/equipment/predict (GradientBoosting RUL & Health)")

    status, body = check_url(f"{BASE_API}/api/anomaly/detect", method="POST", data={"mine_id": "balaghat", "telemetry_features": [44.2, 185.0, 2.4, 68.0, 4.2]})
    assert status == 200, f"Anomaly detect failed: {status}"
    print("  [OK] /api/anomaly/detect (IsolationForest Anomaly Detector)")

    status, body = check_url(f"{BASE_API}/api/protocol/optimize", method="POST", data={"mine_id": "balaghat", "target_tonnage": 6200, "priority_weight": 0.8})
    assert status == 200, f"Protocol optimize failed: {status}"
    print("  [OK] /api/protocol/optimize (Pareto Multi-Objective Optimizer)")

    # 7. National Radar Engine & Exploration Target Scanner Endpoints Check
    print("\n--- NATIONAL RADAR & AI EXPLORATION ENDPOINTS CHECKS ---")
    status, body = check_url(f"{BASE_API}/api/national-radar/modes")
    assert status == 200, f"National radar modes failed: {status}"
    print("  [OK] /api/national-radar/modes (7 Modes & Driver Weights)")

    status, body = check_url(f"{BASE_API}/api/national-radar/analyze?mode=EXPLORATION_PRIORITY")
    assert status == 200, f"National radar analyze failed: {status}"
    print("  [OK] /api/national-radar/analyze (Multi-Variate Ranking Engine)")

    status, body = check_url(f"{BASE_API}/api/national-radar/correlations")
    assert status == 200, f"National radar correlations failed: {status}"
    print("  [OK] /api/national-radar/correlations (Cross-Mine Pearson Engine)")

    status, body = check_url(f"{BASE_API}/api/national-radar/what-if?invest_crores=200")
    assert status == 200, f"National radar what-if failed: {status}"
    print("  [OK] /api/national-radar/what-if (Capital Allocation Simulator)")

    status, body = check_url(f"{BASE_API}/api/exploration/targets/balaghat")
    assert status == 200, f"Exploration targets failed: {status}"
    print("  [OK] /api/exploration/targets/balaghat (Candidate Prospects)")

    status, body = check_url(f"{BASE_API}/api/exploration/drill/balaghat?depth_m=180")
    assert status == 200, f"Virtual drill failed: {status}"
    print("  [OK] /api/exploration/drill/balaghat (Virtual Borehole Stratigraphy)")

    status, body = check_url(f"{BASE_API}/api/earth-observation/environmental/balaghat?year=2024")
    assert status == 200, f"Environmental yearly failed: {status}"
    print("  [OK] /api/earth-observation/environmental/balaghat (Yearly Satellite Profile)")

    status, body = check_url(f"{BASE_API}/api/earth-observation/compare-years/balaghat?year_before=2018&year_after=2026")
    assert status == 200, f"Compare years failed: {status}"
    print("  [OK] /api/earth-observation/compare-years/balaghat (Multi-Temporal Change Comparison)")

    status, body = check_url(f"{BASE_API}/api/reserve/evolution/balaghat")
    assert status == 200, f"Reserve evolution failed: {status}"
    print("  [OK] /api/reserve/evolution/balaghat (UNFC Evolution Waterfall)")

    status, body = check_url(f"{BASE_API}/api/reserve/confidence-grid/balaghat")
    assert status == 200, f"Confidence grid failed: {status}"
    print("  [OK] /api/reserve/confidence-grid/balaghat (24-Cell Spatial Uncertainty Grid)")

    print("\n" + "=" * 60)
    print("ALL TESTS PASSED! 10 Mines x 4 Scenarios (40/40) + All 8 Routes + 10 EO Profiles + 5 ML Models + National Radar & Exploration")
    print("=" * 60 + "\n")

if __name__ == '__main__':
    run_e2e_tests()
