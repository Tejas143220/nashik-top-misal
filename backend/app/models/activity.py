from sqlalchemy import Table, Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from app.db.base_class import Base

shop_activities = Table(
    "shop_activities",
    Base.metadata,
    Column("shop_id", Integer, ForeignKey("misal_shops.id", ondelete="CASCADE"), primary_key=True),
    Column("activity_id", Integer, ForeignKey("activities.id", ondelete="CASCADE"), primary_key=True)
)

class Activity(Base):
    __tablename__ = "activities"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), unique=True, nullable=False)
    slug = Column(String(100), unique=True, nullable=False)
    icon_name = Column(String(50), nullable=True) # e.g. "Car", "Users", "Flame", "Coffee", "Trees"

    shops = relationship("MisalShop", secondary=shop_activities, back_populates="activities")
