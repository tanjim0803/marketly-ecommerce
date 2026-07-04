from fastapi import APIRouter, Depends, HTTPException, status
from app.database.session import SessionDep
from app.api.dependencies import get_current_user
from app.database.models import User
from app.api.schemas.payment import PaymentCreate
from app.api.schemas.order import OrderOut
from typing import Annotated
from app.services.order import order_service

order_router = APIRouter()


@order_router.post("/checkout", response_model=OrderOut)
async def checkout_order(
    user: Annotated[User, Depends(get_current_user)],
    session: SessionDep,
    payment_data: PaymentCreate,
):
    return await order_service.checkout(session, user.id, payment_data)


@order_router.get("/", response_model=list[OrderOut])
async def get_user_order_list(
    user: Annotated[User, Depends(get_current_user)], session: SessionDep
):
    return await order_service.get_placed_order_for_user(session, user.id)


@order_router.get("/{order_id}", response_model=OrderOut)
async def get_user_order_by_id(
    user: Annotated[User, Depends(get_current_user)], session: SessionDep, order_id: str
):
    order = await order_service.get_order_by_id(session, user.id, order_id)

    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Order not found!"
        )

    return order


@order_router.patch("/cancel/{order_id}", response_model=OrderOut)
async def order_cancel(
    user: Annotated[User, Depends(get_current_user)], session: SessionDep, order_id: str
):
    return await order_service.cancel_order(session, user.id, order_id)
