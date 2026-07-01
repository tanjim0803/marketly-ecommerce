from sqlalchemy.orm import selectinload
from sqlalchemy.ext.asyncio import AsyncSession
from app.database.models import ShippingAddress, User
from app.api.schemas.shipping import (
    ShippingAddressCreate,
    ShippingAddressOut,
    ShippingAddressUpdate,
)
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

    async def get_user_shipping_address_by_address_id(
        self, session: AsyncSession, address_id: str, user_id: str
    ) -> ShippingAddressOut:
        address = await session.get(ShippingAddress, address_id)

        if not address or address.user_id != user_id:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Address not found or not authorized!",
            )

        return address

    async def update_user_shipping_address_by_address_id(
        self,
        session: AsyncSession,
        address_id: str,
        user_id: str,
        data: ShippingAddressUpdate,
    ) -> ShippingAddressOut:
        address = await session.get(ShippingAddress, address_id)

        if not address or address.user_id != user_id:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Address not found or not authorized!",
            )

        for key, value in data.model_dump(exclude_unset=True).items():
            setattr(address, key, value)

        await session.commit()
        session.refresh(address)

        return address

    async def delete_user_shipping_address_by_address_id(
        self, session: AsyncSession, address_id: str, user_id: str
    ):
        address = await session.get(ShippingAddress, address_id)

        if not address or address.user_id != user_id:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Address not found or not authorized!",
            )

        await session.delete(address)
        await session.commit()

        return {"message": "Address deleted successfully!"}


shipping_service = ShippingService()
