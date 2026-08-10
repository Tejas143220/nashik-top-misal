import random
import string
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.coupon import Coupon, CouponClaim

router = APIRouter()

class ClaimCouponRequest(BaseModel):
    coupon_id: str
    user_name: Optional[str] = "Nashik Foodie"

@router.get("/")
def get_active_coupons(db: Session = Depends(get_db)):
    coupons = db.query(Coupon).filter(Coupon.is_active == 1).all()
    if not coupons:
        # Static fallback if table unseeded
        return [
            {
                "id": "c1",
                "shop_id": 1,
                "shop_name": "Sadhana Chulhivarchi Misal",
                "shop_area": "Gangapur Road",
                "title": "Free Hot Jalebi Plate 🍮",
                "description": "Get 1 complimentary fresh hot Jalebi plate with any 2 Misal Thalis ordered!",
                "code_prefix": "SADHANA-JALEBI",
                "discount_type": "freebie",
                "badge": "Gold Deal ⭐",
                "expiry_date": "2026-08-31",
                "image_url": "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=600&q=80"
            },
            {
                "id": "c2",
                "shop_id": 2,
                "shop_name": "Grape Embassy Misal",
                "shop_area": "Peth Road",
                "title": "15% Off Total Bill (Group of 4+) 🍇",
                "description": "Enjoy dining under grape vines with 15% discount on total family/group bill above ₹500.",
                "code_prefix": "GRAPE-15OFF",
                "discount_type": "percentage",
                "badge": "Platinum Special 👑",
                "expiry_date": "2026-09-15",
                "image_url": "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=80"
            },
            {
                "id": "c3",
                "shop_id": 3,
                "shop_name": "Shamsundar Misal",
                "shop_area": "Panchavati",
                "title": "Free Solkadhi Glass & Extra Pav 🥤",
                "description": "Cool down your Zanzanit Kala Rassa spice with a complimentary chilled Solkadhi glass!",
                "code_prefix": "SHAM-SOLKADHI",
                "discount_type": "freebie",
                "badge": "Popular Deal 🔥",
                "expiry_date": "2026-08-30",
                "image_url": "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&q=80"
            }
        ]

    return [
        {
            "id": c.id,
            "shop_id": c.shop_id,
            "shop_name": c.shop_name,
            "shop_area": c.shop_area,
            "title": c.title,
            "description": c.description,
            "code_prefix": c.code_prefix,
            "discount_type": c.discount_type,
            "badge": c.badge,
            "expiry_date": c.expiry_date,
            "image_url": c.image_url
        } for c in coupons
    ]

@router.post("/claim")
def claim_coupon(req: ClaimCouponRequest, db: Session = Depends(get_db)):
    coupon = db.query(Coupon).filter(Coupon.id == req.coupon_id).first()
    
    code_prefix = coupon.code_prefix if coupon else "MISAL-PERK"
    coupon_title = coupon.title if coupon else "Special Misal Perk"
    shop_name = coupon.shop_name if coupon else "Partner Spot"
    shop_area = coupon.shop_area if coupon else "Nashik"
    expiry_date = coupon.expiry_date if coupon else "2026-08-31"

    random_suffix = ''.join(random.choices(string.ascii_uppercase + string.digits, k=6))
    voucher_code = f"{code_prefix}-{random_suffix}"

    claim_record = CouponClaim(
        coupon_id=req.coupon_id,
        user_name=req.user_name,
        voucher_code=voucher_code
    )
    db.add(claim_record)
    db.commit()

    return {
        "status": "success",
        "voucher_code": voucher_code,
        "coupon_title": coupon_title,
        "shop_name": shop_name,
        "shop_area": shop_area,
        "expiry_date": expiry_date,
        "qr_value": f"https://nashikmisal.in/verify-deal?code={voucher_code}",
        "instructions": "Show this voucher screen or QR code to the restaurant manager at billing time."
    }
