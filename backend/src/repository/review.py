from datetime import datetime
from typing import List
from uuid import UUID

import asyncpg


class ReviewRepository:
    def __init__(self, connection: asyncpg.Connection):
        self.connection = connection

    async def create_review(self, review_id: UUID, specialist_id: UUID, created_at: datetime, text: str) -> None:
        query = """
        INSERT INTO reviews (review_id, specialist_id, created_at, text)
        VALUES ($1, $2, $3, $4)
        """
        await self.connection.execute(query, review_id, specialist_id, created_at, text)

    async def get_reviews_by_specialist_id(self, specialist_id: UUID) -> List[dict]:
        query = """
        SELECT review_id, specialist_id, created_at, text
        FROM reviews
        WHERE specialist_id = $1
        """
        records = await self.connection.fetch(query, specialist_id)
        return records
