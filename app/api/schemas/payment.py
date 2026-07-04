from pydantic import BaseModel, Field
import uuid
from typing import Literal


class PaymentCreate(BaseModel):
    amount: int
    shipping_address_id: uuid.UUID
    gateway: Literal["mock", "razorpay"] = Field(default="mock")
    simulate_success: bool | None = None
