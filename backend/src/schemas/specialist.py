from pydantic import BaseModel
from uuid import UUID
from typing import Optional
from datetime import datetime


class SpecialistProfileCreateDTO(BaseModel):
    password: str
    email: str
    first_name: str
    last_name: str
    phone: str
    birth_date: datetime
    experience: Optional[float] = None
    rating: Optional[float] = None
    description: Optional[str] = None


class SpecialistProfileResponseDTO(BaseModel):
    user_id: UUID
    email: str
    first_name: str
    last_name: str
    phone: str
    birth_date: datetime
    created_at: datetime
    experience: Optional[float] = None
    rating: Optional[float] = None
    description: Optional[str] = None
