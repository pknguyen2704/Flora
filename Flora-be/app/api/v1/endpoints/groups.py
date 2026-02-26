"""Groups endpoints."""
from fastapi import APIRouter, Depends, HTTPException, status
from motor.motor_asyncio import AsyncIOMotorDatabase
from app.db.mongodb import get_database
from app.core.dependencies import get_current_user
from app.models.group import GroupResponse
from app.schemas.auth import APIResponse
from typing import List, Dict, Any

router = APIRouter(prefix="/groups", tags=["groups"])


@router.get("", response_model=APIResponse)
async def get_groups(
    current_user: Dict[str, Any] = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """Get all active groups."""
    groups = await db.groups.find({"is_active": True}).sort("group_number", 1).to_list(length=100)
    
    # Convert ObjectId to string
    for group in groups:
        group["id"] = str(group.pop("_id"))
    
    return APIResponse(
        success=True,
        data={"groups": groups}
    )


@router.get("/{group_id}", response_model=APIResponse)
async def get_group(
    group_id: str,
    current_user: Dict[str, Any] = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """Get single group with all its content."""
    from bson import ObjectId
    
    try:
        # Get group
        group = await db.groups.find_one({"_id": ObjectId(group_id), "is_active": True})
        if not group:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Group not found"
            )
        
        # Get instructions
        instructions = await db.instructions.find(
            {"group_id": ObjectId(group_id), "is_active": True}
        ).sort("instruction_number", 1).to_list(length=100)
        
        # Get situations
        situations = await db.situations.find(
            {"group_id": ObjectId(group_id), "is_active": True}
        ).sort("situation_number", 1).to_list(length=100)
        
        # Convert ObjectIds
        group["id"] = str(group.pop("_id"))
        for inst in instructions:
            inst["id"] = str(inst.pop("_id"))
            inst["group_id"] = str(inst["group_id"])
        for sit in situations:
            sit["id"] = str(sit.pop("_id"))
            sit["group_id"] = str(sit["group_id"])
        
        group["instructions"] = instructions
        group["situations"] = situations
        
        return APIResponse(
            success=True,
            data=group
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
