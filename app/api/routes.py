from fastapi import APIRouter
from app.api.routers.user import user_router

master_router = APIRouter(prefix="/api")

master_router.include_router(user_router, prefix="/account")