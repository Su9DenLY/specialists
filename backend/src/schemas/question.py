from uuid import UUID

from pydantic import BaseModel, EmailStr


class QuestionCreateDTO(BaseModel):
    user_email: EmailStr
    topic: str
    description: str


class QuestionResponseDTO(BaseModel):
    question_id: UUID
    user_email: EmailStr
    topic: str
    description: str
