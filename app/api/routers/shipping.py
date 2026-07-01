from fastapi import APIRouter, Depends, HTTPException, status
from app.database.session import SessionDep
from app.api.dependencies import get_current_user
from app.database.models import User
from app.api.schemas.shipping import ShippingAddressCreate, ShippingAddressOut
from typing import Annotated
from app.services.shipping import shipping_service

shipping_router = APIRouter()


@shipping_router.post("/addresses", response_model=ShippingAddressOut)
async def shipping_address_create(
    user: Annotated[User, Depends(get_current_user)],
    session: SessionDep,
    data: ShippingAddressCreate,
):
    return await shipping_service.create_shipping_address(session, user.id, data)


@shipping_router.get("/addresses", response_model=list[ShippingAddressOut])
async def shipping_addresses_user_list(
    user: Annotated[User, Depends(get_current_user)],
    session: SessionDep,
):
    return await shipping_service.list_user_shipping_addresses(session, user.id)


@shipping_router.get("/addresses/{address_id}", response_model=ShippingAddressOut)
async def shipping_address_user_by_user_id(
    user: Annotated[User, Depends(get_current_user)],
    session: SessionDep,
    address_id: str,
):
    return await shipping_service.get_user_shipping_address_by_address_id(
        session, address_id, user.id
    )
