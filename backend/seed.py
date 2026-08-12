import os
import sys

# Ensure backend root is in sys.path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from sqlalchemy.orm import Session
from app.db.session import engine, SessionLocal
from app.db.base import Base
from app.models.shop import MisalShop, ShopImage, SponsorshipTier, CrowdStatus
from app.models.activity import Activity
from app.models.review import Review, ReviewStatus
from app.models.ad import AdPlacement
from app.models.user import User
from app.models.passport import PassportBadge, UserPassportStamp
from app.models.battle import MisalBattle
from app.models.coupon import Coupon
from app.models.contest import ContestEntry

def seed_database():
    print("Re-creating Database schema for Open Access Features...")
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    db: Session = SessionLocal()

    try:
        print("Seeding Activities / Special Amenities...")
        act_chulhi = Activity(name="Chulhivarchi (Wood Stove)", slug="chulhivarchi", icon_name="Flame")
        act_parking = Activity(name="Ample Parking Space", slug="ample-parking", icon_name="Car")
        act_family = Activity(name="Family Seating & AC Hall", slug="family-seating", icon_name="Users")
        act_jalebi = Activity(name="Hot Jalebi & Gulab Jamun", slug="jalebi-sweets", icon_name="Coffee")
        act_garden = Activity(name="Open Garden Environment", slug="garden-seating", icon_name="Trees")

        db.add_all([act_chulhi, act_parking, act_family, act_jalebi, act_garden])
        db.commit()

        print("Seeding Passport Badges...")
        badges = [
            PassportBadge(code="first_stamp", title="Misal Explorer 🧭", description="Stamped your first Nashik Misal joint!", icon="Compass", required_stamps=1),
            PassportBadge(code="spicy_warrior", title="Spicy Warrior 🌶️", description="Stamped 3 different Zanzanit spicy spots!", icon="Flame", required_stamps=3),
            PassportBadge(code="chulha_pioneer", title="Chulha Pioneer 🔥", description="Visited authentic traditional wood-stove misal spots!", icon="Award", required_stamps=5),
            PassportBadge(code="nashik_legend", title="Nashik Misal Legend 🏆", description="Ultimate Master! Collected 8+ stamps across Nashik.", icon="Crown", required_stamps=8),
        ]
        db.add_all(badges)
        db.commit()

        print("Seeding Default User...")
        user = User(
            id=1,
            full_name="Rajesh Patil (Nashik Foodie)",
            email="rajesh.patil@example.com",
            avatar_url="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80",
            total_stamps=2
        )
        db.add(user)
        db.commit()

        print("Seeding Famous Nashik Misal Joints...")
        
        # 1. Sadhana Chulhivarchi Misal
        sadhana = MisalShop(
            name="Sadhana Chulhivarchi Misal",
            slug="sadhana-chulhivarchi-misal-nashik",
            tagline="Authentic traditional wood-stove Misal served in earthen pots with Jalebi & Solkadhi",
            description="Established in 1959, Sadhana Chulhivarchi Misal is a legendary culinary landmark of Nashik. Slow-cooked on traditional wood stoves with smoky aromatics.",
            address="Hardev Baug, Bardan Phata, Near Someshwar, Gangapur Road",
            area="Gangapur Road",
            city="Nashik",
            pincode="422013",
            phone="+91 98220 12345",
            google_maps_url="https://maps.google.com/?q=Sadhana+Chulhivarchi+Misal+Nashik",
            latitude=20.0315,
            longitude=73.7421,
            spicy_level=4,
            is_chulhivarchi=True,
            price_per_plate=140.0,
            opening_time="08:00 AM",
            closing_time="03:30 PM",
            weekly_off="None",
            video_url="https://assets.mixkit.co/videos/preview/mixkit-cooking-food-in-a-pot-41555-large.mp4",
            video_thumbnail_url="https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=1200&q=80",
            main_image_url="https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=1200&q=80",
            crowd_status=CrowdStatus.CROWDED,
            meta_title="Sadhana Chulhivarchi Misal Nashik - Menu, Timings & Reviews",
            meta_description="Read customer reviews and check menu for Sadhana Chulhivarchi Misal on Gangapur Road, Nashik.",
            is_sponsored=True,
            sponsorship_tier=SponsorshipTier.PLATINUM,
            featured_order=1,
            avg_rating=4.8,
            total_reviews=1420,
            view_count=8500,
            is_verified=True,
            is_active=True
        )
        sadhana.activities.extend([act_chulhi, act_parking, act_family, act_jalebi, act_garden])

        # 2. Grape Embassy Misal
        grape_embassy = MisalShop(
            name="Grape Embassy Misal",
            slug="grape-embassy-misal-nashik",
            tagline="Dining under real grape vines with spicy zanzanit sample",
            description="Grape Embassy offers a unique dining experience where visitors enjoy rich Nashik Misal seated directly beneath lush grape farm canopies.",
            address="Peth Road, Near Makhmalabad, Nashik",
            area="Peth Road",
            city="Nashik",
            pincode="422003",
            phone="+91 94222 54321",
            google_maps_url="https://maps.google.com/?q=Grape+Embassy+Misal+Nashik",
            latitude=20.0521,
            longitude=73.7912,
            spicy_level=5,
            is_chulhivarchi=True,
            price_per_plate=150.0,
            opening_time="07:30 AM",
            closing_time="04:00 PM",
            weekly_off="Monday",
            video_url="https://assets.mixkit.co/videos/preview/mixkit-pouring-spicy-sauce-over-food-41553-large.mp4",
            video_thumbnail_url="https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=1200&q=80",
            main_image_url="https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=1200&q=80",
            crowd_status=CrowdStatus.MODERATE,
            meta_title="Grape Embassy Misal Nashik - Grape Garden Dining Experience",
            meta_description="Enjoy zanzanit misal under grape vines at Grape Embassy Nashik.",
            is_sponsored=True,
            sponsorship_tier=SponsorshipTier.GOLD,
            featured_order=2,
            avg_rating=4.7,
            total_reviews=890,
            view_count=6200,
            is_verified=True,
            is_active=True
        )
        grape_embassy.activities.extend([act_chulhi, act_parking, act_garden, act_jalebi])

        # 3. Shamsundar Misal
        shamsundar = MisalShop(
            name="Shamsundar Misal",
            slug="shamsundar-misal-panchavati-nashik",
            tagline="Historic black gravy (Kala Rassa) Misal with unmatched spice kick",
            description="Known for its signature dark roasted spice rassa (Kala Rassa), Shamsundar has been serving authentic Nashik style misal to spice enthusiasts for over 4 decades.",
            address="B-14, MIDC Ambad / Panchavati Industrial Area",
            area="Panchavati",
            city="Nashik",
            pincode="422010",
            phone="+91 98900 11223",
            google_maps_url="https://maps.google.com/?q=Shamsundar+Misal+Nashik",
            latitude=19.9650,
            longitude=73.7430,
            spicy_level=5,
            is_chulhivarchi=False,
            price_per_plate=110.0,
            opening_time="08:00 AM",
            closing_time="07:00 PM",
            weekly_off="Sunday Evening",
            video_url="https://assets.mixkit.co/videos/preview/mixkit-chef-stirring-food-in-a-pan-41554-large.mp4",
            video_thumbnail_url="https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=1200&q=80",
            main_image_url="https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=1200&q=80",
            crowd_status=CrowdStatus.FULL,
            meta_title="Shamsundar Misal Nashik - Original Black Gravy Misal",
            meta_description="Famous Kala Rassa Misal at Shamsundar Nashik.",
            is_sponsored=False,
            sponsorship_tier=SponsorshipTier.NONE,
            featured_order=0,
            avg_rating=4.6,
            total_reviews=1150,
            view_count=5400,
            is_verified=True,
            is_active=True
        )
        shamsundar.activities.extend([act_parking, act_family])

        # 4. Perachi Wadi Chulhivarchi Misal
        perachi_wadi = MisalShop(
            name="Perachi Wadi Chulhivarchi Misal",
            slug="perachi-wadi-chulhivarchi-misal-nashik",
            tagline="Rustic agro-tourism vibe surrounded by guava orchards",
            description="Set inside a guava farm, Perachi Wadi offers slow-cooked woodfire misal served with fresh Pav.",
            address="Someshwar Church Road, Gangapur Road",
            area="Gangapur Road",
            city="Nashik",
            pincode="422013",
            phone="+91 97654 32109",
            google_maps_url="https://maps.google.com/?q=Perachi+Wadi+Misal+Nashik",
            latitude=20.0298,
            longitude=73.7380,
            spicy_level=3,
            is_chulhivarchi=True,
            price_per_plate=130.0,
            opening_time="08:30 AM",
            closing_time="03:00 PM",
            weekly_off="None",
            main_image_url="https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=1200&q=80",
            crowd_status=CrowdStatus.EMPTY,
            meta_title="Perachi Wadi Misal Nashik - Guava Garden Misal",
            meta_description="Enjoy family friendly misal dining inside guava orchards at Perachi Wadi.",
            is_sponsored=False,
            sponsorship_tier=SponsorshipTier.NONE,
            featured_order=0,
            avg_rating=4.5,
            total_reviews=640,
            view_count=3800,
            is_verified=True,
            is_active=True
        )
        perachi_wadi.activities.extend([act_chulhi, act_parking, act_garden, act_family])

        # 5. Hotel Vihar Misal
        vihar = MisalShop(
            name="Hotel Vihar Misal",
            slug="hotel-vihar-misal-college-road-nashik",
            tagline="Youth favourite classic misal on College Road",
            description="The go-to misal hub for college students and families in heart of College Road.",
            address="College Road, Opposite KTHM College, Nashik",
            area="College Road",
            city="Nashik",
            pincode="422005",
            phone="+91 253 231122",
            google_maps_url="https://maps.google.com/?q=Hotel+Vihar+Misal+College+Road+Nashik",
            latitude=20.0031,
            longitude=73.7654,
            spicy_level=3,
            is_chulhivarchi=False,
            price_per_plate=100.0,
            opening_time="07:30 AM",
            closing_time="08:30 PM",
            weekly_off="None",
            main_image_url="https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=1200&q=80",
            crowd_status=CrowdStatus.MODERATE,
            meta_title="Hotel Vihar Misal College Road Nashik",
            meta_description="Popular Misal spot on College Road, Nashik.",
            is_sponsored=False,
            sponsorship_tier=SponsorshipTier.NONE,
            featured_order=0,
            avg_rating=4.4,
            total_reviews=920,
            view_count=4900,
            is_verified=True,
            is_active=True
        )
        vihar.activities.extend([act_family])

        db.add_all([sadhana, grape_embassy, shamsundar, perachi_wadi, vihar])
        db.commit()

        # Seed Passport Stamps for User 1
        s1 = UserPassportStamp(user_id=1, shop_id=sadhana.id)
        s2 = UserPassportStamp(user_id=1, shop_id=grape_embassy.id)
        db.add_all([s1, s2])
        db.commit()

        # Seed Reviews with Thali Photo URLs 📸
        r1 = Review(
            shop_id=sadhana.id,
            reviewer_name="Amit Deshmukh",
            reviewer_email="amit.d@example.com",
            rating=5,
            spice_rating=4,
            comment="Unbeatable smoky chulha taste! The combination of spicy sample with warm Jalebi and curd is unmatched anywhere in Maharashtra.",
            image_url="https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=600&q=80",
            status=ReviewStatus.APPROVED
        )
        r2 = Review(
            shop_id=grape_embassy.id,
            reviewer_name="Rahul Patil",
            reviewer_email="rahul.p@example.com",
            rating=5,
            spice_rating=5,
            comment="Eating misal under actual grape vines is such a fresh concept. Rassa was piping hot and extremely spicy just the way Nashikkar like it!",
            image_url="https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=80",
            status=ReviewStatus.APPROVED
        )
        db.add_all([r1, r2])
        db.commit()

        # Seed Banners
        ad1 = AdPlacement(
            slot_name="directory_sidebar",
            title="Nashik Grape Winery Tour - 20% Off",
            image_url="https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=600&q=80",
            target_url="https://example.com/winery-tour",
            is_active=True
        )
        ad2 = AdPlacement(
            slot_name="homepage_hero_banner",
            title="Promote Your Misal Shop Here! Get 10x More Customers",
            image_url="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80",
            target_url="/submit-shop",
            is_active=True
        )
        db.add_all([ad1, ad2])
        db.commit()

        print("Seeding Misal Battle Match-up...")
        battle = MisalBattle(
            title="Chulha Pioneer Battle ⚔️",
            subtitle="Which wood-stove misal joint reigns supreme in Nashik?",
            shop_a_name="Sadhana Chulhivarchi Misal",
            shop_a_slug="sadhana-chulhivarchi-misal-nashik",
            shop_a_area="Gangapur Road",
            shop_a_image_url="https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=600&q=80",
            shop_a_votes=342,
            shop_b_name="Grape Embassy Misal",
            shop_b_slug="grape-embassy-misal-nashik",
            shop_b_area="Peth Road",
            shop_b_image_url="https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=80",
            shop_b_votes=289,
            expires_in_days=3,
            is_active=1
        )
        db.add(battle)
        db.commit()

        print("Seeding Active Coupons...")
        coupons = [
            Coupon(
                id="c1",
                shop_id=sadhana.id,
                shop_name="Sadhana Chulhivarchi Misal",
                shop_area="Gangapur Road",
                title="Free Hot Jalebi Plate 🍮",
                description="Get 1 complimentary fresh hot Jalebi plate with any 2 Misal Thalis ordered!",
                code_prefix="SADHANA-JALEBI",
                discount_type="freebie",
                badge="Gold Deal ⭐",
                expiry_date="2026-08-31",
                image_url="https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=600&q=80"
            ),
            Coupon(
                id="c2",
                shop_id=grape_embassy.id,
                shop_name="Grape Embassy Misal",
                shop_area="Peth Road",
                title="15% Off Total Bill (Group of 4+) 🍇",
                description="Enjoy dining under grape vines with 15% discount on total family/group bill above ₹500.",
                code_prefix="GRAPE-15OFF",
                discount_type="percentage",
                badge="Platinum Special 👑",
                expiry_date="2026-09-15",
                image_url="https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=80"
            ),
            Coupon(
                id="c3",
                shop_id=shamsundar.id,
                shop_name="Shamsundar Misal",
                shop_area="Panchavati",
                title="Free Solkadhi Glass & Extra Pav 🥤",
                description="Cool down your Zanzanit Kala Rassa spice with a complimentary chilled Solkadhi glass!",
                code_prefix="SHAM-SOLKADHI",
                discount_type="freebie",
                badge="Popular Deal 🔥",
                expiry_date="2026-08-30",
                image_url="https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&q=80"
            )
        ]
        db.add_all(coupons)
        db.commit()

        print("Seeding Photo Contest Leaderboard...")
        contest_entries = [
            ContestEntry(
                id="p1",
                rank=1,
                foodie_name="Amit Deshmukh",
                avatar_url="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80",
                shop_name="Sadhana Chulhivarchi Misal",
                photo_url="https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=800&q=80",
                caption="Earthen pot misal with warm jalebi! Zanzanit perfection 🔥",
                upvotes=248,
                badge="🥇 #1 Top Photo of August",
                prize="🏆 1-Month Free Misal Pass",
                month="August 2026"
            ),
            ContestEntry(
                id="p2",
                rank=2,
                foodie_name="Priya Sharma",
                avatar_url="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80",
                shop_name="Grape Embassy Misal",
                photo_url="https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80",
                caption="Misal under real grape farm canopies! Unique Nashik experience 🍇",
                upvotes=194,
                badge="🥈 #2 Runner Up",
                prize="🎁 ₹500 Misal Coupon",
                month="August 2026"
            ),
            ContestEntry(
                id="p3",
                rank=3,
                foodie_name="Rahul Patil",
                avatar_url="https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=200&q=80",
                shop_name="Shamsundar Misal",
                photo_url="https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80",
                caption="Classic dark Kala Rassa misal. Pure spice heaven! 🌶️",
                upvotes=156,
                badge="🥉 #3 Popular Entry",
                prize="🎁 ₹300 Misal Coupon",
                month="August 2026"
            )
        ]
        db.add_all(contest_entries)
        db.commit()

        # Synchronize PostgreSQL primary key sequences if running on PostgreSQL
        if engine.dialect.name == "postgresql":
            from sqlalchemy import text
            tables = [
                "misal_shops", "shop_images", "activities", "reviews", 
                "ad_placements", "users", "passport_badges", "user_passport_stamps", 
                "misal_battles", "battle_votes", "coupon_claims", "queue_checkins"
            ]
            for table in tables:
                try:
                    db.execute(text(f"SELECT setval(pg_get_serial_sequence('{table}', 'id'), COALESCE((SELECT MAX(id) FROM {table}), 1));"))
                except Exception as seq_err:
                    print(f"Sequence sync note for {table}: {seq_err}")
            db.commit()

        print("Database Schema & Seeding Completed Successfully!")

    except Exception as e:
        db.rollback()
        print(f"Error seeding database: {e}")
        raise
    finally:
        db.close()

if __name__ == "__main__":
    seed_database()
