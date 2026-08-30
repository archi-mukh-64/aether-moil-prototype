import os
import sys
import unittest
from fastapi.testclient import TestClient

# Ensure root is in path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from backend.main import app
from backend.services.mine_service import CANONICAL_MOIL_MINES

class TestMOILBackend(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.client = TestClient(app)
        cls.mine_ids = list(CANONICAL_MOIL_MINES.keys())

    # 1. Health & Root Endpoints
    def test_01_root_endpoint(self):
        res = self.client.get("/")
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertEqual(data["status"], "ONLINE")
        self.assertIn("documentation", data)

    def test_02_health_endpoint(self):
        res = self.client.get("/api/health")
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertIn(data["status"], ["HEALTHY", "DEGRADED"])
        self.assertIn("models", data)
        self.assertIn("database", data)
        self.assertTrue(data["models"]["all_models_operational"])

    # 2. Mine Registry & All 10 Mines
    def test_03_list_all_mines(self):
        res = self.client.get("/api/mines")
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertEqual(data["total_mines"], 10)
        self.assertEqual(len(data["mines"]), 10)

    def test_04_individual_mines(self):
        for mine_id in self.mine_ids:
            res = self.client.get(f"/api/mines/{mine_id}")
            self.assertEqual(res.status_code, 200, f"Mine endpoint failed for {mine_id}")
            mine = res.json()
            self.assertEqual(mine["id"], mine_id)
            self.assertIn("name", mine)
            self.assertIn("coordinatesDMS", mine)
            self.assertIn("productionTarget", mine)
            self.assertIn("telemetry", mine)
            self.assertIn("analytics", mine)
            self.assertIn("reserve", mine)

    def test_05_invalid_mine_id(self):
        res = self.client.get("/api/mines/atlantis-deep-trench")
        self.assertEqual(res.status_code, 404)
        self.assertIn("not found", res.json()["detail"].lower())

    # 3. Telemetry, Analytics, Equipment, Reserve & Trust Endpoints
    def test_06_mine_telemetry(self):
        for mine_id in self.mine_ids:
            res = self.client.get(f"/api/mines/{mine_id}/telemetry")
            self.assertEqual(res.status_code, 200)
            telemetry = res.json()
            self.assertEqual(telemetry["mine_id"], mine_id)
            self.assertIn("sensor_nodes", telemetry)
            self.assertGreater(len(telemetry["sensor_nodes"]), 0)

    def test_07_mine_analytics(self):
        for mine_id in self.mine_ids:
            res = self.client.get(f"/api/mines/{mine_id}/analytics")
            self.assertEqual(res.status_code, 200)
            analytics = res.json()
            self.assertIn("production_history_30d", analytics)
            self.assertIn("forecast_horizon_14d", analytics)
            self.assertEqual(len(analytics["production_history_30d"]), 30)
            self.assertEqual(len(analytics["forecast_horizon_14d"]), 14)

    def test_08_mine_equipment(self):
        for mine_id in self.mine_ids:
            res = self.client.get(f"/api/mines/{mine_id}/equipment")
            self.assertEqual(res.status_code, 200)
            data = res.json()
            self.assertIn("fleet", data)
            self.assertGreater(len(data["fleet"]), 0)

    def test_09_mine_reserve(self):
        for mine_id in self.mine_ids:
            res = self.client.get(f"/api/mines/{mine_id}/reserve")
            self.assertEqual(res.status_code, 200)
            data = res.json()
            self.assertIn("proved_tonnes", data)
            self.assertIn("prospectivity_assessment", data)

    def test_10_mine_trust(self):
        for mine_id in self.mine_ids:
            res = self.client.get(f"/api/mines/{mine_id}/trust")
            self.assertEqual(res.status_code, 200)
            data = res.json()
            self.assertIn("composite_score", data)
            self.assertIn("pillars", data)
            self.assertEqual(len(data["pillars"]), 5)

    # 4. ML Prediction Endpoints
    def test_11_shortfall_predict(self):
        payload = {
            "mine_id": "balaghat",
            "planned_tonnage": 6200,
            "rainfall_mm": 92.5,
            "crusher_utilization": 54.0,
            "fleet_availability": 65.0
        }
        res = self.client.post("/api/alert/predict", json=payload)
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertEqual(data["metadata"]["mine_id"], "balaghat")
        self.assertEqual(data["metadata"]["mode"], "ML_INFERENCE")
        self.assertIn("shortfall_probability", data["prediction"])
        self.assertIn("predicted_production", data["prediction"])

    def test_12_reserve_predict(self):
        payload = {
            "mine_id": "balaghat",
            "depth_m": 160,
            "mn_grade": 45.6,
            "assay_confidence": 0.94
        }
        res = self.client.post("/api/reserve/predict", json=payload)
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertEqual(data["metadata"]["mode"], "ML_INFERENCE")
        self.assertIn("prospectivity_score", data["prediction"])
        self.assertIn("unfc_category", data["prediction"])

    def test_13_equipment_predict(self):
        payload = {
            "mine_id": "balaghat",
            "asset_id": "CR-BAL-01",
            "operating_hours": 3400,
            "vibration_rms": 4.8,
            "engine_temperature": 94.0
        }
        res = self.client.post("/api/equipment/predict", json=payload)
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertEqual(data["metadata"]["mode"], "ML_INFERENCE")
        self.assertIn("failure_probability", data["prediction"])
        self.assertIn("health_score", data["prediction"])
        self.assertIn("estimated_RUL_hours", data["prediction"])

    def test_14_anomaly_detect(self):
        payload = {
            "mine_id": "balaghat",
            "rainfall_mm": 95.0,
            "vibration_rms": 5.2,
            "engine_temperature": 98.0
        }
        res = self.client.post("/api/anomaly/detect", json=payload)
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertEqual(data["metadata"]["mode"], "ML_INFERENCE")
        self.assertIn("is_anomaly", data["prediction"])
        self.assertIn("anomaly_type", data["prediction"])

    def test_15_protocol_optimize(self):
        payload = {
            "mine_id": "balaghat",
            "scenario_id": "MONSOON",
            "severity": "HIGH"
        }
        res = self.client.post("/api/protocol/optimize", json=payload)
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertIn("primary_protocol", data)
        self.assertIn("pareto_options", data)
        self.assertEqual(len(data["pareto_options"]), 3)

    # 5. Scenario Simulation Suite
    def test_16_scenario_simulations(self):
        scenarios = ["HEAVY_MONSOON", "CRUSHER_SEIZURE", "MULTI_RISK_CRISIS", "BASELINE_RESET"]
        for scen in scenarios:
            for mine_id in ["balaghat", "dongri-buzurg", "ukwa"]:
                payload = {
                    "mine_id": mine_id,
                    "scenario_type": scen,
                    "severity": "HIGH",
                    "time_horizon": "24 HOURS"
                }
                res = self.client.post("/api/scenarios/simulate", json=payload)
                self.assertEqual(res.status_code, 200, f"Scenario {scen} failed on {mine_id}")
                data = res.json()
                self.assertEqual(data["mine_id"], mine_id)
                self.assertEqual(data["scenario_type"], scen)
                self.assertIn("projected_yield_tonnes", data)
                self.assertIn("shortfall_probability", data)
                self.assertIn("recommendation", data)

    def test_17_invalid_scenario_type(self):
        payload = {
            "mine_id": "balaghat",
            "scenario_type": "VOLCANIC_ERUPTION",
            "severity": "HIGH"
        }
        res = self.client.post("/api/scenarios/simulate", json=payload)
        self.assertEqual(res.status_code, 400)
        self.assertTrue("not supported" in res.json()["detail"].lower() or "invalid" in res.json()["detail"].lower())

    # 6. Database Feedback & Audit Logging
    def test_18_operator_feedback_and_audit(self):
        # 1. Post Feedback
        fb_payload = {
            "mine_id": "balaghat",
            "prediction_type": "SHORTFALL",
            "predicted_value": "88% Shortfall Risk",
            "actual_observed_value": "Shift shortfall verified at 820 Tonnes",
            "operator_rating": 5,
            "operator_comment": "Model gave accurate 45-min advance warning for sump pump dispatch.",
            "operator_name": "Er. Anil Verma",
            "shift_id": "SHIFT-A"
        }
        res_fb = self.client.post("/api/feedback", json=fb_payload)
        self.assertEqual(res_fb.status_code, 200)
        self.assertEqual(res_fb.json()["status"], "FEEDBACK_STORED")

        # 2. Get Feedback List
        res_list = self.client.get("/api/feedback")
        self.assertEqual(res_list.status_code, 200)
        self.assertGreater(len(res_list.json()), 0)

        # 3. Post Audit Decision
        audit_payload = {
            "decision_id": "LOG-TEST-2026-001",
            "mine_id": "balaghat",
            "operator_decision": "APPROVED",
            "operator_name": "Er. Anil Verma",
            "scenario_type": "HEAVY_MONSOON",
            "severity": "HIGH",
            "detected_signal": "Precipitation 92mm",
            "prediction_summary": "Shortfall Risk 88%",
            "action_id": "PROTO-BAL-01",
            "action_title": "Dynamic Dewatering Dispatch",
            "operator_role": "Shift Controller",
            "operator_notes": "Authorized emergency pump deployment.",
            "realized_impact": "+820 T Protected"
        }
        res_audit = self.client.post("/api/feedback/decision", json=audit_payload)
        self.assertEqual(res_audit.status_code, 200)
        self.assertEqual(res_audit.json()["status"], "RECORDED")

        # 4. Get Audit Decisions List
        res_audit_list = self.client.get("/api/feedback/decisions")
        self.assertEqual(res_audit_list.status_code, 200)
        self.assertGreater(len(res_audit_list.json()), 0)

if __name__ == "__main__":
    unittest.main()
