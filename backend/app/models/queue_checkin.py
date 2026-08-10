from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from app.db.base_class import Base

class QueueCheckin(Base):
    __tablename__ = "queue_checkins"

    id = Column(Integer, primary_key=True, index=True)
    shop_id = Column(Integer, ForeignKey("misal_shops.id", ondelete="CASCADE"), nullable=False, index=True)
    reporter_name = Column(String(100), default="Local Foodie", nullable=False)
    wait_time_mins = Column(Integer, default=15, nullable=False)
    crowd_level = Column(String(50), default="moderate", nullable=False) # low, moderate, crowded, full
    comment = Column(Text, nullable=True)
    reported_at = Column(DateTime, default=datetime.utcnow, nullable=False)
