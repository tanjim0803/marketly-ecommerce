from fastapi import APIRouter
from app.api.routers.user import user_router
from app.api.routers.product import product_router

master_router = APIRouter(prefix="/api")

master_router.include_router(user_router, prefix="/account", tags=["Account"])
master_router.include_router(product_router, prefix="/products", tags=["Categories"])
