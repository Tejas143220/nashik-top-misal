from fastapi import APIRouter, Depends, Response
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.shop import MisalShop

router = APIRouter()

@router.get("/sitemap.xml", response_class=Response)
def get_sitemap_xml(db: Session = Depends(get_db)):
    shops = db.query(MisalShop).filter(MisalShop.is_active == True).all()
    
    xml_content = '<?xml version="1.0" encoding="UTF-8"?>\n'
    xml_content += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
    
    # Static primary pages
    static_pages = [
        ("https://nashikmisal.in/", "1.0", "daily"),
        ("https://nashikmisal.in/directory", "0.9", "daily"),
        ("https://nashikmisal.in/submit-shop", "0.6", "monthly")
    ]
    
    for url, priority, changefreq in static_pages:
        xml_content += f"  <url>\n    <loc>{url}</loc>\n    <changefreq>{changefreq}</changefreq>\n    <priority>{priority}</priority>\n  </url>\n"

    # Dynamic Misal Shop Detail Pages
    for shop in shops:
        xml_content += f"  <url>\n    <loc>https://nashikmisal.in/misal/{shop.slug}</loc>\n    <changefreq>weekly</changefreq>\n    <priority>0.8</priority>\n  </url>\n"

    xml_content += '</urlset>'
    
    return Response(content=xml_content, media_type="application/xml")
