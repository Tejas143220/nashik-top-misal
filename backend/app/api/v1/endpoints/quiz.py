from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.schemas.quiz import QuizRequest, QuizRecommendationOut
from app.services import quiz_service

router = APIRouter()

@router.post("/recommend", response_model=List[QuizRecommendationOut])
def get_quiz_recommendations(quiz_in: QuizRequest, db: Session = Depends(get_db)):
    return quiz_service.recommend_misal(db, quiz=quiz_in)
