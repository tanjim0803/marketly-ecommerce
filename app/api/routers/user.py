from fastapi import APIRouter
from app.database.session import SessionDep
from app.schemas.user import UserCreate, UserOut
from app.services.user import user_service

user_router = APIRouter()


@user_router.post("/register", response_model=UserOut)
async def register(session: SessionDep, user_data: UserCreate):
    user = await user_service.create_user(session, user_data)

    return user
