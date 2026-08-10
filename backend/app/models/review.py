import enum
from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, Enum, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.db.base_class import Base

class ReviewStatus(str, enum.Enum):
    PENDING = "pending"
    APPROVED = "approved"
    REJECTED = "rejected"

class Review(Base):
    __tablename__ = "reviews"

    id = Column(Integer, primary_key=True, index=True)
    shop_id = Column(Integer, ForeignKey("misal_shops.id", ondelete="CASCADE"), nullable=False, index=True)
    reviewer_name = Column(String(100), nullable=False)
    reviewer_email = Column(String(150), nullable=True)
    rating = Column(Integer, nullable=False) # 1 to 5 Stars
    spice_rating = Column(Integer, nullable=True) # 1 to 5 Spice Scale
    comment = Column(Text, nullable=False)
    image_url = Column(String(500), nullable=True) # 📸 Review Thali Photo URL
    status = Column(Enum(ReviewStatus), default=ReviewStatus.APPROVED, nullable=False, index=True)
    
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    shop = relationship("MisalShop", back_populates="reviews")
