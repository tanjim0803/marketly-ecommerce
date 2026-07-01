from sqlalchemy.orm import selectinload
from sqlalchemy.ext.asyncio import AsyncSession
from app.database.models import Product, Category, ProductCategoryLink
from app.api.schemas.product import (
    CategoryCreate,
    CategoryOut,
    ProductCreate,
    ProductOut,
)
from sqlmodel import select, func
from fastapi import HTTPException, UploadFile, status
from typing import List
from app.utils import save_upload_file, generate_slug


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
            statement = await session.execute(
                select(Category).where(Category.id.in_(data.category_ids))
            )
            categories = statement.scalars().all()

        product_dict = data.model_dump(exclude={"category_ids"})

        if not product_dict.get("slug"):
            product_dict["slug"] = generate_slug(product_dict.get("title"))

        new_product = Product(
            **product_dict, image_url=image_path, categories=categories
        )

        session.add(new_product)
        await session.commit()

        result = await session.execute(
            select(Product)
            .where(Product.id == new_product.id)
            .options(selectinload(Product.categories))
        )

        product = result.scalar_one()

        return product

    async def get_all_products(
        self,
        session: AsyncSession,
        category_names: list[str] | None = None,
        limit: int = 5,
        page: int = 1,
    ) -> dict:
        statement = select(Product).options(selectinload(Product.categories))

        if category_names:
            statement = (
                statement.join(Product.categories)
                .where(Category.name.in_(category_names))
                .distinct()
            )

        count_statement = statement.with_only_columns(func.count(Product.id)).order_by(
            None
        )
        total = await session.scalar(count_statement)

        statement = statement.limit(limit).offset((page - 1) * limit)

        result = await session.execute(statement)

        products = result.scalars().all()

        return {
            "total": total,
            "page": page,
            "limit": limit,
            "items": products,
        }

    async def get_product_by_slug(
        self, session: AsyncSession, slug: str
    ) -> ProductOut | None:
        statement = await session.execute(
            select(Product)
            .options(selectinload(Product.categories))
            .where(Product.slug == slug)
        )
        product = statement.scalar_one_or_none()

        if not product:
            return None

        return product


product_service = ProductService()
