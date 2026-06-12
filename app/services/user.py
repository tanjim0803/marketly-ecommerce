from app.database.models import User
from sqlalchemy.ext.asyncio import AsyncSession
from app.api.schemas.user import UserCreate
from fastapi import HTTPException, status
from sqlmodel import select
from app.utils import password_hash


class UserService:
    async def user_exists(self, session: AsyncSession, email: str):
        statement = await session.execute(select(User).where(User.email == email))
        user = statement.scalar_one_or_none()

        return user if user else None

    async def create_user(self, session: AsyncSession, user_data: UserCreate):
        user = await self.user_exists(session, user_data.email)
        if user is not None:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered!",
            )

        new_user = User(
            **user_data.model_dump(exclude=["password"]),
            hash_password=password_hash(user_data.password),
        )

        session.add(new_user)
        await session.commit()
        await session.refresh(new_user)

        return new_user


user_service = UserService()
