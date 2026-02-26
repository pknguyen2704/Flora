"""Pydantic models for User."""
from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime


class UserStats(BaseModel):
    total_pronunciation_attempts: int = 0
    total_situation_attempts: int = 0
    average_pronunciation_score: float = 0.0
    total_study_time_minutes: int = 0


class UserBase(BaseModel):
    username: str = Field(..., min_length=3, max_length=50)
    email: str = Field(..., pattern=r'^[^@]+@[^@]+\.[^@]+$')  # Simple email pattern
    full_name: Optional[str] = Field(None, max_length=100)
    role: str = Field(..., pattern="^(user|student|admin)$")


class UserCreate(UserBase):
    password: str = Field(..., min_length=6)


class UserUpdate(BaseModel):
    email: Optional[str] = Field(None, pattern=r'^[^@]+@[^@]+\.[^@]+$')
    full_name: Optional[str] = Field(None, min_length=1, max_length=100)
    is_active: Optional[bool] = None
    role: Optional[str] = Field(None, pattern="^(user|student|admin)$")


class UserInDB(UserBase):
    id: str
    password_hash: str
    is_active: bool = True
    created_at: datetime
    updated_at: Optional[datetime] = None
    last_login: Optional[datetime] = None
    stats: UserStats = UserStats()
    
    class Config:
        from_attributes = True


class UserResponse(UserBase):
    id: str
    is_active: bool
    created_at: datetime
    last_login: Optional[datetime] = None
    stats: UserStats
    
    class Config:
        from_attributes = True
