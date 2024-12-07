from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException
from uuid import UUID, uuid4
from src.schemas.order import OrderCreateDTO, OrderResponseDTO
from database.get_db import get_db
from src.repository.order import OrderRepository
from src.services.jwt_service import jwt_service

router = APIRouter()


@router.post("/", response_model=OrderResponseDTO, status_code=201)
async def create_order(order: OrderCreateDTO, db=Depends(get_db), _=Depends(jwt_service.get_current_user)):
    async with db as conn:
        repo = OrderRepository(conn)
        order_id = uuid4()
        created_at = datetime.now()
        await repo.create_order(
            order_id, order.customer_id, order.specialist_id, order.address,
            order.scheduled_time, order.price, order.status, created_at, order.description,
        )
        return await repo.get_order_by_id(order_id)


@router.patch("/{order_id}/cancel", response_model=OrderResponseDTO)
async def cancel_order(order_id: UUID, db=Depends(get_db), _=Depends(jwt_service.get_current_user)):
    async with db as conn:
        repo = OrderRepository(conn)
        updated = await repo.cancel_order(order_id)
        if not updated:
            raise HTTPException(status_code=404, detail="Order not found")
        return await repo.get_order_by_id(order_id)


@router.patch("/{order_id}/complete", response_model=OrderResponseDTO)
async def complete_order(order_id: UUID, db=Depends(get_db), _=Depends(jwt_service.get_current_user)):
    async with db as conn:
        repo = OrderRepository(conn)
        updated = await repo.complete_order(order_id)
        if not updated:
            raise HTTPException(status_code=404, detail="Order not found")
        return await repo.get_order_by_id(order_id)


@router.get("/customer/{customer_id}", response_model=list[OrderResponseDTO])
async def get_orders_by_customer_id(customer_id: UUID, db=Depends(get_db), user=Depends(jwt_service.get_current_user)):
    if user["user_id"] != str(customer_id) and user["role"] != "admin":
        raise HTTPException(status_code=403, detail="You are not authorized to view orders")
    async with db as conn:
        repo = OrderRepository(conn)
        return await repo.get_orders_by_customer_id(customer_id)


@router.get("/specialist/{specialist_id}", response_model=list[OrderResponseDTO])
async def get_orders_by_customer_id(specialist_id: UUID, db=Depends(get_db),
                                    user=Depends(jwt_service.get_current_user)):
    if user["user_id"] != str(specialist_id) and user["role"] != "admin":
        raise HTTPException(status_code=403, detail="You are not authorized to view orders")
    async with db as conn:
        repo = OrderRepository(conn)
        return await repo.get_orders_by_specialist_id(specialist_id)
