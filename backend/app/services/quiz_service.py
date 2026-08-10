from typing import List
from sqlalchemy.orm import Session
from app.models.shop import MisalShop
from app.schemas.quiz import QuizRequest, QuizRecommendationOut
from app.schemas.shop import MisalShopCardOut

def recommend_misal(db: Session, quiz: QuizRequest) -> List[QuizRecommendationOut]:
    shops = db.query(MisalShop).filter(MisalShop.is_active == True).all()
    recommendations = []

    for shop in shops:
        score = 0
        max_score = 100
        reasons = []

        # Spice Level Match (Weight 40 points)
        spice_diff = abs(shop.spicy_level - quiz.spice_preference)
        if spice_diff == 0:
            score += 40
            reasons.append("Exact spice level match!")
        elif spice_diff == 1:
            score += 25
            reasons.append("Close spice level match")
        else:
            score += 10

        # Cooking Style (Weight 25 points)
        if quiz.cooking_style == "chulhivarchi" and shop.is_chulhivarchi:
            score += 25
            reasons.append("Authentic wood-stove (Chulhivarchi) cooking")
        elif quiz.cooking_style != "chulhivarchi":
            score += 20

        # Area / Location Preference (Weight 20 points)
        if quiz.area and shop.area.lower() == quiz.area.lower():
            score += 20
            reasons.append(f"Located in your preferred area ({shop.area})")
        else:
            score += 10

        # Sweets pairing or rating boost (Weight 15 points)
        if shop.avg_rating >= 4.5:
            score += 15
            reasons.append("Highly rated by Nashik foodies")

        match_pct = min(100, max(50, score))
        recommendations.append(
            QuizRecommendationOut(
                match_percentage=match_pct,
                reason=" • ".join(reasons[:2]),
                shop=MisalShopCardOut.model_validate(shop)
            )
        )

    # Sort by match percentage descending
    recommendations.sort(key=lambda r: r.match_percentage, reverse=True)
    return recommendations[:3]
