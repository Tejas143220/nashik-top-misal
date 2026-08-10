import enum
from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, Boolean, Float, DateTime, Enum, ForeignKey
from sqlalchemy.orm import relationship
from app.db.base_class import Base
from app.models.activity import shop_activities

class SponsorshipTier(str, enum.Enum):
    NONE = "none"
    SILVER = "silver"
    GOLD = "gold"
    PLATINUM = "platinum"

class CrowdStatus(str, enum.Enum):
    EMPTY = "empty"         # 🟢 Low crowd / Quick seating
    MODERATE = "moderate"   # 🟡 Moderate crowd / 5-10 min wait
    CROWDED = "crowded"     # 🟧 Crowded / 15-30 min wait
    FULL = "full"           # 🔴 Peak rush / Long queue

class MisalShop(Base):
    __tablename__ = "misal_shops"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(150), nullable=False, index=True)
    slug = Column(String(180), unique=True, nullable=False, index=True)
    tagline = Column(String(255), nullable=True)
    description = Column(Text, nullable=True)
    
    # Location & Contact
    address = Column(String(255), nullable=False)
    area = Column(String(100), nullable=False, index=True)
    city = Column(String(50), default="Nashik", nullable=False, index=True)
    pincode = Column(String(10), nullable=True)
    phone = Column(String(20), nullable=True)
    google_maps_url = Column(Text, nullable=True)
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)
    
    # Specialities & Smart Filters
    spicy_level = Column(Integer, default=3, nullable=False) # 1 (Mild) to 5 (Zanzanit)
    is_chulhivarchi = Column(Boolean, default=False, index=True)
    price_per_plate = Column(Float, nullable=True)
    opening_time = Column(String(20), nullable=True)
    closing_time = Column(String(20), nullable=True)
    weekly_off = Column(String(20), nullable=True)

    # 🎬 Short Video Clips (Reels)
    video_url = Column(String(500), nullable=True)
    video_thumbnail_url = Column(String(500), nullable=True)
    main_image_url = Column(String(500), nullable=True)

    # ⏱️ Real-Time Crowd Status Meter
    crowd_status = Column(Enum(CrowdStatus), default=CrowdStatus.MODERATE, nullable=False)
    
    # SEO & Meta
    meta_title = Column(String(200), nullable=True)
    meta_description = Column(String(300), nullable=True)
    
    # Monetization Flags
    is_sponsored = Column(Boolean, default=False, index=True)
    sponsorship_tier = Column(Enum(SponsorshipTier), default=SponsorshipTier.NONE, nullable=False)
    sponsor_expires_at = Column(DateTime, nullable=True)
    featured_order = Column(Integer, default=0, index=True)
    
    # Aggregated Stats
    avg_rating = Column(Float, default=0.0, index=True)
    total_reviews = Column(Integer, default=0)
    view_count = Column(Integer, default=0)
    is_verified = Column(Boolean, default=True)
    is_active = Column(Boolean, default=True, index=True)
    
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    # Relationships
    images = relationship("ShopImage", back_populates="shop", cascade="all, delete-orphan")
    reviews = relationship("Review", back_populates="shop", cascade="all, delete-orphan")
    activities = relationship("Activity", secondary=shop_activities, back_populates="shops")

class ShopImage(Base):
    __tablename__ = "shop_images"

    id = Column(Integer, primary_key=True, index=True)
    shop_id = Column(Integer, ForeignKey("misal_shops.id", ondelete="CASCADE"), nullable=False)
    image_url = Column(String(500), nullable=False)
    caption = Column(String(200), nullable=True)
    display_order = Column(Integer, default=0)
    
    shop = relationship("MisalShop", back_populates="images")
