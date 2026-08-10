def test_create_review_success(client):
    payload = {
        "shop_id": 1,
        "reviewer_name": "Priya Sharma",
        "reviewer_email": "priya@example.com",
        "rating": 5,
        "spice_rating": 4,
        "comment": "Absolutely mouth-watering misal with crunchy farsan!",
        "image_url": "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46"
    }
    response = client.post("/api/v1/reviews/", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert data["reviewer_name"] == "Priya Sharma"
    assert data["shop_id"] == 1
    assert data["status"] == "approved"

    # Verify shop rating was updated
    shop_res = client.get("/api/v1/shops/sadhana-chulhivarchi-misal-nashik")
    assert shop_res.status_code == 200
    shop_data = shop_res.json()
    assert shop_data["total_reviews"] == 2
    assert shop_data["avg_rating"] == 5.0

def test_create_review_invalid_shop(client):
    payload = {
        "shop_id": 9999,
        "reviewer_name": "Ghost Foodie",
        "rating": 4,
        "comment": "Nice place if it existed"
    }
    response = client.post("/api/v1/reviews/", json=payload)
    assert response.status_code == 404
    assert response.json()["detail"] == "Misal shop not found"

def test_create_review_validation_error(client):
    # Missing required comment and reviewer_name too short
    payload = {
        "shop_id": 1,
        "reviewer_name": "A",
        "rating": 6
    }
    response = client.post("/api/v1/reviews/", json=payload)
    assert response.status_code == 422
