def generate_restaurant_schema(shop):
    """
    Generates Schema.org JSON-LD for LocalBusiness/Restaurant rich snippets.
    """
    schema = {
        "@context": "https://schema.org",
        "@type": "Restaurant",
        "name": shop.name,
        "image": shop.main_image_url or "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46",
        "telephone": shop.phone or "+919876543210",
        "address": {
            "@type": "PostalAddress",
            "streetAddress": shop.address,
            "addressLocality": shop.area,
            "addressRegion": "Maharashtra",
            "postalCode": shop.pincode or "422001",
            "addressCountry": "IN"
        },
        "geo": {
            "@type": "GeoCoordinates",
            "latitude": shop.latitude or 20.0059,
            "longitude": shop.longitude or 73.7898
        },
        "url": f"https://nashikmisal.in/misal/{shop.slug}",
        "priceRange": f"₹{int(shop.price_per_plate)}" if shop.price_per_plate else "₹100-₹200",
        "servesCuisine": ["Maharashtrian", "Misal Pav", "Nashik Special"]
    }
    
    if shop.total_reviews > 0 and shop.avg_rating > 0:
        schema["aggregateRating"] = {
            "@type": "AggregateRating",
            "ratingValue": round(shop.avg_rating, 1),
            "reviewCount": shop.total_reviews,
            "bestRating": 5,
            "worstRating": 1
        }
        
    return schema
