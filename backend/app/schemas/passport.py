from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class BadgeOut(BaseModel):
    id: int
    title: str
    code: str
    description: str
    icon: str
    required_stamps: int
    unlocked: bool = False

    class Config:
        from_attributes = True

class StampOut(BaseModel):
    id: int
    shop_id: int
    shop_name: str
    shop_slug: str
    shop_area: str
    stamped_at: datetime

    class Config:
        from_attributes = True

class DigitalPassportOut(BaseModel):
    user_id: int
    user_name: str
    total_stamps: int
    stamps: List[StampOut] = []
    badges: List[BadgeOut] = []
