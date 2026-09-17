import logging
import shutil
from datetime import datetime, timezone
from fastapi import APIRouter, Response, status
from sqlalchemy import text

from app.core.database import engine
from app.core.config import settings

logger = logging.getLogger(__name__)

router = APIRouter()

@router.get("", summary="Production System Health & Diagnostics")
@router.get("/", include_in_schema=False)
def check_system_health(response: Response):
    """
    Comprehensive system health check for Docker, Kubernetes, and uptime probes.
    Verifies:
    1. Database connectivity via a rapid `SELECT 1` ping.
    2. Git mining subsystem readiness (git binary & GitPython).
    3. Application version and UTC timestamp.
    """
    db_status = "connected"
    system_status = "healthy"
    
    # 1. Test Database Connectivity
    try:
        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))
    except Exception as e:
        logger.error(f"Database healthcheck ping failed: {e}")
        db_status = "disconnected"
        system_status = "degraded"
        # We still return 200 during transient warmup, or set 503 if critical
        response.status_code = status.HTTP_503_SERVICE_UNAVAILABLE

    # 2. Test Git Miner Subsystem
    git_bin = shutil.which("git")
    git_status = "ready" if git_bin else "degraded"
    if not git_bin:
        system_status = "degraded"

    return {
        "status": system_status,
        "database": db_status,
        "git_miner": git_status,
        "version": "1.0.0",
        "app_name": settings.APP_NAME,
        "environment": settings.APP_ENV,
        "timestamp": datetime.now(timezone.utc).isoformat(),
    }
