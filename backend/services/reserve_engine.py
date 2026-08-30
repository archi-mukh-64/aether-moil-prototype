"""
MOIL National Mining Intelligence Platform
Backend UNFC Reserve Evolution & Spatial Confidence Grid Engine
"""

from typing import Dict, Any, List
from backend.services.mine_service import CANONICAL_MOIL_MINES

class ReserveEngine:
    """Computes UNFC mineral inventory progression and spatial block confidence."""

    @staticmethod
    def get_reserve_evolution(mine_id: str = "balaghat") -> List[Dict[str, Any]]:
        m_id = mine_id if mine_id in CANONICAL_MOIL_MINES else "balaghat"
        mine = CANONICAL_MOIL_MINES[m_id]
        total_est = 14.8 if "111" in mine.get("unfcStatus", "") else 8.6

        return [
            {"step": "1. Initial Geological Resource", "value": round(total_est + 6.2, 1), "fill": "#64748b", "desc": "Original pre-mining in-situ resource"},
            {"step": "2. Cumulative Extraction Extracted", "value": -6.2, "fill": "#ef4444", "desc": "Historical mining depletion to date"},
            {"step": "3. Current Proved Reserve (UNFC-111)", "value": total_est, "fill": "#10b981", "desc": "Statutory DGMS proved commercial reserve"},
            {"step": "4. Satellite-Supported Potential", "value": 3.4, "fill": "#38bdf8", "desc": "SWIR 2.19µm strike alteration anomaly addition"},
            {"step": "5. AI-Projected Deep Expansion", "value": 4.8, "fill": "#f59e0b", "desc": "Deep borehole continuation horizon (-240m to -350m)"},
            {"step": "6. Total Resource Horizon", "value": round(total_est + 3.4 + 4.8, 1), "fill": "#8b5cf6", "desc": "Combined potential asset life horizon"}
        ]

    @staticmethod
    def get_confidence_grid(mine_id: str = "balaghat", model_stance: str = "BALANCED", data_density: str = "HIGH") -> List[Dict[str, Any]]:
        m_id = mine_id if mine_id in CANONICAL_MOIL_MINES else "balaghat"
        mine = CANONICAL_MOIL_MINES[m_id]
        base_grade = mine.get("baseGradeNum", 42.0)

        stance_mult = 0.92 if model_stance == "CONSERVATIVE" else 1.05 if model_stance == "AGGRESSIVE" else 1.0
        density_bonus = 6 if data_density == "HIGH" else -8 if data_density == "LOW" else 0

        blocks = []
        for r in range(1, 5):
            for c in range(1, 7):
                b_id = f"B-{(r - 1) * 6 + c}"
                base_conf = min(98, max(45, int((70 + ((r * 7 + c * 11) % 25) + density_bonus) * stance_mult)))
                grade = round(base_grade - 2.5 + ((r * 3 + c * 5) % 6.5), 1)
                uncert = round(1.8 + ((r + c) % 3.2), 1)
                drill_holes = max(1, (r + c) % 5)
                level = "HIGH" if base_conf >= 85 else "MEDIUM" if base_conf >= 70 else "LOW"

                blocks.append({
                    "id": b_id,
                    "row": r,
                    "col": c,
                    "conf": base_conf,
                    "grade": grade,
                    "uncert": uncert,
                    "drillHoles": drill_holes,
                    "level": level,
                    "satSupport": "HIGH" if base_conf > 80 else "MEDIUM",
                    "geoSupport": "HIGH" if base_conf > 75 else "MODERATE"
                })

        return blocks
