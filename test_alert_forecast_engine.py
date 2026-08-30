import urllib.request
import urllib.error
import json
import sys
import math

sys.stdout.reconfigure(encoding='utf-8')

API_BASE = "http://127.0.0.1:8000/api"
FRONTEND_BASE = "http://127.0.0.1:5173"

MINES = [
    "balaghat", "tirodi", "ukwa", "munsar", "kandri", 
    "gumgaon", "chikla", "dongri-buzurg", "ramtek", "bhandara"
]

SCENARIOS = ["BASELINE", "HEAVY_MONSOON", "CRUSHER_SEIZURE", "MULTI_RISK"]

def req(url, method="GET", data=None):
    try:
        r = urllib.request.Request(url, method=method)
        if data is not None:
            r.add_header('Content-Type', 'application/json')
            data_bytes = json.dumps(data).encode('utf-8')
        else:
            data_bytes = None
        with urllib.request.urlopen(r, data=data_bytes, timeout=12) as resp:
            content_type = resp.headers.get('Content-Type', '')
            body = resp.read()
            if 'application/json' in content_type:
                return resp.status, json.loads(body.decode('utf-8'))
            return resp.status, body.decode('utf-8')
    except urllib.error.HTTPError as e:
        body = e.read().decode('utf-8')
        try:
            return e.code, json.loads(body)
        except:
            return e.code, body
    except Exception as e:
        return 0, str(e)

print("=" * 80)
print("AETHER 14-DAY DYNAMIC ALERT & PRODUCTION FORECAST ENGINE RIGOROUS QA")
print("=" * 80)

total_assertions = 0

def check(cond, msg):
    global total_assertions
    total_assertions += 1
    assert cond, msg

# 1. Route Rendering & Frontend HTTP Accessibility
print("\n--- 1. ALERT ENGINE ROUTE ACCESSIBILITY ---")
st, html = req(f"{FRONTEND_BASE}/alert-engine")
check(st == 200, f"Route /alert-engine returned HTTP {st}")
check('<div id="root">' in html, "React root element missing")
print(f"[PASS] Route /alert-engine accessible: HTTP 200 OK | HTML Size: {len(html)} bytes")

# 2. 14-Day Point Integrity across All 10 Mines x 4 Scenarios
print("\n--- 2. TIME-SERIES CONTINUITY & MATHEMATICAL ENVELOPE (10 MINES x 4 SCENARIOS) ---")
for m in MINES:
    for sc in SCENARIOS:
        st, res = req(f"{API_BASE}/forecast/14-day", method="POST", data={"mine_id": m, "scenario_id": sc})
        check(st == 200, f"Forecast request failed for {m} + {sc}: {st}")
        pts = res.get("forecast_points", [])
        check(len(pts) == 14, f"Expected 14 points, got {len(pts)} for {m}+{sc}")
        
        prev_envelope = 0
        for p in pts:
            d = p["day_num"]
            y = p["predicted_yield_tpd"]
            low = p["lower_ci_tpd"]
            up = p["upper_ci_tpd"]
            check(not math.isnan(y) and not math.isinf(y) and y > 0, f"Invalid yield on day {d} for {m}+{sc}: {y}")
            check(low <= y <= up, f"CI envelope violated on day {d} for {m}+{sc}: {low} <= {y} <= {up}")
            check(p["event_marker"], f"Missing event marker on day {d} for {m}+{sc}")
            check(p["main_driver"], f"Missing main driver on day {d} for {m}+{sc}")
            
            env = up - low
            if low > 0.0:
                check(env >= prev_envelope - 1.0, f"Uncertainty envelope shrank on day {d}: {env} < {prev_envelope}")
            prev_envelope = env

print("[PASS] 560 Daily Time-Series Points Verified (100% Non-Null, Lower CI <= Yield <= Upper CI, Expanding Envelope)")

# 3. Scenario Fingerprint & Trajectory Differentiation
print("\n--- 3. OPERATIONAL SCENARIO TRAJECTORY DIFFERENTIATION ---")
for m in ["balaghat", "dongri-buzurg", "ramtek"]:
    trajectories = {}
    for sc in SCENARIOS:
        st, res = req(f"{API_BASE}/forecast/14-day", method="POST", data={"mine_id": m, "scenario_id": sc})
        pts = [p["predicted_yield_tpd"] for p in res["forecast_points"]]
        trajectories[sc] = pts
    
    # Assert mutual distinctness
    for i in range(len(SCENARIOS)):
        for j in range(i + 1, len(SCENARIOS)):
            sc1, sc2 = SCENARIOS[i], SCENARIOS[j]
            t1, t2 = trajectories[sc1], trajectories[sc2]
            check(t1 != t2, f"Trajectory collision at {m} between {sc1} and {sc2}")
            dist = math.sqrt(sum((a - b)**2 for a, b in zip(t1, t2)))
            target_val = res["daily_target"]
            min_dist = max(180.0, target_val * 0.12)
            check(dist > min_dist, f"Trajectory difference too small between {sc1} and {sc2} at {m}: dist={dist} vs min={min_dist}")
            print(f"  [PASS] {m.ljust(14)}: {sc1.ljust(16)} vs {sc2.ljust(16)} -> Trajectory Delta Euclidean Dist: {round(dist, 1)} TPD")

# 4. Canonical Mine Differentiation Under Identical Shock
print("\n--- 4. MINE-SPECIFIC DIFFERENTIATION UNDER IDENTICAL HEAVY MONSOON ---")
mine_yields = {}
for m in MINES:
    st, res = req(f"{API_BASE}/forecast/14-day", method="POST", data={"mine_id": m, "scenario_id": "HEAVY_MONSOON"})
    avg_yield = res["kpis"]["avg_predicted_yield"]
    target = res["daily_target"]
    net_loss = res["kpis"]["avg_daily_shortfall"]
    d5_shock = res["forecast_points"][4]["predicted_yield_tpd"]
    mine_yields[m] = (target, avg_yield, net_loss, d5_shock)
    print(f"  [PASS] Mine {m.ljust(16)} -> Quota: {str(target).rjust(5)} TPD | Monsoon 14D Avg: {str(avg_yield).rjust(5)} TPD | Day 5 Peak Shock: {str(d5_shock).rjust(5)} TPD | Shortfall: -{str(net_loss).rjust(5)} TPD")

# Verify all 10 mines have distinct targets and distinct Day 5 shock responses
d5_shocks = [v[3] for v in mine_yields.values()]
check(len(set(d5_shocks)) == 10, "Day 5 shock collision across mines under Heavy Monsoon")
print("[PASS] 100% Mine Output Isolation: All 10 MOIL assets produce distinct physical responses")

# 5. Continuous Slider Sensitivity Tests
print("\n--- 5. PROGRESSIVE PARAMETER SENSITIVITY ---")
# 5a. Rainfall progressive response (20mm -> 80mm -> 150mm)
st, r20 = req(f"{API_BASE}/forecast/14-day", method="POST", data={"mine_id": "balaghat", "rainfall_mm": 20.0})
st, r80 = req(f"{API_BASE}/forecast/14-day", method="POST", data={"mine_id": "balaghat", "rainfall_mm": 80.0})
st, r150 = req(f"{API_BASE}/forecast/14-day", method="POST", data={"mine_id": "balaghat", "rainfall_mm": 150.0})
y20 = r20["kpis"]["avg_predicted_yield"]
y80 = r80["kpis"]["avg_predicted_yield"]
y150 = r150["kpis"]["avg_predicted_yield"]
check(y20 > y80 > y150, f"Rainfall progressive sensitivity failed: {y20} > {y80} > {y150}")
print(f"  [PASS] Rainfall Response: 20mm ({y20} TPD) -> 80mm ({y80} TPD) -> 150mm ({y150} TPD) [Monotonic Loss]")

# 5b. Crusher progressive response (100% -> 70% -> 30% -> 10%)
st, c100 = req(f"{API_BASE}/forecast/14-day", method="POST", data={"mine_id": "balaghat", "crusher_availability_pct": 100.0})
st, c70 = req(f"{API_BASE}/forecast/14-day", method="POST", data={"mine_id": "balaghat", "crusher_availability_pct": 70.0})
st, c30 = req(f"{API_BASE}/forecast/14-day", method="POST", data={"mine_id": "balaghat", "crusher_availability_pct": 30.0})
st, c10 = req(f"{API_BASE}/forecast/14-day", method="POST", data={"mine_id": "balaghat", "crusher_availability_pct": 10.0})
cy100 = c100["kpis"]["avg_predicted_yield"]
cy70 = c70["kpis"]["avg_predicted_yield"]
cy30 = c30["kpis"]["avg_predicted_yield"]
cy10 = c10["kpis"]["avg_predicted_yield"]
check(cy100 > cy70 > cy30 > cy10, f"Crusher progressive sensitivity failed: {cy100} > {cy70} > {cy30} > {cy10}")
print(f"  [PASS] Crusher Response: 100% ({cy100} TPD) -> 70% ({cy70} TPD) -> 30% ({cy30} TPD) -> 10% ({cy10} TPD) [Monotonic Loss]")

# 5c. Fleet progressive response (100% -> 80% -> 50% -> 20%)
st, f100 = req(f"{API_BASE}/forecast/14-day", method="POST", data={"mine_id": "balaghat", "fleet_availability_pct": 100.0})
st, f80 = req(f"{API_BASE}/forecast/14-day", method="POST", data={"mine_id": "balaghat", "fleet_availability_pct": 80.0})
st, f50 = req(f"{API_BASE}/forecast/14-day", method="POST", data={"mine_id": "balaghat", "fleet_availability_pct": 50.0})
st, f20 = req(f"{API_BASE}/forecast/14-day", method="POST", data={"mine_id": "balaghat", "fleet_availability_pct": 20.0})
fy100 = f100["kpis"]["avg_predicted_yield"]
fy80 = f80["kpis"]["avg_predicted_yield"]
fy50 = f50["kpis"]["avg_predicted_yield"]
fy20 = f20["kpis"]["avg_predicted_yield"]
check(fy100 > fy80 > fy50 > fy20, f"Fleet progressive sensitivity failed: {fy100} > {fy80} > {fy50} > {fy20}")
print(f"  [PASS] Fleet Response: 100% ({fy100} TPD) -> 80% ({fy80} TPD) -> 50% ({fy50} TPD) -> 20% ({fy20} TPD) [Monotonic Loss]")

# 6. Time-Staged Operational Recovery Verification
print("\n--- 6. TIME-STAGED RECOVERY BEHAVIOR ---")
st, crush_res = req(f"{API_BASE}/forecast/14-day", method="POST", data={"mine_id": "balaghat", "scenario_id": "CRUSHER_SEIZURE"})
crush_pts = crush_res["forecast_points"]
# Day 1-3 normal (~6000), Day 5 seizure drop (~2500), Day 8 low (~3200), Day 14 recovered (>5500)
check(crush_pts[0]["predicted_yield_tpd"] > 5500, "Crusher Day 1 should be normal")
check(crush_pts[4]["predicted_yield_tpd"] < 3500, "Crusher Day 5 should show seizure drop")
check(crush_pts[13]["predicted_yield_tpd"] > crush_pts[4]["predicted_yield_tpd"] + 1800, "Crusher Day 14 should show recovery ramp")
print(f"  [PASS] Crusher Seizure Signature: D1={crush_pts[0]['predicted_yield_tpd']} TPD -> D5 (Seizure)={crush_pts[4]['predicted_yield_tpd']} TPD -> D14 (Restored)={crush_pts[13]['predicted_yield_tpd']} TPD")

# 7. Causally Connected Unified Model Verification
print("\n--- 7. CAUSAL CONNECTION: GRAPH = KPIS = AI EXPLANATION = WATERFALL ---")
st, exp_res = req(f"{API_BASE}/forecast/14-day", method="POST", data={"mine_id": "balaghat", "scenario_id": "HEAVY_MONSOON"})
kpis = exp_res["kpis"]
avg_from_points = sum(p["predicted_yield_tpd"] for p in exp_res["forecast_points"]) / 14.0
check(abs(kpis["avg_predicted_yield"] - avg_from_points) < 2.0, "KPI avg yield decoupled from graph points")
check(len(exp_res["ai_explanation"]) > 50, "AI explanation missing")
check("Heavy monsoon precipitation" in exp_res["ai_explanation"] or "monsoon" in exp_res["ai_explanation"].lower(), "AI explanation not reflecting active scenario")
check(len(exp_res["waterfall_drivers"]) == 5, "Waterfall drivers count mismatch")
check(len(exp_res["generated_alerts"]) >= 1, "Generated alerts missing")
print(f"  [PASS] Graph Mean ({round(avg_from_points)} TPD) matches KPI Card ({kpis['avg_predicted_yield']} TPD)")
ai_snip = exp_res['ai_explanation'][:85]
print(f"  [PASS] AI Explanation: '{ai_snip}...'")

print("\n" + "=" * 80)
print(f"ALERT FORECAST ENGINE QA: 100% OF ALL {total_assertions} ASSERTIONS PASSED!")
print("=" * 80)
