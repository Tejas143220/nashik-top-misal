from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, DateTime
from app.db.base_class import Base

class ContestEntry(Base):
    __tablename__ = "contest_entries"

    id = Column(String(50), primary_key=True, index=True)
    rank = Column(Integer, default=0, nullable=False)
    foodie_name = Column(String(100), nullable=False)
    avatar_url = Column(String(500), nullable=True)
    shop_name = Column(String(150), nullable=False)
    photo_url = Column(String(500), nullable=False)
    caption = Column(Text, nullable=True)
    upvotes = Column(Integer, default=0, nullable=False)
    badge = Column(String(100), nullable=True)
    prize = Column(String(150), nullable=True)
    month = Column(String(50), default="August 2026", nullable=False)
    is_active = Column(Integer, default=1, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
