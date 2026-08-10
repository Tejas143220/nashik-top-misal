from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.contest import ContestEntry

router = APIRouter()

class UpvoteRequest(BaseModel):
    photo_id: str

@router.get("/leaderboard")
def get_contest_leaderboard(db: Session = Depends(get_db)):
    entries = db.query(ContestEntry).filter(ContestEntry.is_active == 1).order_by(ContestEntry.rank.asc()).all()
    
    if not entries:
        # Static fallback if table unseeded
        return {
            "month": "August 2026",
            "title": "Snap & Win Misal Photo Contest 📸",
            "subtitle": "Post your misal thali photos & win free monthly passes & coupons!",
            "entries": [
                {
                    "id": "p1",
                    "rank": 1,
                    "foodie_name": "Amit Deshmukh",
                    "avatar_url": "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80",
                    "shop_name": "Sadhana Chulhivarchi Misal",
                    "photo_url": "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=800&q=80",
                    "caption": "Earthen pot misal with warm jalebi! Zanzanit perfection 🔥",
                    "upvotes": 248,
                    "badge": "🥇 #1 Top Photo of August",
                    "prize": "🏆 1-Month Free Misal Pass"
                },
                {
                    "id": "p2",
                    "rank": 2,
                    "foodie_name": "Priya Sharma",
                    "avatar_url": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80",
                    "shop_name": "Grape Embassy Misal",
                    "photo_url": "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80",
                    "caption": "Misal under real grape farm canopies! Unique Nashik experience 🍇",
                    "upvotes": 194,
                    "badge": "🥈 #2 Runner Up",
                    "prize": "🎁 ₹500 Misal Coupon"
                },
                {
                    "id": "p3",
                    "rank": 3,
                    "foodie_name": "Rahul Patil",
                    "avatar_url": "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=200&q=80",
                    "shop_name": "Shamsundar Misal",
                    "photo_url": "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80",
                    "caption": "Classic dark Kala Rassa misal. Pure spice heaven! 🌶️",
                    "upvotes": 156,
                    "badge": "🥉 #3 Popular Entry",
                    "prize": "🎁 ₹300 Misal Coupon"
                }
            ]
        }

    return {
        "month": entries[0].month if entries else "August 2026",
        "title": "Snap & Win Misal Photo Contest 📸",
        "subtitle": "Post your misal thali photos & win free monthly passes & coupons!",
        "entries": [
            {
                "id": e.id,
                "rank": e.rank,
                "foodie_name": e.foodie_name,
                "avatar_url": e.avatar_url,
                "shop_name": e.shop_name,
                "photo_url": e.photo_url,
                "caption": e.caption,
                "upvotes": e.upvotes,
                "badge": e.badge,
                "prize": e.prize
            } for e in entries
        ]
    }

@router.post("/upvote")
def upvote_photo(req: UpvoteRequest, db: Session = Depends(get_db)):
    entry = db.query(ContestEntry).filter(ContestEntry.id == req.photo_id).first()
    if not entry:
        raise HTTPException(status_code=404, detail="Photo contest entry not found")

    entry.upvotes += 1
    db.commit()
    db.refresh(entry)

    return {
        "status": "success",
        "photo_id": entry.id,
        "new_upvotes": entry.upvotes
    }
