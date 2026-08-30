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
                "protected_tonnes": int(loss_tonnes * 0.45),
                "expected_downtime": "3.2 Hours",
                "operational_impact": "Recovers partial volume but residual bottleneck remains.",
                "confidence": "91.2%",
                "cost_estimate": "₹24,000 / shift",
                "roi": "3.8x",
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
                "cost_estimate": "₹42,000 / shift",
                "roi": "9.4x (₹8.2L Value Protected)",
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
                "roi": "9.4x (High Assurance)",
                "priority": "CRITICAL DISPATCH"
            },
            "pareto_options": pareto_options,
            "audit_trace_id": f"DGMS-TRACE-{mine['shortName'].upper()[:4]}-2026"
        }

protocol_service = ProtocolService()
