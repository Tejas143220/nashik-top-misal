from sqlalchemy import Column, Integer, String, Text, Boolean
from app.db.base_class import Base

class AdPlacement(Base):
    __tablename__ = "ad_placements"

    id = Column(Integer, primary_key=True, index=True)
    slot_name = Column(String(50), nullable=False, index=True) # e.g. "homepage_hero_banner", "directory_sidebar", "in_feed_ad"
    title = Column(String(150), nullable=True)
    ad_code_or_html = Column(Text, nullable=True)
    image_url = Column(String(500), nullable=True)
    target_url = Column(String(500), nullable=True)
    is_active = Column(Boolean, default=True)
