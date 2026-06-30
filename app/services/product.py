from sqlalchemy.ext.asyncio import AsyncSession
from app.database.models import Product, Category, ProductCategoryLink
from app.api.schemas.product import (
    CategoryCreate,
    CategoryOut,
    ProductCreate,
    ProductOut,
)
from sqlmodel import select
from fastapi import HTTPException, UploadFile, status
from typing import List
from app.utils import save_upload_file


class ProductService:
    async def create_category(
        self, session: AsyncSession, data: CategoryCreate
    ) -> CategoryOut:
        statement = await session.execute(
            select(Category).where(Category.name == data.name)
        )
        result = statement.scalar_one_or_none()

        if result:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="This category already exists!",
            )

        category = Category(**data.model_dump())

        session.add(category)
        await session.commit()
        await session.refresh(category)

        return category

    async def get_all_categories(self, session: AsyncSession) -> List[CategoryOut]:
        statement = await session.execute(select(Category))
        return statement.scalars().all()

    async def delete_category(self, session: AsyncSession, category_id: str):
        category = await session.get(Category, category_id)

        if not category:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="This category doesn't exists!",
            )

        await session.delete(category)
        await session.commit()

        return {"message": "Category deleted successfully!"}

    async def create_product(
        self,
        session: AsyncSession,
        data: ProductCreate,
        image_url: UploadFile | None = None,
    ) -> Product:
        if data.stock_quantity < 0:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Stock quantity cannot be negative.",
            )
        
        image_path = await save_upload_file(image_url, "images")
        
        categories = []
        
        if data.category_ids:
            statement = await session.execute(select(Category).where(Category.id.in_(data.category_ids)))
            categories = statement.scalars().all()
        
        product_dict = data.model_dump(exclude={"category_ids"})


product_service = ProductService()
