from fastapi import APIRouter
from app.api.v1.endpoints import shops, reviews, activities, ads, seo, passport, quiz, sponsorship, battle, coupons, contest, trail, share, merchant, queue

api_router = APIRouter()

api_router.include_router(shops.router, prefix="/shops", tags=["shops"])
api_router.include_router(reviews.router, prefix="/reviews", tags=["reviews"])
api_router.include_router(activities.router, prefix="/activities", tags=["activities"])
api_router.include_router(ads.router, prefix="/ads", tags=["ads"])
api_router.include_router(seo.router, prefix="/seo", tags=["seo"])
api_router.include_router(passport.router, prefix="/passport", tags=["passport"])
api_router.include_router(quiz.router, prefix="/quiz", tags=["quiz"])
api_router.include_router(sponsorship.router, prefix="/sponsorship", tags=["sponsorship"])
api_router.include_router(battle.router, prefix="/battle", tags=["battle"])
api_router.include_router(coupons.router, prefix="/coupons", tags=["coupons"])
api_router.include_router(contest.router, prefix="/contest", tags=["contest"])
api_router.include_router(trail.router, prefix="/trail", tags=["trail"])
api_router.include_router(share.router, prefix="/share", tags=["share"])
api_router.include_router(merchant.router, prefix="/merchant", tags=["merchant"])
api_router.include_router(queue.router, prefix="/queue", tags=["queue"])
