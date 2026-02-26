"""User settings request/response schemas."""
from pydantic import BaseModel, Field, EmailStr
from typing import Optional


class UpdateProfileRequest(BaseModel):
    full_name: Optional[str] = Field(None, min_length=1, max_length=100)
    email: Optional[EmailStr] = None


class ChangePasswordRequest(BaseModel):
    current_password: str = Field(..., min_length=6)
    new_password: str = Field(..., min_length=6)


class UpdatePreferencesRequest(BaseModel):
    language: Optional[str] = Field(None, pattern="^(en|vi)$")
    email_notifications: Optional[bool] = None
    pronunciation_reminders: Optional[bool] = None
