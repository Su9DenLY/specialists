from datetime import datetime
from typing import Optional
from uuid import UUID

import asyncpg


class CustomerProfileRepository:
    def __init__(self, connection: asyncpg.Connection):
        self.connection = connection

    async def create_customer_profile(
            self, user_id: UUID, first_name: str, last_name: str, phone: str, birth_date: datetime
    ) -> None:
        query = """
        INSERT INTO customer_profiles (user_id, first_name, last_name, phone, birth_date)
        VALUES ($1, $2, $3, $4, $5);
        """
        await self.connection.execute(query, user_id, first_name, last_name, phone, birth_date)

    async def get_customer_by_id(self, user_id: UUID) -> Optional[dict]:
        query = """
        SELECT  user_id,
                email,
                first_name,
                last_name,
                phone,
                birth_date,
                created_at  
        FROM customer_profiles
            JOIN users USING (user_id)
        WHERE user_id = $1;
        """
        record = await self.connection.fetchrow(query, user_id)
        return dict(record) if record else None
