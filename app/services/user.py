from app.database.models import User
from sqlalchemy.ext.asyncio import AsyncSession
from app.schemas.user import UserCreate


class UserService:
    async def create_user(session: AsyncSession, user_data: UserCreate):
        pass


user_service = UserService()
