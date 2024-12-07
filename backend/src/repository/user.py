from datetime import datetime
from uuid import UUID

import asyncpg

from src.domain.users import User


class UserRepository:
    def __init__(self, connection: asyncpg.Connection):
        self.connection = connection

    async def create_user(self, user_id: UUID, email: str, password_hash: str, role: str, time: datetime) -> UUID:
        query = """
        INSERT INTO users (user_id, email, password_hash, role, created_at)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING user_id;
        """
        return await self.connection.fetchval(query, user_id, email, password_hash, role, time)

    async def get_customer_by_email(self, email: str) -> User | None:
        query = """
        SELECT user_id, email, password_hash, role, created_at
        FROM users
        WHERE email = $1 AND role = 'customer';
        """
        record = await self.connection.fetchrow(query, email)
        return User(**record) if record else None

    async def get_specialist_by_email(self, email: str) -> User | None:
        query = """
        SELECT user_id, email, password_hash, role, created_at
        FROM users
        WHERE email = $1 AND role = 'specialist';
        """
        record = await self.connection.fetchrow(query, email)
        return User(**record) if record else None

    async def get_admin_by_email(self, email: str) -> User | None:
        query = """
        SELECT user_id, email, password_hash, role, created_at
        FROM users
        WHERE email = $1 AND role = 'admin';
        """
        record = await self.connection.fetchrow(query, email)
        return User(**record) if record else None
