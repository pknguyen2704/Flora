"""Authentication endpoints."""
from fastapi import APIRouter, Depends, HTTPException, status
from motor.motor_asyncio import AsyncIOMotorDatabase
from app.db.mongodb import get_database
from app.schemas.auth import LoginRequest, TokenResponse, RefreshTokenRequest, RefreshTokenResponse, APIResponse
from app.core.security import verify_password, create_access_token, create_refresh_token, decode_token, hash_password
from app.core.config import settings
from app.core.dependencies import get_current_user
from app.models.user import UserResponse
from datetime import datetime, timedelta, timezone
from bson import ObjectId
from app.schemas.settings import (
    UpdateProfileRequest,
    ChangePasswordRequest,
    UpdatePreferencesRequest,
)

router = APIRouter(prefix="/auth", tags=["authentication"])


@router.post("/login", response_model=APIResponse)
async def login(
    credentials: LoginRequest,
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """User login endpoint."""
    # Find user
    user = await db.users.find_one({"username": credentials.username})
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid username or password"
        )
    
    # Verify password
    if not verify_password(credentials.password, user["password_hash"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid username or password"
        )
    
    # Check if user is active
    if not user.get("is_active", True):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User account is inactive"
        )
    
    # Create tokens
    token_data = {
        "sub": str(user["_id"]),
        "username": user["username"],
        "role": user["role"],
        "full_name": user["full_name"]
    }
    
    access_token = create_access_token(token_data)
    refresh_token = create_refresh_token(token_data)
    
    # Update last login
    await db.users.update_one(
        {"_id": user["_id"]},
        {"$set": {"last_login": datetime.now(timezone.utc)}}
    )
    
    # Prepare user response
    user_response = UserResponse(
        id=str(user["_id"]),
        username=user["username"],
        email=user.get("email"),
        full_name=user["full_name"],
        role=user["role"],
        is_active=user["is_active"],
        created_at=user["created_at"],
        last_login=datetime.now(timezone.utc),
        stats=user.get("stats", {})
    )
    
    return APIResponse(
        success=True,
        data={
            "access_token": access_token,
            "refresh_token": refresh_token,
            "token_type": "bearer",
            "expires_in": settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
            "user": user_response.dict()
        },
        message="Login successful"
    )


@router.post("/refresh", response_model=APIResponse)
async def refresh_token(
    request: RefreshTokenRequest,
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """Refresh access token."""
    try:
        payload = decode_token(request.refresh_token)
        
        # Verify it's a refresh token
        if payload.get("type") != "refresh":
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid refresh token"
            )
        
        user_id = payload.get("sub")
        user = await db.users.find_one({"_id": ObjectId(user_id)})
        
        if not user or not user.get("is_active"):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="User not found or inactive"
            )
        
        # Create new access token
        token_data = {
            "sub": str(user["_id"]),
            "username": user["username"],
            "role": user["role"]
        }
        
        new_access_token = create_access_token(token_data)
        
        return APIResponse(
            success=True,
            data={
                "access_token": new_access_token,
                "expires_in": settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60
            },
            message="Token refreshed"
        )
        
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=str(e)
        )


@router.post("/logout", response_model=APIResponse)
async def logout():
    """User logout endpoint."""
    # In a stateless JWT system, logout is handled client-side
    # by removing the token. This endpoint exists for consistency.
    return APIResponse(
        success=True,
        message="Logged out successfully"
    )


@router.put("/profile", response_model=APIResponse)
async def update_profile(
    profile_data: UpdateProfileRequest,
    db: AsyncIOMotorDatabase = Depends(get_database),
    current_user: dict = Depends(get_current_user)
):
    """Update user profile information."""
    update_data = {}
    if profile_data.full_name:
        update_data["full_name"] = profile_data.full_name
    if profile_data.email:
        # Check if email is already taken by another user
        existing_user = await db.users.find_one({
            "email": profile_data.email,
            "_id": {"$ne": ObjectId(current_user["id"])}
        })
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already in use"
            )
        update_data["email"] = profile_data.email
    
    if not update_data:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No data to update"
        )
    
    # Update user
    result = await db.users.update_one(
        {"_id": ObjectId(current_user["_id"])},
        {"$set": update_data}
    )
    
    if result.modified_count == 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Profile update failed"
        )
    
    # Get updated user
    updated_user = await db.users.find_one({"_id": ObjectId(current_user["_id"])})
    
    user_response = UserResponse(
        id=str(updated_user["_id"]),
        username=updated_user["username"],
        email=updated_user.get("email"),
        full_name=updated_user["full_name"],
        role=updated_user["role"],
        is_active=updated_user["is_active"],
        created_at=updated_user["created_at"],
        last_login=updated_user.get("last_login"),
        stats=updated_user.get("stats", {})
    )
    
    return APIResponse(
        success=True,
        data={"user": user_response.dict()},
        message="Profile updated successfully"
    )


@router.put("/password", response_model=APIResponse)
async def change_password(
    password_data: ChangePasswordRequest,
    db: AsyncIOMotorDatabase = Depends(get_database),
    current_user: dict = Depends(get_current_user)
):
    """Change user password."""
    # Get user from database
    user = await db.users.find_one({"_id": ObjectId(current_user["_id"])})
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    # Verify current password
    if not verify_password(password_data.current_password, user["password_hash"]):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Current password is incorrect"
        )
    
    # Hash new password
    new_password_hash = hash_password(password_data.new_password)
    
    # Update password
    result = await db.users.update_one(
        {"_id": ObjectId(current_user["_id"])},
        {"$set": {"password_hash": new_password_hash}}
    )
    
    if result.modified_count == 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Password change failed"
        )
    
    return APIResponse(
        success=True,
        message="Password changed successfully"
    )


@router.put("/preferences", response_model=APIResponse)
async def update_preferences(
    preferences_data: UpdatePreferencesRequest,
    db: AsyncIOMotorDatabase = Depends(get_database),
    current_user: dict = Depends(get_current_user)
):
    """Update user preferences."""
    # Get current preferences
    user = await db.users.find_one({"_id": ObjectId(current_user["_id"])})
    current_preferences = user.get("preferences", {})
    
    # Update preferences
    if preferences_data.language is not None:
        current_preferences["language"] = preferences_data.language
    if preferences_data.email_notifications is not None:
        current_preferences["email_notifications"] = preferences_data.email_notifications
    if preferences_data.pronunciation_reminders is not None:
        current_preferences["pronunciation_reminders"] = preferences_data.pronunciation_reminders
    
    # Save to database
    result = await db.users.update_one(
        {"_id": ObjectId(current_user["_id"])},
        {"$set": {"preferences": current_preferences}}
    )
    
    if result.modified_count == 0 and not user.get("preferences"):
        # First time setting preferences
        await db.users.update_one(
            {"_id": ObjectId(current_user["_id"])},
            {"$set": {"preferences": current_preferences}}
        )
    
    return APIResponse(
        success=True,
        data={"preferences": current_preferences},
        message="Preferences updated successfully"
    )
