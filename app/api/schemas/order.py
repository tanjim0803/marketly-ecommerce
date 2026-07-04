from pydantic import BaseModel
from datetime import datetime
from app.api.schemas.shipping import ShippingAddressOut, ShippingStatusOut
import uuid

class OrderedProductInfo(BaseModel):
    title: str
    description: str
    
    model_config = {"from_attributes":True}

class OrderItemOut(BaseModel):
    id: uuid.UUID
    product_id: uuid.UUID
    quantity: int
    price: float
    product: OrderedProductInfo | None
    model_config = {"from_attributes":True}


class OrderOut(BaseModel):
    id: uuid.UUID
    user_id: uuid.UUID
    total_price: float
    status: str
    created_at: datetime
    shipping_address: ShippingAddressOut
    shipping_status: ShippingStatusOut
    orderitems: list[OrderItemOut]
    
    model_config = {"from_attributes":True}
