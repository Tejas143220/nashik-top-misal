import pytest
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

# Create in-memory SQLite database for fast isolated testing
SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

@pytest.fixture(scope="function")
def db_session():
    """
    Creates a fresh database schema for each test function.
    """
    Base.metadata.create_all(bind=engine)
    db = TestingSessionLocal()

    # Seed minimal test data
    act1 = Activity(id=1, name="Chulhivarchi (Wood Stove)", slug="chulhivarchi", icon_name="Flame")
    act2 = Activity(id=2, name="Ample Parking Space", slug="ample-parking", icon_name="Car")
    db.add_all([act1, act2])
    db.commit()

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

    db.add_all([shop1, shop2])
    db.commit()

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
    db.add_all([rev1, rev2])
    db.commit()

    ad1 = AdPlacement(
        id=1,
        slot_name="directory_sidebar",
        title="Sample Banner Ad",
        is_active=True
    )
    db.add(ad1)
    db.commit()

    user1 = User(
        id=1,
        full_name="Test Foodie",
        email="foodie@example.com",
        total_stamps=1
    )
    db.add(user1)
    db.commit()

    badge1 = PassportBadge(
        id=1,
        code="first_stamp",
        title="Misal Explorer",
        description="First stamp",
        icon="Compass",
        required_stamps=1
    )
    db.add(badge1)
    db.commit()

    stamp1 = UserPassportStamp(id=1, user_id=1, shop_id=1)
    db.add(stamp1)
    db.commit()

    try:
        yield db
    finally:
        db.close()
        Base.metadata.drop_all(bind=engine)

@pytest.fixture(scope="function")
def client(db_session):
    """
    TestClient fixture with db_session dependency override.
    """
    def _override_get_db():
        try:
            yield db_session
        finally:
            pass

    app.dependency_overrides[get_db] = _override_get_db
    with TestClient(app) as c:
        yield c
    app.dependency_overrides.clear()
