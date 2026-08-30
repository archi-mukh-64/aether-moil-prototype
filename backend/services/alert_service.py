from datetime import datetime, timezone
from typing import Dict, Any, Optional, List
import copy
from ..utils.model_loader import model_registry
from ..utils.validation import normalize_mine_id
from .mine_service import mine_service, CANONICAL_MOIL_MINES

# Exhaustive Canonical 10-Mine Threat Matrix Dataset
CANONICAL_THREAT_CORPUS: List[Dict[str, Any]] = [
    # 1. BALAGHAT MINE (Underground Deep Shaft, 6200 TPD Target)
    {
        "id": "ALT-BAL-101",
        "mine_id": "balaghat",
        "mine_name": "Balaghat Mine",
        "state": "Madhya Pradesh",
        "title": "Primary Crusher High-Frequency Harmonic Vibration Drift",
        "description": "Spectral vibration on Crusher CR-BAL-01 reached 4.85 mm/s (normal: 2.1 mm/s). TreeSHAP attributes 34% risk to eccentric bearing race wear.",
        "severity": "CRITICAL",
        "category": "Mechanical",
        "source": "SCADA Telemetry & TreeSHAP",
        "sensor_type": "Tri-Axial Accelerometer (Piezoelectric)",
        "sensor_id": "VIB-CR-01",
        "risk_score": 89,
        "probability": "88%",
        "affected_system": "Primary Crushing Circuit",
        "affected_equipment": "Nordberg C160 Jaw Crusher (CR-BAL-01)",
        "production_impact_tpd": 1116,
        "financial_exposure": "₹1.62 Cr",
        "recommended_action": "Engage secondary jaw crusher standby and throttle feed conveyor to 70%.",
        "status": "ACTIVE",
        "acknowledgement_state": False,
        "escalation_state": False,
        "metadata": {"asset_id": "CR-BAL-01", "vibration_rms": 4.85, "temperature_c": 74.2, "threshold_rms": 2.1}
    },
    {
        "id": "ALT-BAL-102",
        "mine_id": "balaghat",
        "mine_name": "Balaghat Mine",
        "state": "Madhya Pradesh",
        "title": "-185m Level Sump Dewatering Ingress Surge",
        "description": "Inflow rate into main shaft drainage sump reached 820 m³/h vs maximum pump discharge rate of 900 m³/h (91.1% capacity utilization).",
        "severity": "HIGH",
        "category": "Hydrogeological",
        "source": "SCADA Flow Meter",
        "sensor_type": "Electromagnetic Flow Transducer",
        "sensor_id": "FLOW-SMP-01",
        "risk_score": 78,
        "probability": "76%",
        "affected_system": "Underground Dewatering Substation",
        "affected_equipment": "Kirloskar 250 kW High-Head Submersible (PUMP-BAL-01)",
        "production_impact_tpd": 720,
        "financial_exposure": "₹1.04 Cr",
        "recommended_action": "Start auxiliary 250 kW Kirloskar submersible pump on level 6 drainage header.",
        "status": "ACTIVE",
        "acknowledgement_state": False,
        "escalation_state": False,
        "metadata": {"level": "-185m Level", "flow_rate_m3h": 820, "pump_head_bar": 18.5}
    },
    {
        "id": "ALT-BAL-103",
        "mine_id": "balaghat",
        "mine_name": "Balaghat Mine",
        "state": "Madhya Pradesh",
        "title": "3.2MW Friction Winder Drive Thermal Anomaly",
        "description": "Stator winding thermal sensor on south shaft winder registered 78.4°C during high-speed hoisting cycle.",
        "severity": "ELEVATED",
        "category": "Electrical",
        "source": "Drive SCADA Telemetry",
        "sensor_type": "PT100 RTD Temperature Probe",
        "sensor_id": "TEMP-WND-02",
        "risk_score": 64,
        "probability": "62%",
        "affected_system": "Main Shaft Hoisting System",
        "affected_equipment": "3.2MW Thyristor Friction Winder (HOIST-BAL-01)",
        "production_impact_tpd": 450,
        "financial_exposure": "₹0.65 Cr",
        "recommended_action": "Reduce cage cycle acceleration by 15% and inspect forced-air cooling ducts.",
        "status": "ACTIVE",
        "acknowledgement_state": False,
        "escalation_state": False,
        "metadata": {"stator_temp_c": 78.4, "limit_temp_c": 85.0}
    },
    {
        "id": "ALT-BAL-104",
        "mine_id": "balaghat",
        "mine_name": "Balaghat Mine",
        "state": "Madhya Pradesh",
        "title": "Surface Stockpile Blending Grade Variance",
        "description": "Feed silica variance detected at 11.2% against 9.5% specification threshold for metallurgical furnace batching.",
        "severity": "LOW",
        "category": "Production",
        "source": "XRF Online Belt Analyzer",
        "sensor_type": "Prompt Gamma Neutron Activation",
        "sensor_id": "XRF-BLD-01",
        "risk_score": 28,
        "probability": "25%",
        "affected_system": "Surface Ore Blending Yard",
        "affected_equipment": "High-Grade Surge Stockpile (STK-BAL-04)",
        "production_impact_tpd": 120,
        "financial_exposure": "₹0.17 Cr",
        "recommended_action": "Adjust reclaimer draw from Stockpile Stack #2 to stabilize blend.",
        "status": "ACTIVE",
        "acknowledgement_state": False,
        "escalation_state": False,
        "metadata": {"sio2_pct": 11.2, "target_sio2_pct": 9.5}
    },

    # 2. DONGRI BUZURG MINE (Opencast & Beneficiation, 5400 TPD Target)
    {
        "id": "ALT-DON-201",
        "mine_id": "dongri-buzurg",
        "mine_name": "Dongri Buzurg Mine",
        "state": "Maharashtra",
        "title": "Dioxide Plant Beneficiation Feed Moisture Surge",
        "description": "ROM feed moisture reached 12.8% vs statutory mill target of <8.5%, risking screen blinding in dry magnetic separation line.",
        "severity": "HIGH",
        "category": "Production",
        "source": "Beneficiation SCADA",
        "sensor_type": "Microwave Moisture Analyzer",
        "sensor_id": "MST-MILL-01",
        "risk_score": 76,
        "probability": "74%",
        "affected_system": "Manganese Dioxide Beneficiation Plant",
        "affected_equipment": "High-Gradient Magnetic Separator (MILL-DON-01)",
        "production_impact_tpd": 640,
        "financial_exposure": "₹0.93 Cr",
        "recommended_action": "Blend feed with covered dry high-grade stockpile (Stack #4) at 1:1 ratio.",
        "status": "ACTIVE",
        "acknowledgement_state": False,
        "escalation_state": False,
        "metadata": {"feed_moisture_pct": 12.8, "target_moisture_pct": 8.5}
    },
    {
        "id": "ALT-DON-202",
        "mine_id": "dongri-buzurg",
        "mine_name": "Dongri Buzurg Mine",
        "state": "Maharashtra",
        "title": "South-West Bench Slope Groundwater Hydrostatic Pressure",
        "description": "Piezometer PIEZ-DON-03 indicated pore water pressure rise of +1.8 bar following catchment runoff influx.",
        "severity": "CRITICAL",
        "category": "Geotechnical",
        "source": "Slope Stability Radar & Piezometer",
        "sensor_type": "Vibrating Wire Piezometer",
        "sensor_id": "PIEZ-DON-03",
        "risk_score": 86,
        "probability": "84%",
        "affected_system": "Opencast South-West Highwall",
        "affected_equipment": "Bench 4 Geotechnical Anchor Network",
        "production_impact_tpd": 880,
        "financial_exposure": "₹1.28 Cr",
        "recommended_action": "Install horizontal depressurization weep-holes and restrict haulage to inner radius.",
        "status": "ACTIVE",
        "acknowledgement_state": False,
        "escalation_state": False,
        "metadata": {"pore_pressure_bar": 4.2, "threshold_bar": 3.0}
    },
    {
        "id": "ALT-DON-203",
        "mine_id": "dongri-buzurg",
        "mine_name": "Dongri Buzurg Mine",
        "state": "Maharashtra",
        "title": "Komatsu HD785 Haul Road Mud Slick Traction Loss",
        "description": "Sentinel-2 NDWI soil saturation index at 0.44 on main pit exit incline. Dumper cycle times extended by +5.8 min.",
        "severity": "ELEVATED",
        "category": "Environmental",
        "source": "Sentinel-2 Remote Sensing",
        "sensor_type": "Multi-Spectral NDWI & GPS Telemetry",
        "sensor_id": "SAT-S2-DON",
        "risk_score": 62,
        "probability": "60%",
        "affected_system": "Main Pit Haulage Gradient",
        "affected_equipment": "Komatsu HD785 Fleet (DUMP-DON-102)",
        "production_impact_tpd": 380,
        "financial_exposure": "₹0.55 Cr",
        "recommended_action": "Deploy CAT 16M motor grader with crushed aggregate ballast dressing.",
        "status": "ACTIVE",
        "acknowledgement_state": False,
        "escalation_state": False,
        "metadata": {"ndwi": 0.44, "haul_delay_min": 5.8}
    },

    # 3. CHIKLA MINE (Underground Incline & Stopes, 4050 TPD Target)
    {
        "id": "ALT-CHK-301",
        "mine_id": "chikla",
        "mine_name": "Chikla Mine",
        "state": "Maharashtra",
        "title": "Siliceous Ore Body Blend Ratio Fluctuation",
        "description": "Feed silica variance spiked to 14.8% (tolerance: 10.5%), disrupting ferro-alloy grade dispatch specs.",
        "severity": "MEDIUM",
        "category": "Production",
        "source": "XRF Online Analyzer",
        "sensor_type": "Energy Dispersive X-Ray Fluorescence",
        "sensor_id": "XRF-CHK-01",
        "risk_score": 54,
        "probability": "52%",
        "affected_system": "Crushing & Blending Plant",
        "affected_equipment": "Secondary Cone Crusher Circuit (CR-CHK-02)",
        "production_impact_tpd": 320,
        "financial_exposure": "₹0.46 Cr",
        "recommended_action": "Re-route LHD dispatch to Stope 12B high-grade low-silica face.",
        "status": "ACTIVE",
        "acknowledgement_state": False,
        "escalation_state": False,
        "metadata": {"sio2_pct": 14.8, "target_sio2_pct": 10.5}
    },
    {
        "id": "ALT-CHK-302",
        "mine_id": "chikla",
        "mine_name": "Chikla Mine",
        "state": "Maharashtra",
        "title": "Level 4 Sub-Level Stoping Crown Pillar Convergence",
        "description": "Multipoint extensometer EXT-CHK-04 logged 4.1 mm micro-strain acceleration across 72 hours.",
        "severity": "HIGH",
        "category": "Geotechnical",
        "source": "Geotechnical Telemetry",
        "sensor_type": "Magnetic Extensometer Probe",
        "sensor_id": "EXT-CHK-04",
        "risk_score": 74,
        "probability": "72%",
        "affected_system": "Level 4 Crown Support",
        "affected_equipment": "Cable-Bolted Crown Stope (Stope-4B)",
        "production_impact_tpd": 580,
        "financial_exposure": "₹0.84 Cr",
        "recommended_action": "Halt stoping in 4B and install additional resin-grouted steel cable anchors.",
        "status": "ACTIVE",
        "acknowledgement_state": False,
        "escalation_state": False,
        "metadata": {"displacement_mm": 4.1, "threshold_mm": 5.0}
    },
    {
        "id": "ALT-CHK-303",
        "mine_id": "chikla",
        "mine_name": "Chikla Mine",
        "state": "Maharashtra",
        "title": "Submersible Dewatering Sump Pump Cavitation",
        "description": "Vibration harmonics on Pump PUMP-CHK-02 indicated impeller cavitation under high discharge head.",
        "severity": "ELEVATED",
        "category": "Hydrogeological",
        "source": "Pump Vibration SCADA",
        "sensor_type": "Acoustic Cavitation Transducer",
        "sensor_id": "PUMP-CHK-02",
        "risk_score": 60,
        "probability": "58%",
        "affected_system": "Incline Drainage Header",
        "affected_equipment": "150 kW Multi-Stage Centrifugal Pump (PUMP-CHK-02)",
        "production_impact_tpd": 260,
        "financial_exposure": "₹0.38 Cr",
        "recommended_action": "Purge suction strainer and reduce valve throttling to stabilize NPSH.",
        "status": "ACTIVE",
        "acknowledgement_state": False,
        "escalation_state": False,
        "metadata": {"cavitation_index": 0.78, "head_bar": 14.2}
    },

    # 4. GUMGAON MINE (Deep Underground Shaft, 3400 TPD Target)
    {
        "id": "ALT-GUM-401",
        "mine_id": "gumgaon",
        "mine_name": "Gumgaon Mine",
        "state": "Maharashtra",
        "title": "6.6 kV Substation 3 Total Harmonic Distortion Spike",
        "description": "THD on 6.6 kV winding hoist feeder increased to 8.2% (DGMS statutory limit: 5.0%).",
        "severity": "ELEVATED",
        "category": "Electrical",
        "source": "Power Quality SCADA",
        "sensor_type": "Digital Power Meter & Spectrum Analyzer",
        "sensor_id": "USS-GUM-03",
        "risk_score": 63,
        "probability": "61%",
        "affected_system": "Underground Power Distribution Grid",
        "affected_equipment": "Main 6.6kV Substation (USS-03)",
        "production_impact_tpd": 340,
        "financial_exposure": "₹0.49 Cr",
        "recommended_action": "Engage active harmonic filter bank #2 and schedule thermographic transformer audit.",
        "status": "ACTIVE",
        "acknowledgement_state": False,
        "escalation_state": False,
        "metadata": {"thd_pct": 8.2, "limit_thd_pct": 5.0}
    },
    {
        "id": "ALT-GUM-402",
        "mine_id": "gumgaon",
        "mine_name": "Gumgaon Mine",
        "state": "Maharashtra",
        "title": "Deep Shaft Cage Hoist Brake Line Pressure Anomaly",
        "description": "Hydraulic brake back-pressure on friction winder dropped by 14% below statutory fail-safe threshold.",
        "severity": "CRITICAL",
        "category": "Mechanical",
        "source": "Hoist Safety SCADA",
        "sensor_type": "Dual Piezo-Resistive Pressure Transducer",
        "sensor_id": "BRK-HOIST-01",
        "risk_score": 88,
        "probability": "86%",
        "affected_system": "Vertical Shaft Hoisting System",
        "affected_equipment": "Double-Drum Service Cage Hoist (HOIST-GUM-01)",
        "production_impact_tpd": 950,
        "financial_exposure": "₹1.38 Cr",
        "recommended_action": "Engage secondary mechanical caliper lock and cycle hydraulic fluid accumulator.",
        "status": "ACTIVE",
        "acknowledgement_state": False,
        "escalation_state": False,
        "metadata": {"brake_pressure_bar": 122, "target_pressure_bar": 140}
    },
    {
        "id": "ALT-GUM-403",
        "mine_id": "gumgaon",
        "mine_name": "Gumgaon Mine",
        "state": "Maharashtra",
        "title": "Stope Level 5 Return Air Carbon Monoxide Rise",
        "description": "Electrochemical CO sensor detected 24 ppm in return airway following blasting shift (DGMS threshold: 50 ppm).",
        "severity": "MEDIUM",
        "category": "Environmental",
        "source": "Atmospheric Mine Telemetry",
        "sensor_type": "Electrochemical Gas Sensor",
        "sensor_id": "GAS-GUM-02",
        "risk_score": 48,
        "probability": "45%",
        "affected_system": "Underground Auxiliary Ventilation",
        "affected_equipment": "Level 5 Forcing Booster Fan (FAN-GUM-05)",
        "production_impact_tpd": 180,
        "financial_exposure": "₹0.26 Cr",
        "recommended_action": "Increase booster fan output to 18 m³/s for 30 min before worker clearance.",
        "status": "ACTIVE",
        "acknowledgement_state": False,
        "escalation_state": False,
        "metadata": {"co_ppm": 24, "threshold_ppm": 50}
    },

    # 5. TIRODI MINE (Opencast & Incline, 3100 TPD Target)
    {
        "id": "ALT-TIR-501",
        "mine_id": "tirodi",
        "mine_name": "Tirodi Mine",
        "state": "Madhya Pradesh",
        "title": "West Pit 8% Switchback Ramp Traction Loss",
        "description": "Satellite NDWI soil moisture at 0.42 on pit switchback. Heavy dumper cycle times extended by +6.2 min.",
        "severity": "ELEVATED",
        "category": "Environmental",
        "source": "Sentinel-2 Remote Sensing",
        "sensor_type": "Multi-Spectral Soil Saturation Index",
        "sensor_id": "SAT-S2-TIR",
        "risk_score": 65,
        "probability": "64%",
        "affected_system": "Pit Haulage Transport Corridor",
        "affected_equipment": "Main West Ramp (RAMP-TIR-01)",
        "production_impact_tpd": 420,
        "financial_exposure": "₹0.61 Cr",
        "recommended_action": "Deploy motor grader with crushed aggregate dressing on switchbacks 3 and 4.",
        "status": "ACTIVE",
        "acknowledgement_state": False,
        "escalation_state": False,
        "metadata": {"ndwi": 0.42, "cycle_time_delay_min": 6.2}
    },
    {
        "id": "ALT-TIR-502",
        "mine_id": "tirodi",
        "mine_name": "Tirodi Mine",
        "state": "Madhya Pradesh",
        "title": "Primary Gyratory Crusher Lubrication Pressure Drop",
        "description": "Main bearing oil differential pressure decreased to 1.8 bar (normal: 2.8 bar) with oil temperature at 69°C.",
        "severity": "HIGH",
        "category": "Mechanical",
        "source": "Crusher SCADA Lube Unit",
        "sensor_type": "Differential Pressure Sensor",
        "sensor_id": "LUBE-CR-01",
        "risk_score": 79,
        "probability": "77%",
        "affected_system": "Primary Crushing Plant",
        "affected_equipment": "Metso Gyratory Primary Crusher (CR-TIR-01)",
        "production_impact_tpd": 710,
        "financial_exposure": "₹1.03 Cr",
        "recommended_action": "Switch to auxiliary lube pump B and replace duplex oil filter cartridge.",
        "status": "ACTIVE",
        "acknowledgement_state": False,
        "escalation_state": False,
        "metadata": {"lube_pressure_bar": 1.8, "target_pressure_bar": 2.8}
    },
    {
        "id": "ALT-TIR-503",
        "mine_id": "tirodi",
        "mine_name": "Tirodi Mine",
        "state": "Madhya Pradesh",
        "title": "Pit Sump Catchment Overflow Margin Warning",
        "description": "Water level in pit bottom central sump reached 78% of freeboard capacity following afternoon rain.",
        "severity": "MEDIUM",
        "category": "Hydrogeological",
        "source": "Level Radar Sensor",
        "sensor_type": "FMCW Radar Level Gauge",
        "sensor_id": "SUMP-TIR-01",
        "risk_score": 52,
        "probability": "50%",
        "affected_system": "Pit Dewatering Circuit",
        "affected_equipment": "Main Pit Sump Battery (SUMP-TIR-01)",
        "production_impact_tpd": 290,
        "financial_exposure": "₹0.42 Cr",
        "recommended_action": "Start second 110 kW high-volume pump and clear perimeter drainage ditch.",
        "status": "ACTIVE",
        "acknowledgement_state": False,
        "escalation_state": False,
        "metadata": {"sump_level_pct": 78, "freeboard_m": 1.2}
    },

    # 6. KANDRI MINE (Opencast & Underground, 2800 TPD Target)
    {
        "id": "ALT-KAN-601",
        "mine_id": "kandri",
        "mine_name": "Kandri Mine",
        "state": "Maharashtra",
        "title": "Stope 4A Hanging Wall Extensometer Micro-Displacement Alert",
        "description": "Multipoint borehole extensometer MPBX-04 measured 3.8 mm displacement over 48h in Stope 4A.",
        "severity": "CRITICAL",
        "category": "Geotechnical",
        "source": "DGMS Geotechnical Sensor",
        "sensor_type": "Multipoint Borehole Extensometer",
        "sensor_id": "MPBX-04",
        "risk_score": 91,
        "probability": "89%",
        "affected_system": "Underground Stope Structural Support",
        "affected_equipment": "Stope 4A Hanging Wall Horizon",
        "production_impact_tpd": 820,
        "financial_exposure": "₹1.19 Cr",
        "recommended_action": "Halt production drilling in Stope 4A, install secondary resin cable bolts, notify Safety Officer.",
        "status": "ACTIVE",
        "acknowledgement_state": False,
        "escalation_state": False,
        "metadata": {"displacement_mm": 3.8, "threshold_mm": 5.0}
    },
    {
        "id": "ALT-KAN-602",
        "mine_id": "kandri",
        "mine_name": "Kandri Mine",
        "state": "Maharashtra",
        "title": "Opencast Highwall Radar Micro-Strain Velocity Acceleration",
        "description": "Interferometric slope stability radar detected 1.2 mm/day deformation vector on north-east bench face.",
        "severity": "HIGH",
        "category": "Geotechnical",
        "source": "Slope Stability Radar (SSR)",
        "sensor_type": "Ground-Based SAR Interferometry",
        "sensor_id": "SSR-KAN-01",
        "risk_score": 77,
        "probability": "75%",
        "affected_system": "North-East Opencast Highwall",
        "affected_equipment": "Bench 6 Critical Slope Area",
        "production_impact_tpd": 610,
        "financial_exposure": "₹0.88 Cr",
        "recommended_action": "Establish 30m exclusion perimeter below Bench 6 and increase radar scan frequency to 2 min.",
        "status": "ACTIVE",
        "acknowledgement_state": False,
        "escalation_state": False,
        "metadata": {"velocity_mm_day": 1.2, "alert_threshold": 1.0}
    },
    {
        "id": "ALT-KAN-603",
        "mine_id": "kandri",
        "mine_name": "Kandri Mine",
        "state": "Maharashtra",
        "title": "Haul Fleet Komatsu HD785 Engine Coolant Temperature Warning",
        "description": "Telemetry on Dumper TRK-KAN-03 logged coolant temp of 98°C during full-payload uphill grade haul.",
        "severity": "LOW",
        "category": "Equipment",
        "source": "Komatsu Telemetry",
        "sensor_type": "Engine CAN-bus Telemetry",
        "sensor_id": "TRK-KAN-03",
        "risk_score": 34,
        "probability": "30%",
        "affected_system": "HEMM Haulage Fleet",
        "affected_equipment": "Komatsu HD785 Dump Truck (TRK-KAN-03)",
        "production_impact_tpd": 140,
        "financial_exposure": "₹0.20 Cr",
        "recommended_action": "Inspect radiator fan viscous clutch and clean debris from heat exchanger mesh.",
        "status": "ACTIVE",
        "acknowledgement_state": False,
        "escalation_state": False,
        "metadata": {"coolant_temp_c": 98, "max_temp_c": 105}
    },

    # 7. MUNSAR MINE (Opencast & Incline, 2400 TPD Target)
    {
        "id": "ALT-MUN-701",
        "mine_id": "munsar",
        "mine_name": "Munsar Mine",
        "state": "Maharashtra",
        "title": "East Wall Settling Pond Runoff Suspended Solids Surge",
        "description": "Water quality monitor logged suspended solids at 145 mg/L in settling basin discharge (SPCB limit: 100 mg/L).",
        "severity": "LOW",
        "category": "Environmental",
        "source": "Environmental SCADA",
        "sensor_type": "Optical Turbidity Transducer",
        "sensor_id": "ENV-MUN-01",
        "risk_score": 36,
        "probability": "32%",
        "affected_system": "Perimeter Environmental Drainage",
        "affected_equipment": "East Wall Settling Pond Basin #2",
        "production_impact_tpd": 90,
        "financial_exposure": "₹0.13 Cr",
        "recommended_action": "Divert outflow to secondary retention pond and activate automated polymer flocculant dosing.",
        "status": "ACTIVE",
        "acknowledgement_state": False,
        "escalation_state": False,
        "metadata": {"tss_mgl": 145, "limit_tss_mgl": 100}
    },
    {
        "id": "ALT-MUN-702",
        "mine_id": "munsar",
        "mine_name": "Munsar Mine",
        "state": "Maharashtra",
        "title": "Jaw Crusher Eccentric Bushing Thermal Gradient",
        "description": "Temperature probe on Jaw Crusher CR-MUN-01 main bearing reached 74.5°C during continuous shift crushing.",
        "severity": "HIGH",
        "category": "Mechanical",
        "source": "Crusher Bearing SCADA",
        "sensor_type": "Bearing Temperature RTD",
        "sensor_id": "TEMP-CR-MUN",
        "risk_score": 72,
        "probability": "70%",
        "affected_system": "Primary Crushing Plant",
        "affected_equipment": "Jaw Crusher (CR-MUN-01)",
        "production_impact_tpd": 480,
        "financial_exposure": "₹0.70 Cr",
        "recommended_action": "Flush lubrication circuit with ISO VG 220 oil and verify grease injection frequency.",
        "status": "ACTIVE",
        "acknowledgement_state": False,
        "escalation_state": False,
        "metadata": {"temp_c": 74.5, "limit_temp_c": 80.0}
    },
    {
        "id": "ALT-MUN-703",
        "mine_id": "munsar",
        "mine_name": "Munsar Mine",
        "state": "Maharashtra",
        "title": "Haulage Bench 3 Dust Suppression Pressure Loss",
        "description": "Perimeter water misting pipeline pressure dropped to 1.2 bar due to nozzle line particulate clogging.",
        "severity": "LOW",
        "category": "Environmental",
        "source": "Dust Suppression SCADA",
        "sensor_type": "Water Pressure Transmitter",
        "sensor_id": "DUST-MUN-01",
        "risk_score": 24,
        "probability": "20%",
        "affected_system": "Haul Road Environmental Control",
        "affected_equipment": "Bench 3 Misting Header",
        "production_impact_tpd": 60,
        "financial_exposure": "₹0.09 Cr",
        "recommended_action": "Backflush misting header line filter and clear spray nozzles.",
        "status": "ACTIVE",
        "acknowledgement_state": False,
        "escalation_state": False,
        "metadata": {"pressure_bar": 1.2, "target_bar": 3.5}
    },

    # 8. BHANDARA MINE (Beldongri Operations, 1950 TPD Target)
    {
        "id": "ALT-BHA-801",
        "mine_id": "bhandara",
        "mine_name": "Bhandara Mine (Beldongri)",
        "state": "Maharashtra",
        "title": "Siding Conveyor Belt Drift Alignment Sensor Trip",
        "description": "Overland rail loadout conveyor CNV-BHA-01 exhibited 35mm lateral tracking drift under wet ore loading.",
        "severity": "MEDIUM",
        "category": "Mechanical",
        "source": "Conveyor Safety SCADA",
        "sensor_type": "Belt Sway Limit Switch",
        "sensor_id": "SWAY-CNV-01",
        "risk_score": 50,
        "probability": "48%",
        "affected_system": "Rail Siding Dispatch Conveyor",
        "affected_equipment": "800mm Overland Loadout Conveyor (CNV-BHA-01)",
        "production_impact_tpd": 280,
        "financial_exposure": "₹0.41 Cr",
        "recommended_action": "Adjust self-aligning training idlers at transfer chute 2 and clear buildup.",
        "status": "ACTIVE",
        "acknowledgement_state": False,
        "escalation_state": False,
        "metadata": {"sway_drift_mm": 35, "threshold_mm": 50}
    },
    {
        "id": "ALT-BHA-802",
        "mine_id": "bhandara",
        "mine_name": "Bhandara Mine (Beldongri)",
        "state": "Maharashtra",
        "title": "Pit Drainage Sump Groundwater Inflow Surge",
        "description": "Pit bottom sump inflow increased to 340 m³/h vs rated pump battery discharge of 380 m³/h.",
        "severity": "HIGH",
        "category": "Hydrogeological",
        "source": "Pit Flow Sensor",
        "sensor_type": "Ultrasonic Flow Transmitter",
        "sensor_id": "SUMP-BHA-01",
        "risk_score": 71,
        "probability": "69%",
        "affected_system": "Pit Dewatering Circuit",
        "affected_equipment": "Main Pit Sump Pump Station",
        "production_impact_tpd": 390,
        "financial_exposure": "₹0.57 Cr",
        "recommended_action": "Deploy standby diesel pump unit to prevent bench toe flooding.",
        "status": "ACTIVE",
        "acknowledgement_state": False,
        "escalation_state": False,
        "metadata": {"inflow_m3h": 340, "capacity_m3h": 380}
    },
    {
        "id": "ALT-BHA-803",
        "mine_id": "bhandara",
        "mine_name": "Bhandara Mine (Beldongri)",
        "state": "Maharashtra",
        "title": "High-Grade Stockpile Blending Segregation",
        "description": "Fines ratio in dispatch stockpile Stack #2 exceeded 28%, risking moisture agglomeration.",
        "severity": "LOW",
        "category": "Production",
        "source": "Stockpile Quality Log",
        "sensor_type": "Laser Particle Size Analyzer",
        "sensor_id": "PSA-BHA-01",
        "risk_score": 30,
        "probability": "28%",
        "affected_system": "Surface Stacking Yard",
        "affected_equipment": "Stockpile Yard (STK-BHA-02)",
        "production_impact_tpd": 110,
        "financial_exposure": "₹0.16 Cr",
        "recommended_action": "Re-blend with lump fraction from primary screen discharge.",
        "status": "ACTIVE",
        "acknowledgement_state": False,
        "escalation_state": False,
        "metadata": {"fines_pct": 28, "target_fines_pct": 18}
    },

    # 9. UKWA MINE (Underground Adit & Incline, 1800 TPD Target)
    {
        "id": "ALT-UKW-901",
        "mine_id": "ukwa",
        "mine_name": "Ukwa Mine",
        "state": "Madhya Pradesh",
        "title": "Adit 2 Low-Phosphorus Ore Silo Level Buffer Depletion",
        "description": "Buffer storage in low-phosphorus surge bin dropped to 178T (critical buffer threshold: 400T).",
        "severity": "MEDIUM",
        "category": "Production",
        "source": "Ultrasonic Level Radar",
        "sensor_type": "Continuous Radar Bin Level Transmitter",
        "sensor_id": "SILO-UKW-02",
        "risk_score": 49,
        "probability": "47%",
        "affected_system": "Adit 2 Ore Bin Dispatch",
        "affected_equipment": "Surface Concrete Surge Silo (SILO-UKW-02)",
        "production_impact_tpd": 260,
        "financial_exposure": "₹0.38 Cr",
        "recommended_action": "Prioritize electric locomotive tramming from decline 3 to maintain 50 TPH refill rate.",
        "status": "ACTIVE",
        "acknowledgement_state": False,
        "escalation_state": False,
        "metadata": {"silo_level_t": 178, "target_buffer_t": 400}
    },
    {
        "id": "ALT-UKW-902",
        "mine_id": "ukwa",
        "mine_name": "Ukwa Mine",
        "state": "Madhya Pradesh",
        "title": "Main Underground Ventilation Fan 2 V-Belt Slip",
        "description": "Airflow through Adit 2 dropped from 62 m³/s to 48 m³/s due to ventilation drive belt tension slack.",
        "severity": "HIGH",
        "category": "Environmental",
        "source": "Ventilation SCADA",
        "sensor_type": "Thermal Anemometer Air Velocity Sensor",
        "sensor_id": "FAN-UKW-02",
        "risk_score": 75,
        "probability": "73%",
        "affected_system": "Main Adit Ventilation Circuit",
        "affected_equipment": "Primary Exhaust Axial Fan (FAN-UKW-02)",
        "production_impact_tpd": 520,
        "financial_exposure": "₹0.75 Cr",
        "recommended_action": "Engage standby auxiliary fan and adjust drive belt tensioning pulley.",
        "status": "ACTIVE",
        "acknowledgement_state": False,
        "escalation_state": False,
        "metadata": {"airflow_m3s": 48, "target_airflow_m3s": 62}
    },
    {
        "id": "ALT-UKW-903",
        "mine_id": "ukwa",
        "mine_name": "Ukwa Mine",
        "state": "Madhya Pradesh",
        "title": "Decline 3 Rail Tramming Track Gauge Variance",
        "description": "Track gauge expansion of +18mm measured on decline curve 2, risking mine car derailment.",
        "severity": "ELEVATED",
        "category": "Mechanical",
        "source": "Track Telemetry Inspection",
        "sensor_type": "Track Geometry Trolley Scanner",
        "sensor_id": "TRK-UKW-03",
        "risk_score": 58,
        "probability": "56%",
        "affected_system": "Underground Rail Tramming Haulage",
        "affected_equipment": "Decline 3 600mm Track Rail (TRK-UKW-03)",
        "production_impact_tpd": 310,
        "financial_exposure": "₹0.45 Cr",
        "recommended_action": "Re-spike ties and install steel gauge tie rods along curve 2.",
        "status": "ACTIVE",
        "acknowledgement_state": False,
        "escalation_state": False,
        "metadata": {"gauge_variance_mm": 18, "threshold_mm": 25}
    },

    # 10. RAMTEK OPERATIONS (Underground Small Horizon, 1600 TPD Target)
    {
        "id": "ALT-RAM-1001",
        "mine_id": "ramtek",
        "mine_name": "Ramtek Operations",
        "state": "Maharashtra",
        "title": "Excavator EX-RAM-02 Hydraulic Fluid Thermal Warning",
        "description": "Excavator EX-RAM-02 hydraulic tank temperature reached 88°C during peak ambient afternoon heat.",
        "severity": "MEDIUM",
        "category": "Equipment",
        "source": "Komatsu Telemetry",
        "sensor_type": "Hydraulic Oil Temperature Transmitter",
        "sensor_id": "EX-RAM-02",
        "risk_score": 53,
        "probability": "51%",
        "affected_system": "HEMM Loading Fleet",
        "affected_equipment": "Tata-Hitachi EX200 Hydraulic Shovel (EX-RAM-02)",
        "production_impact_tpd": 210,
        "financial_exposure": "₹0.30 Cr",
        "recommended_action": "Cycle excavator to shaded inspection stall and blow down hydraulic cooler fins.",
        "status": "ACTIVE",
        "acknowledgement_state": False,
        "escalation_state": False,
        "metadata": {"hydraulic_temp_c": 88, "threshold_temp_c": 92}
    },
    {
        "id": "ALT-RAM-1002",
        "mine_id": "ramtek",
        "mine_name": "Ramtek Operations",
        "state": "Maharashtra",
        "title": "Incline Haul Rope Tension Dynamic Load Drift",
        "description": "Peak tensile stress on incline haulage wire rope spiked by +18% during loaded car ascent.",
        "severity": "HIGH",
        "category": "Mechanical",
        "source": "Incline Winder Load Cell",
        "sensor_type": "Tension Load Cell Pin",
        "sensor_id": "ROPE-RAM-01",
        "risk_score": 73,
        "probability": "71%",
        "affected_system": "Incline Tub Haulage System",
        "affected_equipment": "Main Incline 28mm Steel Wire Rope (ROPE-RAM-01)",
        "production_impact_tpd": 360,
        "financial_exposure": "₹0.52 Cr",
        "recommended_action": "Inspect rope for broken wire clusters and limit car train load to 6 tubs.",
        "status": "ACTIVE",
        "acknowledgement_state": False,
        "escalation_state": False,
        "metadata": {"tension_spike_pct": 18, "max_load_kn": 145}
    },
    {
        "id": "ALT-RAM-1003",
        "mine_id": "ramtek",
        "mine_name": "Ramtek Operations",
        "state": "Maharashtra",
        "title": "Tailings Settling Pond Level Indicator Calibration Anomaly",
        "description": "Dual level transmitters on settling pond #1 exhibited 0.45m reading discrepancy.",
        "severity": "LOW",
        "category": "Environmental",
        "source": "Environmental SCADA",
        "sensor_type": "Dual Ultrasonic & Hydrostatic Sensor",
        "sensor_id": "LVL-RAM-01",
        "risk_score": 26,
        "probability": "22%",
        "affected_system": "Tailings & Sump Management",
        "affected_equipment": "Perimeter Retention Basin (LVL-RAM-01)",
        "production_impact_tpd": 80,
        "financial_exposure": "₹0.12 Cr",
        "recommended_action": "Clean transducer acoustic face and execute two-point field recalibration.",
        "status": "ACTIVE",
        "acknowledgement_state": False,
        "escalation_state": False,
        "metadata": {"delta_level_m": 0.45, "limit_delta_m": 0.20}
    }
]


class AlertService:
    def __init__(self):
        self._alerts: Dict[str, Dict[str, Any]] = {}
        self._simulation_clock = datetime.now(timezone.utc)
        self._active_scenario: str = "BASELINE"
        self._active_severity: str = "HIGH"
        self._init_default_alerts()

    def _init_default_alerts(self):
        """Initializes canonical multi-source operational alerts across all 10 MOIL mines."""
        now = datetime.now(timezone.utc).isoformat()
        for a in CANONICAL_THREAT_CORPUS:
            item = copy.deepcopy(a)
            item["detected_at"] = now
            item["last_updated"] = now
            item["timestamp"] = now
            self._alerts[item["id"]] = item

    def set_scenario_context(self, scenario_type: str = "BASELINE", severity: str = "HIGH"):
        """Applies scenario stress shock to the canonical threat matrix."""
        self._active_scenario = scenario_type.upper()
        self._active_severity = severity.upper()

    def get_alerts(
        self,
        mine_id: Optional[str] = None,
        severity: Optional[str] = None,
        status: Optional[str] = None,
        search: Optional[str] = None,
        scenario: Optional[str] = None,
        scenario_severity: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Retrieves live operational alerts filtered by mine, severity, status, search, and active scenario.
        """
        scen = (scenario or self._active_scenario).upper()
        scen_sev = (scenario_severity or self._active_severity).upper()

        # Build dynamic list with scenario shock adjustments
        results = []
        for alert_id, raw_alert in self._alerts.items():
            a = copy.deepcopy(raw_alert)
            
            # Apply Scenario Multi-Physics Shock Elevation
            if scen in ["HEAVY_MONSOON", "MONSOON", "MONSOON_INFLUX"]:
                if a.get("category") in ["Hydrogeological", "Environmental"]:
                    a["risk_score"] = min(98, a["risk_score"] + (18 if scen_sev == "CRITICAL" else 12))
                    if a["severity"] in ["HIGH", "ELEVATED"]:
                        a["severity"] = "CRITICAL"
                    a["production_impact_tpd"] = int(a["production_impact_tpd"] * 1.45)
                    a["probability"] = f"{min(99, int(a['probability'].replace('%', '')) + 15)}%"
            elif scen in ["CRUSHER_SEIZURE", "CRUSHER", "CRUSHER_CONSTRAINT"]:
                if a.get("category") == "Mechanical" or "Crusher" in a.get("title", ""):
                    a["risk_score"] = min(99, a["risk_score"] + (22 if scen_sev == "CRITICAL" else 15))
                    a["severity"] = "CRITICAL"
                    a["production_impact_tpd"] = int(a["production_impact_tpd"] * 1.65)
                    a["probability"] = f"{min(99, int(a['probability'].replace('%', '')) + 20)}%"
            elif scen in ["MULTI_RISK", "MULTI_RISK_CRISIS", "CRISIS"]:
                if a.get("category") in ["Hydrogeological", "Mechanical", "Geotechnical", "Electrical"]:
                    a["risk_score"] = min(99, a["risk_score"] + 15)
                    if a["severity"] == "HIGH":
                        a["severity"] = "CRITICAL"
                    a["production_impact_tpd"] = int(a["production_impact_tpd"] * 1.5)

            results.append(a)

        # 1. Mine Filter
        if mine_id and mine_id.lower() != "all":
            norm_mine = normalize_mine_id(mine_id)
            results = [a for a in results if a.get("mine_id") == norm_mine]

        # 2. Status Filter (ACTIVE, ACKNOWLEDGED, RESOLVED, ESCALATED)
        if status and status.upper() != "ALL":
            st_upper = status.upper()
            results = [a for a in results if a.get("status") == st_upper]

        # 3. Severity Filter (ALL, CRITICAL, HIGH, ELEVATED, MEDIUM, LOW)
        if severity and severity.upper() != "ALL":
            sev_upper = severity.upper()
            if sev_upper in ["MEDIUM", "WATCH"]:
                results = [a for a in results if a.get("severity") in ("MEDIUM", "WATCH")]
            elif sev_upper in ["LOW", "NORMAL"]:
                results = [a for a in results if a.get("severity") in ("LOW", "NORMAL")]
            else:
                results = [a for a in results if a.get("severity") == sev_upper]

        # 4. Search Filter (Matches Title, Mine, Category, Equipment, Description, Sensor, Action)
        if search and search.strip():
            q = search.strip().lower()
            results = [
                a for a in results
                if q in a.get("title", "").lower()
                or q in a.get("description", "").lower()
                or q in a.get("mine_name", "").lower()
                or q in a.get("mine_id", "").lower()
                or q in a.get("id", "").lower()
                or q in a.get("category", "").lower()
                or q in a.get("affected_equipment", "").lower()
                or q in a.get("affected_system", "").lower()
                or q in a.get("sensor_type", "").lower()
                or q in a.get("sensor_id", "").lower()
                or q in a.get("recommended_action", "").lower()
            ]

        # 5. Priority Sorting: Severity Hierarchy -> Risk Score (Desc) -> Production Impact (Desc)
        severity_rank = {"CRITICAL": 0, "HIGH": 1, "ELEVATED": 2, "MEDIUM": 3, "WATCH": 3, "LOW": 4, "NORMAL": 4}
        status_rank = {"ACTIVE": 0, "ESCALATED": 1, "ACKNOWLEDGED": 2, "RESOLVED": 3}

        results.sort(
            key=lambda x: (
                status_rank.get(x.get("status", "ACTIVE"), 0),
                severity_rank.get(x.get("severity", "LOW"), 4),
                -x.get("risk_score", 0),
                -x.get("production_impact_tpd", 0)
            )
        )

        # Dynamic KPI Summary Calculation
        active_count = sum(1 for a in results if a.get("status") == "ACTIVE")
        critical_count = sum(1 for a in results if a.get("severity") == "CRITICAL" and a.get("status") != "RESOLVED")
        high_count = sum(1 for a in results if a.get("severity") == "HIGH" and a.get("status") != "RESOLVED")
        elevated_count = sum(1 for a in results if a.get("severity") == "ELEVATED" and a.get("status") != "RESOLVED")
        medium_count = sum(1 for a in results if a.get("severity") in ("MEDIUM", "WATCH") and a.get("status") != "RESOLVED")
        low_count = sum(1 for a in results if a.get("severity") in ("LOW", "NORMAL") and a.get("status") != "RESOLVED")

        total_production_at_risk = sum(a.get("production_impact_tpd", 0) for a in results if a.get("status") != "RESOLVED")

        return {
            "total": len(results),
            "active_count": active_count,
            "critical_count": critical_count,
            "high_count": high_count,
            "elevated_count": elevated_count,
            "medium_count": medium_count,
            "low_count": low_count,
            "total_production_at_risk_tpd": total_production_at_risk,
            "active_scenario": scen,
            "active_severity": scen_sev,
            "alerts": results
        }

    def acknowledge_alert(self, alert_id: str, operator: str = "DGMS Shift Controller", note: str = "") -> Dict[str, Any]:
        if alert_id not in self._alerts:
            return {"status": "error", "message": f"Alert {alert_id} not found", "alert": None}

        now = datetime.now(timezone.utc).isoformat()
        alert = self._alerts[alert_id]
        alert["status"] = "ACKNOWLEDGED"
        alert["acknowledgement_state"] = True
        alert["acknowledged_at"] = now
        alert["acknowledged_by"] = operator
        alert["last_updated"] = now
        if not alert.get("metadata"):
            alert["metadata"] = {}
        alert["metadata"]["acknowledgement_note"] = note or "Verified telemetry anomaly and initiated operator watch."

        return {
            "status": "success",
            "message": f"Alert {alert_id} acknowledged by {operator}",
            "alert": alert
        }

    def resolve_alert(self, alert_id: str, operator: str = "DGMS Shift Controller", note: str = "") -> Dict[str, Any]:
        if alert_id not in self._alerts:
            return {"status": "error", "message": f"Alert {alert_id} not found", "alert": None}

        now = datetime.now(timezone.utc).isoformat()
        alert = self._alerts[alert_id]
        alert["status"] = "RESOLVED"
        alert["resolved_at"] = now
        alert["resolved_by"] = operator
        alert["resolution_action"] = note or "Mitigation protocol executed. Sensor telemetry returned to nominal range."
        alert["last_updated"] = now
        if not alert.get("metadata"):
            alert["metadata"] = {}
        alert["metadata"]["resolution_note"] = alert["resolution_action"]

        return {
            "status": "success",
            "message": f"Alert {alert_id} resolved with mitigation recorded",
            "alert": alert
        }

    def escalate_alert(self, alert_id: str, operator: str = "DGMS Shift Controller", target: str = "DGMS Regional Inspector & General Manager") -> Dict[str, Any]:
        if alert_id not in self._alerts:
            return {"status": "error", "message": f"Alert {alert_id} not found", "alert": None}

        now = datetime.now(timezone.utc).isoformat()
        alert = self._alerts[alert_id]
        alert["status"] = "ESCALATED"
        alert["escalation_state"] = True
        alert["escalated_to"] = target
        alert["escalated_at"] = now
        alert["escalated_by"] = operator
        alert["last_updated"] = now

        return {
            "status": "success",
            "message": f"Alert {alert_id} escalated to {target}",
            "alert": alert
        }

    def refresh_telemetry(self) -> Dict[str, Any]:
        """
        Executes progressive simulation tick: updates last_updated timestamps and micro-drifts sensor values deterministically.
        """
        now = datetime.now(timezone.utc).isoformat()
        self._simulation_clock = datetime.now(timezone.utc)
        for a in self._alerts.values():
            a["last_updated"] = now
        return {"status": "success", "message": "Telemetry refreshed", "timestamp": now}

    @staticmethod
    def predict_shortfall(data: Dict[str, Any]) -> Dict[str, Any]:
        mine_id = normalize_mine_id(data.get("mine_id", "balaghat"))
        mine = mine_service.get_mine_by_id(mine_id)
        predictor = model_registry.get_model("shortfall")
        ts = datetime.now(timezone.utc).isoformat()

        features = {
            "planned_tonnage": data.get("planned_tonnage", mine["productionTarget"]),
            "ore_grade_mn": data.get("ore_grade_mn", mine["baseGradeNum"]),
            "recovery_rate": data.get("recovery_rate", 88.0),
            "crusher_utilization": data.get("crusher_utilization", 85.0),
            "fleet_availability": data.get("fleet_availability", mine["fleetAvailabilityBase"]),
            "operating_hours": data.get("operating_hours", 16.0),
            "downtime_hours": data.get("downtime_hours", 2.5),
            "rainfall_mm": data.get("rainfall_mm", 12.5),
            "production_trend_7d": data.get("production_trend_7d", mine["productionTarget"] * 0.98),
            "production_trend_30d": data.get("production_trend_30d", mine["productionTarget"] * 0.99),
            "shortfall_rate": data.get("shortfall_rate", 5.0),
            "target_deviation": data.get("target_deviation", -0.02),
            "rolling_downtime_7d": data.get("rolling_downtime_7d", 12.0)
        }

        if predictor is not None:
            raw_pred = predictor.predict(features)
            return {
                "metadata": {
                    "mine_id": mine_id,
                    "model": "production_shortfall",
                    "model_version": "SHORTFALL-GBM v1.0",
                    "mode": "ML_INFERENCE",
                    "confidence": raw_pred.get("confidence", "95.0%"),
                    "timestamp": ts,
                    "features_used": list(features.keys())
                },
                "prediction": raw_pred
            }
        else:
            rainfall = features["rainfall_mm"]
            utilization = features["crusher_utilization"]
            planned = features["planned_tonnage"]
            prob = min(0.95, max(0.05, 0.10 + (rainfall / 120.0) * 0.40 + (1.0 - utilization / 100.0) * 0.45))
            shortfall_t = int(planned * prob * 0.35)
            predicted_prod = planned - shortfall_t

            return {
                "metadata": {
                    "mine_id": mine_id,
                    "model": "production_shortfall",
                    "model_version": "SHORTFALL-HEURISTIC v1.0",
                    "mode": "DEMO_FALLBACK",
                    "confidence": "85.0%",
                    "timestamp": ts,
                    "features_used": list(features.keys())
                },
                "prediction": {
                    "shortfall_probability": round(prob, 4),
                    "shortfall_probability_pct": f"{prob * 100:.1f}%",
                    "is_shortfall_detected": prob >= 0.40,
                    "predicted_production": predicted_prod,
                    "predicted_production_formatted": f"{predicted_prod:,} T",
                    "predicted_shortfall_tonnes": shortfall_t,
                    "predicted_shortfall_percentage": f"{round((shortfall_t/planned)*100, 1)}%",
                    "confidence": "85.0%",
                    "top_drivers": {
                        "Rainfall Catchment Sensitivity": 35.0,
                        "Crusher Utilization": 30.0,
                        "Fleet Availability": 20.0
                    }
                }
            }


alert_service = AlertService()

