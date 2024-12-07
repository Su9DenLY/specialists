from fastapi import APIRouter
from src.api.routes.customers import router as customer_router
from src.api.routes.specialists import router as specialist_router
from src.api.routes.specialties import router as speciality_router
from src.api.routes.orders import router as order_router
from src.api.routes.questions import router as question_router
from src.api.routes.complaints import router as complaint_router
from src.api.routes.reviews import router as review_router

api_router = APIRouter()
api_router.include_router(customer_router, prefix="/customers", tags=["customers"])
api_router.include_router(specialist_router, prefix="/specialists", tags=["specialists"])
api_router.include_router(speciality_router, prefix="/specialities", tags=["specialties"])
api_router.include_router(order_router, prefix="/orders", tags=["orders"])
api_router.include_router(question_router, prefix="/questions", tags=["questions"])
api_router.include_router(complaint_router, prefix="/complaints", tags=["complaints"])
api_router.include_router(review_router, prefix="/reviews", tags=["reviews"])
