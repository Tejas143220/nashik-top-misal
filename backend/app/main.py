from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.v1.api import api_router
from app.db.session import engine
from app.db.base import Base

# Auto-create tables on startup (For seamless quickstart dev)
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    description="Production-ready REST API for Nashik's Best Misal Directory & Review Platform."
)

origins = [
    "http://localhost:5173",
    "http://localhost:3000",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:3000",
    "https://nashik-top-misal-nvcj.vercel.app",
    "https://nashik-top-misal.vercel.app",
]

# Set up CORS middleware with explicit origins & regex for all Vercel previews
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_origin_regex=r"https://.*\.vercel\.app",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix=settings.API_V1_STR)

@app.get("/")
def root():
    return {
        "message": "Welcome to Nashik's Best Misal API",
        "docs": "/docs",
        "version": "1.0.0"
    }
