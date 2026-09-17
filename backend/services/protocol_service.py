from typing import Dict, Any, List
from .mine_service import mine_service
from ..utils.validation import normalize_mine_id

class ProtocolService:
    @staticmethod
    def optimize_protocol(data: Dict[str, Any]) -> Dict[str, Any]:
        mine_id = normalize_mine_id(data.get("mine_id", "balaghat"))
        mine = mine_service.get_mine_by_id(mine_id)
        
        scenario = data.get("scenario_id", "MONSOON")
        target_t = mine["productionTarget"]
        pfx = (mine["shortName"] or "MIN")[:3].upper()
        
        if scenario == "CRUSHER" or scenario == "CRUSHER_SEIZURE":
            proto_id = f"PROTO-{pfx}-02"
            proto_title = f"{mine['shortName']} Crusher Feed Balancing & Parallel Screening Bypass"
            proto_desc = f"Throttles primary jaw crusher from {mine['crusherCapacityTPH']} TPH to {int(mine['crusherCapacityTPH']*0.7)} TPH + engages mobile screen bypass to suppress 42Hz bearing harmonic."
            protected_yield = int(target_t * 0.16)
            loss_tonnes = int(target_t * 0.18)
        else:
            proto_id = f"PROTO-{pfx}-01"
            proto_title = f"{mine['shortName']} Dynamic Dewatering & Dual-Corridor Haulage Re-route"
            proto_desc = f"Engages auxiliary submersible pump matrix ({mine['waterTableDepth']}) + diverts {max(2, int(mine['fleetCount']*0.25))} heavy haul dumpers to Western high-ground corridor."
            protected_yield = int(target_t * 0.18)
            loss_tonnes = int(target_t * 0.22)

        # Transparent economic valuation parameters (explicit formulas & disclosed assumptions)
        assumed_ore_value_per_t = 8500  # INR per tonne benchmark (labeled DEMO_ASSUMPTION)
        cost_b = 24000
        cost_c = max(22000, int(mine["productionTarget"] * 7.0))  # Scales with mine production scale

        protected_tonnes_b = int(loss_tonnes * 0.45)
        gross_val_b = protected_tonnes_b * assumed_ore_value_per_t
        roi_b = round(gross_val_b / max(1, cost_b), 1)

        gross_val_c = protected_yield * assumed_ore_value_per_t
        roi_c = round(gross_val_c / max(1, cost_c), 1)

        pareto_options = [
            {
                "id": "OPT-A",
                "title": "OPTION A: Status Quo (Unmitigated)",
                "description": "Maintain standard single-line shift operations without automated dispatch intervention.",
                "expected_loss_pct": "-22.5%",
                "expected_loss_tonnes": loss_tonnes,
                "protected_tonnes": 0,
                "expected_downtime": "6.0 Hours",
                "operational_impact": "Full production shortfall and potential asset strain.",
                "confidence": "97.0%",
                "cost_estimate": "₹0 Initial (High Deficit)",
                "roi": "0.0x",
                "is_ai_recommended": False
            },
            {
                "id": "OPT-B",
                "title": "OPTION B: Partial Manual Mitigation",
                "description": "Manual operator intervention on isolated subsystem without cross-circuit optimization.",
                "expected_loss_pct": "-12.0%",
                "expected_loss_tonnes": int(loss_tonnes * 0.55),
                "protected_tonnes": protected_tonnes_b,
                "expected_downtime": "3.2 Hours",
                "operational_impact": "Recovers partial volume but residual bottleneck remains.",
                "confidence": "91.2%",
                "cost_estimate": f"₹{cost_b:,} / shift",
                "roi": f"{roi_b:.1f}x (₹{gross_val_b / 100000:.1f}L Protected)",
                "is_ai_recommended": False
            },
            {
                "id": "OPT-C",
                "title": "OPTION C: Multi-Vector Algorithmic Prescription",
                "description": f"Integrated countermeasure: auxiliary capacity + flow balancing + {mine['stockpileBufferT']}T buffer drawdown.",
                "expected_loss_pct": "-2.8%",
                "expected_loss_tonnes": int(loss_tonnes * 0.12),
                "protected_tonnes": protected_yield,
                "expected_downtime": "1.2 Hours",
                "operational_impact": "Maintains 97%+ scheduled throughput and prevents equipment failure.",
                "confidence": "95.4%",
                "cost_estimate": f"₹{cost_c:,} / shift",
                "roi": f"{roi_c:.1f}x (₹{gross_val_c / 100000:.1f}L Value Protected)",
                "is_ai_recommended": True
            }
        ]

        return {
            "mine_id": mine["id"],
            "mine_name": mine["name"],
            "primary_protocol": {
                "id": proto_id,
                "title": proto_title,
                "description": proto_desc,
                "expected_recovery": f"+{protected_yield:,} T/day Protected Yield",
                "roi": f"{roi_c:.1f}x (Assumed ₹{assumed_ore_value_per_t:,}/T)",
                "priority": "CRITICAL DISPATCH"
            },
            "pareto_options": pareto_options,
            "economic_valuation": {
                "calculation_basis": "Gross Value Protected = protected_tonnes * assumed_ore_value_per_tonne; Net ROI = Gross Value / Mitigation Cost",
                "assumed_ore_value_inr_per_tonne": assumed_ore_value_per_t,
                "data_provenance": "DEMO_ASSUMPTION (MOIL high-grade Mn benchmark)",
                "protected_tonnes_opt_c": protected_yield,
                "gross_value_protected_inr": gross_val_c,
                "mitigation_cost_inr": cost_c,
                "net_benefit_inr": gross_val_c - cost_c
            },
            "audit_trace_id": f"DGMS-TRACE-{mine['shortName'].upper()[:4]}-2026"
        }

protocol_service = ProtocolService()
