from sqlalchemy import DateTime
from sqlmodel import SQLModel, Field, Relationship
from pydantic import EmailStr
from datetime import datetime, timezone
import uuid
from typing import List


def get_now():
    return datetime.now(timezone.utc)


### =========> Associated Tables <========= ###


class ProductCategoryLink(SQLModel, table=True):
    __tablename__ = "product_category"

    product_id: uuid.UUID = Field(
        foreign_key="products.id",
        primary_key=True,
        ondelete="CASCADE",
    )

    category_id: uuid.UUID = Field(
        foreign_key="categories.id",
        primary_key=True,
        ondelete="CASCADE",
    )


### =========> Users <========= ###


class User(SQLModel, table=True):
    __tablename__ = "users"

    id: uuid.UUID | None = Field(primary_key=True, default_factory=uuid.uuid4)
    email: EmailStr = Field(unique=True, max_length=255, nullable=False)
    hash_password: str = Field(max_length=255, nullable=False)
    is_active: bool = Field(default=True)
    is_admin: bool = Field(default=False)
    is_verified: bool = Field(default=False)
    created_at: datetime = Field(
        default_factory=get_now, sa_type=DateTime(timezone=True)
    )
    updated_at: datetime = Field(
        default_factory=get_now, sa_type=DateTime(timezone=True)
    )

    # Relationship
    refresh_tokens: List["RefreshToken"] = Relationship(
        back_populates="user", sa_relationship_kwargs={"cascade": "all, delete-orphan"}
    )
    cart_items: List["CartItem"] = Relationship(
        back_populates="user", sa_relationship_kwargs={"cascade": "all, delete-orphan"}
    )
    shipping_address: "ShippingAddress" = Relationship(
        back_populates="user", sa_relationship_kwargs={"cascade": "all, delete-orphan"}
    )


class RefreshToken(SQLModel, table=True):
    __tablename__ = "refresh_tokens"

    id: uuid.UUID | None = Field(primary_key=True, default_factory=uuid.uuid4)
    user_id: uuid.UUID = Field(
        foreign_key="users.id", ondelete="CASCADE", nullable=False
    )
    token: str = Field(max_length=255, nullable=False)
    expires_at: datetime = Field(nullable=False, sa_type=DateTime(timezone=True))
    revoked: bool = Field(default=False)
    created_at: datetime = Field(
        default_factory=get_now, sa_type=DateTime(timezone=True)
    )

    # Relationship
    user: "User" = Relationship(back_populates="refresh_tokens")


### =========> Products <========= ###


class Product(SQLModel, table=True):
    __tablename__ = "products"

    id: uuid.UUID | None = Field(primary_key=True, default_factory=uuid.uuid4)
    title: str = Field(max_length=255, nullable=False)
    description: str = Field(nullable=True)
    slug: str = Field(unique=True, nullable=False)
    price: float = Field(nullable=False)
    stock_quantity: int = Field(default=0)
    image_url: str = Field(max_length=255, nullable=False)
    created_at: datetime = Field(
        default_factory=get_now, sa_type=DateTime(timezone=True)
    )
    updated_at: datetime = Field(
        default_factory=get_now, sa_type=DateTime(timezone=True)
    )

    # Relationship
    categories: List["Category"] = Relationship(
        back_populates="products", link_model=ProductCategoryLink
    )

    cart_items: List["CartItem"] = Relationship(back_populates="product")


class Category(SQLModel, table=True):
    __tablename__ = "categories"

    id: uuid.UUID = Field(primary_key=True, default_factory=uuid.uuid4)
    name: str = Field(max_length=50, unique=True, nullable=False)

    # Relationship
    products: List["Product"] = Relationship(
        back_populates="categories", link_model=ProductCategoryLink
    )


### =========> Cart Items <========= ###


class CartItem(SQLModel, table=True):
    __tablename__ = "cart_items"

    id: uuid.UUID | None = Field(primary_key=True, default_factory=uuid.uuid4)
    user_id: uuid.UUID = Field(
        foreign_key="users.id", ondelete="CASCADE", nullable=False
    )
    product_id: uuid.UUID = Field(
        foreign_key="products.id", ondelete="SET NULL", nullable=True
    )
    quantity: int = Field(default=1)
    price: float = Field(nullable=False)

    # Relationship
    user: "User" = Relationship(back_populates="cart_items")
    product: "Product" = Relationship(back_populates="cart_items")


### =========> Cart Items <========= ###
class ShippingAddress(SQLModel, table=True):
    __tablename__ = "shipping_address"

    id: uuid.UUID | None = Field(primary_key=True, default_factory=uuid.uuid4)
    user_id: uuid.UUID = Field(
        foreign_key="users.id", ondelete="CASCADE", nullable=False
    )
    name: str = Field(max_length=255, nullable=False)
    address_line1: str = Field(max_length=255, nullable=False)
    address_line2: str = Field(max_length=255, nullable=True)
    city: str = Field(max_length=100, nullable=False)
    state: str = Field(max_length=100, nullable=False)
    pin_code: str = Field(max_length=20, nullable=False)
    country: str = Field(max_length=100, nullable=False)

    user: "User" = Relationship(back_populates="shipping_address")
