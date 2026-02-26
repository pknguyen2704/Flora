"""Pydantic models for Group."""
from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


class GroupBase(BaseModel):
    group_number: int = Field(..., ge=1, le=10)
    name: str = Field(..., min_length=1, max_length=100)
    description: str
    color_hex: str = Field(..., pattern="^#[0-9A-Fa-f]{6}$")


class GroupCreate(GroupBase):
    pass


class GroupUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=100)
    description: Optional[str] = None
    color_hex: Optional[str] = Field(None, pattern="^#[0-9A-Fa-f]{6}$")
    is_active: Optional[bool] = None


class GroupResponse(GroupBase):
    id: str
    is_active: bool
    instruction_count: int = 0
    situation_count: int = 0
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True
