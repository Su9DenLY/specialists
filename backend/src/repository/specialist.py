from datetime import datetime
from typing import Optional, List, Dict
from uuid import UUID

import asyncpg


class SpecialistProfileRepository:
    def __init__(self, connection: asyncpg.Connection):
        self.connection = connection

    async def create_specialist_profile(self, user_id: UUID, first_name: str, last_name: str, phone: str,
                                        birth_date: datetime, experience: Optional[float] = None,
                                        rating: Optional[float] = None, description: Optional[str] = None,
                                        ) -> None:
        query = """
        INSERT INTO specialist_profiles (
            user_id, first_name, last_name, phone, birth_date, experience, rating, description
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8);
        """
        await self.connection.execute(
            query, user_id, first_name, last_name, phone, birth_date, experience, rating, description
        )

    async def get_specialists(self) -> List[Dict]:
        query = """
        SELECT  user_id,
                email,
                created_at,
                first_name,
                last_name,
                phone,
                birth_date,
                experience,
                rating,
                description
        FROM specialist_profiles
            JOIN users USING (user_id);
        """
        records = await self.connection.fetch(query)
        return [dict(record) for record in records]

    async def get_specialists_by_speciality(self, speciality_title: str) -> List[Dict]:
        query = """
        SELECT  user_id,
                email,
                created_at,
                first_name,
                last_name,
                phone,
                birth_date,
                experience,
                rating,
                description
        FROM specialist_profiles
            JOIN specialist_specialties ON (specialist_profiles.user_id = specialist_specialties.specialist_id)
            JOIN specialties ON (specialist_specialties.specialty_id = specialties.specialty_id)
            JOIN users USING (user_id)
        WHERE specialties.title = $1;
        """
        records = await self.connection.fetch(query, speciality_title)
        return [dict(record) for record in records]

    async def get_specialist_by_id(self, specialist_id: UUID) -> Optional[dict]:
        query = """
            SELECT  user_id,
                    email,
                    created_at,
                    first_name,
                    last_name,
                    phone,
                    birth_date,
                    experience,
                    rating,
                    description
            FROM specialist_profiles
                JOIN users USING (user_id)
            WHERE user_id = $1;
            """
        record = await self.connection.fetchrow(query, specialist_id)
        return dict(record)
