from pydantic import BaseModel
from typing import Optional

class ActivityBase(BaseModel):
    name: str
    slug: str
    icon_name: Optional[str] = None

class ActivityCreate(ActivityBase):
    pass

class ActivityOut(ActivityBase):
    id: int

    class Config:
        from_attributes = True
