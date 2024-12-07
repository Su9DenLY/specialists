from contextlib import asynccontextmanager

from asyncpg import create_pool
from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware
import uvicorn

from config import Settings
from src.api import api_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    database_url = Settings.get_database_url()
    async with create_pool(database_url) as db_pool:
        app.state.db_pool = db_pool
        yield


app = FastAPI(title="Specialists Service API", version="1.0.0", lifespan=lifespan)

app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def main():
    uvicorn.run("src.main:app", host="127.0.0.1", port=8000, reload=True)


if __name__ == "__main__":
    main()
