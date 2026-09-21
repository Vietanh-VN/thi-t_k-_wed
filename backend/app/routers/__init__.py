from app.routers.auth import router as auth_router
from app.routers.zones import router as zones_router
from app.routers.spots import router as spots_router
from app.routers.vehicle_types import router as vehicle_types_router
from app.routers.vehicles import router as vehicles_router
from app.routers.checkin_checkout import router as parking_router
from app.routers.monthly_passes import router as monthly_passes_router
from app.routers.pricing import router as pricing_router
from app.routers.history import router as history_router
from app.routers.stats import router as stats_router
from app.routers.ai_assistant import router as ai_router

__all__ = [
    "auth_router",
    "zones_router",
    "spots_router",
    "vehicle_types_router",
    "vehicles_router",
    "parking_router",
    "monthly_passes_router",
    "pricing_router",
    "history_router",
    "stats_router",
    "ai_router"
]
