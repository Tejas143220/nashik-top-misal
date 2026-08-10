from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime

class UserBase(BaseModel):
    full_name: str
    email: str
    avatar_url: Optional[str] = None

class UserCreate(UserBase):
    pass

class UserOut(UserBase):
    id: int
    total_stamps: int
    created_at: datetime

    class Config:
        from_attributes = True
