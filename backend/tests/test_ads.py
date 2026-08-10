def test_get_ad_for_existing_slot(client):
    response = client.get("/api/v1/ads/slot/directory_sidebar")
    assert response.status_code == 200
    data = response.json()
    assert data is not None
    assert data["slot_name"] == "directory_sidebar"
    assert data["title"] == "Sample Banner Ad"

def test_get_ad_for_non_existent_slot(client):
    response = client.get("/api/v1/ads/slot/non_existent_slot")
    assert response.status_code == 200
    data = response.json()
    assert data is None
