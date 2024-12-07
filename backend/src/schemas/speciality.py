from pydantic import BaseModel
from uuid import UUID


class SpecialityCreateDTO(BaseModel):
    title: str


class SpecialityResponseDTO(BaseModel):
    speciality_id: UUID
    title: str


class RelationSpecialistSpecialityDTO(BaseModel):
    specialist_id: UUID
    speciality_id: UUID
