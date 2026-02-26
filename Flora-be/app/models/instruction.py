"""Pydantic models for Instruction."""
from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime


class InstructionBase(BaseModel):
    text: str = Field(..., min_length=1, max_length=500)
    phonetic_focus: List[str] = []


class InstructionCreate(InstructionBase):
    group_id: str
    instruction_number: int = Field(..., ge=1, le=20)
    audio_url: Optional[str] = None


class InstructionResponse(InstructionBase):
    id: str
    group_id: str
    instruction_number: int
    audio_url: Optional[str] = None
    created_at: datetime
    is_active: bool
    
    # User-specific stats (added when fetching for a user)
    user_stats: Optional[dict] = None
    
    class Config:
        from_attributes = True
