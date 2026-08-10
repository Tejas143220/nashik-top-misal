import random
from datetime import datetime, timedelta
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.shop import MisalShop, SponsorshipTier

router = APIRouter()

class SponsorshipPlan(BaseModel):
    id: str
    name: str
    tagline: str
    badge_label: str
    monthly_price: int
    yearly_price: int
    popular: bool = False
    features: List[str]

class SubscribeRequest(BaseModel):
    shop_id: int
    tier: str # "silver", "gold", "platinum"
    billing_cycle: str = "yearly" # "monthly" or "yearly"
    transaction_ref: Optional[str] = None # PhonePe UTR / Txn Reference
    contact_name: str
    contact_phone: str

class SubscribeResponse(BaseModel):
    status: str
    message: str
    shop_id: int
    shop_name: str
    sponsorship_tier: str
    expires_at: str
    invoice_no: str
    subtotal: int
    gst_amount: int
    total_paid: int
    transaction_ref: str
    created_at: str
    creator_contact: str
    phonepe_number: str
    whatsapp_alert_url: Optional[str] = None

@router.get("/plans")
def get_sponsorship_plans():
    return {
        "creator": {
            "name": "Tejas Thakare",
            "role": "Website Maker & Lead Developer",
            "phonepe_number": "7058638277",
            "upi_id": "7058638277@ybl"
        },
        "plans": [
            {
                "id": "silver",
                "name": "Silver Partner",
                "tagline": "Essential Directory Boost",
                "badge_label": "Silver Partner",
                "monthly_price": 999,
                "yearly_price": 9999,
                "popular": False,
                "features": [
                    "Highlighted Directory Card",
                    "Priority Search Ranking over Free Shops",
                    "Custom Tagline & Photo Gallery",
                    "Monthly View Analytics"
                ]
            },
            {
                "id": "gold",
                "name": "Gold Partner ⭐",
                "tagline": "Featured Popular Joint",
                "badge_label": "Gold Verified",
                "monthly_price": 2499,
                "yearly_price": 24999,
                "popular": True,
                "features": [
                    "Everything in Silver Plan",
                    "Gold Gradient Verified Badge & Card Border",
                    "Top 3 Guaranteed Area Rank",
                    "Short Video Clips Highlight in Shop Details",
                    "Priority Placement in AI Quiz Recommendations",
                    "Detailed Click & Call Analytics"
                ]
            },
            {
                "id": "platinum",
                "name": "Platinum Partner 👑",
                "tagline": "Ultimate Nashik Landmark",
                "badge_label": "Platinum Crown",
                "monthly_price": 4999,
                "yearly_price": 49999,
                "popular": False,
                "features": [
                    "Everything in Gold Plan",
                    "Animated Platinum Crown Badge",
                    "#1 Homepage Hero Banner & Directory Placement",
                    "Direct WhatsApp Reservation & Order Button",
                    "Featured in 'Must-Visit Nashik Misal' Trail",
                    "Dedicated Account Manager (Tejas Thakare)"
                ]
            }
        ]
    }

@router.post("/subscribe", response_model=SubscribeResponse)
def subscribe_shop_plan(req: SubscribeRequest, db: Session = Depends(get_db)):
    shop = db.query(MisalShop).filter(MisalShop.id == req.shop_id).first()
    if not shop:
        raise HTTPException(status_code=404, detail="Misal shop not found")

    tier_prices = {
        "silver": (999, 9999),
        "gold": (2499, 24999),
        "platinum": (4999, 49999)
    }

    tier_lower = req.tier.lower()
    if tier_lower not in tier_prices:
        raise HTTPException(status_code=400, detail="Invalid sponsorship tier")

    m_price, y_price = tier_prices[tier_lower]
    total = y_price if req.billing_cycle.lower() == "yearly" else m_price

    subtotal = round(total / 1.18)
    gst = total - subtotal

    if tier_lower == "silver":
        shop.sponsorship_tier = SponsorshipTier.SILVER
        shop.featured_order = 10
    elif tier_lower == "gold":
        shop.sponsorship_tier = SponsorshipTier.GOLD
        shop.featured_order = 50
    elif tier_lower == "platinum":
        shop.sponsorship_tier = SponsorshipTier.PLATINUM
        shop.featured_order = 100

    shop.is_sponsored = True
    days = 365 if req.billing_cycle.lower() == "yearly" else 30
    shop.sponsor_expires_at = datetime.utcnow() + timedelta(days=days)

    db.commit()
    db.refresh(shop)

    inv_num = f"INV-2026-NMK-{random.randint(1000, 9999)}"
    txn_id = req.transaction_ref or f"PHONEPE-UPI-{random.randint(1000000000, 9999999999)}"

    from app.services.notification_service import build_whatsapp_alert_url, dispatch_automated_whatsapp_alert
    
    dispatch_automated_whatsapp_alert(
        shop_name=shop.name,
        area=shop.area,
        address=shop.address or "Nashik",
        owner_name=req.contact_name,
        owner_phone=req.contact_phone,
        plan_type=f"Paid Sponsorship ({req.tier.upper()})"
    )

    alert_url = build_whatsapp_alert_url(
        shop_name=shop.name,
        area=shop.area,
        address=shop.address or "Nashik",
        owner_name=req.contact_name,
        owner_phone=req.contact_phone,
        plan_type=f"Paid Sponsorship ({req.tier.upper()})"
    )

    return SubscribeResponse(
        status="success",
        message=f"Successfully subscribed {shop.name} to {req.tier.upper()} plan!",
        shop_id=shop.id,
        shop_name=shop.name,
        sponsorship_tier=shop.sponsorship_tier.value,
        expires_at=shop.sponsor_expires_at.strftime("%Y-%m-%d"),
        invoice_no=inv_num,
        subtotal=subtotal,
        gst_amount=gst,
        total_paid=total,
        transaction_ref=txn_id,
        created_at=datetime.utcnow().strftime("%b %d, %Y at %I:%M %p"),
        creator_contact="Tejas Thakare (Website Maker)",
        phonepe_number="7058638277",
        whatsapp_alert_url=alert_url
    )
