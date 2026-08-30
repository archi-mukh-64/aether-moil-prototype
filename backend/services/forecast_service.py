import math
from datetime import datetime, timedelta, timezone
from typing import Dict, Any, List, Optional
from backend.services.mine_service import mine_service, CANONICAL_MOIL_MINES
from backend.schemas.forecast import ForecastRequest, ForecastResponse, DailyForecastPoint, ForecastDriver, ScenarioTrajectory

SCENARIO_DEFAULTS = {
    "BASELINE": {
        "rainfall": 12.5, "crusher": 90.0, "fleet": 88.0, "haul_eff": 92.0, "sump": 120.0, "pump": 95.0, "eq_health": 92.0
    },
    "HEAVY_MONSOON": {
        "rainfall": 95.0, "crusher": 75.0, "fleet": 70.0, "haul_eff": 48.0, "sump": 520.0, "pump": 85.0, "eq_health": 78.0
    },
    "CRUSHER_SEIZURE": {
        "rainfall": 15.0, "crusher": 28.0, "fleet": 78.0, "haul_eff": 88.0, "sump": 140.0, "pump": 95.0, "eq_health": 42.0
    },
    "CRUSHER_CONSTRAINT": {
        "rainfall": 15.0, "crusher": 35.0, "fleet": 80.0, "haul_eff": 88.0, "sump": 140.0, "pump": 95.0, "eq_health": 48.0
    },
    "MULTI_RISK": {
        "rainfall": 110.0, "crusher": 35.0, "fleet": 55.0, "haul_eff": 40.0, "sump": 680.0, "pump": 60.0, "eq_health": 50.0
    }
}

MINE_PHYSICAL_PROFILES = {
    "balaghat": {
        "targetTpd": 6200, "actualD1Tpd": 6140, "mineType": "Underground Deep Shaft",
        "keyInfrastructure": "Holmes & Bharveli Shafts (-185m Level)",
        "waveA": 0.016, "waveB": 0.008, "tau": 7.0, "lambda": 3.5, "phi": 1.0, "psi": 2.0,
        "rainSens": 1.35, "catchmentExposure": 1.15, "haulDistKm": 2.8, "roadGradeFactor": 1.05,
        "crusherHealthBase": 88, "crusherDependency": 0.78, "fleetAvailBase": 91.5,
        "maxDrainageM3h": 45.0, "headPressureFactor": 1.25, "stockpileBufferT": 850, "stockpileDampening": 0.20,
        "baseUncertainty": 0.020, "volatilityDrift": 0.025, "vulnCategory": "Deep Shaft Ingress & Skip Hoisting",
        "protocolCode": "PROTO-BLG-01"
    },
    "dongri-buzurg": {
        "targetTpd": 5400, "actualD1Tpd": 5320, "mineType": "Opencast Massive Semi-Mechanized",
        "keyInfrastructure": "East Bench Pit Highwall (3.2 km Ramp)",
        "waveA": 0.034, "waveB": 0.016, "tau": 5.0, "lambda": 2.5, "phi": 2.0, "psi": 1.0,
        "rainSens": 1.55, "catchmentExposure": 1.45, "haulDistKm": 3.2, "roadGradeFactor": 1.35,
        "crusherHealthBase": 85, "crusherDependency": 0.74, "fleetAvailBase": 89.0,
        "maxDrainageM3h": 42.0, "headPressureFactor": 0.95, "stockpileBufferT": 920, "stockpileDampening": 0.24,
        "baseUncertainty": 0.032, "volatilityDrift": 0.038, "vulnCategory": "Opencast Mud Slick & Ramp Traction",
        "protocolCode": "PROTO-DBG-04"
    },
    "chikla": {
        "targetTpd": 4100, "actualD1Tpd": 4050, "mineType": "Underground Incline & Shaft",
        "keyInfrastructure": "Main Incline (-120m Level)",
        "waveA": 0.022, "waveB": 0.010, "tau": 6.0, "lambda": 3.0, "phi": 3.0, "psi": 0.0,
        "rainSens": 1.20, "catchmentExposure": 1.05, "haulDistKm": 2.1, "roadGradeFactor": 1.00,
        "crusherHealthBase": 90, "crusherDependency": 0.72, "fleetAvailBase": 90.5,
        "maxDrainageM3h": 28.0, "headPressureFactor": 1.10, "stockpileBufferT": 650, "stockpileDampening": 0.18,
        "baseUncertainty": 0.022, "volatilityDrift": 0.026, "vulnCategory": "Incline Winch & Sump Balancing",
        "protocolCode": "PROTO-CHK-02"
    },
    "gumgaon": {
        "targetTpd": 3400, "actualD1Tpd": 3360, "mineType": "Underground Deep Shaft",
        "keyInfrastructure": "Vertical Shaft & Fault Sump (-160m Level)",
        "waveA": 0.026, "waveB": 0.012, "tau": 4.0, "lambda": 2.0, "phi": 0.0, "psi": 3.0,
        "rainSens": 1.25, "catchmentExposure": 1.10, "haulDistKm": 2.4, "roadGradeFactor": 1.10,
        "crusherHealthBase": 88, "crusherDependency": 0.75, "fleetAvailBase": 87.0,
        "maxDrainageM3h": 30.0, "headPressureFactor": 1.20, "stockpileBufferT": 540, "stockpileDampening": 0.16,
        "baseUncertainty": 0.024, "volatilityDrift": 0.028, "vulnCategory": "Fractured Schist Hydro-Inflow",
        "protocolCode": "PROTO-GMG-03"
    },
    "tirodi": {
        "targetTpd": 3100, "actualD1Tpd": 3040, "mineType": "Opencast & Incline Shaft",
        "keyInfrastructure": "North Opencast Benches (-92m Pit Sump)",
        "waveA": 0.032, "waveB": 0.015, "tau": 5.0, "lambda": 2.5, "phi": 4.0, "psi": 2.0,
        "rainSens": 1.45, "catchmentExposure": 1.30, "haulDistKm": 1.9, "roadGradeFactor": 1.25,
        "crusherHealthBase": 82, "crusherDependency": 0.70, "fleetAvailBase": 88.5,
        "maxDrainageM3h": 24.0, "headPressureFactor": 0.90, "stockpileBufferT": 480, "stockpileDampening": 0.15,
        "baseUncertainty": 0.030, "volatilityDrift": 0.035, "vulnCategory": "Bench Slurry Runoff & Tyre Wear",
        "protocolCode": "PROTO-TRD-01"
    },
    "kandri": {
        "targetTpd": 2800, "actualD1Tpd": 2760, "mineType": "Opencast to Underground Transition",
        "keyInfrastructure": "Kandri Deep Adit Portal (-110m Level)",
        "waveA": 0.020, "waveB": 0.009, "tau": 6.0, "lambda": 3.0, "phi": 1.0, "psi": 4.0,
        "rainSens": 1.15, "catchmentExposure": 1.00, "haulDistKm": 1.7, "roadGradeFactor": 0.95,
        "crusherHealthBase": 86, "crusherDependency": 0.68, "fleetAvailBase": 86.5,
        "maxDrainageM3h": 22.0, "headPressureFactor": 1.05, "stockpileBufferT": 420, "stockpileDampening": 0.15,
        "baseUncertainty": 0.020, "volatilityDrift": 0.024, "vulnCategory": "High-Grade Ore Protection Priority",
        "protocolCode": "PROTO-KND-02"
    },
    "munsar": {
        "targetTpd": 2400, "actualD1Tpd": 2350, "mineType": "Opencast & Underground Shaft",
        "keyInfrastructure": "Munsar Shaft & Central Incline (-85m Level)",
        "waveA": 0.028, "waveB": 0.012, "tau": 4.0, "lambda": 2.0, "phi": 2.0, "psi": 1.0,
        "rainSens": 1.10, "catchmentExposure": 0.95, "haulDistKm": 1.5, "roadGradeFactor": 0.90,
        "crusherHealthBase": 84, "crusherDependency": 0.65, "fleetAvailBase": 85.0,
        "maxDrainageM3h": 20.0, "headPressureFactor": 0.90, "stockpileBufferT": 390, "stockpileDampening": 0.14,
        "baseUncertainty": 0.025, "volatilityDrift": 0.028, "vulnCategory": "Siliceous Ore Jaw Abrasiveness",
        "protocolCode": "PROTO-MNR-01"
    },
    "bhandara": {
        "targetTpd": 1950, "actualD1Tpd": 1910, "mineType": "Underground Incline",
        "keyInfrastructure": "Bhandara East Incline Drift (-70m Level)",
        "waveA": 0.030, "waveB": 0.014, "tau": 3.0, "lambda": 1.5, "phi": 0.0, "psi": 2.0,
        "rainSens": 1.00, "catchmentExposure": 0.85, "haulDistKm": 1.4, "roadGradeFactor": 0.88,
        "crusherHealthBase": 80, "crusherDependency": 0.60, "fleetAvailBase": 84.0,
        "maxDrainageM3h": 18.0, "headPressureFactor": 0.85, "stockpileBufferT": 310, "stockpileDampening": 0.12,
        "baseUncertainty": 0.028, "volatilityDrift": 0.032, "vulnCategory": "Narrow Vein Extraction & Winch Lag",
        "protocolCode": "PROTO-BHD-01"
    },
    "ukwa": {
        "targetTpd": 1850, "actualD1Tpd": 1820, "mineType": "Underground Drift & Adit",
        "keyInfrastructure": "Ukwa Long Adit Level 4 (Gravity Drainage)",
        "waveA": 0.014, "waveB": 0.006, "tau": 8.0, "lambda": 4.0, "phi": 5.0, "psi": 3.0,
        "rainSens": 0.95, "catchmentExposure": 0.70, "haulDistKm": 1.2, "roadGradeFactor": 0.80,
        "crusherHealthBase": 92, "crusherDependency": 0.50, "fleetAvailBase": 91.0,
        "maxDrainageM3h": 16.0, "headPressureFactor": 0.75, "stockpileBufferT": 290, "stockpileDampening": 0.10,
        "baseUncertainty": 0.015, "volatilityDrift": 0.018, "vulnCategory": "Continuous Belt Conveyor Continuity",
        "protocolCode": "PROTO-UKW-01"
    },
    "ramtek": {
        "targetTpd": 1600, "actualD1Tpd": 1570, "mineType": "Opencast Exploratory Bench",
        "keyInfrastructure": "Ramtek South Shallow Quarry (-50m Level)",
        "waveA": 0.036, "waveB": 0.018, "tau": 4.0, "lambda": 2.0, "phi": 3.0, "psi": 1.0,
        "rainSens": 0.90, "catchmentExposure": 0.80, "haulDistKm": 1.1, "roadGradeFactor": 0.85,
        "crusherHealthBase": 82, "crusherDependency": 0.48, "fleetAvailBase": 83.0,
        "maxDrainageM3h": 14.0, "headPressureFactor": 0.70, "stockpileBufferT": 250, "stockpileDampening": 0.10,
        "baseUncertainty": 0.034, "volatilityDrift": 0.040, "vulnCategory": "Contract Hauler Roster Variance",
        "protocolCode": "PROTO-RAM-01"
    }
}

class ForecastService:
    @staticmethod
    def calculate_14_day_forecast(req: ForecastRequest, include_comparisons: bool = True) -> Dict[str, Any]:
        norm_id = (req.mine_id or "balaghat").lower().replace("_", "-")
        phys = MINE_PHYSICAL_PROFILES.get(norm_id, MINE_PHYSICAL_PROFILES["balaghat"])
        canonical_mine = CANONICAL_MOIL_MINES.get(norm_id, CANONICAL_MOIL_MINES.get("balaghat", {}))
        
        target = float(phys["targetTpd"])
        rainfall_sens = float(phys["rainSens"])
        base_grade = canonical_mine.get("oreGrade") or "44.2% Mn"
        base_crusher_health = float(phys["crusherHealthBase"])
        base_fleet_avail = float(phys["fleetAvailBase"])
        haul_dist_km = float(phys["haulDistKm"])
        buffer_stockpile_t = float(phys["stockpileBufferT"])
        mine_name = canonical_mine.get("name", norm_id.capitalize())

        raw_scen = (req.scenario_id or "BASELINE").upper().strip()
        scen_alias_map = {
            "MONSOON": "HEAVY_MONSOON",
            "HEAVY_MONSOON": "HEAVY_MONSOON",
            "MONSOON_INFLUX": "HEAVY_MONSOON",
            "CRUSHER": "CRUSHER_SEIZURE",
            "CRUSHER_SEIZURE": "CRUSHER_SEIZURE",
            "CRUSHER_CONSTRAINT": "CRUSHER_CONSTRAINT",
            "CRUSHER_FAILURE": "CRUSHER_SEIZURE",
            "MULTI_RISK": "MULTI_RISK",
            "MULTI_RISK_CRISIS": "MULTI_RISK",
            "CRISIS": "MULTI_RISK",
            "BASELINE": "BASELINE",
            "BASELINE_RESET": "BASELINE",
            "NOMINAL": "BASELINE"
        }
        scen_key = scen_alias_map.get(raw_scen, "BASELINE")
        defaults = SCENARIO_DEFAULTS.get(scen_key, SCENARIO_DEFAULTS["BASELINE"])

        rainfall = req.rainfall_mm if req.rainfall_mm is not None else defaults["rainfall"]
        crusher = req.crusher_availability_pct if req.crusher_availability_pct is not None else defaults["crusher"]
        fleet = req.fleet_availability_pct if req.fleet_availability_pct is not None else defaults["fleet"]
        haul_eff = req.haul_efficiency_pct if req.haul_efficiency_pct is not None else defaults["haul_eff"]
        sump_inflow = req.sump_inflow_rate if req.sump_inflow_rate is not None else defaults["sump"]
        pump = req.pump_capacity_pct if req.pump_capacity_pct is not None else defaults["pump"]
        eq_health = req.equipment_health_index if req.equipment_health_index is not None else defaults["eq_health"]

        base_date = datetime.now(timezone.utc)
        forecast_points = []
        total_shortfall_tonnes = 0.0
        worst_point = None
        recovery_day_idx = None

        sum_rain_loss = 0.0
        sum_haul_loss = 0.0
        sum_crusher_loss = 0.0
        sum_fleet_loss = 0.0
        sum_sump_loss = 0.0
        sum_stockpile_gain = 0.0

        for d in range(1, 15):
            cur_date = base_date + timedelta(days=(d - 1))
            date_str = cur_date.strftime("%d %b")

            day_rain_mult = 1.0
            day_haul_mult = 1.0
            day_crusher_mult = 1.0
            day_fleet_mult = 1.0
            day_sump_mult = 1.0
            event_marker = "NORMAL"
            main_driver = "Nominal Quota Operations"

            if scen_key == "BASELINE":
                day_rain_mult = 0.85 + 0.15 * math.sin(d * 0.5)
                event_marker = "NOMINAL QUOTA STABILITY"
                main_driver = f"{mine_name} Baseline Shift Rotation"
            elif scen_key == "HEAVY_MONSOON":
                if d <= 2:
                    day_rain_mult = 0.25
                    day_haul_mult = 0.95
                    day_sump_mult = 0.35
                    event_marker = "PRE-MONSOON ONSET"
                    main_driver = "Catchment Cloud Influx"
                elif d == 3:
                    day_rain_mult = 0.70
                    day_haul_mult = 0.78
                    day_sump_mult = 0.75
                    event_marker = "PRECIPITATION INTENSIFICATION"
                    main_driver = "Haul Ramp Surface Softening"
                elif 4 <= d <= 6:
                    day_rain_mult = 1.30
                    day_haul_mult = 0.44
                    day_sump_mult = 1.40
                    day_fleet_mult = 0.70
                    day_crusher_mult = 0.80
                    event_marker = "PEAK MONSOON INUNDATION & HAUL SLIP"
                    main_driver = f"Heavy Catchment Storm ({phys['keyInfrastructure']})"
                elif 7 <= d <= 9:
                    day_rain_mult = 0.50
                    day_haul_mult = 0.68
                    day_sump_mult = 0.80
                    day_fleet_mult = 0.84
                    day_crusher_mult = 0.90
                    event_marker = "AUXILIARY DEWATERING ENGAGED"
                    main_driver = f"Pumping Head Active ({phys['maxDrainageM3h']} m³/h Battery)"
                elif 10 <= d <= 12:
                    day_rain_mult = 0.20
                    day_haul_mult = 0.86
                    day_sump_mult = 0.40
                    day_fleet_mult = 0.92
                    day_crusher_mult = 0.96
                    event_marker = "ROAD RE-GRADING & CLEARANCE"
                    main_driver = "Haul Traction Restoring"
                else:
                    day_rain_mult = 0.15
                    day_haul_mult = 0.95
                    day_sump_mult = 0.25
                    day_fleet_mult = 0.98
                    day_crusher_mult = 1.0
                    event_marker = "STABILIZED OPERATIONS"
                    main_driver = "Post-Monsoon Baseline Re-stabilization"
            elif scen_key in ["CRUSHER_SEIZURE", "CRUSHER_CONSTRAINT"]:
                if d <= 3:
                    day_crusher_mult = 1.0
                    event_marker = "NOMINAL OPERATIONS"
                    main_driver = "Primary Crusher Circuit Nominal"
                elif d == 4:
                    day_crusher_mult = 0.58
                    event_marker = "BEARING VIBRATION SPIKE & THROTTLE"
                    main_driver = f"Bearing Vibration > 4.8 mm/s on {mine_name} Primary"
                elif d == 5:
                    day_crusher_mult = 0.10
                    event_marker = "CATASTROPHIC BEARING SEIZURE"
                    main_driver = "Drive Bearing Seizure & Circuit Lockout"
                elif 6 <= d <= 8:
                    day_crusher_mult = 0.18
                    event_marker = "EMERGENCY OVERHAUL & SLEEVE MACHINING"
                    main_driver = "Heavy Mechanical Rigging Active"
                elif d == 9:
                    day_crusher_mult = 0.62
                    event_marker = "COLD RUN COMMISSIONING & BALANCING"
                    main_driver = "Unloaded Bearing Run & Dynamic Alignment"
                elif 10 <= d <= 12:
                    day_crusher_mult = 0.88
                    event_marker = "THROUGHPUT RECOVERY RAMP"
                    main_driver = "Paced Feed Rate Re-acceleration"
                else:
                    day_crusher_mult = 1.0
                    event_marker = "FULL CAPACITY RESTORATION"
                    main_driver = "Full Circuit Nominal Output"
            elif scen_key == "MULTI_RISK":
                if d <= 2:
                    day_rain_mult = 0.35
                    day_crusher_mult = 0.90
                    day_haul_mult = 0.90
                    event_marker = "INCUBATING COMPOUNDED RISK"
                    main_driver = "Multi-Vector Warning Signals"
                elif 3 <= d <= 7:
                    day_rain_mult = 1.35
                    day_haul_mult = 0.38
                    day_crusher_mult = 0.18
                    day_fleet_mult = 0.52
                    day_sump_mult = 1.50
                    event_marker = "COMPOUNDED MULTI-VECTOR CRISIS PEAK"
                    main_driver = f"Cascading Flooding, Ramp Slip & Crusher Lockout ({phys['vulnCategory']})"
                elif 8 <= d <= 11:
                    day_rain_mult = 0.65
                    day_haul_mult = 0.65
                    day_crusher_mult = 0.52
                    day_fleet_mult = 0.72
                    day_sump_mult = 0.85
                    event_marker = "EMERGENCY MULTI-FRONT MITIGATION"
                    main_driver = "Auxiliary Pumping & Bypass Haulage"
                else:
                    day_rain_mult = 0.30
                    day_haul_mult = 0.80
                    day_crusher_mult = 0.78
                    day_fleet_mult = 0.86
                    day_sump_mult = 0.45
                    event_marker = "SYSTEM-WIDE PROGRESSIVE RECOVERY"
                    main_driver = "Stabilizing Operating Parameters"

            eff_rain = max(0.0, rainfall * day_rain_mult)
            eff_haul = max(20.0, min(100.0, haul_eff * day_haul_mult))
            eff_crush = max(10.0, min(100.0, crusher * day_crusher_mult))
            eff_flt = max(20.0, min(100.0, fleet * day_fleet_mult))
            eff_inf = max(20.0, sump_inflow * day_sump_mult)
            eff_pmp = max(20.0, pump)
            eff_eq = max(20.0, eq_health)

            rain_loss = target * max(0.0, (eff_rain - 12.5) / 100.0) * 0.28 * rainfall_sens * phys["catchmentExposure"]
            haul_loss = target * max(0.0, (92.0 - eff_haul) / 100.0) * 0.35 * (haul_dist_km / 2.5) * phys["roadGradeFactor"]
            crusher_loss = target * max(0.0, (base_crusher_health - eff_crush) / 100.0) * phys["crusherDependency"]
            fleet_loss = target * max(0.0, (base_fleet_avail - eff_flt) / 100.0) * 0.42
            eq_loss = target * max(0.0, (88.0 - eff_eq) / 100.0) * 0.22

            pump_capacity_m3h = phys["maxDrainageM3h"] * 8.0 * (eff_pmp / 100.0)
            inflow_deficit = max(0.0, (eff_inf * phys["headPressureFactor"]) - pump_capacity_m3h)
            water_loss = target * min(0.40, (inflow_deficit / max(80.0, pump_capacity_m3h)) * 0.38)

            interaction_penalty = (rain_loss + crusher_loss + haul_loss) * 0.18 if scen_key == "MULTI_RISK" else 0.0

            raw_loss = rain_loss + haul_loss + crusher_loss + fleet_loss + water_loss + eq_loss + interaction_penalty
            avail_stockpile = min(buffer_stockpile_t, target * 0.25)
            stockpile_offset = min(avail_stockpile * 0.55, raw_loss * phys["stockpileDampening"])

            net_daily_loss = max(0.0, min(target * 0.88, raw_loss - stockpile_offset))

            sum_rain_loss += rain_loss
            sum_haul_loss += haul_loss
            sum_crusher_loss += crusher_loss
            sum_fleet_loss += fleet_loss
            sum_sump_loss += water_loss
            sum_stockpile_gain += stockpile_offset

            # Deterministic Harmonic Waveform per Mine
            wave_val = target * (
                phys["waveA"] * math.sin((2 * math.pi * (d + phys["phi"])) / phys["tau"]) +
                phys["waveB"] * math.cos((2 * math.pi * (d + phys["psi"])) / phys["lambda"])
            )

            if scen_key == "BASELINE":
                day_yield = round(target - net_daily_loss + wave_val, 1)
            else:
                day_yield = round(max(target * 0.12, target - net_daily_loss + (wave_val * 0.35)), 1)

            if d > 5 and recovery_day_idx is None and day_yield >= target * 0.85:
                recovery_day_idx = d

            sigma = target * (phys["baseUncertainty"] + phys["volatilityDrift"] * math.sqrt(d))
            lower_ci = round(max(0.0, day_yield - 1.96 * sigma), 1)
            upper_ci = round(day_yield + 1.96 * sigma, 1)

            shortfall = round(max(0.0, target - day_yield), 1)
            shortfall_pct = round((shortfall / target) * 100.0, 1)
            total_shortfall_tonnes += shortfall

            risk_lvl = "LOW"
            if shortfall_pct >= 25.0:
                risk_lvl = "CRITICAL"
            elif shortfall_pct >= 14.0:
                risk_lvl = "HIGH"
            elif shortfall_pct >= 6.0:
                risk_lvl = "MODERATE"

            is_hist = (d == 1)
            actual_yield = float(phys["actualD1Tpd"]) if is_hist else None

            point = DailyForecastPoint(
                day_num=d,
                day_label=f"D{d}",
                date=date_str,
                target_tpd=target,
                baseline_tpd=round(target + wave_val, 1),
                predicted_yield_tpd=day_yield,
                lower_ci_tpd=lower_ci,
                upper_ci_tpd=upper_ci,
                shortfall_tpd=shortfall,
                shortfall_pct=shortfall_pct,
                risk_level=risk_lvl,
                main_driver=main_driver,
                event_marker=event_marker,
                rainfall_mm=round(eff_rain, 1),
                crusher_avail_pct=round(eff_crush, 1),
                fleet_avail_pct=round(eff_flt, 1),
                haul_eff_pct=round(eff_haul, 1),
                sump_inflow_m3h=round(eff_inf, 1),
                actual_tpd=actual_yield,
                is_historical=is_hist
            )

            if not worst_point or day_yield < worst_point.predicted_yield_tpd:
                worst_point = point

            forecast_points.append(point)

        avg_predicted = round(sum(p.predicted_yield_tpd for p in forecast_points) / 14.0, 1)
        avg_shortfall = round(total_shortfall_tonnes / 14.0, 1)
        net_impact = round(avg_predicted - target, 1)

        avg_rain_loss = round(sum_rain_loss / 14.0, 1)
        avg_haul_loss = round(sum_haul_loss / 14.0, 1)
        avg_crusher_loss = round(sum_crusher_loss / 14.0, 1)
        avg_fleet_loss = round(sum_fleet_loss / 14.0, 1)
        avg_stockpile_gain = round(sum_stockpile_gain / 14.0, 1)

        drivers = [
            ForecastDriver(
                name="Precipitation & Water Ingress",
                impact_tpd=-avg_rain_loss,
                category="Environmental",
                current_val=f"{rainfall} mm/day",
                baseline_val="12.5 mm/day",
                direction="negative",
                confidence_pct=95.8,
                recommendation=f"Engage {phys['maxDrainageM3h']} m³/h auxiliary submersibles at {phys['keyInfrastructure']}"
            ),
            ForecastDriver(
                name="Haul Road Traction & Slip",
                impact_tpd=-avg_haul_loss,
                category="Logistics",
                current_val=f"{haul_eff}% Traction",
                baseline_val="92.0% Friction",
                direction="negative",
                confidence_pct=93.4,
                recommendation=f"Deploy motor graders & aggregate ballast on {phys['haulDistKm']} km haul gradient"
            ),
            ForecastDriver(
                name="Primary Crusher Circuit",
                impact_tpd=-avg_crusher_loss,
                category="Mechanical",
                current_val=f"{crusher}% Avail",
                baseline_val=f"{base_crusher_health}% Health",
                direction="negative",
                confidence_pct=97.2,
                recommendation=f"Deploy vibration spectrum monitoring on {mine_name} gyratory bearing assembly"
            ),
            ForecastDriver(
                name="Fleet Availability Deficit",
                impact_tpd=-avg_fleet_loss,
                category="Equipment",
                current_val=f"{fleet}% Roster",
                baseline_val=f"{base_fleet_avail}% Base",
                direction="negative",
                confidence_pct=91.0,
                recommendation="Authorize emergency workshop overtime for scheduled preventative overhaul"
            ),
            ForecastDriver(
                name="High-Grade Stockpile Buffer",
                impact_tpd=avg_stockpile_gain,
                category="Buffer Dampening",
                current_val=f"{buffer_stockpile_t} T Buffer",
                baseline_val="Nominal Drawdown",
                direction="positive",
                confidence_pct=98.5,
                recommendation=f"Draw down emergency high-grade stockpile buffer to sustain {mine_name} plant feed rate"
            )
        ]
        drivers.sort(key=lambda d: abs(d.impact_tpd), reverse=True)

        if scen_key == "BASELINE":
            ai_exp = f"{mine_name} ({phys['mineType']}) is operating within nominal statistical tolerance. Baseline yield averages {avg_predicted:,.1f} TPD against the statutory quota target of {target:,.1f} TPD. Historical logged yield on Day 1 is {phys['actualD1Tpd']:,} TPD ({((phys['actualD1Tpd'] / target) * 100):.1f}% quota achievement). Harmonic shift oscillations reflect the {phys['tau']:.0f}-day shift rotation schedule with no structural bottlenecks detected across {phys['keyInfrastructure']}."
        elif scen_key == "HEAVY_MONSOON":
            ai_exp = f"{mine_name} is experiencing significant operational drag under the Heavy Monsoon scenario, with projected 14-day yield averaging {avg_predicted:,.1f} TPD (-{abs(net_impact):,.1f} TPD deficit). The primary bottleneck is {drivers[0].name} (-{abs(drivers[0].impact_tpd):,.1f} TPD) compounded by {drivers[1].name} (-{abs(drivers[1].impact_tpd):,.1f} TPD) along the {phys['haulDistKm']} km haul gradient. Peak shortfall reaches Day {worst_point.day_num if worst_point else 5} ({worst_point.predicted_yield_tpd if worst_point else 0:,.1f} TPD). High-grade stockpile drawdown of {buffer_stockpile_t:,.0f} T dampens recovery until auxiliary dewatering stabilizes the {phys['keyInfrastructure']}. Statutory protocol {phys['protocolCode']} is recommended."
        elif scen_key in ["CRUSHER_SEIZURE", "CRUSHER_CONSTRAINT"]:
            ai_exp = f"Catastrophic primary crusher bearing seizure at {mine_name} introduces severe downstream throttling. Crushing availability plunges to {crusher}% on Day 5, collapsing daily yield to {worst_point.predicted_yield_tpd if worst_point else 0:,.1f} TPD against the {target:,.1f} TPD baseline quota. The 14-day cumulative volume at risk is {total_shortfall_tonnes:,.0f} Tonnes (₹{((total_shortfall_tonnes * 14500) / 10000000):.2f} Cr value). Emergency overhaul and dynamic bearing realignment restore 85%+ throughput by Day {recovery_day_idx or 10}. Statutory protocol {phys['protocolCode']} is active."
        else:
            ai_exp = f"{mine_name} faces a compounded Multi-Risk Crisis combining severe catchment rainfall, {phys['haulDistKm']} km haulage mud slip, crusher bearing constraint, and sump inundation at {phys['keyInfrastructure']}. Total volume at risk reaches {total_shortfall_tonnes:,.0f} Tonnes with worst-day deficit at {worst_point.predicted_yield_tpd if worst_point else 0:,.1f} TPD (Day {worst_point.day_num if worst_point else 5}). Multi-vector algorithmic mitigation under protocol {phys['protocolCode']} is urgently required to prevent cascading unrecoverable quarter shortfall."

        kpis = {
            "avg_predicted_yield": avg_predicted,
            "avg_daily_shortfall": avg_shortfall,
            "total_shortfall_tonnes": round(total_shortfall_tonnes, 1),
            "worst_day": f"{worst_point.day_label} ({worst_point.date})" if worst_point else "D5",
            "worst_day_yield": worst_point.predicted_yield_tpd if worst_point else round(target * 0.65, 1),
            "worst_day_shortfall": worst_point.shortfall_tpd if worst_point else round(target * 0.35, 1),
            "recovery_day": f"D{recovery_day_idx}" if recovery_day_idx else ("D1 (Nominal)" if scen_key == "BASELINE" else "D11+"),
            "risk_classification": worst_point.risk_level if worst_point else "LOW",
            "financial_exposure_cr": round(((total_shortfall_tonnes * 14500) / 10000000), 2),
            "crusher_status": f"{crusher}% Avail ({base_crusher_health}% Base Health)",
            "fleet_status": f"{fleet}% Roster ({base_fleet_avail}% Base)",
            "water_status": f"{phys['maxDrainageM3h']} m³/h Pumping ({phys['headPressureFactor']}x Head)"
        }

        # Multi-scenario comparisons for chart overlays
        scenarios_comparison = []
        if include_comparisons:
            for s_id, s_name in [("BASELINE", "Baseline Nominal"), ("HEAVY_MONSOON", "Heavy Monsoon Influx"), ("CRUSHER_SEIZURE", "Crusher Bearing Seizure"), ("MULTI_RISK", "Multi-Risk Crisis")]:
                if s_id != scen_key:
                    dummy_req = ForecastRequest(mine_id=norm_id, scenario_id=s_id)
                    sim_res = ForecastService.calculate_14_day_forecast(dummy_req, include_comparisons=False)
                    pts = [p["predicted_yield_tpd"] for p in sim_res["forecast_points"]]
                else:
                    pts = [p.predicted_yield_tpd for p in forecast_points]
                
                color_map = {
                    "BASELINE": "#10b981", "HEAVY_MONSOON": "#3b82f6", "CRUSHER_SEIZURE": "#f59e0b", "MULTI_RISK": "#ef4444"
                }
                scenarios_comparison.append(
                    ScenarioTrajectory(
                        scenario_id=s_id,
                        scenario_name=s_name,
                        name=s_name,
                        color=color_map.get(s_id, "#38bdf8"),
                        points=pts
                    )
                )

        return {
            "mine_id": norm_id,
            "mine_name": mine_name,
            "mine_type": phys["mineType"],
            "ore_grade": base_grade,
            "daily_target": target,
            "historical_actual_d1": phys["actualD1Tpd"],
            "active_scenario": scen_key,
            "forecast_points": [p.dict() for p in forecast_points],
            "waterfall_drivers": [d.dict() for d in drivers],
            "net_impact_tpd": net_impact,
            "kpis": kpis,
            "ai_explanation": ai_exp,
            "scenarios_comparison": [s.dict() for s in scenarios_comparison],
            "physical_profile": phys,
            "generated_alerts": [
                {
                    "id": f"ALT-{norm_id.upper()[:3]}-01",
                    "severity": "CRITICAL" if kpis["risk_classification"] == "CRITICAL" else ("HIGH" if kpis["risk_classification"] == "HIGH" else "NORMAL"),
                    "title": f"{scen_key.replace('_', ' ')}: {mine_name}",
                    "message": ai_exp[:160] + "...",
                    "timestamp": datetime.now(timezone.utc).strftime("%H:%M:%S") + " UTC"
                }
            ],
            "models_status": {
                "engine": "AETHER-DYNAMIC-FORECAST-v4.0",
                "active_mine": norm_id,
                "canonical_target_tpd": target,
                "model_version": "v4.0-PHYSICS-GROUNDED",
                "status": "ONLINE"
            }
        }
