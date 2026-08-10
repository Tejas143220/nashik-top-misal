from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.schemas.shop import MisalShopCardOut, MisalShopDetailOut, MisalShopCreate
from app.services import shop_service
from app.models.shop import MisalShop
from app.services.seo_service import generate_restaurant_schema

router = APIRouter()

@router.get("/", response_model=dict)
def read_shops(
    db: Session = Depends(get_db),
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    search: Optional[str] = None,
    area: Optional[str] = None,
    spicy_level: Optional[int] = Query(None, ge=1, le=5),
    is_chulhivarchi: Optional[bool] = None,
    activity_slug: Optional[str] = None,
    sort_by: str = "recommended"
):
    shops, total = shop_service.get_shops(
        db=db,
        skip=skip,
        limit=limit,
        search=search,
        area=area,
        spicy_level=spicy_level,
        is_chulhivarchi=is_chulhivarchi,
        activity_slug=activity_slug,
        sort_by=sort_by
    )
    
    return {
        "items": [MisalShopCardOut.model_validate(s) for s in shops],
        "total": total,
        "page": (skip // limit) + 1,
        "pages": (total + limit - 1) // limit if limit > 0 else 1
    }

@router.post("/", status_code=status.HTTP_201_CREATED)
def create_misal_shop(
    shop_in: MisalShopCreate,
    db: Session = Depends(get_db)
):
    """
    Submit and add a new Misal Shop to the directory database.
    """
    from app.services.notification_service import build_whatsapp_alert_url, dispatch_automated_whatsapp_alert
    new_shop = shop_service.create_shop(db=db, shop_in=shop_in)
    
    dispatch_automated_whatsapp_alert(
        shop_name=new_shop.name,
        area=new_shop.area,
        address=new_shop.address or "Nashik",
        owner_name=getattr(new_shop, 'owner_name', 'Shop Owner'),
        owner_phone=new_shop.phone or "Not Provided",
        plan_type="Free Listing"
    )

    alert_url = build_whatsapp_alert_url(
        shop_name=new_shop.name,
        area=new_shop.area,
        address=new_shop.address or "Nashik",
        owner_name=getattr(new_shop, 'owner_name', 'Shop Owner'),
        owner_phone=new_shop.phone or "Not Provided",
        plan_type="Free Listing"
    )

    detail_data = MisalShopDetailOut.model_validate(new_shop).model_dump()
    detail_data["whatsapp_alert_url"] = alert_url
    return detail_data

@router.get("/areas", response_model=List[str])
def get_popular_areas(db: Session = Depends(get_db)):
    areas = db.query(MisalShop.area).distinct().filter(MisalShop.is_active == True).all()
    return sorted([a[0] for a in areas if a[0]])

@router.get("/nearby", response_model=dict)
def get_nearby_shops(
    lat: float = Query(20.0059),
    lng: float = Query(73.7898),
    radius_km: float = Query(20.0),
    db: Session = Depends(get_db)
):
    import math

    def haversine(lat1, lon1, lat2, lon2):
        R = 6371.0
        dlat = math.radians(lat2 - lat1)
        dlon = math.radians(lon2 - lon1)
        a = math.sin(dlat / 2)**2 + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlon / 2)**2
        c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
        return R * c

    shops = db.query(MisalShop).filter(MisalShop.is_active == True).all()
    nearby_items = []

    for s in shops:
        s_lat = s.latitude or 20.0059
        s_lng = s.longitude or 73.7898
        dist = haversine(lat, lng, s_lat, s_lng)
        if dist <= radius_km:
            card_data = MisalShopCardOut.model_validate(s).model_dump()
            card_data["distance_km"] = round(dist, 1)
            card_data["driving_mins"] = round((dist / 25.0 * 60) + 3)
            nearby_items.append(card_data)

    nearby_items.sort(key=lambda x: x["distance_km"])

    return {
        "items": nearby_items,
        "total": len(nearby_items),
        "user_lat": lat,
        "user_lng": lng
    }

@router.get("/{slug}", response_model=MisalShopDetailOut)
def read_shop_detail(slug: str, db: Session = Depends(get_db)):
    shop = shop_service.get_shop_by_slug(db, slug=slug)
    if not shop:
        raise HTTPException(status_code=404, detail="Misal shop not found")
    return shop

@router.get("/{slug}/schema", response_model=dict)
def read_shop_schema(slug: str, db: Session = Depends(get_db)):
    shop = shop_service.get_shop_by_slug(db, slug=slug)
    if not shop:
        raise HTTPException(status_code=404, detail="Misal shop not found")
    return generate_restaurant_schema(shop)
