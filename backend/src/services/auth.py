from datetime import datetime
from typing import Dict
from uuid import uuid4

import bcrypt
from src.services.jwt_service import jwt_service
from fastapi import HTTPException

from src.domain.users import User, UserRole
from src.repository.user import UserRepository

weak_passwords = ["12345", "password", "zxc"]


class AuthService:
    def __init__(self, user_repo: UserRepository):
        self.user_repo = user_repo

    async def customer_login(self, email: str, password: str) -> Dict[str, str]:
        customer = await self.user_repo.get_customer_by_email(email)
        if not customer:
            raise HTTPException(status_code=404, detail="Customer not found")

        if not bcrypt.checkpw(password.encode(), customer.password_hash.encode()):
            raise HTTPException(status_code=401, detail="Incorrect password")

        token = jwt_service.create_jwt_token(user_id=str(customer.user_id), role="customer")
        return {"access_token": token}

    async def specialist_login(self, email: str, password: str) -> Dict[str, str]:
        user = await self.user_repo.get_specialist_by_email(email)
        role = "specialist"

        if not user:
            user = await self.user_repo.get_admin_by_email(email)
            role = "admin"

        if not user:
            raise HTTPException(status_code=404, detail="Specialist not found")

        if not bcrypt.checkpw(password.encode(), user.password_hash.encode()):
            raise HTTPException(status_code=401, detail="Incorrect password")

        token = jwt_service.create_jwt_token(user_id=str(user.user_id), role=role)
        return {"access_token": token}

    async def customer_register(self, email: str, password: str) -> User:
        existing_customer = await self.user_repo.get_customer_by_email(email)
        if existing_customer:
            raise HTTPException(status_code=400, detail="Customer already exists")

        if len(password) < 5 or password in weak_passwords:
            raise HTTPException(status_code=400, detail="The password is too weak")

        user_id = uuid4()
        hashed_password = bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()
        created_at = datetime.now()

        await self.user_repo.create_user(user_id, email, hashed_password, UserRole.CUSTOMER.value, created_at)

        return User(user_id=user_id, email=email, password_hash=hashed_password, role=UserRole.CUSTOMER.value,
                    created_at=created_at)

    async def specialist_register(self, email: str, password: str) -> User:
        existing_specialist = await self.user_repo.get_specialist_by_email(email)
        if existing_specialist:
            raise HTTPException(status_code=400, detail="Specialist already exists")

        if len(password) < 5 or password in weak_passwords:
            raise HTTPException(status_code=400, detail="The password is too weak")

        user_id = uuid4()
        hashed_password = bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()
        created_at = datetime.now()

        await self.user_repo.create_user(user_id, email, hashed_password, UserRole.SPECIALIST.value, created_at)

        return User(user_id=user_id, email=email, password_hash=hashed_password, role=UserRole.SPECIALIST.value,
                    created_at=created_at)
