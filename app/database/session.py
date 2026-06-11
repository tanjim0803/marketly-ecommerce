from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from app.config import db_settings
from fastapi import Depends
from typing import Annotated

async_engine = create_async_engine(db_settings.DATABASE_URL, echo=True)

AsyncSessionLocal = async_sessionmaker(
    bind=async_engine, expire_on_commit=False, class_=AsyncSession
)


async def get_session():
    async with AsyncSessionLocal as session:
        yield session


SessionDep = Annotated[AsyncSession, Depends(get_session)]
