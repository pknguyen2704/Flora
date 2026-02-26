"""Authentication request/response schemas."""
from pydantic import BaseModel, Field
from app.models.user import UserResponse


class LoginRequest(BaseModel):
    username: str = Field(..., min_length=3)
    password: str = Field(..., min_length=5)


class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    expires_in: int
    user: UserResponse


class RefreshTokenRequest(BaseModel):
    refresh_token: str


class RefreshTokenResponse(BaseModel):
    access_token: str
    expires_in: int


class APIResponse(BaseModel):
    success: bool
    data: dict = None
    message: str = ""
    
    class Config:
        from_attributes = True
