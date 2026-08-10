import os
from typing import List, Union
from pydantic import AnyHttpUrl
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "Nashik's Best Misal Directory API"
    API_V1_STR: str = "/api/v1"
    
    # Database Configuration (Default SQLite for instant zero-config dev, easily overridden by env var)
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL", 
        "sqlite:///./nashik_misal.db"
    )
    
    # CORS Origins
    BACKEND_CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:3000",
    ]

    class Config:
        case_sensitive = True
        env_file = ".env"

settings = Settings()
