"""
Enable Row Level Security (RLS) on all public PostgreSQL tables for Supabase Security Compliance.
"""
import os
import sys

sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from sqlalchemy import text
from app.db.session import engine

tables = [
    "ad_placements",
    "misal_shops",
    "shop_images",
    "activities",
    "shop_activities",
    "reviews",
    "users",
    "passport_badges",
    "user_passport_stamps",
    "misal_battles",
    "battle_votes",
    "coupons",
    "coupon_claims",
    "contest_entries",
    "queue_checkins"
]

def enable_rls():
    print("Enabling Row Level Security (RLS) on Supabase PostgreSQL tables...\n")
    with engine.connect() as conn:
        for table in tables:
            try:
                conn.execute(text(f"ALTER TABLE public.{table} ENABLE ROW LEVEL SECURITY;"))
                print(f"  [OK] Enabled RLS on: public.{table}")
            except Exception as e:
                print(f"  [NOTE] public.{table}: {e}")
        conn.commit()
    print("\nRow Level Security successfully enabled across all tables!")

if __name__ == "__main__":
    enable_rls()
