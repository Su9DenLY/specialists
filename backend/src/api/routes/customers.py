from datetime import timezone

from fastapi import APIRouter, Depends, HTTPException
from uuid import UUID

from src.repository.user import UserRepository
from src.schemas.customer import CustomerProfileCreateDTO, CustomerProfileResponseDTO
from database.get_db import get_db
from src.repository.customer import CustomerProfileRepository
from src.schemas.login import LoginResponseDTO
from src.schemas.user import UserCreateDTO
from src.services.auth import AuthService

router = APIRouter()


@router.post("/login", response_model=LoginResponseDTO)
async def login(user_data: UserCreateDTO, db=Depends(get_db)):
    async with db as conn:
        user_repo = UserRepository(conn)
        auth_service = AuthService(user_repo)

        try:
            token = await auth_service.customer_login(str(user_data.email), user_data.password)
        except ValueError as e:
            raise HTTPException(status_code=400, detail=str(e))

        return token


@router.post("/register", response_model=CustomerProfileResponseDTO, status_code=201)
async def register(user_data: CustomerProfileCreateDTO, db=Depends(get_db)):
    async with db as conn:
        tz_birth_date = user_data.birth_date
        if tz_birth_date.tzinfo is None:
            tz_birth_date = tz_birth_date.replace(tzinfo=timezone.utc)

        user_repo = UserRepository(conn)
        auth_service = AuthService(user_repo)

        try:
            user = await auth_service.customer_register(email=user_data.email, password=user_data.password)

            customers_repo = CustomerProfileRepository(conn)
            await customers_repo.create_customer_profile(
                user.user_id, user_data.first_name, user_data.last_name, user_data.phone, tz_birth_date
            )
        except ValueError as e:
            return {"error": str(e)}

        return CustomerProfileResponseDTO(
            user_id=user.user_id,
            email=user.email,
            first_name=user_data.first_name,
            last_name=user_data.last_name,
            phone=user_data.phone,
            birth_date=tz_birth_date,
            created_at=user.created_at,
        )


@router.get("/{user_id}", response_model=CustomerProfileResponseDTO)
async def get_customer_by_id(user_id: UUID, db=Depends(get_db)):
    async with db as conn:
        repo = CustomerProfileRepository(conn)
        customer = await repo.get_customer_by_id(user_id)
        if not customer:
            raise HTTPException(status_code=404, detail="Customer not found")
        return customer
