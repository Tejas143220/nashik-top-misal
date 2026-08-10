from datetime import datetime, timedelta
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.queue_checkin import QueueCheckin
from app.models.shop import MisalShop, CrowdStatus

router = APIRouter()

class QueueCheckinRequest(BaseModel):
    shop_id: int
    reporter_name: Optional[str] = "Nashik Foodie"
    wait_time_mins: int
    crowd_level: Optional[str] = "moderate"
    comment: Optional[str] = None

@router.post("/checkin", status_code=status.HTTP_201_CREATED)
def submit_queue_checkin(req: QueueCheckinRequest, db: Session = Depends(get_db)):
    shop = db.query(MisalShop).filter(MisalShop.id == req.shop_id).first()
    if not shop:
        raise HTTPException(status_code=404, detail="Misal shop not found")

    wait_mins = max(0, req.wait_time_mins)
    crowd_lvl = req.crowd_level or ("low" if wait_mins <= 5 else "moderate" if wait_mins <= 20 else "crowded" if wait_mins <= 35 else "full")

    checkin = QueueCheckin(
        shop_id=req.shop_id,
        reporter_name=req.reporter_name or "Nashik Foodie",
        wait_time_mins=wait_mins,
        crowd_level=crowd_lvl,
        comment=req.comment,
        reported_at=datetime.utcnow()
    )
    db.add(checkin)

    # Automatically update live CrowdStatus on MisalShop
    if wait_mins <= 5:
        shop.crowd_status = CrowdStatus.LOW
    elif wait_mins <= 20:
        shop.crowd_status = CrowdStatus.MODERATE
    elif wait_mins <= 35:
        shop.crowd_status = CrowdStatus.CROWDED
    else:
        shop.crowd_status = CrowdStatus.FULL

    db.commit()
    db.refresh(checkin)

    return {
        "status": "success",
        "message": f"Thank you for checking in! Live queue wait of {wait_mins} mins reported.",
        "checkin_id": checkin.id,
        "shop_id": shop.id,
        "shop_name": shop.name,
        "updated_crowd_status": shop.crowd_status.value,
        "reported_at": checkin.reported_at
    }

@router.get("/{shop_id}/status")
def get_shop_queue_status(shop_id: int, db: Session = Depends(get_db)):
    shop = db.query(MisalShop).filter(MisalShop.id == shop_id).first()
    if not shop:
        raise HTTPException(status_code=404, detail="Misal shop not found")

    cutoff_time = datetime.utcnow() - timedelta(hours=2)
    recent_checkins = db.query(QueueCheckin)\
        .filter(QueueCheckin.shop_id == shop_id, QueueCheckin.reported_at >= cutoff_time)\
        .order_by(QueueCheckin.reported_at.desc())\
        .all()

    if not recent_checkins:
        # Fallback to all time latest
        latest = db.query(QueueCheckin)\
            .filter(QueueCheckin.shop_id == shop_id)\
            .order_by(QueueCheckin.reported_at.desc())\
            .first()
        recent_checkins = [latest] if latest else []

    avg_wait = round(sum([c.wait_time_mins for c in recent_checkins]) / len(recent_checkins)) if recent_checkins else 15
    last_reported = recent_checkins[0].reported_at if recent_checkins else datetime.utcnow()

    return {
        "shop_id": shop.id,
        "shop_name": shop.name,
        "crowd_status": shop.crowd_status.value if shop.crowd_status else "moderate",
        "avg_wait_time_mins": avg_wait,
        "total_recent_checkins": len(recent_checkins),
        "last_reported_at": last_reported,
        "recent_reports": [
            {
                "reporter_name": c.reporter_name,
                "wait_time_mins": c.wait_time_mins,
                "crowd_level": c.crowd_level,
                "comment": c.comment,
                "reported_at": c.reported_at
            }
            for c in recent_checkins[:5]
        ]
    }
