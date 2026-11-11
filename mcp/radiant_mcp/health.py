"""Health and readiness endpoints (unauthenticated)."""

from starlette.responses import JSONResponse


async def health_check(request):
    """Liveness check — the process is up. Does not touch StarRocks (this
    component holds no StarRocks credentials; DB access is per-user via JWT)."""
    return JSONResponse({"status": "healthy"})


async def ready_check(request):
    """Readiness check - returns ok if server is ready to accept requests."""
    return JSONResponse({"status": "ready"})
