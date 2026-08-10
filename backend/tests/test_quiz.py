def test_quiz_recommendation(client):
    payload = {
        "spice_preference": 4,
        "cooking_style": "chulhivarchi",
        "area": "Gangapur Road"
    }
    response = client.post("/api/v1/quiz/recommend", json=payload)
    assert response.status_code == 200
    recommendations = response.json()
    assert isinstance(recommendations, list)
    assert len(recommendations) > 0
    top_recommendation = recommendations[0]
    assert "match_percentage" in top_recommendation
    assert "shop" in top_recommendation
    assert top_recommendation["shop"]["slug"] == "sadhana-chulhivarchi-misal-nashik"
