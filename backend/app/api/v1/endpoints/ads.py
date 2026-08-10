from typing import List, Optional
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.schemas.ad import AdPlacementOut
from app.models.ad import AdPlacement

router = APIRouter()

@router.get("/slot/{slot_name}", response_model=Optional[AdPlacementOut])
def get_ad_for_slot(slot_name: str, db: Session = Depends(get_db)):
    ad = db.query(AdPlacement).filter(
        AdPlacement.slot_name == slot_name,
        AdPlacement.is_active == True
    ).first()
    return ad
