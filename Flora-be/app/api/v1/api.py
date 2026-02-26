"""API router aggregation."""
from fastapi import APIRouter
from app.api.v1.endpoints import auth, groups, pronunciation, situations, dashboard, admin, quiz

api_router = APIRouter()

# Include routers
api_router.include_router(auth.router)
api_router.include_router(groups.router)
api_router.include_router(pronunciation.router)
api_router.include_router(situations.router)
api_router.include_router(quiz.router)
api_router.include_router(dashboard.router)
api_router.include_router(admin.router)
