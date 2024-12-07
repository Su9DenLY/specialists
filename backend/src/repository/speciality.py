from typing import List, Dict
from uuid import UUID

import asyncpg


class SpecialityRepository:
    def __init__(self, connection: asyncpg.Connection):
        self.connection = connection

    async def create_speciality(self, specialty_id: UUID, title: str) -> None:
        query = """
        INSERT INTO specialties (specialty_id, title)
        VALUES ($1, $2);
        """
        await self.connection.execute(query, specialty_id, title)

    async def get_specialties(self) -> List[Dict]:
        query = """
        SELECT specialty_id, title
        FROM specialties
        ORDER BY title;
        """
        records = await self.connection.fetch(query)
        return [dict(record) for record in records]

    async def get_specialities_by_specialist_id(self, specialist_id) -> List[Dict]:
        query = """
        SELECT specialty_id, title
        FROM specialties
            JOIN specialist_specialties USING (specialty_id)
        WHERE specialist_specialties.specialist_id = $1
        """
        records = await self.connection.fetch(query, specialist_id)
        return [dict(record) for record in records]

    async def delete_relation_specialist_speciality(self, specialist_id: UUID, speciality_id: UUID) -> None:
        query = """
        DELETE FROM specialist_specialties
        WHERE specialist_id = $1 AND specialty_id = $2;
        """
        await self.connection.execute(query, specialist_id, speciality_id)

    async def create_relation_specialist_speciality(self, specialist_id: UUID, speciality_id: UUID) -> None:
        query = """
        INSERT INTO specialist_specialties (specialist_id, specialty_id)
        VALUES ($1, $2);
        """
        await self.connection.execute(query, specialist_id, speciality_id)
