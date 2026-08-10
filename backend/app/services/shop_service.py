import re
from typing import List, Optional
from sqlalchemy.orm import Session, joinedload, selectinload
from sqlalchemy import func, desc, asc
from app.models.shop import MisalShop, SponsorshipTier
from app.models.activity import Activity, shop_activities
from app.models.review import Review, ReviewStatus
from app.schemas.shop import MisalShopCreate

def slugify(text: str) -> str:
    text = text.lower().strip()
    text = re.sub(r'[^\w\s-]', '', text)
    text = re.sub(r'[\s_-]+', '-', text)
    text = re.sub(r'^-+|-+$', '', text)
    return text

def get_shops(
    db: Session,
    skip: int = 0,
    limit: int = 20,
    search: Optional[str] = None,
    area: Optional[str] = None,
    spicy_level: Optional[int] = None,
    is_chulhivarchi: Optional[bool] = None,
    activity_slug: Optional[str] = None,
    sort_by: str = "recommended" # recommended, rating, reviews, price_asc, price_desc
):
    query = db.query(MisalShop).filter(MisalShop.is_active == True)

    if search:
        search_pattern = f"%{search}%"
        query = query.filter(
            (MisalShop.name.ilike(search_pattern)) | 
            (MisalShop.area.ilike(search_pattern)) | 
            (MisalShop.tagline.ilike(search_pattern))
        )

    if area:
        query = query.filter(MisalShop.area.ilike(area))

    if spicy_level is not None:
        query = query.filter(MisalShop.spicy_level == spicy_level)

    if is_chulhivarchi is not None:
        query = query.filter(MisalShop.is_chulhivarchi == is_chulhivarchi)

    if activity_slug:
        query = query.join(MisalShop.activities).filter(Activity.slug == activity_slug)

    order_clauses = [desc(MisalShop.is_sponsored), desc(MisalShop.featured_order)]

    if sort_by == "rating":
        order_clauses.append(desc(MisalShop.avg_rating))
    elif sort_by == "reviews":
        order_clauses.append(desc(MisalShop.total_reviews))
    elif sort_by == "price_asc":
        order_clauses.append(asc(MisalShop.price_per_plate))
    elif sort_by == "price_desc":
        order_clauses.append(desc(MisalShop.price_per_plate))
    else: # recommended / default
        order_clauses.extend([desc(MisalShop.avg_rating), desc(MisalShop.total_reviews)])

    query = query.order_by(*order_clauses)
    
    total = query.count()
    shops = query.options(joinedload(MisalShop.activities)).offset(skip).limit(limit).all()

    return shops, total

def get_shop_by_slug(db: Session, slug: str) -> Optional[MisalShop]:
    shop = db.query(MisalShop).options(
        joinedload(MisalShop.activities),
        joinedload(MisalShop.images),
        selectinload(MisalShop.reviews)
    ).filter(MisalShop.slug == slug, MisalShop.is_active == True).first()
    
    if shop:
        shop.view_count += 1
        db.commit()
        shop.reviews = [r for r in shop.reviews if r.status == ReviewStatus.APPROVED]
        
    return shop

def create_shop(db: Session, shop_in: MisalShopCreate) -> MisalShop:
    base_slug = slugify(shop_in.slug) if shop_in.slug else slugify(f"{shop_in.name} {shop_in.area}")
    slug = base_slug
    counter = 1
    while db.query(MisalShop).filter(MisalShop.slug == slug).first():
        slug = f"{base_slug}-{counter}"
        counter += 1

    shop_data = shop_in.model_dump(exclude={"activity_ids"})
    shop_data["slug"] = slug

    db_shop = MisalShop(**shop_data)
    
    if shop_in.activity_ids:
        activities = db.query(Activity).filter(Activity.id.in_(shop_in.activity_ids)).all()
        db_shop.activities = activities

    db.add(db_shop)
    db.commit()
    db.refresh(db_shop)
    return db_shop

def recalculate_shop_rating(db: Session, shop_id: int):
    stats = db.query(
        func.avg(Review.rating).label("avg_rating"),
        func.count(Review.id).label("total_reviews")
    ).filter(Review.shop_id == shop_id, Review.status == ReviewStatus.APPROVED).first()
    
    shop = db.query(MisalShop).filter(MisalShop.id == shop_id).first()
    if shop:
        shop.avg_rating = round(float(stats.avg_rating or 0.0), 1)
        shop.total_reviews = int(stats.total_reviews or 0)
        db.commit()
