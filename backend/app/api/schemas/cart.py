from pydantic import BaseModel
import uuid


class CartItemBase(BaseModel):
    product_id: uuid.UUID
    quantity: int


class CartItemCreate(CartItemBase):
    price: float | None = None


class CartItemOut(BaseModel):
    id: uuid.UUID
    user_id: uuid.UUID
    product_id: uuid.UUID
    product_title: str
    quantity: int
    price: float
    total: float

    model_config = {"from_attributes": True}


class CartSummary(BaseModel):
    items: list[CartItemOut]
    total_quantity: int
    total_price: float
