from fastapi import (
    APIRouter,
    Depends,
    File,
    HTTPException,
    UploadFile,
    status,
    Form,
    Query,
)
from app.services.product import product_service
from app.database.session import SessionDep
from app.database.models import Category, User
from app.api.schemas.product import (
    CategoryCreate,
    CategoryOut,
    ProductCreate,
    ProductOut,
    PaginatedProductOut,
    ProductUpdate,
)
from app.api.dependencies import require_admin, get_current_user
from typing import Annotated, List
import uuid

product_router = APIRouter()


@product_router.post("/category", response_model=CategoryOut)
async def create_category(
    _admin_user: Annotated[User, Depends(require_admin)],
    session: SessionDep,
    category: CategoryCreate,
):
    return await product_service.create_category(session, category)


@product_router.get("/category", response_model=List[CategoryOut])
async def get_categories(
    session: SessionDep,
):
    return await product_service.get_all_categories(session)


@product_router.delete(
    "/category/{category_id}", status_code=status.HTTP_204_NO_CONTENT
)
async def delete_category(
    _admin_user: Annotated[User, Depends(require_admin)],
    session: SessionDep,
    category_id: str,
):
    return await product_service.delete_category(session, category_id)


@product_router.post("/", response_model=ProductOut)
async def product_create(
    _admin_user: Annotated[User, Depends(require_admin)],
    session: SessionDep,
    title: str = Form(...),
    description: str | None = Form(None),
    price: float = Form(...),
    stock_quantity: int = Form(...),
    category_ids: Annotated[List[uuid.UUID], Form()] = [],
    image_url: UploadFile | None = File(None),
):
    data = ProductCreate(
        title=title,
        description=description,
        price=price,
        stock_quantity=stock_quantity,
        category_ids=category_ids,
    )

    return await product_service.create_product(session, data, image_url)


@product_router.get("/", response_model=PaginatedProductOut)
async def list_products(
    session: SessionDep,
    categories: list[str] | None = Query(default=None),
    limit: int = Query(default=5, ge=1, le=100),
    page: int = Query(default=1, ge=1),
):
    return await product_service.get_all_products(session, categories, limit, page)


@product_router.get("/search")
async def products_search(
    session: SessionDep,
    categories: list[str] | None = Query(default=None),
    title: str = Query(default=None),
    description: str | None = Query(default=None),
    min_price: float | None = Query(default=None),
    max_price: float | None = Query(default=None),
    limit: int = Query(default=5, ge=1, le=100),
    page: int = Query(default=1, ge=1),
):
    return await product_service.search_products(
        session, categories, title, description, min_price, max_price, limit, page
    )


@product_router.get("/{slug}", response_model=ProductOut)
async def product_get_by_slug(session: SessionDep, slug: str):
    product = await product_service.get_product_by_slug(session, slug)

    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Product not found!"
        )

    return product


@product_router.patch("/{product_id}", response_model=ProductOut)
async def product_update_by_id(
    _admin_user: Annotated[User, Depends(require_admin)],
    session: SessionDep,
    product_id: str,
    title: str | None = Form(default=None),
    description: str | None = Form(default=None),
    price: float | None = Form(default=None),
    stock_quantity: int | None = Form(default=None),
    category_ids: list[str] | None = Form(default=None),
    image_url: UploadFile | None = Form(default=None),
):
    data = ProductUpdate(
        title=title,
        description=description,
        price=price,
        stock_quantity=stock_quantity,
        categories_ids=category_ids,
    )

    product = await product_service.update_product_by_id(
        session, product_id, data, image_url
    )

    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Product not found!"
        )

    return product


@product_router.delete("/{product_id}", status_code=status.HTTP_204_NO_CONTENT)
async def product_delete_by_id(
    _admin_user: Annotated[User, Depends(require_admin)],
    session: SessionDep,
    product_id: str,
):
    result = await product_service.delete_product(session, product_id)

    if not result:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Product doesn't exists!"
        )

    return {"message": "Product deleted successfully!"}
