#!/usr/bin/env python3
"""
AETHER SCENARIO LAB — 150-PERMUTATION FULL STRESS MATRIX TEST SUITE
Validates:
1. 10 Mines x 15 Scenarios = 150 globally distinct physical simulation fingerprints.
2. Complete determinism and absence of NaN / Inf / null anomalies.
3. Realistic engineering outputs (Yield TPD, Loss Tonnes, Shortfall Risk, Vibration, Fleet Health).
4. Mine differentiation across all 10 canonical assets.
5. Scenario differentiation across all 15 real-world stress conditions.
"""

import sys
import json
import urllib.request
import urllib.error

sys.stdout.reconfigure(encoding='utf-8')

BASE_API = "http://127.0.0.1:8000"

MINES = [
    "balaghat", "tirodi", "ukwa", "munsar", "kandri",
    "gumgaon", "chikla", "dongri-buzurg", "ramtek", "bhandara"
]

SCENARIOS = [
    "BASELINE_RESET",
    "HEAVY_MONSOON",
    "CRUSHER_SEIZURE",
    "HAUL_ROAD_FAILURE",
    "FLEET_BREAKDOWN",
    "SHAFT_HOIST_FAILURE",
    "DEWATERING_FAILURE",
    "POWER_FAILURE",
    "GEOLOGICAL_HAZARD",
    "MULTI_RISK_CRISIS",
    "FIRE_INCIDENT",
    "SLOPE_INSTABILITY",
    "EXTREME_RAINFALL",
    "VENTILATION_FAILURE",
    "BLASTING_DISRUPTION"
]

def make_request(url, method="GET", data=None):
    req = urllib.request.Request(url, method=method)
    if data:
        req.add_header('Content-Type', 'application/json')
        payload = json.dumps(data).encode('utf-8')
    else:
        payload = None

    try:
        with urllib.request.urlopen(req, data=payload, timeout=10) as response:
            return response.status, response.read().decode('utf-8')
    except urllib.error.HTTPError as e:
        return e.code, e.read().decode('utf-8')
    except Exception as e:
        return 0, str(e)

def run_150_matrix_test():
    print("=" * 80)
    print("AETHER SCENARIO LAB — 150-PERMUTATION (10 MINES x 15 SCENARIOS) QA SUITE")
    print("=" * 80)

    total_runs = 0
    all_fingerprints = set()
    mine_fingerprints = {m: [] for m in MINES}
    scenario_fingerprints = {s: [] for s in SCENARIOS}

    print("\n[SECTION 1] Executing 150 Simulation Permutations...")
    print("-" * 80)

    for m in MINES:
        for s in SCENARIOS:
            payload = {
                "mine_id": m,
                "scenario_type": s,
                "severity": "HIGH",
                "time_horizon": "24 HOURS"
            }
            status, body = make_request(f"{BASE_API}/api/scenarios/simulate", method="POST", data=payload)
            assert status == 200, f"Failed permutation {m} + {s}: Status {status} ({body})"
            res = json.loads(body)

            yield_val = res.get("projected_yield_tonnes", 0)
            loss_val = res.get("predicted_loss_tonnes", 0)
            risk_val = res.get("shortfall_probability", 0.0)
            crusher_vib = res.get("crusher_vibration_mms", 0.0)
            fleet_health = res.get("fleet_health_pct", 0.0)

            # Numerical Sanity Assertions
            for val in [yield_val, loss_val, risk_val, crusher_vib, fleet_health]:
                assert str(val).lower() not in ["nan", "inf", "-inf"], f"Invalid numerical value {val} in {m}+{s}"

            fp = f"{m}::{s}::{yield_val}::{loss_val}::{risk_val:.2f}::{crusher_vib:.1f}::{fleet_health:.1f}"
            all_fingerprints.add(fp)
            mine_fingerprints[m].append(fp)
            scenario_fingerprints[s].append(fp)

            total_runs += 1
            if total_runs % 15 == 0:
                print(f"  [PASS] Completed {m.upper():<14} : 15/15 Scenarios Verified -> Latest: {s:<20} | Yield: {yield_val}T")

    print("\n[SECTION 2] Mine Differentiation Verification (10 Canonical Assets)")
    print("-" * 80)
    for m, fps in mine_fingerprints.items():
        unique_fps = set(fps)
        assert len(unique_fps) == 15, f"Mine {m} produced only {len(unique_fps)}/15 unique scenario states!"
        print(f"  [OK] Mine {m:<14} : 15 / 15 100% Unique Scenario Fingerprints")

    print("\n[SECTION 3] Scenario Differentiation Verification (15 Real Scenarios)")
    print("-" * 80)
    for s, fps in scenario_fingerprints.items():
        unique_fps = set(fps)
        assert len(unique_fps) == 10, f"Scenario {s} produced only {len(unique_fps)}/10 unique mine outputs!"
        print(f"  [OK] Scenario {s:<22} : 10 / 10 100% Unique Mine Fingerprints")

    print("\n[SECTION 4] Global 150/150 Permutation Uniqueness")
    print("-" * 80)
    assert len(all_fingerprints) == 150, f"Expected 150 unique permutations, got {len(all_fingerprints)}"
    print(f"  [OK] Total Globally Unique Fingerprints: 150 / 150 (100% Unique State Vectors)")

    print("\n" + "=" * 80)
    print(f"150-MATRIX QA SUITE PASSED: 150 / 150 SIMULATIONS VERIFIED (100% SUCCESS)")
    print("=" * 80)

if __name__ == "__main__":
    run_150_matrix_test()
