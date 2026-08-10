def test_get_activities(client):
    response = client.get("/api/v1/activities/")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) == 2
    slugs = [a["slug"] for a in data]
    assert "ample-parking" in slugs
    assert "chulhivarchi" in slugs
