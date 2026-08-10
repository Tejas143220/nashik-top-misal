from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from app.db.base_class import Base

class Coupon(Base):
    __tablename__ = "coupons"

    id = Column(String(50), primary_key=True, index=True)
    shop_id = Column(Integer, nullable=True)
    shop_name = Column(String(150), nullable=False)
    shop_area = Column(String(100), nullable=False)
    title = Column(String(200), nullable=False)
    description = Column(Text, nullable=True)
    code_prefix = Column(String(50), nullable=False)
    discount_type = Column(String(50), default="freebie", nullable=False)
    badge = Column(String(100), nullable=True)
    expiry_date = Column(String(50), nullable=False)
    image_url = Column(String(500), nullable=True)
    is_active = Column(Integer, default=1, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

class CouponClaim(Base):
    __tablename__ = "coupon_claims"

    id = Column(Integer, primary_key=True, index=True)
    coupon_id = Column(String(50), ForeignKey("coupons.id", ondelete="CASCADE"), nullable=False)
    user_name = Column(String(100), default="Nashik Foodie")
    voucher_code = Column(String(100), nullable=False, unique=True)
    is_redeemed = Column(Integer, default=0, nullable=False)
    redeemed_at = Column(DateTime, nullable=True)
    claimed_at = Column(DateTime, default=datetime.utcnow, nullable=False)
