import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    DB_USER = os.getenv("POSTGRES_USER")
    DB_PASSWORD = os.getenv("POSTGRES_PASSWORD")
    DB_HOST = os.getenv("POSTGRES_HOST")
    DB_PORT = os.getenv("POSTGRES_PORT")
    DB_NAME = os.getenv("POSTGRES_DB")
    SECRET_KEY = os.getenv("SECRET_KEY")
    ALGORITHM = os.getenv("ALGORITHM")

    @staticmethod
    def get_database_url() -> str:
        user = Settings.DB_USER
        password = Settings.DB_PASSWORD
        host = Settings.DB_HOST
        port = Settings.DB_PORT
        db_name = Settings.DB_NAME

        return f"postgresql://{user}:{password}@{host}:{port}/{db_name}"
