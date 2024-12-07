from fastapi import APIRouter, Depends, HTTPException
from uuid import uuid4, UUID
from src.schemas.speciality import SpecialityCreateDTO, SpecialityResponseDTO, RelationSpecialistSpecialityDTO
from database.get_db import get_db
from src.repository.speciality import SpecialityRepository
from src.services.jwt_service import jwt_service

router = APIRouter()


@router.post("/", response_model=SpecialityResponseDTO, status_code=201)
async def create_specialty(speciality: SpecialityCreateDTO, db=Depends(get_db),
                           user=Depends(jwt_service.get_current_user)):
    if user["role"] != "admin":
        raise HTTPException(403, "Forbidden")
    async with db as conn:
        repo = SpecialityRepository(conn)
        speciality_id = uuid4()
        await repo.create_speciality(speciality_id, speciality.title)
        return SpecialityResponseDTO(speciality_id=speciality_id, title=speciality.title)


@router.get("/", response_model=list[SpecialityResponseDTO])
async def get_specialties(db=Depends(get_db)):
    async with db as conn:
        repo = SpecialityRepository(conn)
        specialities = await repo.get_specialties()
        return [SpecialityResponseDTO(
            speciality_id=speciality["specialty_id"],
            title=speciality["title"]
        ) for speciality in specialities]


@router.get("/{specialist_id}", response_model=list[SpecialityResponseDTO])
async def get_specialities_by_specialist_id(specialist_id: UUID, db=Depends(get_db)):
    async with db as conn:
        repo = SpecialityRepository(conn)
        specialities = await repo.get_specialities_by_specialist_id(specialist_id)
        return [SpecialityResponseDTO(
            speciality_id=speciality["specialty_id"],
            title=speciality["title"]
        ) for speciality in specialities]


@router.delete("/{specialist_id}/{speciality_id}", response_model=None)
async def delete_relation_specialist_speciality(specialist_id: UUID, speciality_id: UUID, db=Depends(get_db),
                                                user=Depends(jwt_service.get_current_user)):
    if user["role"] != "admin" and user["user_id"] != str(specialist_id):
        raise HTTPException(403, "Forbidden")
    async with db as conn:
        repo = SpecialityRepository(conn)
        await repo.delete_relation_specialist_speciality(specialist_id, speciality_id)


@router.post("/{specialist_id}/{speciality_id}", response_model=RelationSpecialistSpecialityDTO)
async def create_relation_specialist_speciality(specialist_id: UUID, speciality_id: UUID, db=Depends(get_db),
                                                user=Depends(jwt_service.get_current_user)):
    if user["role"] != "admin" and user["user_id"] != str(specialist_id):
        raise HTTPException(403, "Forbidden")
    async with db as conn:
        repo = SpecialityRepository(conn)
        await repo.create_relation_specialist_speciality(specialist_id, speciality_id)
        return RelationSpecialistSpecialityDTO(
            specialist_id=speciality_id,
            speciality_id=speciality_id
        )
