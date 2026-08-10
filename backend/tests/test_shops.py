def test_read_shops_default(client):
    response = client.get("/api/v1/shops/")
    assert response.status_code == 200
    data = response.json()
    assert "items" in data
    assert "total" in data
    assert data["total"] == 2
    assert len(data["items"]) == 2
    # Check that sponsored Platinum shop is returned first
    assert data["items"][0]["slug"] == "sadhana-chulhivarchi-misal-nashik"

def test_read_shops_search_filter(client):
    response = client.get("/api/v1/shops/?search=Shamsundar")
    assert response.status_code == 200
    data = response.json()
    assert data["total"] == 1
    assert data["items"][0]["name"] == "Shamsundar Misal"

def test_read_shops_area_filter(client):
    response = client.get("/api/v1/shops/?area=Panchavati")
    assert response.status_code == 200
    data = response.json()
    assert data["total"] == 1
    assert data["items"][0]["area"] == "Panchavati"

def test_read_shops_spice_filter(client):
    response = client.get("/api/v1/shops/?spicy_level=5")
    assert response.status_code == 200
    data = response.json()
    assert data["total"] == 1
    assert data["items"][0]["spicy_level"] == 5

def test_read_shops_chulhivarchi_filter(client):
    response = client.get("/api/v1/shops/?is_chulhivarchi=true")
    assert response.status_code == 200
    data = response.json()
    assert data["total"] == 1
    assert data["items"][0]["is_chulhivarchi"] is True

def test_read_shops_activity_filter(client):
    response = client.get("/api/v1/shops/?activity_slug=chulhivarchi")
    assert response.status_code == 200
    data = response.json()
    assert data["total"] == 1
    assert data["items"][0]["slug"] == "sadhana-chulhivarchi-misal-nashik"

def test_read_shops_sorting(client):
    # Test price_asc sorting
    res_asc = client.get("/api/v1/shops/?sort_by=price_asc")
    assert res_asc.status_code == 200
    items = res_asc.json()["items"]
    # Both items present, non-sponsored/price sort check
    prices = [i["price_per_plate"] for i in items if i["price_per_plate"] is not None]
    assert prices == sorted(prices)

def test_read_popular_areas(client):
    response = client.get("/api/v1/shops/areas")
    assert response.status_code == 200
    areas = response.json()
    assert isinstance(areas, list)
    assert "Gangapur Road" in areas
    assert "Panchavati" in areas

def test_read_shop_detail_success(client):
    response = client.get("/api/v1/shops/sadhana-chulhivarchi-misal-nashik")
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "Sadhana Chulhivarchi Misal"
    assert len(data["reviews"]) == 1
    assert data["reviews"][0]["reviewer_name"] == "Amit D"

def test_read_shop_detail_not_found(client):
    response = client.get("/api/v1/shops/non-existent-misal-shop")
    assert response.status_code == 404
    assert response.json()["detail"] == "Misal shop not found"

def test_read_shop_schema_success(client):
    response = client.get("/api/v1/shops/sadhana-chulhivarchi-misal-nashik/schema")
    assert response.status_code == 200
    schema = response.json()
    assert schema["@type"] == "Restaurant"
    assert schema["name"] == "Sadhana Chulhivarchi Misal"
    assert "aggregateRating" in schema

def test_read_shop_schema_not_found(client):
    response = client.get("/api/v1/shops/unknown-shop/schema")
    assert response.status_code == 404

def test_create_misal_shop_auto_slug(client):
    payload = {
        "name": "Mamacha Wada Misal",
        "tagline": "Spicy authentic Maharashtrian misal",
        "description": "Great ambiance and delicious food.",
        "address": "Indira Nagar, Nashik",
        "area": "Indira Nagar",
        "spicy_level": 4,
        "is_chulhivarchi": True,
        "price_per_plate": 120.0
    }
    response = client.post("/api/v1/shops/", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert data["name"] == "Mamacha Wada Misal"
    assert data["slug"] == "mamacha-wada-misal-indira-nagar"
    assert data["area"] == "Indira Nagar"
