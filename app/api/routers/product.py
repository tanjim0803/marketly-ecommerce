from fastapi import APIRouter, Depends, HTTPException, status
from app.services.product import product_service
from app.database.session import SessionDep
from app.database.models import Category, User
from app.api.schemas.product import CategoryCreate, CategoryOut
from app.api.dependencies import require_admin, get_current_user
from typing import Annotated, List

product_router = APIRouter()


@product_router.post("/create-category", response_model=CategoryOut)
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
    session: SessionDep,
    category_id: str,
    _admin_user: Annotated[User, Depends(require_admin)],
):
    return await product_service.delete_category(session, category_id)
