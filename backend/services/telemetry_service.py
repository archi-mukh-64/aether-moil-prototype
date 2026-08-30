from datetime import datetime, timezone
from typing import Dict, Any, List
from .mine_service import mine_service
from ..utils.validation import normalize_mine_id

class TelemetryService:
    @staticmethod
    def get_mine_telemetry(mine_id: str) -> Dict[str, Any]:
        mine = mine_service.get_mine_by_id(mine_id)
        ts = datetime.now(timezone.utc).isoformat()
        
        sensor_nodes = [
            {
                "node_id": f"SN-{mine['shortName'].upper()[:3]}-01",
                "parameter": "Deep Sump Piezometer",
                "value": f"{mine['drainageBaselineM3h']} m³/h",
                "status": "NOMINAL",
                "location": mine["waterTableDepth"]
            },
            {
                "node_id": f"SN-{mine['shortName'].upper()[:3]}-02",
                "parameter": "Primary Crusher Vibration",
                "value": f"{mine['crusherVibBase']} mm/s",
                "status": "NOMINAL",
                "location": "Surface Crushing Hopper"
            },
            {
                "node_id": f"SN-{mine['shortName'].upper()[:3]}-03",
                "parameter": "Primary Crusher Temperature",
                "value": f"{mine['crusherTempBase']}°C",
                "status": "NOMINAL",
                "location": "Main Drive Bearing"
            },
            {
                "node_id": f"SN-{mine['shortName'].upper()[:3]}-04",
                "parameter": "Continuous Assay XRF",
                "value": f"{mine['baseGradeNum']}% Mn",
                "status": "NOMINAL",
                "location": "ROM Discharge Chute"
            },
            {
                "node_id": f"SN-{mine['shortName'].upper()[:3]}-05",
                "parameter": "Slope Stability Radar",
                "value": "FoS 1.84 (Displacement: 0.22mm)",
                "status": "NOMINAL",
                "location": "Highwall Bench Sector 4"
            }
        ]

        return {
            "mine_id": mine["id"],
            "mine_name": mine["name"],
            "timestamp": ts,
            "shift": "SHIFT-A (06:00 - 14:00)",
            "rainfall_mm": 12.5,
            "sump_inflow_m3h": mine["drainageBaselineM3h"],
            "crusher_vibration_mms": mine["crusherVibBase"],
            "crusher_temperature_c": mine["crusherTempBase"],
            "crusher_utilization_pct": 86.4,
            "fleet_availability_pct": mine["fleetAvailabilityBase"],
            "grade_mn_pct": mine["baseGradeNum"],
            "silica_sio2_pct": 8.4,
            "water_table_depth": mine["waterTableDepth"],
            "active_fleet_status": f"{int(mine['fleetCount'] * (mine['fleetAvailabilityBase']/100))}/{mine['fleetCount']} Units Online",
            "hoist_status": "Cycle #184 Nominal Throughput",
            "sensor_nodes": sensor_nodes
        }

telemetry_service = TelemetryService()
