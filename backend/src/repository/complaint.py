from datetime import datetime
from typing import Optional, List
from uuid import UUID

import asyncpg

from src.schemas.complaint import ComplaintResponseDTO, OrderDTO, CustomerDTO


class ComplaintRepository:
    def __init__(self, connection: asyncpg.Connection):
        self.connection = connection

    def _map_complaint_record(self, record) -> ComplaintResponseDTO:
        return ComplaintResponseDTO(
            complaint_id=record["complaint_id"],
            specialist_id=record["specialist_id"],
            description=record["description"],
            created_at=record["created_at"],
            order=OrderDTO(
                order_id=record["order_id"],
                customer_id=record["customer_id"],
                address=record["address"],
                scheduled_time=record["scheduled_time"],
                status=record["status"],
                updated_at=record["updated_at"],
            ),
            customer=CustomerDTO(
                customer_id=record["customer_id"],
                first_name=record["first_name"],
            ),
        )

    async def create_complaint(
            self, complaint_id: UUID, order_id: UUID, customer_id: UUID, specialist_id: UUID, description: str,
            created_at: datetime
    ) -> None:
        query = """
        INSERT INTO complaints (complaint_id, order_id, customer_id, specialist_id, description, created_at)
        VALUES ($1, $2, $3, $4, $5, $6);
        """
        await self.connection.execute(query, complaint_id, order_id, customer_id, specialist_id, description,
                                      created_at)

    async def get_complaint_by_id(self, complaint_id: UUID) -> Optional[ComplaintResponseDTO]:
        query = """
        SELECT  complaint_id,
                orders.order_id,
                orders.address,
                orders.scheduled_time,
                orders.status,
                orders.updated_at,
                complaints.customer_id,
                complaints.specialist_id,
                complaints.description,
                complaints.created_at,
                customer_profiles.first_name
        FROM complaints
            JOIN orders USING(order_id)
            JOIN customer_profiles ON (complaints.customer_id = customer_profiles.user_id)
        WHERE complaints.complaint_id = $1
        ORDER BY complaints.created_at DESC;
        """
        record = await self.connection.fetchrow(query, complaint_id)
        if not record:
            return None

        return self._map_complaint_record(record)

    async def get_complaints_by_specialist_id(self, specialist_id: UUID) -> List[ComplaintResponseDTO]:
        query = """
        SELECT  complaint_id,
                orders.order_id,
                orders.address,
                orders.scheduled_time,
                orders.status,
                orders.updated_at,
                complaints.customer_id,
                complaints.specialist_id,
                complaints.description,
                complaints.created_at,
                customer_profiles.first_name
        FROM complaints
            JOIN orders USING(order_id)
            JOIN customer_profiles ON (complaints.customer_id = customer_profiles.user_id)
        WHERE complaints.specialist_id = $1
        ORDER BY complaints.created_at DESC;
        """
        records = await self.connection.fetch(query, specialist_id)
        if not records:
            return []

        return [self._map_complaint_record(record) for record in records]
