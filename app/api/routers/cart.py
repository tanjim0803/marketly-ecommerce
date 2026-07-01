from fastapi import APIRouter, Depends, HTTPException, status
from app.database.session import SessionDep
from app.api.dependencies import get_current_user
from app.database.models import User
from app.api.schemas.cart import CartItemOut, CartItemCreate, CartSummary
from typing import Annotated, Union
from app.services.cart import cart_service

cart_router = APIRouter()


@cart_router.get("/", response_model=CartSummary)
async def list_user_cart_item(
    user: Annotated[User, Depends(get_current_user)], session: SessionDep
):
    return await cart_service.list_user_cart(session, user.id)


@cart_router.post("/add", response_model=CartItemOut)
async def add_item_to_cart(
    user: Annotated[User, Depends(get_current_user)],
    session: SessionDep,
    item: CartItemCreate,
):
    return await cart_service.add_to_cart(session, item, user.id)


@cart_router.patch("/increase/{product_id}", response_model=Union[CartItemOut, dict])
async def increase_quantity_by_product(
    user: Annotated[User, Depends(get_current_user)],
    session: SessionDep,
    product_id: str,
):
    return await cart_service.change_cart_item_quantity_by_product(
        session, user.id, product_id, delta=1
    )


@cart_router.patch("/decrease/{product_id}", response_model=Union[CartItemOut, dict])
async def decrease_quantity_by_product(
    user: Annotated[User, Depends(get_current_user)],
    session: SessionDep,
    product_id: str,
):
    return await cart_service.change_cart_item_quantity_by_product(
        session, user.id, product_id, delta=-1
    )
