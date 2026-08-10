from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.battle import MisalBattle, BattleVote

router = APIRouter()

class VoteRequest(BaseModel):
    shop_choice: str # "a" or "b"

@router.get("/current")
def get_current_battle(db: Session = Depends(get_db)):
    battle = db.query(MisalBattle).filter(MisalBattle.is_active == 1).order_by(MisalBattle.id.desc()).first()
    
    # Fallback to default state if database table is unseeded
    if not battle:
        return {
            "title": "Chulha Pioneer Battle ⚔️",
            "subtitle": "Which wood-stove misal joint reigns supreme in Nashik?",
            "shop_a": {
                "id": 1,
                "name": "Sadhana Chulhivarchi Misal",
                "slug": "sadhana-chulhivarchi-misal-nashik",
                "area": "Gangapur Road",
                "image_url": "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=600&q=80",
                "votes": 342,
                "pct": 54
            },
            "shop_b": {
                "id": 2,
                "name": "Grape Embassy Misal",
                "slug": "grape-embassy-misal-nashik",
                "area": "Peth Road",
                "image_url": "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=80",
                "votes": 289,
                "pct": 46
            },
            "total_votes": 631,
            "expires_in_days": 3
        }

    total = battle.shop_a_votes + battle.shop_b_votes
    pct_a = round((battle.shop_a_votes / total * 100)) if total > 0 else 50
    pct_b = 100 - pct_a

    return {
        "title": battle.title,
        "subtitle": battle.subtitle,
        "shop_a": {
            "id": 1,
            "name": battle.shop_a_name,
            "slug": battle.shop_a_slug,
            "area": battle.shop_a_area,
            "image_url": battle.shop_a_image_url,
            "votes": battle.shop_a_votes,
            "pct": pct_a
        },
        "shop_b": {
            "id": 2,
            "name": battle.shop_b_name,
            "slug": battle.shop_b_slug,
            "area": battle.shop_b_area,
            "image_url": battle.shop_b_image_url,
            "votes": battle.shop_b_votes,
            "pct": pct_b
        },
        "total_votes": total,
        "expires_in_days": battle.expires_in_days
    }

@router.post("/vote")
def cast_battle_vote(req: VoteRequest, db: Session = Depends(get_db)):
    choice = req.shop_choice.lower()
    if choice not in ["a", "b"]:
        raise HTTPException(status_code=400, detail="Invalid shop choice")

    battle = db.query(MisalBattle).filter(MisalBattle.is_active == 1).order_by(MisalBattle.id.desc()).first()
    if not battle:
        raise HTTPException(status_code=404, detail="No active battle found")

    if choice == "a":
        battle.shop_a_votes += 1
    else:
        battle.shop_b_votes += 1

    vote_log = BattleVote(battle_id=battle.id, shop_choice=choice)
    db.add(vote_log)
    db.commit()
    db.refresh(battle)

    total = battle.shop_a_votes + battle.shop_b_votes
    pct_a = round((battle.shop_a_votes / total * 100)) if total > 0 else 50
    pct_b = 100 - pct_a

    return {
        "status": "success",
        "message": "Vote recorded successfully in database!",
        "voted_for": choice,
        "total_votes": total,
        "pct_a": pct_a,
        "pct_b": pct_b
    }
