from fastapi import APIRouter, Depends, HTTPException, status
from app.database.session import SessionDep
from app.api.dependencies import get_current_user, require_admin
from app.database.models import User
from app.api.schemas.shipping import (
    ShippingAddressCreate,
    ShippingAddressOut,
    ShippingAddressUpdate,
)
from typing import Annotated
from app.services.shipping import shipping_service
from app.api.schemas.shipping import ShippingStatusOut, ShippingStatusUpdate
import uuid

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
async def shipping_address_user_by_address_id(
    user: Annotated[User, Depends(get_current_user)],
    session: SessionDep,
    address_id: str,
):
    return await shipping_service.get_user_shipping_address_by_address_id(
        session, address_id, user.id
    )


@shipping_router.patch("/addresses/{address_id}", response_model=ShippingAddressOut)
async def user_shipping_address_update_by_address_id(
    user: Annotated[User, Depends(get_current_user)],
    session: SessionDep,
    address_id: str,
    data: ShippingAddressUpdate,
):
    return await shipping_service.update_user_shipping_address_by_address_id(
        session, address_id, user.id, data
    )


@shipping_router.delete("/addresses/{address_id}")
async def user_shipping_address_delete_by_address_id(
    user: Annotated[User, Depends(get_current_user)],
    session: SessionDep,
    address_id: str,
):
    return await shipping_service.delete_user_shipping_address_by_address_id(
        session, address_id, user.id
    )


@shipping_router.get("/status/{order_id}", response_model=ShippingStatusOut)
async def get_user_order_shipping_status(
    user: Annotated[User, Depends(get_current_user)],
    session: SessionDep,
    order_id: uuid.UUID,
):
    return await shipping_service.get_user_order_shipping_status(
        session, order_id, user.id
    )


@shipping_router.patch("/status/{order_id}", response_model=ShippingStatusOut)
async def change_shipping_status(
    _admin_user: Annotated[User, Depends(require_admin)],
    session: SessionDep,
    order_id: uuid.UUID,
    data: ShippingStatusUpdate,
):
    return await shipping_service.update_shipping_status(session, order_id, data.status)
