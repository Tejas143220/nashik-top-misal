from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime, UniqueConstraint
from sqlalchemy.orm import relationship
from app.db.base_class import Base

class PassportBadge(Base):
    __tablename__ = "passport_badges"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(100), nullable=False) # e.g. "Spicy Warrior", "Chulha Pioneer", "Nashik Legend"
    code = Column(String(50), unique=True, nullable=False)
    description = Column(Text, nullable=False)
    icon = Column(String(50), nullable=False) # Icon identifier or emoji
    required_stamps = Column(Integer, default=1)

class UserPassportStamp(Base):
    __tablename__ = "user_passport_stamps"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    shop_id = Column(Integer, ForeignKey("misal_shops.id", ondelete="CASCADE"), nullable=False, index=True)
    review_id = Column(Integer, ForeignKey("reviews.id", ondelete="SET NULL"), nullable=True)
    stamped_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    __table_args__ = (UniqueConstraint("user_id", "shop_id", name="uq_user_shop_stamp"),)

    user = relationship("User", back_populates="stamps")
    shop = relationship("MisalShop")
