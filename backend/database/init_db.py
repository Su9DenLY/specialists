import asyncpg
import asyncio
import os
from dotenv import load_dotenv


async def configure_database():
    load_dotenv()

    DB_USER = os.getenv("POSTGRES_USER")
    DB_PASSWORD = os.getenv("POSTGRES_PASSWORD")
    DB_NAME = os.getenv("POSTGRES_DB")
    DB_HOST = os.getenv("POSTGRES_HOST")
    DB_PORT = os.getenv("POSTGRES_PORT")

    connection = await asyncpg.connect(
        user=DB_USER,
        password=DB_PASSWORD,
        database=DB_NAME,
        host=DB_HOST,
        port=DB_PORT
    )
    return connection


async def execute_ddl(connection):
    try:
        with open("database/migrations/ddl.sql", "r") as ddl_file:
            ddl_script = ddl_file.read()
            await connection.execute(ddl_script)
    except Exception as e:
        print(f"Error DDL: {e}")


async def main():
    connection = await configure_database()
    try:
        await execute_ddl(connection)
    finally:
        await connection.close()


def run():
    asyncio.run(main())


if __name__ == "__main__":
    run()
