"""Pydantic models for Situation."""
from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime


class ChoiceBase(BaseModel):
    choice_id: str
    text: str = Field(..., min_length=1, max_length=500)
    rating: str = Field(..., pattern="^(best|acceptable|not_recommended)$")


class SituationBase(BaseModel):
    situation_number: int = Field(..., ge=1)
    title: Optional[str] = Field(None, max_length=100)
    question: str = Field(..., min_length=1, max_length=1000)
    best_choice_id: str = Field(..., pattern="^[A-C]$")
    detailed_explanation: Optional[str] = Field(None, min_length=1, max_length=2000)
    choices: List[ChoiceBase]


class SituationCreate(SituationBase):
    group_id: str


class SituationUpdate(BaseModel):
    situation_number: Optional[int] = Field(None, ge=1)
    title: Optional[str] = Field(None, min_length=1, max_length=100)
    question: Optional[str] = Field(None, min_length=1, max_length=1000)
    best_choice_id: Optional[str] = Field(None, pattern="^[A-C]$")
    detailed_explanation: Optional[str] = Field(None, min_length=1, max_length=2000)
    choices: Optional[List[ChoiceBase]] = None
    is_active: Optional[bool] = None


class SituationResponse(SituationBase):
    id: str
    group_id: str
    created_at: datetime
    is_active: bool

    class Config:
        from_attributes = True
