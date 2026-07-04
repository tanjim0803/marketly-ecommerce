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
