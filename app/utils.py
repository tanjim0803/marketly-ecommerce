from fastapi import HTTPException, status
from passlib.context import CryptContext
from datetime import datetime, timedelta, timezone
from app.config import security_settings
from jose import jwt, JWTError, ExpiredSignatureError
from sqlmodel import select
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


def decode_token(token: str):
    try:
        return jwt.decode(
            token,
            key=security_settings.JWT_SECRET,
            algorithms=[security_settings.JWT_ALGORITHM],
        )
    except ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Token has expired!"
        )
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid Token!"
        )


async def verify_refresh_token(session: AsyncSession, token: str):
    statement = await session.execute(
        select(RefreshToken).where(RefreshToken.token == token)
    )
    db_refresh_token = statement.scalar_one_or_none()
    
    print(f"===========================DB REFRESH_TOKEN: {db_refresh_token}")
    
    if db_refresh_token and not db_refresh_token.revoked:
        expires_at = db_refresh_token.expires_at
        if expires_at.tzinfo is None:
            expires_at = expires_at.replace(tzinfo=timezone.utc)

        if expires_at > datetime.now(timezone.utc):
            user_statement = statement = await session.execute(
                select(User).where(User.id == db_refresh_token.user_id)
            )

            user = user_statement.scalar_one_or_none()
            return user

    return None


def create_email_verification_token(user_id: int):
    expire = datetime.now(timezone.utc) + timedelta(
        hours=security_settings.EMAIL_VERIFICATION_TOKEN_TIME_HOUR
    )

    to_encode = {"sub": str(user_id), "type": "verify_email", "exp": expire}

    return jwt.encode(
        to_encode,
        key=security_settings.JWT_SECRET,
        algorithm=security_settings.JWT_ALGORITHM,
    )


def verify_email_token_and_get_user_id(token: str, token_type: str):
    payload = decode_token(token)

    if not payload or payload.get("type") != token_type:
        return None

    return str(payload.get("sub"))
