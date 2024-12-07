from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException
from uuid import UUID, uuid4
from src.schemas.complaint import ComplaintCreateDTO, ComplaintResponseDTO
from database.get_db import get_db
from src.repository.complaint import ComplaintRepository
from src.services.jwt_service import jwt_service

router = APIRouter()


@router.post("/", response_model=ComplaintResponseDTO, status_code=201)
async def create_complaint(complaint: ComplaintCreateDTO, db=Depends(get_db), _=Depends(jwt_service.get_current_user)):
    async with db as conn:
        repo = ComplaintRepository(conn)
        complaint_id = uuid4()
        created_at = datetime.now()
        await repo.create_complaint(
            complaint_id, complaint.order_id, complaint.customer_id, complaint.specialist_id, complaint.description,
            created_at
        )
        created_complaint = await repo.get_complaint_by_id(complaint_id)
        return created_complaint


@router.get("/{specialist_id}", response_model=list[ComplaintResponseDTO])
async def get_complaint_by_specialist_id(specialist_id: UUID, db=Depends(get_db),
                                         user=Depends(jwt_service.get_current_user)):
    if user["user_id"] != str(specialist_id) and user["role"] != "admin":
        raise HTTPException(403, "Forbidden")
    async with db as conn:
        repo = ComplaintRepository(conn)
        complaints = await repo.get_complaints_by_specialist_id(specialist_id)
        return complaints
