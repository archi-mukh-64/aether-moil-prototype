import os
from typing import List
from pydantic import BaseModel

class Settings(BaseModel):
    app_name: str = "MOIL Mining Intelligence Platform API"
    app_version: str = "3.4.0"
    api_prefix: str = "/api"
    debug: bool = False
    environment: str = "development"
    secret_key: str = ""

    def __init__(self, **data):
        if "environment" not in data:
            data["environment"] = os.getenv("ENVIRONMENT", "development")
        if "debug" not in data:
            data["debug"] = os.getenv("DEBUG", "False").lower() in ("true", "1", "yes")
        if "secret_key" not in data:
            data["secret_key"] = os.getenv("SECRET_KEY", "")

        super().__init__(**data)

        if self.environment.lower() == "production":
            insecure_defaults = {
                "dev-insecure-local-only-key",
                "moil-aether-secure-production-key-2026",
                "dev-secret-key-change-in-production-12345",
                "insecure-default-change-in-production",
                "your-secret-key",
                "secret",
                "changeme"
            }
            if not self.secret_key or self.secret_key in insecure_defaults or len(self.secret_key) < 32:
                raise ValueError(
                    "Production deployment requires a cryptographically secure SECRET_KEY environment variable "
                    "(minimum 32 characters, non-default). Refusing to start."
                )
        else:
            if not self.secret_key:
                self.secret_key = "dev-insecure-local-only-key"
    
    # Render Port
    port: int = int(os.getenv("PORT", "8000"))
    
    # CORS Origins
    @property
    def allowed_origins(self) -> List[str]:
        raw = os.getenv("CORS_ORIGINS", "")
        defaults = [
            "https://aether-moil-prototype.vercel.app",
            "http://localhost:5173",
            "http://127.0.0.1:5173",
            "http://localhost:3000",
            "http://127.0.0.1:3000",
            "http://localhost:8000",
            "http://127.0.0.1:8000",
            "https://moil-aether-backend.onrender.com",
        ]
        if raw:
            custom = [origin.strip().rstrip('/') for origin in raw.split(",") if origin.strip()]
            return list(set(defaults + custom))
        return defaults

    @property
    def allow_origin_regex(self) -> str:
        # Restricted regex for verified project previews; avoids opening CORS to all *.vercel.app
        custom_regex = os.getenv("CORS_ORIGIN_REGEX", "")
        if custom_regex:
            return custom_regex
        return r"^https://([a-zA-Z0-9_-]+\.)?(aether-moil|moil-aether).*\.vercel\.app$"
    
    # Database configuration (PostgreSQL / Supabase with SQLite fallback)
    database_url: str = os.getenv("DATABASE_URL", "")
    database_path: str = os.getenv("DATABASE_PATH", os.path.abspath(os.path.join(os.path.dirname(__file__), "database", "feedback.db")))
    
    # Machine Learning Models Directory
    models_dir: str = os.getenv("MODELS_DIR", os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "models")))
    
    # Earth Observation Configuration
    gee_project_id: str = os.getenv("GEE_PROJECT_ID", "")
    gee_service_account: str = os.getenv("GEE_SERVICE_ACCOUNT", "")

settings = Settings()
