import os
from typing import List
from pydantic import BaseModel

class Settings(BaseModel):
    app_name: str = "MOIL Mining Intelligence Platform API"
    app_version: str = "3.4.0"
    api_prefix: str = "/api"
    debug: bool = os.getenv("DEBUG", "False").lower() in ("true", "1", "yes")
    environment: str = os.getenv("ENVIRONMENT", "development")
    secret_key: str = os.getenv("SECRET_KEY", "moil-aether-secure-production-key-2026")
    
    # Render Port
    port: int = int(os.getenv("PORT", "8000"))
    
    # CORS Origins
    @property
    def allowed_origins(self) -> List[str]:
        raw = os.getenv("CORS_ORIGINS", "")
        defaults = [
            "http://localhost:5173",
            "http://127.0.0.1:5173",
            "http://localhost:3000",
            "http://127.0.0.1:3000",
            "http://localhost:8000",
            "http://127.0.0.1:8000",
        ]
        if raw:
            custom = [origin.strip() for origin in raw.split(",") if origin.strip()]
            return list(set(defaults + custom))
        if self.environment == "development":
            return defaults + ["*"]
        return defaults
    
    # Database configuration (PostgreSQL / Supabase with SQLite fallback)
    database_url: str = os.getenv("DATABASE_URL", "")
    database_path: str = os.getenv("DATABASE_PATH", os.path.abspath(os.path.join(os.path.dirname(__file__), "database", "feedback.db")))
    
    # Machine Learning Models Directory
    models_dir: str = os.getenv("MODELS_DIR", os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "models")))
    
    # Earth Observation Configuration
    gee_project_id: str = os.getenv("GEE_PROJECT_ID", "")
    gee_service_account: str = os.getenv("GEE_SERVICE_ACCOUNT", "")

settings = Settings()
