from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import JSONResponse
from app.database.session import SessionDep
from app.schemas.user import UserCreate, UserOut
from app.services.user import user_service
from fastapi.security import OAuth2PasswordRequestForm
from typing import Annotated
from app.utils import create_tokens, verify_password

user_router = APIRouter()


@user_router.post("/register", response_model=UserOut)
async def register(session: SessionDep, user_data: UserCreate):
    user = await user_service.create_user(session, user_data)

    return user


@user_router.post("/login")
async def login(
    session: SessionDep, form_data: Annotated[OAuth2PasswordRequestForm, Depends()]
):
    user = await user_service.user_exists(session, form_data.username)

    if user is None or not verify_password(form_data.password, user.hash_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid Credentials!"
        )

    tokens = await create_tokens(session, user)

    response = JSONResponse(content={"message": "Login successful"})

    response.set_cookie(
        "access_token",
        value=tokens["access_token"],
        httponly=True,
        samesite="lax",
        secure=True,
        max_age=60 * 60 * 24 * 1,
    )

    response.set_cookie(
        "refresh_token",
        value=tokens["refresh_token"],
        httponly=True,
        samesite="lax",
        secure=True,
        max_age=60 * 60 * 24 * 7,
    )

    return response
