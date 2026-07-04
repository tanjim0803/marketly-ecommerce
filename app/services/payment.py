from sqlalchemy.ext.asyncio import AsyncSession
from app.database.models import Payment, PaymentGateway, PaymentStatus, ShippingAddress
from app.api.schemas.payment import PaymentCreate
from sqlmodel import select
from fastapi import HTTPException, status
from typing import List

from app.utils import generate_mock_ids


class PaymentService:
    async def create_payment(
        self, session: AsyncSession, data: PaymentCreate, user_id: str, order_id: str
    ):

        gateway = PaymentGateway(data.gateway)

        if gateway == PaymentGateway.mock:
            is_success = data.simulate_success

            payment_status = (
                PaymentStatus.success if is_success else PaymentStatus.failed
            )

            pg_order_id, pg_payment_id, pg_signature = generate_mock_ids()

        elif gateway == PaymentGateway.razorpay:
            pass
        else:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Unsupported payment gateway!",
            )

        payment = Payment(
            order_id=order_id,
            user_id=user_id,
            amount=data.amount,
            status=payment_status,
            is_paid=(payment_status == PaymentStatus.success),
            payment_gateway=gateway,
            pg_order_id=pg_order_id,
            pg_payment_id=pg_payment_id,
            pg_signature=pg_signature,
        )

        session.add(payment)
        await session.commit()
        await session.refresh(payment)

        return payment


payment_service = PaymentService()
