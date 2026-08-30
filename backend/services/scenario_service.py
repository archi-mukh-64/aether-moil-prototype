from typing import Dict, Any, List, Optional
from .mine_service import mine_service
from ..utils.validation import normalize_mine_id, normalize_scenario_type
from ..utils.model_loader import model_registry

class ScenarioService:
    @staticmethod
    def simulate_scenario(
        mine_id: str,
        scenario_type: str,
        severity: str = "HIGH",
        time_horizon: str = "24 HOURS",
        custom_params: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        norm_mine_id = normalize_mine_id(mine_id)
        norm_scen_type = normalize_scenario_type(scenario_type)
        mine = mine_service.get_mine_by_id(norm_mine_id)
        
        target = mine["productionTarget"]
        sens = mine["rainfallSensitivity"]
        pfx = (mine["shortName"] or "MIN")[:3].upper()
        
        sev_mult = {
            "LOW": 0.40,
            "MEDIUM": 0.70,
            "HIGH": 1.00,
            "CRITICAL": 1.45
        }.get(severity.upper(), 1.00)
        
        horizon_factor = {
            "6 HOURS": 0.40,
            "24 HOURS": 1.00,
            "7 DAYS": 3.80
        }.get(time_horizon.upper(), 1.00)

        # -------------------------------------------------------------
        # 1. BASELINE RESET SCENARIO
        # -------------------------------------------------------------
        if norm_scen_type == "BASELINE_RESET":
            return {
                "scenario_id": f"SCEN-RESET-{pfx}",
                "scenario_type": "BASELINE_RESET",
                "mine_id": mine["id"],
                "mine_name": mine["name"],
                "severity": "NOMINAL",
                "time_horizon": time_horizon,
                "status_variant": "telemetry",
                "is_detected": False,
                "headline": f"{mine['name']} Operational Baseline Calibrated",
                "baseline_production_target": target,
                "projected_yield_tonnes": target,
                "predicted_loss_tonnes": 0,
                "shortfall_probability": 0.08,
                "shortfall_probability_pct": "8.0%",
                "effective_rainfall_mm": 12.5,
                "effective_sump_inflow_m3h": mine["drainageBaselineM3h"],
                "crusher_vibration_mms": mine["crusherVibBase"],
                "crusher_utilization_pct": 88.5,
                "fleet_health_pct": mine["fleetAvailabilityBase"],
                "equipment_failure_probability": 0.05,
                "anomaly_score": 0.14,
                "overall_risk_level": "OPTIMAL",
                "composite_trust_score": "95.8%",
                "evidence_factors": [
                    {"rank": "01", "factor": "All Environmental & Geotechnical Signals Nominal", "impactPct": 45.0, "direction": "risk_mitigating", "category": "GBM TreeSHAP", "detail": f"Continuous monitoring across {mine['sensorCount']} telemetry channels."},
                    {"rank": "02", "factor": f"Stockpile Safety Buffer Margin ({mine['stockpileBufferT']}T)", "impactPct": 35.0, "direction": "risk_mitigating", "category": "GBM TreeSHAP", "detail": "Available for blending feed stability."}
                ],
                "causal_chain": [
                    "Telemetry sensors streaming nominal baselines",
                    "Dewatering sump rate within standard clearance envelope",
                    "Shift quota pacing on schedule"
                ],
                "recommendation": {
                    "action_id": f"PROTO-{pfx}-NOMINAL",
                    "title": "Maintain Standard Shift Supervision",
                    "what_to_do": "Continue automated shift dispatch according to nominal DGMS roster.",
                    "why": "Zero anomaly detected across multi-variate sensor array.",
                    "expected_impact": "100% Scheduled Yield",
                    "confidence": "98.4%"
                },
                "optimization_options": []
            }

        # -------------------------------------------------------------
        # 2. HEAVY MONSOON INUNDATION SCENARIO
        # -------------------------------------------------------------
        elif norm_scen_type == "HEAVY_MONSOON":
            effective_rain = round((85.0 + sens * 12.0) * sev_mult, 1)
            effective_inflow = round((mine["drainageBaselineM3h"] + 24.5 * sens) * sev_mult, 1)
            loss_pct = round(min(45.0, max(12.0, (16.5 * sens * sev_mult * horizon_factor))), 1)
            loss_t = int(target * (loss_pct / 100.0))
            projected_yield = max(0, target - loss_t)
            shortfall_prob = round(min(0.98, max(0.65, 0.72 + (sens - 1.2) * 0.2 * sev_mult)), 2)

            return {
                "scenario_id": f"SCEN-MONSOON-{pfx}",
                "scenario_type": "HEAVY_MONSOON",
                "mine_id": mine["id"],
                "mine_name": mine["name"],
                "severity": severity,
                "time_horizon": time_horizon,
                "status_variant": "hazard",
                "is_detected": True,
                "headline": f"Catchment Inundation & Sump Inflow Threat ({effective_rain}mm Precipitation)",
                "baseline_production_target": target,
                "projected_yield_tonnes": projected_yield,
                "predicted_loss_tonnes": loss_t,
                "shortfall_probability": shortfall_prob,
                "shortfall_probability_pct": f"{shortfall_prob * 100:.1f}%",
                "effective_rainfall_mm": effective_rain,
                "effective_sump_inflow_m3h": effective_inflow,
                "crusher_vibration_mms": mine["crusherVibBase"],
                "crusher_utilization_pct": 74.0,
                "fleet_health_pct": round(mine["fleetAvailabilityBase"] - 18.0 * sev_mult, 1),
                "equipment_failure_probability": 0.22,
                "anomaly_score": -0.28,
                "overall_risk_level": "CRITICAL" if shortfall_prob >= 0.85 else "ELEVATED",
                "composite_trust_score": "92.4%",
                "evidence_factors": [
                    {"rank": "01", "factor": f"Catchment Precipitation Spike ({effective_rain}mm)", "impactPct": 46.0, "direction": "risk_elevating", "category": "GBM TreeSHAP", "detail": f"Rainfall sensitivity multiplier ({sens}x) active for {mine['district']} terrain."},
                    {"rank": "02", "factor": f"Deep Sump Ingress Load ({effective_inflow} m³/h)", "impactPct": 32.0, "direction": "risk_elevating", "category": "GBM TreeSHAP", "detail": f"Pumping system loaded to {mine['waterTableDepth']}."},
                    {"rank": "03", "factor": f"High-Grade Buffer Margin ({mine['stockpileBufferT']}T)", "impactPct": 18.0, "direction": "risk_mitigating", "category": "GBM TreeSHAP", "detail": f"Surface stock of {mine['oreGrade']} buffers deficit."}
                ],
                "causal_chain": [
                    f"Intense precipitation ({effective_rain}mm) saturates surface catchment",
                    f"Sub-surface seepage accelerates sump inflow to {effective_inflow} m³/h",
                    f"Haul road slurry drag increases cycle time and threatens daily quota of {target:,} T"
                ],
                "recommendation": {
                    "action_id": f"PROTO-{pfx}-01",
                    "title": "Dynamic Dewatering & Corridor Re-Route Protocol",
                    "what_to_do": f"1. Engage auxiliary dewatering submersibles (+35 m³/h).\n2. Re-route haulage trucks to Western high-ground gravel road.\n3. Draw {int(mine['stockpileBufferT'] * 0.4)}T from surface buffer.",
                    "why": f"Prescriptive intervention protects {int(loss_t * 0.88):,} Tonnes.",
                    "expected_impact": f"+{int(loss_t * 0.88):,} T Protected Yield",
                    "confidence": "94.8%"
                },
                "optimization_options": []
            }

        # -------------------------------------------------------------
        # 3. CRUSHER SEIZURE & MECHANICAL DEGRADATION
        # -------------------------------------------------------------
        elif norm_scen_type == "CRUSHER_SEIZURE":
            effective_vib = round((mine["crusherVibBase"] + 2.8 * sev_mult), 1)
            effective_temp = int(mine["crusherTempBase"] + 34 * sev_mult)
            loss_pct = round(min(40.0, max(14.0, (18.0 * sev_mult * horizon_factor))), 1)
            loss_t = int(target * (loss_pct / 100.0))
            projected_yield = max(0, target - loss_t)
            fail_prob = round(min(0.96, max(0.68, 0.75 * sev_mult)), 2)

            return {
                "scenario_id": f"SCEN-CRUSHER-{pfx}",
                "scenario_type": "CRUSHER_SEIZURE",
                "mine_id": mine["id"],
                "mine_name": mine["name"],
                "severity": severity,
                "time_horizon": time_horizon,
                "status_variant": "hazard",
                "is_detected": True,
                "headline": f"Primary Jaw Crusher Bearing Degradation ({effective_vib} mm/s Vibration Peak)",
                "baseline_production_target": target,
                "projected_yield_tonnes": projected_yield,
                "predicted_loss_tonnes": loss_t,
                "shortfall_probability": fail_prob,
                "shortfall_probability_pct": f"{fail_prob * 100:.1f}%",
                "effective_rainfall_mm": 12.5,
                "effective_sump_inflow_m3h": mine["drainageBaselineM3h"],
                "crusher_vibration_mms": effective_vib,
                "crusher_utilization_pct": 54.0,
                "fleet_health_pct": 72.0,
                "equipment_failure_probability": fail_prob,
                "anomaly_score": -0.32,
                "overall_risk_level": "CRITICAL" if fail_prob >= 0.80 else "ELEVATED",
                "composite_trust_score": "91.8%",
                "evidence_factors": [
                    {"rank": "01", "factor": f"Harmonic Vibration Peak ({effective_vib} mm/s at 42Hz)", "impactPct": 56.0, "direction": "risk_elevating", "category": "GBM TreeSHAP", "detail": "Drive bearing spectral frequency exceeds ISO 10816 Class IV threshold."},
                    {"rank": "02", "factor": f"Bearing Thermal Dissipation Drift ({effective_temp}°C)", "impactPct": 28.0, "direction": "risk_elevating", "category": "GBM TreeSHAP", "detail": "Lube breakdown triggers rapid temperature rise."}
                ],
                "causal_chain": [
                    "Bearing inner race micro-spalling induces 42Hz harmonic vibration",
                    f"Surface temperature rises to {effective_temp}°C indicating impending seizure",
                    f"Single-line crushing bottleneck threatens {loss_t:,} T throughput"
                ],
                "recommendation": {
                    "action_id": f"PROTO-{pfx}-02",
                    "title": "Crusher Feed Balancing & Fines Bypass Protocol",
                    "what_to_do": f"1. Throttle jaw crusher feed from {mine['crusherCapacityTPH']} TPH to {int(mine['crusherCapacityTPH']*0.7)} TPH.\n2. Engage mobile vibrating screen.\n3. Flush lube during shift change.",
                    "why": f"Suppresses bearing damage while maintaining {int(loss_t * 0.85):,} Tonnes of protected throughput.",
                    "expected_impact": f"+{int(loss_t * 0.85):,} T Protected Yield",
                    "confidence": "96.2%"
                },
                "optimization_options": []
            }

        # -------------------------------------------------------------
        # 4. HAUL ROAD FAILURE
        # -------------------------------------------------------------
        elif norm_scen_type == "HAUL_ROAD_FAILURE":
            loss_pct = round(min(35.0, max(12.0, (14.0 * sev_mult * horizon_factor))), 1)
            loss_t = int(target * (loss_pct / 100.0))
            projected_yield = max(0, target - loss_t)
            shortfall_prob = round(min(0.92, max(0.55, 0.68 * sev_mult)), 2)

            return {
                "scenario_id": f"SCEN-HAUL-{pfx}",
                "scenario_type": "HAUL_ROAD_FAILURE",
                "mine_id": mine["id"],
                "mine_name": mine["name"],
                "severity": severity,
                "time_horizon": time_horizon,
                "status_variant": "hazard",
                "is_detected": True,
                "headline": f"Main Haul Ramp Sloughing & Traction Failure (Cycle Delay +45%)",
                "baseline_production_target": target,
                "projected_yield_tonnes": projected_yield,
                "predicted_loss_tonnes": loss_t,
                "shortfall_probability": shortfall_prob,
                "shortfall_probability_pct": f"{shortfall_prob * 100:.1f}%",
                "effective_rainfall_mm": 24.0,
                "effective_sump_inflow_m3h": mine["drainageBaselineM3h"],
                "crusher_vibration_mms": mine["crusherVibBase"],
                "crusher_utilization_pct": 68.0,
                "fleet_health_pct": 74.0,
                "equipment_failure_probability": 0.32,
                "anomaly_score": -0.26,
                "overall_risk_level": "ELEVATED",
                "composite_trust_score": "93.0%",
                "evidence_factors": [
                    {"rank": "01", "factor": "Haul Road Rolling Resistance (+58% Drag)", "impactPct": 54.0, "direction": "risk_elevating", "category": "Telemetry", "detail": "Ramp 03 gravel degradation extends dump truck round-trip cycles."}
                ],
                "causal_chain": [
                    "Slope sloughing compromises East Haul Ramp traction",
                    "Haul cycle times extend from 18 min to 28 min",
                    f"Crusher hopper starving threatens -{loss_t}T shift output"
                ],
                "recommendation": {
                    "action_id": f"PROTO-{pfx}-HAUL",
                    "title": "Haulage Reroute & Grader Ballasting Protocol",
                    "what_to_do": "1. Divert loaded trucks to West Ridge Corridor.\n2. Dispatch Grader + 40T ballast dump.",
                    "why": f"Restores cycle time within 90 minutes and saves {int(loss_t * 0.82):,} Tonnes.",
                    "expected_impact": f"+{int(loss_t * 0.82):,} T Protected Yield",
                    "confidence": "94.0%"
                },
                "optimization_options": []
            }

        # -------------------------------------------------------------
        # 5. FLEET BREAKDOWN
        # -------------------------------------------------------------
        elif norm_scen_type == "FLEET_BREAKDOWN":
            loss_pct = round(min(38.0, max(14.0, (16.0 * sev_mult * horizon_factor))), 1)
            loss_t = int(target * (loss_pct / 100.0))
            projected_yield = max(0, target - loss_t)
            shortfall_prob = round(min(0.94, max(0.60, 0.70 * sev_mult)), 2)

            return {
                "scenario_id": f"SCEN-FLEET-{pfx}",
                "scenario_type": "FLEET_BREAKDOWN",
                "mine_id": mine["id"],
                "mine_name": mine["name"],
                "severity": severity,
                "time_horizon": time_horizon,
                "status_variant": "hazard",
                "is_detected": True,
                "headline": f"Heavy Dumper Mechanical Outage (-{int(18*sev_mult)}% Haulage Capacity)",
                "baseline_production_target": target,
                "projected_yield_tonnes": projected_yield,
                "predicted_loss_tonnes": loss_t,
                "shortfall_probability": shortfall_prob,
                "shortfall_probability_pct": f"{shortfall_prob * 100:.1f}%",
                "effective_rainfall_mm": 12.0,
                "effective_sump_inflow_m3h": mine["drainageBaselineM3h"],
                "crusher_vibration_mms": mine["crusherVibBase"],
                "crusher_utilization_pct": 65.0,
                "fleet_health_pct": round(mine["fleetAvailabilityBase"] - 26.0 * sev_mult, 1),
                "equipment_failure_probability": 0.72,
                "anomaly_score": -0.30,
                "overall_risk_level": "ELEVATED",
                "composite_trust_score": "92.1%",
                "evidence_factors": [
                    {"rank": "01", "factor": "Komatsu HD785 Turbocharger Pressure Drop", "impactPct": 60.0, "direction": "risk_elevating", "category": "Telemetry", "detail": "Lead trucks DT-184 and DT-210 experiencing exhaust manifold thermal spikes."}
                ],
                "causal_chain": [
                    "Simultaneous engine thermal trips on 2 primary dumpers",
                    "Shovel face loading queues accumulate to 4.2 units",
                    f"ROM ore delivery rate falls below crusher minimum threshold of {mine['crusherCapacityTPH']} TPH"
                ],
                "recommendation": {
                    "action_id": f"PROTO-{pfx}-FLEET",
                    "title": "Dynamic Fleet Re-allocation & Auxiliary Dispatch",
                    "what_to_do": "1. Mobilize reserve Komatsu HD465 standby unit.\n2. Increase payload target to 105% on operational trucks.",
                    "why": f"Recovers {int(loss_t * 0.80):,} Tonnes of scheduled yield.",
                    "expected_impact": f"+{int(loss_t * 0.80):,} T Protected Yield",
                    "confidence": "93.5%"
                },
                "optimization_options": []
            }

        # -------------------------------------------------------------
        # 6. SHAFT HOIST FAILURE
        # -------------------------------------------------------------
        elif norm_scen_type == "SHAFT_HOIST_FAILURE":
            loss_pct = round(min(52.0, max(18.0, (22.0 * sev_mult * horizon_factor))), 1)
            loss_t = int(target * (loss_pct / 100.0))
            projected_yield = max(0, target - loss_t)
            shortfall_prob = round(min(0.98, max(0.75, 0.82 * sev_mult)), 2)

            return {
                "scenario_id": f"SCEN-SHAFT-{pfx}",
                "scenario_type": "SHAFT_HOIST_FAILURE",
                "mine_id": mine["id"],
                "mine_name": mine["name"],
                "severity": severity,
                "time_horizon": time_horizon,
                "status_variant": "hazard",
                "is_detected": True,
                "headline": f"Main Shaft Friction Winder Electrical Trip (Ore Skipping Halted)",
                "baseline_production_target": target,
                "projected_yield_tonnes": projected_yield,
                "predicted_loss_tonnes": loss_t,
                "shortfall_probability": shortfall_prob,
                "shortfall_probability_pct": f"{shortfall_prob * 100:.1f}%",
                "effective_rainfall_mm": 10.0,
                "effective_sump_inflow_m3h": mine["drainageBaselineM3h"],
                "crusher_vibration_mms": mine["crusherVibBase"],
                "crusher_utilization_pct": 42.0,
                "fleet_health_pct": 62.0,
                "equipment_failure_probability": 0.85,
                "anomaly_score": -0.38,
                "overall_risk_level": "CRITICAL",
                "composite_trust_score": "90.5%",
                "evidence_factors": [
                    {"rank": "01", "factor": "Winder Thyristor Drive Over-Current Trip", "impactPct": 65.0, "direction": "risk_elevating", "category": "Telemetry", "detail": "Vertical ore hoist cage stopped between -180m and -240m levels."}
                ],
                "causal_chain": [
                    "Thyristor bridge phase imbalance trips winder safety interlock",
                    "Underground extraction stopes unable to clear broken ore via shaft bin",
                    "Surface beneficiation circuit runs out of feed within 1.5 hours"
                ],
                "recommendation": {
                    "action_id": f"PROTO-{pfx}-SHAFT",
                    "title": "Emergency Auxiliary Hoist & Sub-Surface Buffer Protocol",
                    "what_to_do": "1. Reset thyristor cooling circuit and switch to backup drive channel.\n2. Store run-of-mine ore in -180m drift transfer crosscuts.",
                    "why": f"Restores hoisting within 45 minutes and saves {int(loss_t * 0.84):,} Tonnes.",
                    "expected_impact": f"+{int(loss_t * 0.84):,} T Protected Yield",
                    "confidence": "95.0%"
                },
                "optimization_options": []
            }

        # -------------------------------------------------------------
        # 7. DEWATERING FAILURE
        # -------------------------------------------------------------
        elif norm_scen_type == "DEWATERING_FAILURE":
            loss_pct = round(min(42.0, max(15.0, (17.5 * sens * sev_mult * horizon_factor))), 1)
            loss_t = int(target * (loss_pct / 100.0))
            projected_yield = max(0, target - loss_t)
            shortfall_prob = round(min(0.95, max(0.66, 0.74 * sev_mult)), 2)

            return {
                "scenario_id": f"SCEN-DEWATER-{pfx}",
                "scenario_type": "DEWATERING_FAILURE",
                "mine_id": mine["id"],
                "mine_name": mine["name"],
                "severity": severity,
                "time_horizon": time_horizon,
                "status_variant": "hazard",
                "is_detected": True,
                "headline": f"Pit Sump 450kW Submersible Pump Trip (Water Ingress +2.2m)",
                "baseline_production_target": target,
                "projected_yield_tonnes": projected_yield,
                "predicted_loss_tonnes": loss_t,
                "shortfall_probability": shortfall_prob,
                "shortfall_probability_pct": f"{shortfall_prob * 100:.1f}%",
                "effective_rainfall_mm": 45.0,
                "effective_sump_inflow_m3h": round(mine["drainageBaselineM3h"] * 1.8, 1),
                "crusher_vibration_mms": mine["crusherVibBase"],
                "crusher_utilization_pct": 70.0,
                "fleet_health_pct": 70.0,
                "equipment_failure_probability": 0.68,
                "anomaly_score": -0.31,
                "overall_risk_level": "ELEVATED",
                "composite_trust_score": "91.5%",
                "evidence_factors": [
                    {"rank": "01", "factor": "Submersible Battery Pump #2 Mechanical Seal Rupture", "impactPct": 58.0, "direction": "risk_elevating", "category": "Telemetry", "detail": "Deep pit sump clearance capacity reduced by 50%."}
                ],
                "causal_chain": [
                    "Pump seal failure causes immediate cavitation and automated motor trip",
                    "Unchecked sub-surface inflow raises sump water level at 0.18 m/hr",
                    "Lowest extraction bench access submerged, halting loading shovel EX-17"
                ],
                "recommendation": {
                    "action_id": f"PROTO-{pfx}-PUMP",
                    "title": "Emergency High-Head Diesel Pump Deployment",
                    "what_to_do": "1. Deploy trailer-mounted 150 kW diesel emergency pump unit.\n2. Elevate loading bench excavator to Level +260m.",
                    "why": f"Arrests water rise within 40 min and protects {int(loss_t * 0.86):,} Tonnes.",
                    "expected_impact": f"+{int(loss_t * 0.86):,} T Protected Yield",
                    "confidence": "94.5%"
                },
                "optimization_options": []
            }

        # -------------------------------------------------------------
        # 8. POWER FAILURE
        # -------------------------------------------------------------
        elif norm_scen_type == "POWER_FAILURE":
            loss_pct = round(min(55.0, max(20.0, (25.0 * sev_mult * horizon_factor))), 1)
            loss_t = int(target * (loss_pct / 100.0))
            projected_yield = max(0, target - loss_t)
            shortfall_prob = round(min(0.99, max(0.78, 0.84 * sev_mult)), 2)

            return {
                "scenario_id": f"SCEN-POWER-{pfx}",
                "scenario_type": "POWER_FAILURE",
                "mine_id": mine["id"],
                "mine_name": mine["name"],
                "severity": severity,
                "time_horizon": time_horizon,
                "status_variant": "hazard",
                "is_detected": True,
                "headline": f"33kV Grid Substation Outage (Plant Switched to Backup Diesel)",
                "baseline_production_target": target,
                "projected_yield_tonnes": projected_yield,
                "predicted_loss_tonnes": loss_t,
                "shortfall_probability": shortfall_prob,
                "shortfall_probability_pct": f"{shortfall_prob * 100:.1f}%",
                "effective_rainfall_mm": 10.0,
                "effective_sump_inflow_m3h": mine["drainageBaselineM3h"],
                "crusher_vibration_mms": mine["crusherVibBase"],
                "crusher_utilization_pct": 35.0,
                "fleet_health_pct": 65.0,
                "equipment_failure_probability": 0.82,
                "anomaly_score": -0.40,
                "overall_risk_level": "CRITICAL",
                "composite_trust_score": "89.8%",
                "evidence_factors": [
                    {"rank": "01", "factor": "State Electricity Board 33kV Line Trip", "impactPct": 62.0, "direction": "risk_elevating", "category": "Telemetry", "detail": "Total loss of grid power across crusher, winder, and dewatering pumps."}
                ],
                "causal_chain": [
                    "Transmission surge trips main intake circuit breakers",
                    "Emergency diesel generators auto-synchronize to power critical life-safety fans only",
                    "Beneficiation and heavy crushing circuits locked out"
                ],
                "recommendation": {
                    "action_id": f"PROTO-{pfx}-POWER",
                    "title": "Priority Load Shedding & Diesel Synchronous Power",
                    "what_to_do": "1. Prioritize diesel power to secondary crushing and dewatering.\n2. Reroute haul dumpers directly to raw ROM stockpiles.",
                    "why": f"Recovers {int(loss_t * 0.78):,} Tonnes of protected production.",
                    "expected_impact": f"+{int(loss_t * 0.78):,} T Protected Yield",
                    "confidence": "93.0%"
                },
                "optimization_options": []
            }

        # -------------------------------------------------------------
        # 9. GEOLOGICAL HAZARD / FAULT ZONE MOVEMENT
        # -------------------------------------------------------------
        elif norm_scen_type == "GEOLOGICAL_HAZARD":
            loss_pct = round(min(36.0, max(12.0, (15.0 * sev_mult * horizon_factor))), 1)
            loss_t = int(target * (loss_pct / 100.0))
            projected_yield = max(0, target - loss_t)
            shortfall_prob = round(min(0.92, max(0.58, 0.66 * sev_mult)), 2)

            return {
                "scenario_id": f"SCEN-GEO-{pfx}",
                "scenario_type": "GEOLOGICAL_HAZARD",
                "mine_id": mine["id"],
                "mine_name": mine["name"],
                "severity": severity,
                "time_horizon": time_horizon,
                "status_variant": "hazard",
                "is_detected": True,
                "headline": f"Hanging Wall Shear Discontinuity & Joint Slippage Detected",
                "baseline_production_target": target,
                "projected_yield_tonnes": projected_yield,
                "predicted_loss_tonnes": loss_t,
                "shortfall_probability": shortfall_prob,
                "shortfall_probability_pct": f"{shortfall_prob * 100:.1f}%",
                "effective_rainfall_mm": 15.0,
                "effective_sump_inflow_m3h": mine["drainageBaselineM3h"],
                "crusher_vibration_mms": mine["crusherVibBase"],
                "crusher_utilization_pct": 72.0,
                "fleet_health_pct": 78.0,
                "equipment_failure_probability": 0.45,
                "anomaly_score": -0.29,
                "overall_risk_level": "ELEVATED",
                "composite_trust_score": "92.5%",
                "evidence_factors": [
                    {"rank": "01", "factor": "Micro-Seismic Sensor Trigger at Stope 3W", "impactPct": 55.0, "direction": "risk_elevating", "category": "Telemetry", "detail": "Acoustic emission rate indicates bedding plane shear stress."}
                ],
                "causal_chain": [
                    "Tectonic shear stress exceeds rock mass rating threshold",
                    "Safety exclusion zone enforced across 120m strike face",
                    "Shovel operations temporarily shifted to lower-grade extraction block"
                ],
                "recommendation": {
                    "action_id": f"PROTO-{pfx}-GEO",
                    "title": "Rock-Bolting Reinforcement & Stope Re-Sequencing",
                    "what_to_do": "1. Deploy mechanized roof-bolter for 2.4m resin anchor installation.\n2. Reallocate production quota to Footwall Block B.",
                    "why": f"Maintains stability and saves {int(loss_t * 0.85):,} Tonnes.",
                    "expected_impact": f"+{int(loss_t * 0.85):,} T Protected Yield",
                    "confidence": "94.8%"
                },
                "optimization_options": []
            }

        # -------------------------------------------------------------
        # 10. MULTI-RISK CASCADE CRISIS
        # -------------------------------------------------------------
        elif norm_scen_type in ["MULTI_RISK_CRISIS", "MULTI_RISK"]:
            effective_rain = round((78.0 + sens * 10.0) * sev_mult, 1)
            effective_inflow = round((mine["drainageBaselineM3h"] + 20.0 * sens) * sev_mult, 1)
            effective_vib = round((mine["crusherVibBase"] + 2.4 * sev_mult), 1)
            loss_pct = round(min(60.0, max(22.0, (28.5 * sens * sev_mult * horizon_factor))), 1)
            loss_t = int(target * (loss_pct / 100.0))
            projected_yield = max(0, target - loss_t)
            shortfall_prob = round(min(0.99, max(0.82, 0.88 * sev_mult)), 2)

            return {
                "scenario_id": f"SCEN-MULTI-{pfx}",
                "scenario_type": "MULTI_RISK_CRISIS",
                "mine_id": mine["id"],
                "mine_name": mine["name"],
                "severity": severity,
                "time_horizon": time_horizon,
                "status_variant": "hazard",
                "is_detected": True,
                "headline": f"Compound Dual-Vector Crisis: Sump Inrush + Crusher Harmonic Seizure",
                "baseline_production_target": target,
                "projected_yield_tonnes": projected_yield,
                "predicted_loss_tonnes": loss_t,
                "shortfall_probability": shortfall_prob,
                "shortfall_probability_pct": f"{shortfall_prob * 100:.1f}%",
                "effective_rainfall_mm": effective_rain,
                "effective_sump_inflow_m3h": effective_inflow,
                "crusher_vibration_mms": effective_vib,
                "crusher_utilization_pct": 48.0,
                "fleet_health_pct": 58.0,
                "equipment_failure_probability": 0.78,
                "anomaly_score": -0.44,
                "overall_risk_level": "CRITICAL",
                "composite_trust_score": "89.5%",
                "evidence_factors": [
                    {"rank": "01", "factor": "Compound Multi-Vector Stress (Precipitation + Vibration)", "impactPct": 52.0, "direction": "risk_elevating", "category": "GBM TreeSHAP", "detail": f"Concurrent {effective_rain}mm storm + {effective_vib} mm/s mechanical anomaly."},
                    {"rank": "02", "factor": f"Deep Shaft Drainage Capacity ({effective_inflow} m³/h)", "impactPct": 30.0, "direction": "risk_elevating", "category": "GBM TreeSHAP", "detail": f"Sump water ingress exceeds baseline."}
                ],
                "causal_chain": [
                    "Extreme precipitation triggers pit inundation and road slurry drag",
                    "Primary crusher experiences concurrent bearing overheating and high vibration",
                    "Simultaneous extraction and beneficiation bottlenecks compound into crisis"
                ],
                "recommendation": {
                    "action_id": f"PROTO-{pfx}-03",
                    "title": "Integrated Multi-Vector Incident Response Protocol",
                    "what_to_do": f"1. Deploy emergency diesel pumps (+45 m³/h).\n2. Throttle jaw crusher to {int(mine['crusherCapacityTPH']*0.6)} TPH with bypass.\n3. Draw {int(mine['stockpileBufferT']*0.6)}T buffer reserve.",
                    "why": f"Prevents catastrophic cascading shutdown, recovering {int(loss_t * 0.81):,} Tonnes.",
                    "expected_impact": f"+{int(loss_t * 0.81):,} T Protected Yield",
                    "confidence": "93.1%"
                },
                "optimization_options": []
            }

        # -------------------------------------------------------------
        # 11. FIRE / INDUSTRIAL INCIDENT
        # -------------------------------------------------------------
        elif norm_scen_type == "FIRE_INCIDENT":
            loss_pct = round(min(48.0, max(16.0, (20.0 * sev_mult * horizon_factor))), 1)
            loss_t = int(target * (loss_pct / 100.0))
            projected_yield = max(0, target - loss_t)
            shortfall_prob = round(min(0.96, max(0.70, 0.76 * sev_mult)), 2)

            return {
                "scenario_id": f"SCEN-FIRE-{pfx}",
                "scenario_type": "FIRE_INCIDENT",
                "mine_id": mine["id"],
                "mine_name": mine["name"],
                "severity": severity,
                "time_horizon": time_horizon,
                "status_variant": "hazard",
                "is_detected": True,
                "headline": f"Conveyor Transfer Chute Friction Heat & Dust Suppression Alarm",
                "baseline_production_target": target,
                "projected_yield_tonnes": projected_yield,
                "predicted_loss_tonnes": loss_t,
                "shortfall_probability": shortfall_prob,
                "shortfall_probability_pct": f"{shortfall_prob * 100:.1f}%",
                "effective_rainfall_mm": 10.0,
                "effective_sump_inflow_m3h": mine["drainageBaselineM3h"],
                "crusher_vibration_mms": mine["crusherVibBase"],
                "crusher_utilization_pct": 50.0,
                "fleet_health_pct": 68.0,
                "equipment_failure_probability": 0.74,
                "anomaly_score": -0.35,
                "overall_risk_level": "ELEVATED",
                "composite_trust_score": "91.0%",
                "evidence_factors": [
                    {"rank": "01", "factor": "Infrared Thermal Sensor Alarm (>140°C on Idler 04)", "impactPct": 62.0, "direction": "risk_elevating", "category": "Telemetry", "detail": "Conveyor belt 02 stopped by automated fire protection interlock."}
                ],
                "causal_chain": [
                    "Seized idler roller causes friction heating against rubber belt",
                    "Automated thermal sprinkler array activates, stopping transfer line",
                    "Beneficiation throughput paused pending belt inspection"
                ],
                "recommendation": {
                    "action_id": f"PROTO-{pfx}-FIRE",
                    "title": "Idler Replacement & Deluge Suppression Clearance",
                    "what_to_do": "1. Replace idler roller on Chute 02.\n2. Reroute ROM feed through mobile bypass stacker.",
                    "why": f"Restores conveyor within 50 min and protects {int(loss_t * 0.83):,} Tonnes.",
                    "expected_impact": f"+{int(loss_t * 0.83):,} T Protected Yield",
                    "confidence": "94.2%"
                },
                "optimization_options": []
            }

        # -------------------------------------------------------------
        # 12. SLOPE INSTABILITY
        # -------------------------------------------------------------
        elif norm_scen_type == "SLOPE_INSTABILITY":
            loss_pct = round(min(44.0, max(14.0, (18.5 * sev_mult * horizon_factor))), 1)
            loss_t = int(target * (loss_pct / 100.0))
            projected_yield = max(0, target - loss_t)
            shortfall_prob = round(min(0.94, max(0.64, 0.72 * sev_mult)), 2)

            return {
                "scenario_id": f"SCEN-SLOPE-{pfx}",
                "scenario_type": "SLOPE_INSTABILITY",
                "mine_id": mine["id"],
                "mine_name": mine["name"],
                "severity": severity,
                "time_horizon": time_horizon,
                "status_variant": "hazard",
                "is_detected": True,
                "headline": f"Bench 04 Slope Radar Displacement Alert (>14mm Creep Rate)",
                "baseline_production_target": target,
                "projected_yield_tonnes": projected_yield,
                "predicted_loss_tonnes": loss_t,
                "shortfall_probability": shortfall_prob,
                "shortfall_probability_pct": f"{shortfall_prob * 100:.1f}%",
                "effective_rainfall_mm": 20.0,
                "effective_sump_inflow_m3h": mine["drainageBaselineM3h"],
                "crusher_vibration_mms": mine["crusherVibBase"],
                "crusher_utilization_pct": 66.0,
                "fleet_health_pct": 75.0,
                "equipment_failure_probability": 0.55,
                "anomaly_score": -0.30,
                "overall_risk_level": "ELEVATED",
                "composite_trust_score": "92.0%",
                "evidence_factors": [
                    {"rank": "01", "factor": "Ground Slope Stability Radar (SSR) Prism Vector", "impactPct": 56.0, "direction": "risk_elevating", "category": "Telemetry", "detail": "North bench crest deformation velocity exceeds safety threshold."}
                ],
                "causal_chain": [
                    "Tension crack dilation detected on Upper Bench 04",
                    "Safety exclusion perimeter established around shovel face EX-17",
                    "Haulage cycle re-routed around unstable highwall toe"
                ],
                "recommendation": {
                    "action_id": f"PROTO-{pfx}-SLOPE",
                    "title": "Highwall Dewatering & Safety Berm Re-Profiling",
                    "what_to_do": "1. Drill horizontal depressurization drain holes.\n2. Move shovel EX-17 to Stable South Bench 02.",
                    "why": f"Maintains worker safety while salvaging {int(loss_t * 0.82):,} Tonnes.",
                    "expected_impact": f"+{int(loss_t * 0.82):,} T Protected Yield",
                    "confidence": "93.8%"
                },
                "optimization_options": []
            }

        # -------------------------------------------------------------
        # 13. EXTREME RAINFALL / CLOUDBURST
        # -------------------------------------------------------------
        elif norm_scen_type == "EXTREME_RAINFALL":
            effective_rain = round((140.0 + sens * 20.0) * sev_mult, 1)
            effective_inflow = round((mine["drainageBaselineM3h"] + 45.0 * sens) * sev_mult, 1)
            loss_pct = round(min(58.0, max(25.0, (26.0 * sens * sev_mult * horizon_factor))), 1)
            loss_t = int(target * (loss_pct / 100.0))
            projected_yield = max(0, target - loss_t)
            shortfall_prob = round(min(0.99, max(0.85, 0.90 * sev_mult)), 2)

            return {
                "scenario_id": f"SCEN-RAIN-{pfx}",
                "scenario_type": "EXTREME_RAINFALL",
                "mine_id": mine["id"],
                "mine_name": mine["name"],
                "severity": severity,
                "time_horizon": time_horizon,
                "status_variant": "hazard",
                "is_detected": True,
                "headline": f"Severe Cloudburst Flash Inundation ({effective_rain}mm Precipitation)",
                "baseline_production_target": target,
                "projected_yield_tonnes": projected_yield,
                "predicted_loss_tonnes": loss_t,
                "shortfall_probability": shortfall_prob,
                "shortfall_probability_pct": f"{shortfall_prob * 100:.1f}%",
                "effective_rainfall_mm": effective_rain,
                "effective_sump_inflow_m3h": effective_inflow,
                "crusher_vibration_mms": mine["crusherVibBase"],
                "crusher_utilization_pct": 52.0,
                "fleet_health_pct": 55.0,
                "equipment_failure_probability": 0.40,
                "anomaly_score": -0.42,
                "overall_risk_level": "CRITICAL",
                "composite_trust_score": "90.0%",
                "evidence_factors": [
                    {"rank": "01", "factor": f"Record 2-Hour Precipitation Inflow ({effective_rain}mm)", "impactPct": 60.0, "direction": "risk_elevating", "category": "Telemetry", "detail": "Pit rim peripheral ditches overwhelmed by flash runoff."}
                ],
                "causal_chain": [
                    f"Catastrophic cloudburst of {effective_rain}mm causes surface flooding",
                    "Haul road friction drops below 0.22, halting loaded haulage dumpers",
                    "Sump water ingress peaks at emergency capacity"
                ],
                "recommendation": {
                    "action_id": f"PROTO-{pfx}-RAIN",
                    "title": "Emergency Peripheral Sump Diversion Protocol",
                    "what_to_do": "1. Deploy mobile flood barrier at main haul portal.\n2. Engage all 3 auxiliary 450kW pump banks.",
                    "why": f"Saves pit floor from submergence and protects {int(loss_t * 0.80):,} Tonnes.",
                    "expected_impact": f"+{int(loss_t * 0.80):,} T Protected Yield",
                    "confidence": "92.5%"
                },
                "optimization_options": []
            }

        # -------------------------------------------------------------
        # 14. VENTILATION FAILURE
        # -------------------------------------------------------------
        elif norm_scen_type == "VENTILATION_FAILURE":
            loss_pct = round(min(45.0, max(15.0, (19.0 * sev_mult * horizon_factor))), 1)
            loss_t = int(target * (loss_pct / 100.0))
            projected_yield = max(0, target - loss_t)
            shortfall_prob = round(min(0.95, max(0.68, 0.75 * sev_mult)), 2)

            return {
                "scenario_id": f"SCEN-VENT-{pfx}",
                "scenario_type": "VENTILATION_FAILURE",
                "mine_id": mine["id"],
                "mine_name": mine["name"],
                "severity": severity,
                "time_horizon": time_horizon,
                "status_variant": "hazard",
                "is_detected": True,
                "headline": f"Underground Downcast Shaft Fan #2 Vane Pitch Fault",
                "baseline_production_target": target,
                "projected_yield_tonnes": projected_yield,
                "predicted_loss_tonnes": loss_t,
                "shortfall_probability": shortfall_prob,
                "shortfall_probability_pct": f"{shortfall_prob * 100:.1f}%",
                "effective_rainfall_mm": 10.0,
                "effective_sump_inflow_m3h": mine["drainageBaselineM3h"],
                "crusher_vibration_mms": mine["crusherVibBase"],
                "crusher_utilization_pct": 60.0,
                "fleet_health_pct": 66.0,
                "equipment_failure_probability": 0.70,
                "anomaly_score": -0.33,
                "overall_risk_level": "CRITICAL",
                "composite_trust_score": "91.2%",
                "evidence_factors": [
                    {"rank": "01", "factor": "Airflow Velocity Drop (-38% in -180m Drift)", "impactPct": 64.0, "direction": "risk_elevating", "category": "Telemetry", "detail": "CO gas sensor detects localized concentration rise at drill face."}
                ],
                "causal_chain": [
                    "Axial ventilation fan hydraulic pitch cylinder leaks fluid",
                    "Underground air exchange rate falls below DGMS statutory standard",
                    "Personnel evacuated from active extraction stopes until airflow restored"
                ],
                "recommendation": {
                    "action_id": f"PROTO-{pfx}-VENT",
                    "title": "Standby Booster Fan Engagement & Airway Re-Routing",
                    "what_to_do": "1. Start standby 250kW centrifugal booster fan.\n2. Open regulatory ventilation regulator door 3B.",
                    "why": f"Restores statutory airflow in 35 min and saves {int(loss_t * 0.85):,} Tonnes.",
                    "expected_impact": f"+{int(loss_t * 0.85):,} T Protected Yield",
                    "confidence": "95.5%"
                },
                "optimization_options": []
            }

        # -------------------------------------------------------------
        # 15. BLASTING DISRUPTION
        # -------------------------------------------------------------
        else: # BLASTING_DISRUPTION
            loss_pct = round(min(32.0, max(10.0, (12.5 * sev_mult * horizon_factor))), 1)
            loss_t = int(target * (loss_pct / 100.0))
            projected_yield = max(0, target - loss_t)
            shortfall_prob = round(min(0.88, max(0.50, 0.62 * sev_mult)), 2)

            return {
                "scenario_id": f"SCEN-BLAST-{pfx}",
                "scenario_type": "BLASTING_DISRUPTION",
                "mine_id": mine["id"],
                "mine_name": mine["name"],
                "severity": severity,
                "time_horizon": time_horizon,
                "status_variant": "hazard",
                "is_detected": True,
                "headline": f"Bench 03 Production Blast Firing Circuit Delay (Safety Cordon Extended)",
                "baseline_production_target": target,
                "projected_yield_tonnes": projected_yield,
                "predicted_loss_tonnes": loss_t,
                "shortfall_probability": shortfall_prob,
                "shortfall_probability_pct": f"{shortfall_prob * 100:.1f}%",
                "effective_rainfall_mm": 10.0,
                "effective_sump_inflow_m3h": mine["drainageBaselineM3h"],
                "crusher_vibration_mms": mine["crusherVibBase"],
                "crusher_utilization_pct": 76.0,
                "fleet_health_pct": 80.0,
                "equipment_failure_probability": 0.35,
                "anomaly_score": -0.22,
                "overall_risk_level": "ELEVATED",
                "composite_trust_score": "93.5%",
                "evidence_factors": [
                    {"rank": "01", "factor": "Electronic Detonator Continuity Disconnect", "impactPct": 52.0, "direction": "risk_elevating", "category": "Telemetry", "detail": "Hole 24 lead wire severed during stemming, holding blast window."}
                ],
                "causal_chain": [
                    "Continuity check fail requires re-testing of 48 blast holes",
                    "Mine wide 500m safety clearance zone keeps fleet idle for 1.8 hours",
                    "Postponed blast delays fresh blasted ore feed to loading shovels"
                ],
                "recommendation": {
                    "action_id": f"PROTO-{pfx}-BLAST",
                    "title": "Rapid Detonator Re-Wiring & Shovel Stockpile Blending",
                    "what_to_do": "1. Bridge severed line with backup electronic harness.\n2. Dispatch haul dumpers to secondary blasted bench 01.",
                    "why": f"Limits blast delay to 30 min and preserves {int(loss_t * 0.88):,} Tonnes.",
                    "expected_impact": f"+{int(loss_t * 0.88):,} T Protected Yield",
                    "confidence": "96.0%"
                },
                "optimization_options": []
            }

scenario_service = ScenarioService()
