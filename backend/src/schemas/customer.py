from pydantic import BaseModel
from uuid import UUID
from datetime import datetime


class CustomerProfileCreateDTO(BaseModel):
    password: str
    email: str
    first_name: str
    last_name: str
    phone: str
    birth_date: datetime


class CustomerProfileResponseDTO(BaseModel):
    user_id: UUID
    email: str
    first_name: str
    last_name: str
    phone: str
    birth_date: datetime
    created_at: datetime
