from fastapi import HTTPException

# Valid 10 Canonical MOIL Mine IDs
VALID_MINE_IDS = {
    "balaghat",
    "tirodi",
    "ukwa",
    "munsar",
    "kandri",
    "gumgaon",
    "chikla",
    "dongri-buzurg",
    "ramtek",
    "bhandara"
}

# Alias map for backwards compatibility
MINE_ALIASES = {
    "dongri": "dongri-buzurg",
    "dongribuzurg": "dongri-buzurg",
    "beldongri": "bhandara",
    "bhandara-mine": "bhandara"
}

# Valid Scenario Types (15 Real-World Scenarios)
VALID_SCENARIO_TYPES = {
    "BASELINE_RESET",
    "HEAVY_MONSOON",
    "CRUSHER_SEIZURE",
    "HAUL_ROAD_FAILURE",
    "FLEET_BREAKDOWN",
    "SHAFT_HOIST_FAILURE",
    "DEWATERING_FAILURE",
    "POWER_FAILURE",
    "GEOLOGICAL_HAZARD",
    "MULTI_RISK_CRISIS",
    "FIRE_INCIDENT",
    "SLOPE_INSTABILITY",
    "EXTREME_RAINFALL",
    "VENTILATION_FAILURE",
    "BLASTING_DISRUPTION"
}

SCENARIO_ALIASES = {
    "BASELINE": "BASELINE_RESET",
    "RESET": "BASELINE_RESET",
    "MONSOON": "HEAVY_MONSOON",
    "CRUSHER": "CRUSHER_SEIZURE",
    "HAUL_ROAD": "HAUL_ROAD_FAILURE",
    "FLEET": "FLEET_BREAKDOWN",
    "SHAFT": "SHAFT_HOIST_FAILURE",
    "DEWATERING": "DEWATERING_FAILURE",
    "POWER": "POWER_FAILURE",
    "GEOLOGY": "GEOLOGICAL_HAZARD",
    "MULTI_RISK": "MULTI_RISK_CRISIS",
    "FIRE": "FIRE_INCIDENT",
    "SLOPE": "SLOPE_INSTABILITY",
    "RAIN": "EXTREME_RAINFALL",
    "VENTILATION": "VENTILATION_FAILURE",
    "BLASTING": "BLASTING_DISRUPTION"
}

# Valid Severities
VALID_SEVERITIES = {"LOW", "MEDIUM", "HIGH", "CRITICAL"}

def normalize_mine_id(mine_id: str) -> str:
    """
    Validates and normalizes mine ID to canonical slug.
    Raises HTTPException(404) if not found.
    """
    if not mine_id:
        raise HTTPException(status_code=400, detail="Mine ID cannot be empty.")
    
    clean_id = str(mine_id).strip().lower().replace("_", "-")
    clean_id = MINE_ALIASES.get(clean_id, clean_id)
    
    if clean_id not in VALID_MINE_IDS:
        raise HTTPException(
            status_code=404,
            detail=f"Mine '{mine_id}' not found. Supported mines are: {', '.join(sorted(VALID_MINE_IDS))}"
        )
    return clean_id

def normalize_scenario_type(scenario_type: str) -> str:
    """
    Validates and normalizes scenario type.
    Raises HTTPException(400) if invalid.
    """
    if not scenario_type:
        raise HTTPException(status_code=400, detail="Scenario type cannot be empty.")
    
    clean_scen = str(scenario_type).strip().upper().replace("-", "_").replace(" ", "_")
    clean_scen = SCENARIO_ALIASES.get(clean_scen, clean_scen)
    
    if clean_scen not in VALID_SCENARIO_TYPES:
        raise HTTPException(
            status_code=400,
            detail=f"Scenario '{scenario_type}' not supported. Valid scenarios: {', '.join(sorted(VALID_SCENARIO_TYPES))}"
        )
    return clean_scen

def normalize_severity(severity: str) -> str:
    if not severity:
        return "HIGH"
    clean_sev = str(severity).strip().upper()
    if clean_sev not in VALID_SEVERITIES:
        return "HIGH"
    return clean_sev
