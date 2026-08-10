import math
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.shop import MisalShop
from app.schemas.shop import MisalShopCardOut

router = APIRouter()

class TrailCalculateRequest(BaseModel):
    shop_ids: List[int]
    group_size: Optional[int] = 2

def haversine_distance(lat1, lon1, lat2, lon2):
    """Calculate distance between two coordinates in km."""
    R = 6371.0 # Earth radius in kilometers
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = math.sin(dlat / 2)**2 + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlon / 2)**2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return R * c

@router.get("/curated")
def get_curated_trails(db: Session = Depends(get_db)):
    shops = db.query(MisalShop).filter(MisalShop.is_active == True).all()
    shop_map = {s.id: s for s in shops}

    def format_trail(id_str, title, subtitle, badge, icon, shop_ids, desc):
        ordered_shops = [MisalShopCardOut.model_validate(shop_map[sid]) for sid in shop_ids if sid in shop_map]
        total_dist = 0.0
        for i in range(len(ordered_shops) - 1):
            s1, s2 = ordered_shops[i], ordered_shops[i+1]
            if s1.latitude and s1.longitude and s2.latitude and s2.longitude:
                total_dist += haversine_distance(s1.latitude, s1.longitude, s2.latitude, s2.longitude)
            else:
                total_dist += 4.5

        # Maps dir link
        coords_str = "/".join([f"{s.latitude or 20.0059},{s.longitude or 73.7898}" for s in ordered_shops])
        gmaps_link = f"https://www.google.com/maps/dir/{coords_str}"

        return {
            "id": id_str,
            "title": title,
            "subtitle": subtitle,
            "badge": badge,
            "icon": icon,
            "description": desc,
            "shops": ordered_shops,
            "total_distance_km": round(total_dist, 1),
            "estimated_driving_mins": round((total_dist / 25.0 * 60) + (len(ordered_shops) * 8)),
            "gmaps_url": gmaps_link
        }

    trails = []
    # 1. Traditional Wood Stove Chulha Trail
    if all(k in shop_map for k in [1, 2, 4]):
        trails.append(format_trail(
            "chulha_trail",
            "Authentic Chulhivarchi Wood Stove Trail 🔥",
            "Slow-cooked smoky earthen pot misal trail across Gangapur & Peth Road",
            "Most Popular 🏆",
            "Flame",
            [1, 2, 4],
            "Experience traditional wood-stove misal starting at Someshwar, visiting Grape Embassy under grape vines, and ending at Perachi Wadi orchard."
        ))

    # 2. Zanzanit Kala Rassa Trail
    if all(k in shop_map for k in [3, 2, 5]):
        trails.append(format_trail(
            "kala_rassa_trail",
            "Zanzanit Kala Rassa Spice Challenge 🌶️",
            "High-kick dark roasted gravy trail for ultimate spice lovers",
            "Spice Level 5/5 🌶️",
            "Zap",
            [3, 2, 5],
            "Test your spice tolerance with classic Panchavati Kala Rassa at Shamsundar, followed by Grape Embassy's spicy sample and Hotel Vihar."
        ))

    # 3. Agro Farm & Orchard Trail
    if all(k in shop_map for k in [2, 4, 1]):
        trails.append(format_trail(
            "agro_trail",
            "Agro-Tourism & Guava Garden Trail 🍇",
            "Scenic rural dining surrounded by grape canopies & guava orchards",
            "Family Weekend 🌳",
            "Trees",
            [2, 4, 1],
            "Perfect for family weekend outings with open garden seating, sweets, and fresh fruit farm ambiance."
        ))

    return trails

@router.post("/calculate")
def calculate_custom_trail(req: TrailCalculateRequest, db: Session = Depends(get_db)):
    if not req.shop_ids or len(req.shop_ids) < 2:
        raise HTTPException(status_code=400, detail="Select at least 2 misal spots to build a trail")

    shops = db.query(MisalShop).filter(MisalShop.id.in_(req.shop_ids)).all()
    shop_dict = {s.id: s for s in shops}
    
    # Maintain user requested order
    ordered_shops = [shop_dict[sid] for sid in req.shop_ids if sid in shop_dict]
    if len(ordered_shops) < 2:
        raise HTTPException(status_code=404, detail="Selected misal shops not found")

    total_dist = 0.0
    for i in range(len(ordered_shops) - 1):
        s1, s2 = ordered_shops[i], ordered_shops[i+1]
        if s1.latitude and s1.longitude and s2.latitude and s2.longitude:
            total_dist += haversine_distance(s1.latitude, s1.longitude, s2.latitude, s2.longitude)
        else:
            total_dist += 4.0

    group_size = max(1, req.group_size)
    total_bill_est = sum([(s.price_per_plate or 120.0) * group_size for s in ordered_shops])
    
    coords = [f"{s.latitude or 20.0059},{s.longitude or 73.7898}" for s in ordered_shops]
    gmaps_url = f"https://www.google.com/maps/dir/{'/'.join(coords)}"

    crowd_warnings = []
    for s in ordered_shops:
        if s.crowd_status and s.crowd_status.value in ["crowded", "full"]:
            crowd_warnings.append(f"{s.name} currently has a peak rush ({s.crowd_status.value.upper()})")

    return {
        "status": "success",
        "trail_stops": [MisalShopCardOut.model_validate(s) for s in ordered_shops],
        "total_stops": len(ordered_shops),
        "total_distance_km": round(total_dist, 1),
        "estimated_driving_mins": round((total_dist / 25.0 * 60) + (len(ordered_shops) * 10)),
        "estimated_total_bill": round(total_bill_est),
        "group_size": group_size,
        "gmaps_url": gmaps_url,
        "crowd_warnings": crowd_warnings
    }
