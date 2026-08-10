def test_root_endpoint(client):
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert "message" in data
    assert data["docs"] == "/docs"

def test_sitemap_xml_endpoint(client):
    response = client.get("/api/v1/seo/sitemap.xml")
    assert response.status_code == 200
    assert response.headers["content-type"].startswith("application/xml")
    content = response.text
    assert "<urlset" in content
    assert "sadhana-chulhivarchi-misal-nashik" in content
