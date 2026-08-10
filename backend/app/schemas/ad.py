from pydantic import BaseModel
from typing import Optional

class AdPlacementOut(BaseModel):
    id: int
    slot_name: str
    title: Optional[str] = None
    ad_code_or_html: Optional[str] = None
    image_url: Optional[str] = None
    target_url: Optional[str] = None
    is_active: bool

    class Config:
        from_attributes = True
