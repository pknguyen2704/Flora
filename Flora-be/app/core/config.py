"""Core configuration settings."""
from pydantic_settings import BaseSettings
from typing import List


class Settings(BaseSettings):
    # App
    APP_NAME: str = "Flora"
    DEBUG: bool = True
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    
    # Database
    MONGODB_URL: str
    MONGODB_DB_NAME: str = "flora_db"
    
    # AI
    GEMINI_API_KEY: str
    GEMINI_MODEL: str = "gemini-1.5-pro"
    
    # JWT
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 15
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    
    # CORS
    CORS_ORIGINS: str = "http://localhost:5173,http://localhost:3000"
    
    # Storage
    AUDIO_STORAGE_PATH: str = "./app/static/audio"
    MAX_AUDIO_FILE_SIZE: int = 10485760  # 10MB
    
    @property
    def cors_origins_list(self) -> List[str]:
        return [origin.strip() for origin in self.CORS_ORIGINS.split(",")]
    
    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()
