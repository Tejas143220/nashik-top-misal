from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.schemas.review import ReviewCreate, ReviewOut
from app.models.review import Review, ReviewStatus
from app.models.shop import MisalShop
from app.services.shop_service import recalculate_shop_rating

router = APIRouter()

@router.post("/", response_model=ReviewOut, status_code=status.HTTP_201_CREATED)
def create_review(review_in: ReviewCreate, db: Session = Depends(get_db)):
    shop = db.query(MisalShop).filter(MisalShop.id == review_in.shop_id, MisalShop.is_active == True).first()
    if not shop:
        raise HTTPException(status_code=404, detail="Misal shop not found")
        
    db_review = Review(
        shop_id=review_in.shop_id,
        reviewer_name=review_in.reviewer_name,
        reviewer_email=review_in.reviewer_email,
        rating=review_in.rating,
        spice_rating=review_in.spice_rating,
        comment=review_in.comment,
        image_url=review_in.image_url,
        status=ReviewStatus.APPROVED
    )
    db.add(db_review)
    db.commit()
    db.refresh(db_review)

    recalculate_shop_rating(db, shop_id=review_in.shop_id)

    return db_review
