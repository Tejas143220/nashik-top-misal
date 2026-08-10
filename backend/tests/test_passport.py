def test_get_user_digital_passport(client):
    response = client.get("/api/v1/passport/1")
    assert response.status_code == 200
    data = response.json()
    assert data["user_id"] == 1
    assert data["user_name"] == "Test Foodie"
    assert data["total_stamps"] >= 1
    assert len(data["stamps"]) >= 1
    assert len(data["badges"]) >= 1

def test_stamp_passport_success(client):
    # Stamp user 1 for shop 2
    response = client.post("/api/v1/passport/1/stamp/2")
    assert response.status_code == 200
    data = response.json()
    assert data["user_id"] == 1
    stamped_shop_ids = [s["shop_id"] for s in data["stamps"]]
    assert 2 in stamped_shop_ids

def test_stamp_passport_invalid_shop(client):
    response = client.post("/api/v1/passport/1/stamp/9999")
    assert response.status_code == 404
    assert response.json()["detail"] == "Misal shop not found"

def test_get_or_create_new_user_passport(client):
    # Access passport for a brand new user id
    response = client.get("/api/v1/passport/999")
    assert response.status_code == 200
    data = response.json()
    assert data["user_id"] == 999
    assert data["user_name"] == "Nashik Foodie"
    assert data["total_stamps"] == 0
