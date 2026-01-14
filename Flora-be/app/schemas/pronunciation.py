"""Pronunciation request/response schemas."""
from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime


class PronunciationError(BaseModel):
    word_index: int
    word: str
    error_type: str
    severity: str
    penalty: int
    message: str


class Assessment(BaseModel):
    total_score: Optional[int]
    errors: List[PronunciationError]
    asr_transcript: str
    suggestions: List[str]
    overall_feedback: Optional[str] = ""
    processing_time_ms: Optional[int] = None


class PronunciationAssessResponse(BaseModel):
    attempt_id: str
    assessment: Assessment
    user_stats: Dict[str, Any]


class PronunciationStatsResponse(BaseModel):
    instruction_id: str
    instruction_text: str
    attempts_count: int
    best_score: Optional[int]
    worst_score: Optional[int]
    average_score: Optional[float]
    last_attempt_date: Optional[datetime]
    
    class Config:
        from_attributes = True
