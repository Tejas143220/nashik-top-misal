from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime
from app.schemas.activity import ActivityOut
from app.schemas.review import ReviewOut

class ShopImageOut(BaseModel):
    id: int
    image_url: str
    caption: Optional[str] = None
    display_order: int

    class Config:
        from_attributes = True

class MisalShopBase(BaseModel):
    name: str
    slug: Optional[str] = None
    tagline: Optional[str] = None
    description: Optional[str] = None
    address: str
    area: str
    city: str = "Nashik"
    pincode: Optional[str] = None
    phone: Optional[str] = None
    google_maps_url: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    spicy_level: int = Field(3, ge=1, le=5)
    is_chulhivarchi: bool = False
    price_per_plate: Optional[float] = None
    opening_time: Optional[str] = None
    closing_time: Optional[str] = None
    weekly_off: Optional[str] = None
    video_url: Optional[str] = None
    video_thumbnail_url: Optional[str] = None
    main_image_url: Optional[str] = None
    crowd_status: str = "moderate"
    is_sponsored: bool = False
    sponsorship_tier: str = "none"
    meta_title: Optional[str] = None
    meta_description: Optional[str] = None

class MisalShopCreate(MisalShopBase):
    activity_ids: Optional[List[int]] = []

class MisalShopCardOut(MisalShopBase):
    id: int
    avg_rating: float = 0.0
    total_reviews: int = 0
    activities: List[ActivityOut] = []

    class Config:
        from_attributes = True

class MisalShopDetailOut(MisalShopCardOut):
    images: List[ShopImageOut] = []
    reviews: List[ReviewOut] = []
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
