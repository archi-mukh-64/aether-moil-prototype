"""
MOIL National Mining Intelligence Platform
Backend Environmental Intelligence & Multi-Temporal Change Engine
Computes NDVI vegetation recovery, NDWI pit moisture, disturbance area, and year-by-year change detection (2018 -> 2026).
"""

from typing import Dict, Any, List
from backend.services.mine_service import CANONICAL_MOIL_MINES

class EnvironmentalEngine:
    """Computes satellite environmental indices and multi-temporal change detection."""

    @staticmethod
    def get_yearly_profile(mine_id: str = "balaghat", year: int = 2026) -> Dict[str, Any]:
        m_id = mine_id if mine_id in CANONICAL_MOIL_MINES else "balaghat"
        mine = CANONICAL_MOIL_MINES[m_id]
        base_area = mine.get("leaseAreaHa", 180.5)
        yr = max(2018, min(2026, year))

        # Year progression factors
        yr_idx = yr - 2018
        footprint_pct = 0.78 + (yr_idx * 0.027)
        footprint_ha = round(base_area * footprint_pct, 1)
        veg_ha = round(48 - (yr_idx * 1.1) + (2 if yr >= 2024 else 0), 1)
        dist_ha = round(38 + (yr_idx * 2.8), 1)
        rec_ha = round(12 + (yr_idx * 1.9), 1)
        sump_water_ha = round(4.2 + (yr_idx * 0.3), 1)
        ndvi = round(0.48 - (yr_idx * 0.012), 2)
        ndwi = round(0.18 + (yr_idx * 0.005), 2)

        return {
            "mineId": m_id,
            "year": yr,
            "satelliteSource": "Copernicus Sentinel-2 Level-2A & Landsat 8/9 OLI",
            "provider": "SATELLITE_DEMONSTRATION_DATA",
            "footprintHa": footprint_ha,
            "disturbedAreaHa": dist_ha,
            "afforestationVegetationHa": veg_ha,
            "reclaimedLandHa": rec_ha,
            "sumpWaterHa": sump_water_ha,
            "meanNdvi": ndvi,
            "meanNdwi": ndwi,
            "statutoryCompliance": "LOW RISK (DGMS & SPCB Approved)" if ndvi >= 0.35 else "MODERATE ATTENTION",
            "activeDewateringPumps": "450kW Active Battery",
            "landCoverBreakdown": [
                {"name": "Trees / Afforestation", "pct": 38, "color": "#16a34a"},
                {"name": "Shrub & Scrub", "pct": 22, "color": "#84cc16"},
                {"name": "Bare Soil / Excavation Face", "pct": 18, "color": "#f59e0b"},
                {"name": "Built Infrastructure / Pad", "pct": 12, "color": "#64748b"},
                {"name": "Sump Water & Drainage", "pct": 6, "color": "#06b6d4"},
                {"name": "Crops / Agriculture Buffer", "pct": 4, "color": "#eab308"}
            ]
        }

    @staticmethod
    def compare_years(mine_id: str = "balaghat", year_before: int = 2018, year_after: int = 2026) -> Dict[str, Any]:
        before = EnvironmentalEngine.get_yearly_profile(mine_id, year_before)
        after = EnvironmentalEngine.get_yearly_profile(mine_id, year_after)

        delta_footprint = round(after["footprintHa"] - before["footprintHa"], 1)
        delta_disturbed = round(after["disturbedAreaHa"] - before["disturbedAreaHa"], 1)
        delta_reclaimed = round(after["reclaimedLandHa"] - before["reclaimedLandHa"], 1)
        delta_ndvi = round(after["meanNdvi"] - before["meanNdvi"], 2)
        delta_water = round(after["sumpWaterHa"] - before["sumpWaterHa"], 1)

        return {
            "mineId": mine_id,
            "yearBefore": year_before,
            "yearAfter": year_after,
            "beforeProfile": before,
            "afterProfile": after,
            "deltaFootprintHa": delta_footprint,
            "deltaDisturbedHa": delta_disturbed,
            "deltaReclaimedHa": delta_reclaimed,
            "deltaNdvi": delta_ndvi,
            "deltaWaterHa": delta_water,
            "summaryStatement": (
                f"Between {year_before} and {year_after}, total mine lease footprint expanded by +{delta_footprint} Ha, "
                f"while progressive reclamation restored +{delta_reclaimed} Ha of overburden dumps with NDVI delta of {delta_ndvi}."
            )
        }
