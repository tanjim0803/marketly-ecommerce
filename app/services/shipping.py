from sqlalchemy.orm import selectinload
from sqlalchemy.ext.asyncio import AsyncSession
from app.database.models import ShippingAddress, User
from app.api.schemas.shipping import ShippingAddressCreate, ShippingAddressOut
from sqlmodel import select
from fastapi import HTTPException, status
from typing import List


class ShippingService:
    async def create_shipping_address(
        self, session: AsyncSession, user_id: str, data: ShippingAddressCreate
    ) -> ShippingAddressOut:
        address = ShippingAddress(user_id=user_id, **data.model_dump())
        session.add(address)
        await session.commit()
        await session.refresh(address)

        return address

    async def list_user_shipping_addresses(
        self, session: AsyncSession, user_id: str
    ) -> list[ShippingAddressOut]:
        statement = await session.execute(
            select(ShippingAddress).where(ShippingAddress.user_id == user_id)
        )
        addresses = statement.scalars().all()

        if not addresses:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Empty Addresses!"
            )

        return addresses


shipping_service = ShippingService()
