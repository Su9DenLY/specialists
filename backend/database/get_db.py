from contextlib import asynccontextmanager
from asyncpg import Connection
from fastapi import Request


@asynccontextmanager
async def get_db(request: Request) -> Connection:
    db_pool = request.app.state.db_pool
    async with db_pool.acquire() as connection:
        yield connection
