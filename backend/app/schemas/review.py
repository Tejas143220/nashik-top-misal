from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional

class ReviewBase(BaseModel):
    reviewer_name: str = Field(..., min_length=2, max_length=100)
    reviewer_email: Optional[str] = None
    rating: int = Field(..., ge=1, le=5)
    spice_rating: Optional[int] = Field(None, ge=1, le=5)
    comment: str = Field(..., min_length=5)
    image_url: Optional[str] = None

class ReviewCreate(ReviewBase):
    shop_id: int

class ReviewOut(ReviewBase):
    id: int
    shop_id: int
    status: str
    created_at: datetime

    class Config:
        from_attributes = True
