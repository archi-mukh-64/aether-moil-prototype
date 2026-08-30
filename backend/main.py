import os
import sys
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from contextlib import asynccontextmanager

from .config import settings
from .utils.logging_config import logger, RequestLoggingMiddleware
from .utils.model_loader import model_registry
from .database.database import init_db

# Import Route Controllers
from .routes.health import router as health_router
from .routes.mines import router as mines_router
from .routes.telemetry import router as telemetry_router
from .routes.alert import router as alert_router
from .routes.reserve import router as reserve_router
from .routes.equipment import router as equipment_router
from .routes.anomaly import router as anomaly_router
from .routes.protocol import router as protocol_router
from .routes.analytics import router as analytics_router
from .routes.trust import router as trust_router
from .routes.scenarios import router as scenarios_router
from .routes.feedback import router as feedback_router
from .routes.earth_observation import router as earth_observation_router
from .routes.reports import router as reports_router
from .routes.national_radar import router as national_radar_router
from .routes.exploration import router as exploration_router
from .routes.forecast import router as forecast_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup lifecycle
    logger.info("Starting MOIL Mining Intelligence API Gateway...")
    init_db()
    health = model_registry.get_health_status()
    logger.info(f"Model Registry status: {health['models_status']}")
    yield
    # Shutdown lifecycle
    logger.info("Shutting down MOIL Mining Intelligence API Gateway...")

app = FastAPI(
    title=settings.app_name,
    version=settings.app_version,
    description=(
        "Production-grade RESTful API Gateway for MOIL Limited (Manganese Ore India Limited). "
        "Provides operational decision support, AI early warning shortfall predictions, "
        "remote sensing prospectivity estimation, and autonomous emergency dispatch protocols."
    ),
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json",
    lifespan=lifespan
)

# 1. CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins,
    allow_origin_regex=settings.allow_origin_regex,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 2. Custom Request ID & Structured Logging Middleware
app.add_middleware(RequestLoggingMiddleware)

# 3. Global Exception Handler
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled Exception on {request.method} {request.url.path}: {str(exc)}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={
            "status": "error",
            "message": "Internal Server Error" if not settings.debug else str(exc),
            "path": request.url.path
        }
    )

# 4. Include API Routers under /api and Root Health
app.include_router(health_router)
api_prefix = settings.api_prefix
app.include_router(health_router, prefix=api_prefix)
app.include_router(mines_router, prefix=api_prefix)
app.include_router(telemetry_router, prefix=api_prefix)
app.include_router(alert_router, prefix=api_prefix)
app.include_router(reserve_router, prefix=api_prefix)
app.include_router(equipment_router, prefix=api_prefix)
app.include_router(anomaly_router, prefix=api_prefix)
app.include_router(protocol_router, prefix=api_prefix)
app.include_router(analytics_router, prefix=api_prefix)
app.include_router(trust_router, prefix=api_prefix)
app.include_router(scenarios_router, prefix=api_prefix)
app.include_router(feedback_router, prefix=api_prefix)
app.include_router(earth_observation_router, prefix=api_prefix)
app.include_router(reports_router, prefix=api_prefix)
app.include_router(national_radar_router, prefix=api_prefix)
app.include_router(exploration_router, prefix=api_prefix)
app.include_router(forecast_router, prefix=api_prefix)

# 5. Root Welcome Endpoint
@app.get("/", tags=["Root"])
def root():
    return {
        "service": settings.app_name,
        "version": settings.app_version,
        "status": "ONLINE",
        "documentation": "/docs",
        "health_check": f"{api_prefix}/health",
        "mines_registry": f"{api_prefix}/mines"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.main:app", host="0.0.0.0", port=8000, reload=settings.debug)
