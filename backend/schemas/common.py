from pydantic import BaseModel, Field
from typing import Optional, Dict, Any, List
from datetime import datetime, timezone

class BaseAPIResponse(BaseModel):
    status: str = "success"
    timestamp: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())
    message: Optional[str] = None
    data: Optional[Any] = None

class ModelMetadata(BaseModel):
    mine_id: str
    model: str
    model_version: str
    mode: str = Field(..., description="ML_INFERENCE or DEMO_FALLBACK")
    confidence: Optional[str] = None
    timestamp: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())
    features_used: List[str] = Field(default_factory=list)

class HealthCheckResponse(BaseModel):
    status: str
    app_name: str
    app_version: str
    timestamp: str
    models: Dict[str, Any]
    database: Dict[str, Any]
