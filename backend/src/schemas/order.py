from pydantic import BaseModel
from uuid import UUID
from typing import Optional
from datetime import datetime


class OrderCustomer(BaseModel):
    customer_id: UUID
    first_name: str
    last_name: str


class OrderSpecialist(BaseModel):
    specialist_id: UUID
    first_name: str
    last_name: str


class OrderCreateDTO(BaseModel):
    customer_id: UUID
    specialist_id: UUID
    address: str
    scheduled_time: datetime
    price: float
    status: str
    description: Optional[str] = None


class OrderResponseDTO(BaseModel):
    order_id: UUID
    customer: OrderCustomer
    specialist: OrderSpecialist
    address: str
    scheduled_time: datetime
    price: float
    status: str
    description: Optional[str] = None
    created_at: datetime
    updated_at: Optional[datetime] = None
