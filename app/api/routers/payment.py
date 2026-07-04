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
from app.services.payment import payment_service
from app.api.schemas.shipping import ShippingStatusOut, ShippingStatusUpdate
import uuid

payment_router = APIRouter()

# @payment_router.get()