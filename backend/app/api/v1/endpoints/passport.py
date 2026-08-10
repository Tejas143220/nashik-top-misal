from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.schemas.passport import DigitalPassportOut
from app.services import passport_service
from app.models.user import User

router = APIRouter()

class ProfileCreateRequest(BaseModel):
    full_name: str
    email: Optional[str] = None
    avatar_url: Optional[str] = None

@router.post("/profile", response_model=DigitalPassportOut, status_code=status.HTTP_201_CREATED)
def create_or_get_user_profile(req: ProfileCreateRequest, db: Session = Depends(get_db)):
    if not req.full_name.strip():
        raise HTTPException(status_code=400, detail="Full name is required")

    # Check if user with same name exists
    existing_user = db.query(User).filter(User.full_name == req.full_name.strip()).first()
    if existing_user:
        return passport_service.get_user_passport(db, user_id=existing_user.id)

    # Create new user
    new_user = User(
        full_name=req.full_name.strip(),
        email=req.email or f"{req.full_name.lower().replace(' ', '.')}@example.com",
        avatar_url=req.avatar_url or "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80",
        total_stamps=0
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return passport_service.get_user_passport(db, user_id=new_user.id)

@router.get("/{user_id}", response_model=DigitalPassportOut)
def get_user_digital_passport(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User profile not found")
    return passport_service.get_user_passport(db, user_id=user_id)

@router.post("/{user_id}/stamp/{shop_id}", response_model=DigitalPassportOut)
def stamp_passport(user_id: int, shop_id: int, db: Session = Depends(get_db)):
    from app.models.shop import MisalShop
    shop = db.query(MisalShop).filter(MisalShop.id == shop_id).first()
    if not shop:
        raise HTTPException(status_code=404, detail="Misal shop not found")
    passport_service.add_passport_stamp(db, user_id=user_id, shop_id=shop_id)
    return passport_service.get_user_passport(db, user_id=user_id)
