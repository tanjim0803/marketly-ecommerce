from app.database.models import User
from sqlalchemy.ext.asyncio import AsyncSession
from app.api.schemas.user import (
    PasswordResetRequest,
    UserCreate,
    PasswordChangeRequest,
    PasswordResetEmailRequest,
)
from fastapi import HTTPException, status
from sqlmodel import select
from app.utils import (
    get_user_by_email,
    password_hash,
    verify_password,
    create_email_verification_token,
    verify_email_token_and_get_user_id,
    create_password_reset_token,
)


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

    async def email_verification_send(self, user: User):
        token = create_email_verification_token(user.id)
        link = f"http://localhost:8000/account/verify?token={token}"

        print(f"Verify your email: {link}")

        return {"msg": "Verification email sent!"}

    async def verify_email_token(self, session: AsyncSession, token: str):
        user_id = verify_email_token_and_get_user_id(token, "verify_email")

        if not user_id:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid or expired token!",
            )

        statement = await session.execute(select(User).where(User.id == user_id))

        user = statement.scalar_one_or_none()

        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found!",
            )
        user.is_verified = True
        session.add(user)
        await session.commit()

        return {"msg": "Email verified successfully!"}

    async def change_password(
        self, session: AsyncSession, user: User, data: PasswordChangeRequest
    ):

        if not verify_password(data.old_password, user.hash_password):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Old password is incorrect",
            )

        user.hash_password = password_hash(data.new_password)

        session.add(user)
        await session.commit()

    async def password_reset_email_send(
        self, session: AsyncSession, data: PasswordResetEmailRequest
    ):
        user = await get_user_by_email(session, data.email)

        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found!",
            )

        token = create_password_reset_token(user.id)

        link = f"http://localhost:8000/account/password-reset?token={token}"

        print(f"Reset your password: {link}")

        return {"msg": "Password reset link sent!"}

    async def verify_password_reset_token(
        self, session: AsyncSession, data: PasswordResetRequest
    ):
        user_id = verify_email_token_and_get_user_id(data.token, "password_reset")

        if not user_id:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid or expired token!",
            )

        statement = await session.execute(select(User).where(User.id == user_id))

        user = statement.scalar_one_or_none()

        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found!",
            )
        user.hash_password = password_hash(data.new_password)
        session.add(user)
        await session.commit()

        return {"msg": "Password reset successfully!"}


user_service = UserService()
