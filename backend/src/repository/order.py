from datetime import datetime
from typing import Optional, List, Dict
from uuid import UUID

import asyncpg

from src.schemas.order import OrderResponseDTO, OrderCustomer, OrderSpecialist


class OrderRepository:
    def __init__(self, connection: asyncpg.Connection):
        self.connection = connection

    def _map_order_record(self, record) -> OrderResponseDTO:
        return OrderResponseDTO(
            order_id=record["order_id"],
            customer=OrderCustomer(
                customer_id=record["customer_id"],
                first_name=record["customer_first_name"],
                last_name=record["customer_last_name"],
            ),
            specialist=OrderSpecialist(
                specialist_id=record["specialist_id"],
                first_name=record["specialist_first_name"],
                last_name=record["specialist_last_name"],
            ),
            address=record["address"],
            scheduled_time=record["scheduled_time"],
            price=record["price"],
            status=record["status"],
            description=record.get("description"),
            created_at=record["created_at"],
            updated_at=record["updated_at"],
        )

    async def create_order(self, order_id: UUID, customer_id: UUID, specialist_id: UUID, address: str,
                           scheduled_time: datetime, price: float, status: str, created_at: datetime,
                           description: Optional[str] = None
                           ) -> None:
        query = """
        INSERT INTO orders (
            order_id, customer_id, specialist_id, address, scheduled_time, price, status, description, created_at
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9);
        """
        await self.connection.execute(query, order_id, customer_id, specialist_id, address, scheduled_time, price,
                                      status, description, created_at)

    async def get_orders_by_customer_id(self, customer_id: UUID) -> List[OrderResponseDTO]:
        query = """
        SELECT  orders.order_id,
                orders.address,
                orders.scheduled_time,
                orders.status,
                orders.updated_at,
                orders.description,
                orders.created_at,
                orders.price,
                specialist_profiles.user_id AS specialist_id,
                specialist_profiles.first_name AS specialist_first_name,
                specialist_profiles.last_name AS specialist_last_name,
                customer_profiles.user_id AS customer_id,
                customer_profiles.first_name AS customer_first_name,
                customer_profiles.last_name AS customer_last_name
        FROM orders
            JOIN specialist_profiles ON (orders.specialist_id = specialist_profiles.user_id)
            JOIN customer_profiles ON (orders.customer_id = customer_profiles.user_id)
        WHERE customer_id = $1
        ORDER BY orders.created_at DESC;
        """
        records = await self.connection.fetch(query, customer_id)
        return [self._map_order_record(record) for record in records]

    async def get_orders_by_specialist_id(self, specialist_id: UUID) -> List[OrderResponseDTO]:
        query = """
        SELECT  orders.order_id,
                orders.address,
                orders.scheduled_time,
                orders.status,
                orders.updated_at,
                orders.description,
                orders.created_at,
                orders.price,
                specialist_profiles.user_id AS specialist_id,
                specialist_profiles.first_name AS specialist_first_name,
                specialist_profiles.last_name AS specialist_last_name,
                customer_profiles.user_id AS customer_id,
                customer_profiles.first_name AS customer_first_name,
                customer_profiles.last_name AS customer_last_name
        FROM orders
            JOIN specialist_profiles ON (orders.specialist_id = specialist_profiles.user_id)
            JOIN customer_profiles ON (orders.customer_id = customer_profiles.user_id)
        WHERE specialist_id = $1
        ORDER BY orders.created_at DESC;
        """
        records = await self.connection.fetch(query, specialist_id)
        return [self._map_order_record(record) for record in records]

    async def cancel_order(self, order_id: UUID) -> bool:
        query = """
        UPDATE orders 
        SET status = 'cancelled'
        WHERE order_id = $1;
        """
        result = await self.connection.execute(query, order_id)
        return result == "UPDATE 1"

    async def complete_order(self, order_id: UUID) -> bool:
        query = """
        UPDATE orders 
        SET status = 'completed'
        WHERE order_id = $1
        """
        result = await self.connection.execute(query, order_id)
        return result == "UPDATE 1"

    async def get_order_by_id(self, order_id: UUID) -> Optional[OrderResponseDTO]:
        query = """
        SELECT  orders.order_id,
                orders.address,
                orders.scheduled_time,
                orders.status,
                orders.updated_at,
                orders.description,
                orders.created_at,
                orders.price,
                specialist_profiles.user_id AS specialist_id,
                specialist_profiles.first_name AS specialist_first_name,
                specialist_profiles.last_name AS specialist_last_name,
                customer_profiles.user_id AS customer_id,
                customer_profiles.first_name AS customer_first_name,
                customer_profiles.last_name AS customer_last_name
        FROM orders
            JOIN specialist_profiles ON (orders.specialist_id = specialist_profiles.user_id)
            JOIN customer_profiles ON (orders.customer_id = customer_profiles.user_id)
        WHERE order_id = $1
        ORDER BY scheduled_time DESC;
        """
        record = await self.connection.fetchrow(query, order_id)
        return self._map_order_record(record) if record else None
