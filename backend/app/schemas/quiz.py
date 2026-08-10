from pydantic import BaseModel
from typing import Optional, List
from app.schemas.shop import MisalShopCardOut

class QuizRequest(BaseModel):
    spice_preference: int # 1 to 5
    cooking_style: Optional[str] = None # "chulhivarchi" or "any"
    vibe: Optional[str] = None # "garden", "family", "classic"
    sweets_pairing: Optional[bool] = None # Jalebi/Gulab Jamun interest
    area: Optional[str] = None

class QuizRecommendationOut(BaseModel):
    match_percentage: int
    reason: str
    shop: MisalShopCardOut
