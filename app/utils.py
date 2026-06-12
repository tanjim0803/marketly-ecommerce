from passlib.context import CryptContext
from datetime import datetime, timedelta, timezone
from app.config import security_settings
from jose import jwt
from sqlalchemy.ext.asyncio import AsyncSession
from app.database.models import User, RefreshToken
import uuid

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def password_hash(password: str):
    return pwd_context.hash(password)


def verify_password(password: str, hashed_password: str):
    return pwd_context.verify(password, hashed_password)


def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + (
        expires_delta or timedelta(minutes=security_settings.JWT_ACCESS_TOKEN_TIME_MIN)
    )

    to_encode.update({"exp": expire})

    return jwt.encode(
        to_encode,
        key=security_settings.JWT_SECRET,
        algorithm=security_settings.JWT_ALGORITHM,
    )


async def create_tokens(session: AsyncSession, user: User):
    access_token = create_access_token(data={"sub": str(user.id)})
    refresh_token_str = str(uuid.uuid4())
    expires_at = datetime.now(timezone.utc) + timedelta(
        days=security_settings.JWT_REFRESH_TOKEN_TIME_DAY
    )

    refresh_token = RefreshToken(
        user_id=user.id,
        token=refresh_token_str,
        expires_at=expires_at,
    )

    session.add(refresh_token)
    await session.commit()
    await session.refresh(refresh_token)

    return {
        "access_token": access_token,
        "refresh_token": refresh_token_str,
        "token_type": "bearer",
    }
