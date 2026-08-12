"""
SQLite to PostgreSQL Data Migration Tool for Nashik Top Misal
Run this script after setting DATABASE_URL in backend/.env to your PostgreSQL database.

Usage:
    python migrate_to_postgres.py
"""
import os
import sys

# Ensure backend root is in sys.path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker

from app.core.config import settings
from app.db.base import Base
from app.models.shop import MisalShop, ShopImage
from app.models.activity import Activity, shop_activities
from app.models.review import Review
from app.models.ad import AdPlacement
from app.models.user import User
from app.models.passport import PassportBadge, UserPassportStamp
from app.models.battle import MisalBattle, BattleVote
from app.models.coupon import Coupon, CouponClaim
from app.models.contest import ContestEntry
from app.models.queue_checkin import QueueCheckin

SQLITE_URL = "sqlite:///./nashik_misal.db"

def migrate():
    target_url = settings.DATABASE_URL
    if target_url.startswith("sqlite"):
        print("❌ Error: Target DATABASE_URL in .env is still set to SQLite.")
        print("Please set DATABASE_URL to your PostgreSQL connection string in backend/.env")
        print("Example: DATABASE_URL=postgresql://postgres:password@localhost:5432/nashik_misal")
        sys.exit(1)

    print(f"🚀 Starting Migration from SQLite -> PostgreSQL...")
    print(f"Target Database: {target_url.split('@')[-1] if '@' in target_url else target_url}")

    # SQLite Engine & Session
    sqlite_engine = create_engine(SQLITE_URL, connect_args={"check_same_thread": False})
    SQLiteSession = sessionmaker(bind=sqlite_engine)
    sqlite_db = SQLiteSession()

    # Target PostgreSQL Engine & Session
    pg_engine = create_engine(target_url, pool_pre_ping=True)
    PgSession = sessionmaker(bind=pg_engine)
    pg_db = PgSession()

    try:
        print("\n1. Re-creating tables on PostgreSQL...")
        Base.metadata.drop_all(bind=pg_engine)
        Base.metadata.create_all(bind=pg_engine)

        models = [
            (Activity, "Activities"),
            (PassportBadge, "Passport Badges"),
            (User, "Users"),
            (MisalShop, "Misal Shops"),
            (ShopImage, "Shop Images"),
            (Review, "Reviews"),
            (AdPlacement, "Ad Placements"),
            (UserPassportStamp, "User Passport Stamps"),
            (MisalBattle, "Misal Battles"),
            (BattleVote, "Battle Votes"),
            (Coupon, "Coupons"),
            (CouponClaim, "Coupon Claims"),
            (ContestEntry, "Contest Entries"),
            (QueueCheckin, "Queue Checkins")
        ]

        for model, label in models:
            records = sqlite_db.query(model).all()
            print(f"   Migrating {len(records)} {label}...")
            for item in records:
                sqlite_db.expunge(item)
                pg_db.merge(item)
            pg_db.commit()

        # Migrate many-to-many shop_activities association table
        rows = sqlite_db.execute(text("SELECT shop_id, activity_id FROM shop_activities")).fetchall()
        print(f"   Migrating {len(rows)} Shop-Activity links...")
        for r in rows:
            pg_db.execute(
                text("INSERT INTO shop_activities (shop_id, activity_id) VALUES (:s_id, :a_id) ON CONFLICT DO NOTHING"),
                {"s_id": r[0], "a_id": r[1]}
            )
        pg_db.commit()

        # Reset sequences in Postgres
        print("\n2. Synchronizing PostgreSQL Primary Key Sequences...")
        tables = [
            "misal_shops", "shop_images", "activities", "reviews", 
            "ad_placements", "users", "passport_badges", "user_passport_stamps", 
            "misal_battles", "battle_votes", "coupon_claims", "queue_checkins"
        ]
        for table in tables:
            try:
                pg_db.execute(text(f"SELECT setval(pg_get_serial_sequence('{table}', 'id'), COALESCE((SELECT MAX(id) FROM {table}), 1));"))
            except Exception as seq_err:
                print(f"   Sequence sync note for {table}: {seq_err}")
        pg_db.commit()

        print("\n✅ Migration completed successfully! All data transferred to PostgreSQL.")

    except Exception as e:
        pg_db.rollback()
        print(f"\n❌ Migration Failed: {e}")
        raise
    finally:
        sqlite_db.close()
        pg_db.close()

if __name__ == "__main__":
    migrate()
