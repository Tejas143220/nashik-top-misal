import uuid
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.shop import MisalShop
from app.schemas.shop import MisalShopCardOut

router = APIRouter()

# In-memory share storage for social cards
SHARED_RANKINGS = {}

class ShareTopFiveRequest(BaseModel):
    user_name: str
    shop_ids: List[int]

@router.post("/top5")
def create_top_five_share(req: ShareTopFiveRequest, db: Session = Depends(get_db)):
    if not req.shop_ids or len(req.shop_ids) == 0:
        raise HTTPException(status_code=400, detail="Select at least 1 misal spot to rank")

    # Fetch shops preserving user order
    shops = db.query(MisalShop).filter(MisalShop.id.in_(req.shop_ids[:5])).all()
    shop_dict = {s.id: s for s in shops}
    
    ordered_shops = [MisalShopCardOut.model_validate(shop_dict[sid]) for sid in req.shop_ids[:5] if sid in shop_dict]

    share_id = str(uuid.uuid4())[:8]
    data = {
        "share_id": share_id,
        "user_name": req.user_name or "Nashik Foodie",
        "ranked_shops": ordered_shops,
        "total_ranked": len(ordered_shops),
        "share_url": f"https://nashikmisal.in/share/top5/{share_id}"
    }
    
    SHARED_RANKINGS[share_id] = data
    return data

@router.get("/top5/{share_id}")
def get_top_five_share(share_id: str):
    if share_id not in SHARED_RANKINGS:
        raise HTTPException(status_code=404, detail="Shared ranking not found")
    return SHARED_RANKINGS[share_id]
