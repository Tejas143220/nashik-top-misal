from datetime import datetime
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text
from app.db.base_class import Base

class MisalBattle(Base):
    __tablename__ = "misal_battles"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200), nullable=False)
    subtitle = Column(String(300), nullable=True)
    
    shop_a_name = Column(String(150), nullable=False)
    shop_a_slug = Column(String(180), nullable=True)
    shop_a_area = Column(String(100), nullable=True)
    shop_a_image_url = Column(String(500), nullable=True)
    shop_a_votes = Column(Integer, default=0, nullable=False)

    shop_b_name = Column(String(150), nullable=False)
    shop_b_slug = Column(String(180), nullable=True)
    shop_b_area = Column(String(100), nullable=True)
    shop_b_image_url = Column(String(500), nullable=True)
    shop_b_votes = Column(Integer, default=0, nullable=False)

    expires_in_days = Column(Integer, default=3, nullable=False)
    is_active = Column(Integer, default=1, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

class BattleVote(Base):
    __tablename__ = "battle_votes"

    id = Column(Integer, primary_key=True, index=True)
    battle_id = Column(Integer, ForeignKey("misal_battles.id", ondelete="CASCADE"), nullable=False)
    shop_choice = Column(String(10), nullable=False) # "a" or "b"
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
