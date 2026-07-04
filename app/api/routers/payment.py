from fastapi import APIRouter, Depends, HTTPException, status
from app.api.dependencies import get_current_user
from app.api.schemas.payment import PaymentOut
from app.database.session import SessionDep
from app.database.models import User
from typing import Annotated
from app.services.payment import payment_service
import uuid

payment_router = APIRouter()


@payment_router.get("/{order_id}", response_model=PaymentOut)
async def get_payment_status_by_order(
    user: Annotated[User, Depends(get_current_user)],
    session: SessionDep,
    order_id: uuid.UUID,
):
    payment = await payment_service.get_payment_by_order_id(session, order_id, user.id)

    if not payment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Payment not found"
        )
    
    return payment
