from pydantic import BaseModel
from uuid import UUID
from datetime import datetime


class OrderDTO(BaseModel):
    order_id: UUID
    customer_id: UUID
    address: str
    scheduled_time: datetime
    status: str
    updated_at: datetime


class CustomerDTO(BaseModel):
    customer_id: UUID
    first_name: str


class ComplaintCreateDTO(BaseModel):
    order_id: UUID
    customer_id: UUID
    specialist_id: UUID
    description: str


class ComplaintResponseDTO(BaseModel):
    complaint_id: UUID
    specialist_id: UUID
    description: str
    created_at: datetime
    order: OrderDTO
    customer: CustomerDTO
