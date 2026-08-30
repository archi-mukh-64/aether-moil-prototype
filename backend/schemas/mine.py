from pydantic import BaseModel, Field
from typing import Optional, Dict, Any, List

class MineSummary(BaseModel):
    id: str
    name: str
    shortName: str
    mineType: str
    district: str
    state: str
    latitude: float
    longitude: float
    coordinatesDMS: str
    elevation: str
    oreGrade: str
    productionTarget: int
    baselineProduction: int
    fleetCount: int
    sensorCount: int
    languageOptions: List[str]

class MineDetail(MineSummary):
    telemetry: Dict[str, Any]
    analytics: Dict[str, Any]
    equipment: Dict[str, Any]
    reserve: Dict[str, Any]
    risks: Dict[str, Any]
    trust: Dict[str, Any]

class MineListResponse(BaseModel):
    total_mines: int
    mines: List[MineSummary]
