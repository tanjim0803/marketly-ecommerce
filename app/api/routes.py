from fastapi import APIRouter
from app.api.routers.user import user_router
from app.api.routers.product import product_router
from app.api.routers.cart import cart_router
from app.api.routers.shipping import shipping_router

master_router = APIRouter(prefix="/api")

master_router.include_router(user_router, prefix="/account", tags=["Account"])
master_router.include_router(
    product_router, prefix="/products", tags=["Categories", "Products"]
)
master_router.include_router(cart_router, prefix="/carts", tags=["Cart"])
master_router.include_router(shipping_router, prefix="/shippings", tags=["Shippings"])
