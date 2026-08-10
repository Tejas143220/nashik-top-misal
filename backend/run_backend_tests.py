import unittest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.main import app
from app.db.base import Base
from app.db.session import get_db
from app.models.shop import MisalShop, CrowdStatus, SponsorshipTier
from app.models.activity import Activity
from app.models.review import Review, ReviewStatus
from app.models.ad import AdPlacement
from app.models.user import User
from app.models.passport import PassportBadge, UserPassportStamp
from app.models.battle import MisalBattle
from app.models.coupon import Coupon
from app.models.contest import ContestEntry

SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

class BackendTestCase(unittest.TestCase):
    def setUp(self):
        Base.metadata.create_all(bind=engine)
        self.db = TestingSessionLocal()

        # Seed data
        act1 = Activity(id=1, name="Chulhivarchi (Wood Stove)", slug="chulhivarchi", icon_name="Flame")
        act2 = Activity(id=2, name="Ample Parking Space", slug="ample-parking", icon_name="Car")
        self.db.add_all([act1, act2])
        self.db.commit()

        shop1 = MisalShop(
            id=1,
            name="Sadhana Chulhivarchi Misal",
            slug="sadhana-chulhivarchi-misal-nashik",
            tagline="Authentic traditional wood-stove Misal",
            description="Established in 1959.",
            address="Gangapur Road, Nashik",
            area="Gangapur Road",
            city="Nashik",
            pincode="422013",
            phone="+91 98220 12345",
            spicy_level=4,
            is_chulhivarchi=True,
            price_per_plate=140.0,
            crowd_status=CrowdStatus.CROWDED,
            is_sponsored=True,
            sponsorship_tier=SponsorshipTier.PLATINUM,
            featured_order=1,
            avg_rating=4.8,
            total_reviews=1,
            is_active=True
        )
        shop1.activities.append(act1)

        shop2 = MisalShop(
            id=2,
            name="Shamsundar Misal",
            slug="shamsundar-misal-panchavati-nashik",
            tagline="Historic black gravy Misal",
            description="Famous Kala Rassa.",
            address="Panchavati, Nashik",
            area="Panchavati",
            city="Nashik",
            spicy_level=5,
            is_chulhivarchi=False,
            price_per_plate=110.0,
            crowd_status=CrowdStatus.MODERATE,
            avg_rating=4.5,
            total_reviews=1,
            is_active=True
        )
        shop2.activities.append(act2)

        self.db.add_all([shop1, shop2])
        self.db.commit()

        rev1 = Review(
            id=1,
            shop_id=1,
            reviewer_name="Amit D",
            rating=5,
            spice_rating=4,
            comment="Great spicy taste and fast service!",
            status=ReviewStatus.APPROVED
        )
        rev2 = Review(
            id=2,
            shop_id=2,
            reviewer_name="Rahul P",
            rating=4,
            spice_rating=5,
            comment="Very spicy Kala Rassa misal!",
            status=ReviewStatus.APPROVED
        )
        self.db.add_all([rev1, rev2])
        self.db.commit()

        ad1 = AdPlacement(
            id=1,
            slot_name="directory_sidebar",
            title="Sample Banner Ad",
            is_active=True
        )
        self.db.add(ad1)
        self.db.commit()

        user1 = User(
            id=1,
            full_name="Test Foodie",
            email="foodie@example.com",
            total_stamps=1
        )
        self.db.add(user1)
        self.db.commit()

        badge1 = PassportBadge(
            id=1,
            code="first_stamp",
            title="Misal Explorer",
            description="First stamp",
            icon="Compass",
            required_stamps=1
        )
        self.db.add(badge1)
        self.db.commit()

        stamp1 = UserPassportStamp(id=1, user_id=1, shop_id=1)
        self.db.add(stamp1)
        self.db.commit()

        battle1 = MisalBattle(
            id=1,
            title="Chulha Battle",
            subtitle="Test Battle",
            shop_a_name="Sadhana",
            shop_a_votes=10,
            shop_b_name="Grape Embassy",
            shop_b_votes=5,
            is_active=1
        )
        coupon1 = Coupon(
            id="c1",
            shop_id=1,
            shop_name="Sadhana",
            shop_area="Gangapur Road",
            title="Free Jalebi",
            code_prefix="SADHANA",
            discount_type="freebie",
            expiry_date="2026-08-31",
            is_active=1
        )
        contest1 = ContestEntry(
            id="p1",
            rank=1,
            foodie_name="Amit D",
            shop_name="Sadhana",
            photo_url="https://example.com/photo.jpg",
            caption="Test Photo",
            upvotes=100,
            is_active=1
        )
        self.db.add_all([battle1, coupon1, contest1])
        self.db.commit()


        def _override_get_db():
            try:
                yield self.db
            finally:
                pass

        app.dependency_overrides[get_db] = _override_get_db
        self.client = TestClient(app)

    def tearDown(self):
        self.db.close()
        Base.metadata.drop_all(bind=engine)
        app.dependency_overrides.clear()

    # --- Root & Sitemap Tests ---
    def test_root_endpoint(self):
        res = self.client.get("/")
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertIn("message", data)
        self.assertEqual(data["docs"], "/docs")

    def test_sitemap_xml(self):
        res = self.client.get("/api/v1/seo/sitemap.xml")
        self.assertEqual(res.status_code, 200)
        self.assertTrue(res.headers["content-type"].startswith("application/xml"))
        self.assertIn("<urlset", res.text)
        self.assertIn("sadhana-chulhivarchi-misal-nashik", res.text)

    # --- Shop Directory Tests ---
    def test_read_shops_default(self):
        res = self.client.get("/api/v1/shops/")
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertEqual(data["total"], 2)
        self.assertEqual(len(data["items"]), 2)
        self.assertEqual(data["items"][0]["slug"], "sadhana-chulhivarchi-misal-nashik")

    def test_read_shops_search(self):
        res = self.client.get("/api/v1/shops/?search=Shamsundar")
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertEqual(data["total"], 1)
        self.assertEqual(data["items"][0]["name"], "Shamsundar Misal")

    def test_read_shops_area_filter(self):
        res = self.client.get("/api/v1/shops/?area=Panchavati")
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertEqual(data["total"], 1)
        self.assertEqual(data["items"][0]["area"], "Panchavati")

    def test_read_shops_spice_filter(self):
        res = self.client.get("/api/v1/shops/?spicy_level=5")
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertEqual(data["total"], 1)
        self.assertEqual(data["items"][0]["spicy_level"], 5)

    def test_read_shops_chulhivarchi_filter(self):
        res = self.client.get("/api/v1/shops/?is_chulhivarchi=true")
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertEqual(data["total"], 1)
        self.assertTrue(data["items"][0]["is_chulhivarchi"])

    def test_read_shops_activity_filter(self):
        res = self.client.get("/api/v1/shops/?activity_slug=chulhivarchi")
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertEqual(data["total"], 1)

    def test_read_shops_sorting(self):
        res = self.client.get("/api/v1/shops/?sort_by=price_asc")
        self.assertEqual(res.status_code, 200)
        items = res.json()["items"]
        self.assertEqual(len(items), 2)

    def test_popular_areas(self):
        res = self.client.get("/api/v1/shops/areas")
        self.assertEqual(res.status_code, 200)
        areas = res.json()
        self.assertIn("Gangapur Road", areas)
        self.assertIn("Panchavati", areas)

    def test_read_shop_detail_success(self):
        res = self.client.get("/api/v1/shops/sadhana-chulhivarchi-misal-nashik")
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertEqual(data["name"], "Sadhana Chulhivarchi Misal")
        self.assertEqual(len(data["reviews"]), 1)
        self.assertEqual(data["reviews"][0]["reviewer_name"], "Amit D")

    def test_read_shop_detail_not_found(self):
        res = self.client.get("/api/v1/shops/non-existent-slug")
        self.assertEqual(res.status_code, 404)

    def test_read_shop_schema_success(self):
        res = self.client.get("/api/v1/shops/sadhana-chulhivarchi-misal-nashik/schema")
        self.assertEqual(res.status_code, 200)
        schema = res.json()
        self.assertEqual(schema["@type"], "Restaurant")
        self.assertEqual(schema["name"], "Sadhana Chulhivarchi Misal")

    def test_create_misal_shop(self):
        payload = {
            "name": "Mamacha Wada Misal",
            "tagline": "Spicy authentic Maharashtrian misal",
            "address": "Indira Nagar, Nashik",
            "area": "Indira Nagar",
            "spicy_level": 4,
            "is_chulhivarchi": True,
            "price_per_plate": 120.0
        }
        res = self.client.post("/api/v1/shops/", json=payload)
        self.assertEqual(res.status_code, 201)
        data = res.json()
        self.assertEqual(data["name"], "Mamacha Wada Misal")
        self.assertEqual(data["slug"], "mamacha-wada-misal-indira-nagar")

    # --- Review Tests ---
    def test_create_review_success(self):
        payload = {
            "shop_id": 1,
            "reviewer_name": "Priya Sharma",
            "rating": 5,
            "comment": "Delicious authentic misal thali!"
        }
        res = self.client.post("/api/v1/reviews/", json=payload)
        self.assertEqual(res.status_code, 201)
        data = res.json()
        self.assertEqual(data["reviewer_name"], "Priya Sharma")

        # Verify recalculate rating
        shop_res = self.client.get("/api/v1/shops/sadhana-chulhivarchi-misal-nashik")
        self.assertEqual(shop_res.status_code, 200)
        self.assertEqual(shop_res.json()["total_reviews"], 2)

    def test_create_review_invalid_shop(self):
        payload = {
            "shop_id": 999,
            "reviewer_name": "Ghost",
            "rating": 5,
            "comment": "Nice place if existed"
        }
        res = self.client.post("/api/v1/reviews/", json=payload)
        self.assertEqual(res.status_code, 404)

    # --- Activity & Ad Tests ---
    def test_get_activities(self):
        res = self.client.get("/api/v1/activities/")
        self.assertEqual(res.status_code, 200)
        self.assertEqual(len(res.json()), 2)

    def test_get_ad_slot(self):
        res = self.client.get("/api/v1/ads/slot/directory_sidebar")
        self.assertEqual(res.status_code, 200)
        self.assertEqual(res.json()["title"], "Sample Banner Ad")

    # --- Passport Tests ---
    def test_create_or_get_user_profile(self):
        res = self.client.post("/api/v1/passport/profile", json={"full_name": "Tejas Thakare"})
        self.assertEqual(res.status_code, 201)
        data = res.json()
        self.assertEqual(data["user_name"], "Tejas Thakare")

    def test_get_passport(self):
        res = self.client.get("/api/v1/passport/1")
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertEqual(data["user_id"], 1)
        self.assertGreaterEqual(len(data["stamps"]), 1)

    def test_stamp_passport_success(self):
        res = self.client.post("/api/v1/passport/1/stamp/2")
        self.assertEqual(res.status_code, 200)
        data = res.json()
        stamped_ids = [s["shop_id"] for s in data["stamps"]]
        self.assertIn(2, stamped_ids)

    def test_stamp_passport_invalid_shop(self):
        res = self.client.post("/api/v1/passport/1/stamp/9999")
        self.assertEqual(res.status_code, 404)

    # --- Quiz Tests ---
    def test_quiz_recommendation(self):
        payload = {
            "spice_preference": 4,
            "cooking_style": "chulhivarchi",
            "area": "Gangapur Road"
        }
        res = self.client.post("/api/v1/quiz/recommend", json=payload)
        self.assertEqual(res.status_code, 200)
        recs = res.json()
        self.assertGreater(len(recs), 0)
        self.assertEqual(recs[0]["shop"]["slug"], "sadhana-chulhivarchi-misal-nashik")

    # --- Sponsorship Tests ---
    def test_get_sponsorship_plans(self):
        res = self.client.get("/api/v1/sponsorship/plans")
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertIn("creator", data)
        self.assertEqual(data["creator"]["name"], "Tejas Thakare")
        self.assertEqual(data["creator"]["phonepe_number"], "7058638277")
        self.assertEqual(len(data["plans"]), 3)

    def test_subscribe_shop_plan(self):
        payload = {
            "shop_id": 2,
            "tier": "gold",
            "billing_cycle": "yearly",
            "transaction_ref": "TXN7058638277999",
            "contact_name": "Shamsundar Owner",
            "contact_phone": "9890011223"
        }
        res = self.client.post("/api/v1/sponsorship/subscribe", json=payload)
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertEqual(data["status"], "success")
        self.assertEqual(data["sponsorship_tier"], "gold")
        self.assertEqual(data["phonepe_number"], "7058638277")
        self.assertIn("invoice_no", data)
        self.assertEqual(data["total_paid"], 24999)


    # --- Battle Tests ---
    def test_get_current_battle(self):
        res = self.client.get("/api/v1/battle/current")
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertIn("shop_a", data)
        self.assertIn("shop_b", data)

    def test_cast_battle_vote(self):
        res = self.client.post("/api/v1/battle/vote", json={"shop_choice": "a"})
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertEqual(data["status"], "success")

    # --- Coupons Tests ---
    def test_get_coupons(self):
        res = self.client.get("/api/v1/coupons/")
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertGreater(len(data), 0)

    def test_claim_coupon(self):
        res = self.client.post("/api/v1/coupons/claim", json={"coupon_id": "c1"})
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertEqual(data["status"], "success")
        self.assertIn("voucher_code", data)

    # --- Contest Tests ---
    def test_get_contest_leaderboard(self):
        res = self.client.get("/api/v1/contest/leaderboard")
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertIn("entries", data)
        self.assertGreater(len(data["entries"]), 0)

    def test_upvote_contest_photo(self):
        res = self.client.post("/api/v1/contest/upvote", json={"photo_id": "p1"})
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertEqual(data["status"], "success")

    # --- Trail Route Planner Tests ---
    def test_get_curated_trails(self):
        res = self.client.get("/api/v1/trail/curated")
        self.assertEqual(res.status_code, 200)

    def test_calculate_custom_trail(self):
        res = self.client.post("/api/v1/trail/calculate", json={"shop_ids": [1, 2], "group_size": 3})
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertEqual(data["status"], "success")
        self.assertEqual(data["total_stops"], 2)
        self.assertIn("gmaps_url", data)

    # --- Top 5 Share Card Tests ---
    def test_create_top_five_share(self):
        res = self.client.post("/api/v1/share/top5", json={"user_name": "Tejas Thakare", "shop_ids": [1, 2]})
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertEqual(data["user_name"], "Tejas Thakare")
        self.assertEqual(data["total_ranked"], 2)
    # --- Merchant Redemption Tests ---
    def test_verify_and_redeem_merchant_coupon(self):
        # First claim a coupon to get a voucher code
        claim_res = self.client.post("/api/v1/coupons/claim", json={"coupon_id": "c1", "user_name": "Test Merchant User"})
        self.assertEqual(claim_res.status_code, 200)
        v_code = claim_res.json()["voucher_code"]

        # Verify coupon
        v_res = self.client.post("/api/v1/merchant/verify-coupon", json={"voucher_code": v_code})
        self.assertEqual(v_res.status_code, 200)
        self.assertTrue(v_res.json()["is_valid"])

        # Redeem coupon
        r_res = self.client.post("/api/v1/merchant/redeem-coupon", json={"voucher_code": v_code, "merchant_pin": "7058"})
        self.assertEqual(r_res.status_code, 200)
        self.assertEqual(r_res.json()["status"], "SUCCESS")

    def test_get_merchant_analytics(self):
        res = self.client.get("/api/v1/merchant/analytics")
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertIn("total_issued_vouchers", data)

    # --- Queue Check-in Tests ---
    def test_submit_queue_checkin(self):
        payload = {
            "shop_id": 1,
            "reporter_name": "Tejas Foodie",
            "wait_time_mins": 25,
            "crowd_level": "crowded",
            "comment": "Wood stove active, 15 min wait!"
        }
        res = self.client.post("/api/v1/queue/checkin", json=payload)
        self.assertEqual(res.status_code, 201)
        data = res.json()
        self.assertEqual(data["status"], "success")
        self.assertEqual(data["updated_crowd_status"], "crowded")

    def test_get_shop_queue_status(self):
        res = self.client.get("/api/v1/queue/1/status")
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertIn("avg_wait_time_mins", data)
        self.assertIn("recent_reports", data)

    # --- Geo-Location Proximity Tests ---
    def test_get_nearby_shops(self):
        res = self.client.get("/api/v1/shops/nearby?lat=20.0059&lng=73.7898")
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertIn("items", data)
        self.assertGreater(len(data["items"]), 0)
        self.assertIn("distance_km", data["items"][0])

    # --- Notification Service Tests ---
    def test_whatsapp_alert_url_generation(self):
        from app.services.notification_service import build_whatsapp_alert_url, dispatch_automated_whatsapp_alert
        url = build_whatsapp_alert_url(
            shop_name="Testing Misal",
            area="Gangapur Road",
            address="Near Someshwar Waterfall",
            owner_name="Test Owner",
            owner_phone="7058638277",
            plan_type="Gold Partner"
        )
        self.assertIn("https://api.whatsapp.com/send?phone=917058638277", url)
        self.assertIn("Testing%20Misal", url)

        res = dispatch_automated_whatsapp_alert("Testing Misal", "Gangapur Road", "Address", "Owner", "7058638277")
        self.assertEqual(res["status"], "dispatched")

if __name__ == "__main__":
    unittest.main()







