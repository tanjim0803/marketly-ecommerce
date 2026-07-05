from pydantic import BaseModel
import uuid
from app.database.models import ShippingStatusEnum
from datetime import datetime


class ShippingAddressBase(BaseModel):
    name: str
    address_line1: str
    address_line2: str | None = None
    city: str
    state: str
    pin_code: str
    country: str


class ShippingAddressCreate(ShippingAddressBase):
    pass


class ShippingAddressUpdate(BaseModel):
    name: str | None = None
    address_line1: str | None = None
    address_line2: str | None = None
    city: str | None = None
    state: str | None = None
    pin_code: str | None = None
    country: str | None = None


class ShippingAddressOut(ShippingAddressBase):
    id: uuid.UUID
    user_id: uuid.UUID

    model_config = {"from_attributes": True}


class ShippingStatusOut(BaseModel):
    id: uuid.UUID
    order_id: uuid.UUID
    status: ShippingStatusEnum
    updated_at: datetime

    model_config = {"from_attributes": True}


class ShippingStatusUpdate(BaseModel):
    status: ShippingStatusEnum
