from decimal import Decimal

from sqlalchemy.orm import selectinload
from sqlalchemy.ext.asyncio import AsyncSession
from app.database.models import (
    Product,
    ShippingAddress,
    User,
    ShippingStatus,
    ShippingStatusEnum,
    Order,
    OrderItem,
    OrderStatus,
    CartItem,
)
from app.api.schemas.payment import PaymentCreate
from sqlmodel import select
from fastapi import HTTPException, status
from typing import List
from app.services.payment import payment_service


class OrderService:
    async def checkout(
        self,
        session: AsyncSession,
        user_id: str,
        payment_data: PaymentCreate,
    ):
        statement = (
            select(CartItem)
            .where(CartItem.user_id == user_id)
            .options(selectinload(CartItem.product))
            .with_for_update()
        )

        result = await session.execute(statement)

        cart_items = result.scalars().all()

        if not cart_items:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Cart is empty!"
            )

        total_price = Decimal("0.0")
        order_items: list[OrderItem] = []

        for item in cart_items:
            if not item.product:
                continue

            if item.product.stock_quantity < item.quantity:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST, detail="Insufficient stock"
                )

            if item.product.price != item.price:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST, detail="Price mismatch"
                )

            total_price += Decimal(str(item.price)) * item.quantity

            order_items.append(
                OrderItem(
                    product_id=item.product_id,
                    quantity=item.quantity,
                    price=item.price,
                )
            )

            if abs(total_price - Decimal(str(payment_data.amount))) > Decimal("0.01"):
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Payment amount does not match cart total",
                )

            address = await session.get(
                ShippingAddress, payment_data.shipping_address_id
            )

            if not address or address.user_id != user_id:
                raise HTTPException(
                    status_code=400,
                    detail="Invalid shipping address",
                )

            order = Order(
                user_id=user_id,
                total_price=float(total_price),
                shipping_address_id=payment_data.shipping_address_id,
            )

            session.add(order)
            await session.flush()

            payment = await payment_service.create_payment(
                session=session, data=payment_data, user_id=user_id, order_id=order.id
            )

            if not payment.is_paid:
                await session.rollback()
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST, detail="Payment Failed!"
                )

            order.status = OrderStatus.confirmed
            session.add(order)

            shipping_status = ShippingStatus(
                order_id=order.id,
                status=ShippingStatusEnum.pending,
            )

            session.add(shipping_status)

            for oi in order_items:
                oi.order_id = order.id
                session.add(oi)

                product = await session.get(Product, oi.product_id)

                if product:
                    product.stock_quantity -= oi.quantity

            for item in cart_items:
                await session.delete(item)

            await session.commit()
            await session.refresh(order)

            statement = (
                select(Order)
                .where(Order.id == order.id)
                .options(
                    selectinload(Order.orderitems),
                    selectinload(Order.shipping_address),
                    selectinload(Order.shipping_status),
                )
            )
            result = await session.execute(statement)

            return result.scalar_one()

    async def get_placed_order_for_user(self, session: AsyncSession, user_id: str):
        statement = (
            select(Order)
            .where(Order.user_id == user_id)
            .options(
                selectinload(Order.orderitems),
                selectinload(Order.orderitems).selectinload(OrderItem.product),
            )
        )

        result = await session.execute(statement)

        return result.scalars().all()

    async def get_order_by_id(self, session: AsyncSession, user_id: str, order_id: str):
        statement = (
            select(Order)
            .where(Order.id == order_id, Order.user_id == user_id)
            .options(selectinload(Order.orderitems))
        )

        result = await session.execute(statement)

        return result.scalar_one_or_none()

    async def cancel_order(self, session: AsyncSession, user_id: str, order_id: str):
        order = await self.get_order_by_id(session, user_id, order_id)

        if not order:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Order not found!"
            )

        if (
            not order.shipping_status
            or order.shipping_status.status != ShippingStatusEnum.pending
        ):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Only orders with pending shipping status can be cancelled!",
            )

        order.status = OrderStatus.cancelled
        order.shipping_status.status = ShippingStatusEnum.cancelled

        await session.commit()
        await session.refresh(order)

        return order


order_service = OrderService()
