from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.schemas.activity import ActivityOut
from app.models.activity import Activity

router = APIRouter()

@router.get("/", response_model=List[ActivityOut])
def get_activities(db: Session = Depends(get_db)):
    activities = db.query(Activity).order_by(Activity.name).all()
    return activities
