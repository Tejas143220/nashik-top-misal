from sqlalchemy.orm import Session
from app.models.passport import PassportBadge, UserPassportStamp
from app.models.user import User
from app.models.shop import MisalShop
from app.schemas.passport import DigitalPassportOut, StampOut, BadgeOut

def get_or_create_default_badges(db: Session):
    badges_data = [
        {"code": "first_stamp", "title": "Misal Explorer", "description": "Visited and stamped your first Nashik Misal joint!", "icon": "Compass", "required_stamps": 1},
        {"code": "spicy_warrior", "title": "Spicy Warrior 🌶️", "description": "Stamped 3 different Zanzanit spicy spots in Nashik!", "icon": "Flame", "required_stamps": 3},
        {"code": "chulha_pioneer", "title": "Chulha Pioneer 🔥", "description": "Visited authentic traditional wood-stove misal spots!", "icon": "Award", "required_stamps": 5},
        {"code": "nashik_legend", "title": "Nashik Misal Legend 🏆", "description": "Ultimate Master! Collected 8+ stamps across all Nashik areas.", "icon": "Crown", "required_stamps": 8},
    ]
    for b in badges_data:
        existing = db.query(PassportBadge).filter(PassportBadge.code == b["code"]).first()
        if not existing:
            db_badge = PassportBadge(**b)
            db.add(db_badge)
    db.commit()

def add_passport_stamp(db: Session, user_id: int, shop_id: int, review_id: int = None):
    # Ensure user exists
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        user = User(id=user_id, full_name="Nashik Foodie", email=f"foodie{user_id}@nashikmisal.in")
        db.add(user)
        db.commit()

    # Check if stamp already exists
    existing = db.query(UserPassportStamp).filter(
        UserPassportStamp.user_id == user_id,
        UserPassportStamp.shop_id == shop_id
    ).first()
    
    if not existing:
        stamp = UserPassportStamp(user_id=user_id, shop_id=shop_id, review_id=review_id)
        db.add(stamp)
        
        user.total_stamps += 1
        db.commit()
        return stamp
    return existing

def get_user_passport(db: Session, user_id: int) -> DigitalPassportOut:
    get_or_create_default_badges(db)
    
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        # Create a default guest user if needed
        user = User(id=user_id, full_name="Nashik Foodie", email=f"foodie{user_id}@nashikmisal.in")
        db.add(user)
        db.commit()

    user_stamps = db.query(UserPassportStamp).filter(UserPassportStamp.user_id == user_id).all()
    stamps_list = []
    for s in user_stamps:
        shop = db.query(MisalShop).filter(MisalShop.id == s.shop_id).first()
        if shop:
            stamps_list.append(
                StampOut(
                    id=s.id,
                    shop_id=shop.id,
                    shop_name=shop.name,
                    shop_slug=shop.slug,
                    shop_area=shop.area,
                    stamped_at=s.stamped_at
                )
            )

    all_badges = db.query(PassportBadge).order_by(PassportBadge.required_stamps).all()
    badge_list = []
    for b in all_badges:
        unlocked = user.total_stamps >= b.required_stamps
        badge_list.append(
            BadgeOut(
                id=b.id,
                title=b.title,
                code=b.code,
                description=b.description,
                icon=b.icon,
                required_stamps=b.required_stamps,
                unlocked=unlocked
            )
        )

    return DigitalPassportOut(
        user_id=user.id,
        user_name=user.full_name,
        total_stamps=user.total_stamps,
        stamps=stamps_list,
        badges=badge_list
    )
