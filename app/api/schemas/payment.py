from pydantic import BaseModel, Field
import uuid
from typing import Literal
from app.database.models import PaymentGateway


class PaymentCreate(BaseModel):
    amount: int
    shipping_address_id: uuid.UUID
    gateway: Literal["mock", "razorpay"] = Field(default="mock")
    simulate_success: bool | None = None


class PaymentOut(BaseModel):
    id: uuid.UUID
    order_id: uuid.UUID
    amount: int
    status: str
    is_paid: bool
    payment_gateway: PaymentGateway

    model_config = {"from_attributes": True}
