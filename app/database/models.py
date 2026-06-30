from sqlalchemy import DateTime
from sqlmodel import SQLModel, Field, Relationship
from pydantic import EmailStr
from datetime import datetime, timezone
import uuid
from typing import List


def get_now():
    return datetime.now(timezone.utc)


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
    refresh_tokens: List["RefreshToken"] = Relationship(back_populates="user")


class RefreshToken(SQLModel, table=True):
    __tablename__ = "refresh_tokens"

    id: uuid.UUID | None = Field(primary_key=True, default_factory=uuid.uuid4)
    user_id: uuid.UUID = Field(foreign_key="users.id", ondelete="CASCADE")
    token: str = Field(max_length=255, nullable=False)
    expires_at: datetime = Field(nullable=False, sa_type=DateTime(timezone=True))
    revoked: bool = Field(default=False)
    created_at: datetime = Field(
        default_factory=get_now, sa_type=DateTime(timezone=True)
    )

    # Relationship
    user: "User" = Relationship(back_populates="refresh_tokens")


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

    categories: List["Category"] = Relationship(
        back_populates="products", link_model=ProductCategoryLink
    )


class Category(SQLModel, table=True):
    __tablename__ = "categories"

    id: uuid.UUID = Field(primary_key=True, default_factory=uuid.uuid4)
    name: str = Field(max_length=50, unique=True, nullable=False)

    products: List["Product"] = Relationship(
        back_populates="categories", link_model=ProductCategoryLink
    )
