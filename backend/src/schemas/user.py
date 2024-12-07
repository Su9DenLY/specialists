from pydantic import BaseModel, EmailStr
from uuid import UUID
from datetime import datetime


class UserCreateDTO(BaseModel):
    email: EmailStr
    password: str
    role: str


class UserResponseDTO(BaseModel):
    user_id: UUID
    email: EmailStr
    role: str
    created_at: datetime
