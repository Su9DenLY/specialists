from fastapi import APIRouter, Depends, HTTPException
from uuid import uuid4
from src.schemas.question import QuestionCreateDTO, QuestionResponseDTO
from database.get_db import get_db
from src.repository.question import QuestionRepository
from src.services.jwt_service import jwt_service

router = APIRouter()


@router.post("/", response_model=QuestionResponseDTO, status_code=201)
async def create_question(question: QuestionCreateDTO, db=Depends(get_db)):
    async with db as conn:
        repo = QuestionRepository(conn)
        question_id = uuid4()
        await repo.create_question(question_id, str(question.user_email), question.topic, question.description)
        return QuestionResponseDTO(
            question_id=question_id,
            user_email=question.user_email,
            topic=question.topic,
            description=question.description
        )


@router.get("/", response_model=list[QuestionResponseDTO], status_code=200)
async def get_all_questions(db=Depends(get_db), user=Depends(jwt_service.get_current_user)):
    if user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Forbidden")
    async with db as conn:
        repo = QuestionRepository(conn)
        questions = await repo.get_all_questions()
        return [QuestionResponseDTO(**question) for question in questions]
