from datetime import datetime

from fastapi import APIRouter, Depends
from uuid import uuid4, UUID
from src.schemas.review import ReviewCreateDTO, ReviewResponseDTO
from database.get_db import get_db
from src.repository.review import ReviewRepository
from src.services.jwt_service import jwt_service

router = APIRouter()


@router.post("/", response_model=ReviewResponseDTO, status_code=201)
async def create_review(review: ReviewCreateDTO, db=Depends(get_db), _=Depends(jwt_service.get_current_user)):
    async with db as conn:
        repo = ReviewRepository(conn)
        review_id = uuid4()
        created_at = datetime.now()
        await repo.create_review(review_id, review.specialist_id, created_at, review.text)
        return ReviewResponseDTO(
            review_id=review_id,
            specialist_id=review.specialist_id,
            text=review.text,
            created_at=created_at
        )


@router.get("/{specialist_id}", response_model=list[ReviewResponseDTO], status_code=200)
async def get_reviews_by_specialist_id(specialist_id: UUID, db=Depends(get_db)):
    async with db as conn:
        repo = ReviewRepository(conn)
        reviews = await repo.get_reviews_by_specialist_id(specialist_id)
        return [ReviewResponseDTO(**review) for review in reviews]
