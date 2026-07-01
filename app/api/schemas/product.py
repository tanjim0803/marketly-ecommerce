from pydantic import BaseModel, Field
import uuid


class CategoryBase(BaseModel):
    name: str


class CategoryCreate(CategoryBase):
    pass


class CategoryOut(CategoryBase):
    id: uuid.UUID
    name: str

    model_config = {"from_attributes": True}


## Product


class ProductBase(BaseModel):
    title: str
    description: str | None = None
    price: float = Field(gt=0)
    stock_quantity: int = Field(ge=0)


class ProductCreate(ProductBase):
    category_ids: list[uuid.UUID] | None = None


class ProductOut(ProductBase):
    id: uuid.UUID
    title: str
    description: str
    slug: str
    price: float
    categories: list[CategoryOut] = Field(default_factory=list)
    image_url: str | None = None

    model_config = {
        "from_attributes": True,
    }


class PaginatedProductOut(BaseModel):
    total: int
    page: int
    limit: int
    items: list[ProductOut]
