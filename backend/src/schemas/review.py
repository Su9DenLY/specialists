from datetime import datetime
from uuid import UUID

from pydantic import BaseModel


class ReviewCreateDTO(BaseModel):
    specialist_id: UUID
    text: str


class ReviewResponseDTO(BaseModel):
    review_id: UUID
    specialist_id: UUID
    text: str
    created_at: datetime
