from datetime import timezone
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException

from src.repository.user import UserRepository
from src.schemas.login import LoginResponseDTO
from src.schemas.specialist import SpecialistProfileCreateDTO, SpecialistProfileResponseDTO
from database.get_db import get_db
from src.repository.specialist import SpecialistProfileRepository
from src.schemas.user import UserCreateDTO
from src.services.auth import AuthService

router = APIRouter()


@router.post("/login", response_model=LoginResponseDTO)
async def login(user_data: UserCreateDTO, db=Depends(get_db)):
    async with db as conn:
        user_repo = UserRepository(conn)
        auth_service = AuthService(user_repo)

        try:
            token = await auth_service.specialist_login(str(user_data.email), user_data.password)
        except ValueError as e:
            raise HTTPException(status_code=400, detail=str(e))

        return token


@router.post("/register", response_model=SpecialistProfileResponseDTO, status_code=201)
async def register(user_data: SpecialistProfileCreateDTO, db=Depends(get_db)):
    async with db as conn:
        tz_birth_date = user_data.birth_date
        if tz_birth_date.tzinfo is None:
            tz_birth_date = tz_birth_date.replace(tzinfo=timezone.utc)

        user_repo = UserRepository(conn)
        auth_service = AuthService(user_repo)

        try:
            user = await auth_service.specialist_register(email=user_data.email, password=user_data.password)

            specialists_repo = SpecialistProfileRepository(conn)
            await specialists_repo.create_specialist_profile(
                user.user_id, user_data.first_name, user_data.last_name, user_data.phone,
                tz_birth_date, user_data.experience, user_data.rating, user_data.description
            )
        except ValueError as e:
            return {"error": str(e)}

        return SpecialistProfileResponseDTO(
            user_id=user.user_id,
            email=user.email,
            first_name=user_data.first_name,
            last_name=user_data.last_name,
            phone=user_data.phone,
            birth_date=tz_birth_date,
            created_at=user.created_at,
            experience=user_data.experience,
            rating=user_data.rating,
            description=user_data.description
        )


@router.get("/", response_model=list[SpecialistProfileResponseDTO])
async def get_specialists_by_speciality(db=Depends(get_db)):
    async with db as conn:
        repo = SpecialistProfileRepository(conn)
        specialists = await repo.get_specialists()
        return [SpecialistProfileResponseDTO(**specialist) for specialist in specialists]


@router.get("/speciality/{speciality_title}", response_model=list[SpecialistProfileResponseDTO])
async def get_specialists_by_speciality(speciality_title: str, db=Depends(get_db)):
    async with db as conn:
        repo = SpecialistProfileRepository(conn)
        specialists = await repo.get_specialists_by_speciality(speciality_title)
        return [SpecialistProfileResponseDTO(**specialist) for specialist in specialists]


@router.get("/specialist/{specialist_id}", response_model=SpecialistProfileResponseDTO)
async def get_specialist_by_id(specialist_id: UUID, db=Depends(get_db)):
    async with db as conn:
        repo = SpecialistProfileRepository(conn)
        specialist = await repo.get_specialist_by_id(specialist_id)
        if specialist is None:
            raise HTTPException(status_code=404, detail="Specialist not found")
        return SpecialistProfileResponseDTO(**specialist)
