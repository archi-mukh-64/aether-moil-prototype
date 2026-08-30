"""
AETHER OPERATIONAL SCENARIO LAB — DEEP MULTI-VECTOR VALIDATION SUITE
Tests 100+ scenario permutations across 10 canonical mines with 150+ assertions.
"""

import sys
import os

# Set root dir
ROOT_DIR = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, ROOT_DIR)

from backend.services.mine_service import mine_service
from backend.services.scenario_service import scenario_service
from backend.utils.validation import VALID_MINE_IDS, VALID_SCENARIO_TYPES

def test_scenario_lab_deep():
    print("=" * 80)
    print("AETHER OPERATIONAL SCENARIO LAB — DEEP MULTI-VECTOR QA SUITE")
    print("=" * 80)

    total_assertions = 0
    passed_assertions = 0

    mines = mine_service.get_all_mines()
    scenario_keys = [
        "BASELINE_RESET",
        "HEAVY_MONSOON",
        "CRUSHER_SEIZURE",
        "HAUL_ROAD_FAILURE",
        "FLEET_BREAKDOWN",
        "SHAFT_HOIST_FAILURE",
        "DEWATERING_FAILURE",
        "POWER_FAILURE",
        "GEOLOGICAL_HAZARD",
        "MULTI_RISK_CRISIS"
    ]

    severities = ["LOW", "MEDIUM", "HIGH", "CRITICAL"]
    horizons = ["6 HOURS", "24 HOURS", "7 DAYS"]

    # -------------------------------------------------------------------------
    # SECTION 1: 100 PERMUTATIONS (10 MINES x 10 SCENARIOS)
    # -------------------------------------------------------------------------
    print("\n[SECTION 1] 100 Base Permutations (10 Mines x 10 Scenarios)...")
    permutations_results = {}

    for mine in mines:
        mine_id = mine["id"]
        permutations_results[mine_id] = {}

        for scen in scenario_keys:
            res = scenario_service.simulate_scenario(
                mine_id=mine_id,
                scenario_type=scen,
                severity="HIGH",
                time_horizon="24 HOURS"
            )

            # Assertions on returned structure
            assert res is not None, f"Result null for {mine_id} - {scen}"
            total_assertions += 1
            passed_assertions += 1

            assert res["baseline_production_target"] > 0, "Baseline must be > 0"
            total_assertions += 1
            passed_assertions += 1

            assert res["projected_yield_tonnes"] >= 0, "Projected yield must be >= 0"
            total_assertions += 1
            passed_assertions += 1

            assert 0.0 <= res["shortfall_probability"] <= 1.0, "Shortfall prob out of bounds"
            total_assertions += 1
            passed_assertions += 1

            assert len(res["causal_chain"]) >= 2, "Causal chain must have >= 2 links"
            total_assertions += 1
            passed_assertions += 1

            assert "recommendation" in res and res["recommendation"]["action_id"], "Missing recommendation"
            total_assertions += 1
            passed_assertions += 1

            permutations_results[mine_id][scen] = res

        print(f"  [PASS] Mine {mine['name']:<20} : 10/10 Scenarios Validated")

    # -------------------------------------------------------------------------
    # SECTION 2: MINE DIFFERENTIATION (Mine A != Mine B for same scenario)
    # -------------------------------------------------------------------------
    print("\n[SECTION 2] Mine Differentiation Verification...")
    for scen in scenario_keys:
        yields = [permutations_results[m["id"]][scen]["projected_yield_tonnes"] for m in mines]
        unique_yields = len(set(yields))
        assert unique_yields >= 8, f"Too few unique yields for scenario {scen}: {unique_yields}"
        total_assertions += 1
        passed_assertions += 1
        print(f"  [OK] Scenario {scen:<22} : {unique_yields}/10 Unique Mine Output Vectors")

    # -------------------------------------------------------------------------
    # SECTION 3: SCENARIO DIFFERENTIATION (Scenario A != Scenario B for same mine)
    # -------------------------------------------------------------------------
    print("\n[SECTION 3] Scenario Differentiation Verification...")
    for mine in mines:
        m_id = mine["id"]
        losses = [permutations_results[m_id][scen]["predicted_loss_tonnes"] for scen in scenario_keys]
        unique_losses = len(set(losses))
        assert unique_losses >= 8, f"Too few unique scenario loss values for mine {m_id}: {unique_losses}"
        total_assertions += 1
        passed_assertions += 1
        print(f"  [OK] Mine {mine['name']:<20} : {unique_losses}/10 Unique Scenario Loss Vectors")

    # -------------------------------------------------------------------------
    # SECTION 4: SEVERITY SCALING (Low != Medium != High != Critical)
    # -------------------------------------------------------------------------
    print("\n[SECTION 4] Severity Level Impact Scaling...")
    balaghat_id = "balaghat"
    sev_losses = []
    for sev in severities:
        r = scenario_service.simulate_scenario(
            mine_id=balaghat_id,
            scenario_type="HEAVY_MONSOON",
            severity=sev,
            time_horizon="24 HOURS"
        )
        sev_losses.append(r["predicted_loss_tonnes"])

    # Monotonically increasing loss
    assert sev_losses[0] < sev_losses[1] < sev_losses[2] < sev_losses[3], f"Severity not strictly increasing: {sev_losses}"
    total_assertions += 4
    passed_assertions += 4
    print(f"  [OK] Balaghat Monsoon Severity Losses: LOW={sev_losses[0]}T < MED={sev_losses[1]}T < HIGH={sev_losses[2]}T < CRIT={sev_losses[3]}T")

    # -------------------------------------------------------------------------
    # SECTION 5: TIME HORIZON SCALING (6h != 24h != 7d)
    # -------------------------------------------------------------------------
    print("\n[SECTION 5] Time Horizon Scaling...")
    hor_losses = []
    for h in horizons:
        r = scenario_service.simulate_scenario(
            mine_id=balaghat_id,
            scenario_type="CRUSHER_SEIZURE",
            severity="HIGH",
            time_horizon=h
        )
        hor_losses.append(r["predicted_loss_tonnes"])

    assert hor_losses[0] < hor_losses[1] < hor_losses[2], f"Horizon not strictly increasing: {hor_losses}"
    total_assertions += 3
    passed_assertions += 3
    print(f"  [OK] Balaghat Crusher Horizon Losses: 6H={hor_losses[0]}T < 24H={hor_losses[1]}T < 7D={hor_losses[2]}T")

    # -------------------------------------------------------------------------
    # SUMMARY
    # -------------------------------------------------------------------------
    print("\n" + "=" * 80)
    print(f"SCENARIO LAB DEEP SUITE PASSED: {passed_assertions} / {total_assertions} ASSERTIONS (100% SUCCESS)")
    print("=" * 80)

if __name__ == "__main__":
    test_scenario_lab_deep()
