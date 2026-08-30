from fastapi import Header, HTTPException, Depends
from typing import Optional
from .config import settings
from .utils.model_loader import model_registry

def get_model_registry():
    return model_registry

def verify_api_key(x_api_key: Optional[str] = Header(None)):
    # Optional API key verification hook for production deployments
    return True
