import logging
import time
import json
import sys
from datetime import datetime, timezone
from fastapi import Request
from starlette.middleware.base import BaseHTTPMiddleware

# Configure standard logger
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] [%(name)s] %(message)s",
    handlers=[logging.StreamHandler(sys.stdout)]
)

logger = logging.getLogger("moil.api")

class RequestLoggingMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        req_id = request.headers.get("X-Request-ID", f"req-{int(time.time()*1000)}")
        start_time = time.time()
        
        # Attach request id to state
        request.state.request_id = req_id
        
        try:
            response = await call_next(request)
            duration_ms = round((time.time() - start_time) * 1000, 2)
            
            response.headers["X-Request-ID"] = req_id
            response.headers["X-Process-Time"] = f"{duration_ms}ms"
            
            logger.info(
                f"[{req_id}] {request.method} {request.url.path} -> {response.status_code} ({duration_ms}ms)"
            )
            return response
        except Exception as e:
            duration_ms = round((time.time() - start_time) * 1000, 2)
            logger.error(
                f"[{req_id}] {request.method} {request.url.path} FAILED after {duration_ms}ms: {str(e)}",
                exc_info=True
            )
            raise e
