"""Pronunciation endpoints."""
from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form
from motor.motor_asyncio import AsyncIOMotorDatabase
from app.db.mongodb import get_database
from app.core.dependencies import get_current_user
from app.schemas.auth import APIResponse
from app.schemas.pronunciation import PronunciationAssessResponse, Assessment, PronunciationError
from typing import Dict, Any, Optional
from bson import ObjectId
from datetime import datetime, timezone, timedelta
import time
import random
from collections import Counter
from fastapi import Request
router = APIRouter(prefix="/pronunciation", tags=["pronunciation"])


@router.get("/instructions/{group_id}", response_model=APIResponse)
async def get_instructions(
    group_id: str,
    current_user: Dict[str, Any] = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """Get all instructions for a group with user stats."""
    try:
        # Get instructions
        instructions = await db.instructions.find(
            {"group_id": ObjectId(group_id), "is_active": True}
        ).sort("instruction_number", 1).to_list(length=100)
        
        # Get user's attempt stats for each instruction
        for inst in instructions:
            inst["id"] = str(inst.pop("_id"))
            inst["group_id"] = str(inst["group_id"])
            
            # Get user stats
            attempts = await db.pronunciation_attempts.find({
                "user_id": ObjectId(current_user["_id"]),
                "instruction_id": ObjectId(inst["id"])
            }).to_list(length=1000)
            
            if attempts:
                scores = [a["assessment"]["total_score"] for a in attempts if a["assessment"].get("total_score") is not None]
                inst["user_stats"] = {
                    "attempts_count": len(attempts),
                    "best_score": max(scores) if scores else None,
                    "worst_score": min(scores) if scores else None,
                    "last_attempt_date": max(a["created_at"] for a in attempts).isoformat() + "Z"
                }
            else:
                inst["user_stats"] = {
                    "attempts_count": 0,
                    "best_score": None,
                    "worst_score": None,
                    "last_attempt_date": None
                }
        
        # Get group info
        group = await db.groups.find_one({"_id": ObjectId(group_id)})
        
        return APIResponse(
            success=True,
            data={
                "group_id": group_id,
                "group_name": group["name"] if group else "",
                "instructions": instructions
            }
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )

import traceback
@router.post("/assess", response_model=APIResponse)
async def assess_pronunciation(
    request: Request,
    audio_file: UploadFile = File(...),
    instruction_id: Optional[str] = Form(None),
    custom_text: Optional[str] = Form(None),
    session_id: str = Form(...),
    current_user: Dict[str, Any] = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """Assess pronunciation from audio file."""
    start_time = time.time()
    
    try:
        # Validate input
        if not instruction_id and not custom_text:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Either instruction_id or custom_text must be provided"
            )
        
        # Get target text
        if instruction_id and instruction_id != "null" and len(instruction_id) >= 12:
            try:
                instruction = await db.instructions.find_one({"_id": ObjectId(instruction_id)})
            except Exception:
                instruction = None
                
            if not instruction:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail=f"Instruction {instruction_id} not found"
                )
            target_text = instruction["text"]
            group_id = instruction["group_id"]
        else:
            target_text = custom_text
            group_id = None
        
        # Read audio file
        audio_data = await audio_file.read()
        
        # Save to temporary file for Whisper and MFA processing
        import tempfile
        import os
        
        with tempfile.NamedTemporaryFile(delete=False, suffix=".wav", mode="wb") as tmp_audio:
            tmp_audio.write(audio_data)
            tmp_audio.flush()
            tmp_audio_path = tmp_audio.name
            
        try:
            # Use Rule-based Engine (Whisper + MFA)
            engine = getattr(request.app.state, "pronunciation_engine", None)
            if not engine:
                raise HTTPException(
                    status_code=503,
                    detail="Pronunciation engine is still preloading. Please wait a moment and try again."
                )

            assessment_result = await engine.assess(
                audio_path=tmp_audio_path,
                target_text=target_text
            )
                
            if assessment_result.get("total_score") == 0 and not assessment_result.get("asr_transcript"):
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Could not transcribe audio. Please ensure you spoke clearly and try again."
                )
                
        finally:
            if os.path.exists(tmp_audio_path):
                os.remove(tmp_audio_path)
        
        # Calculate processing time
        processing_time = int((time.time() - start_time) * 1000)
        assessment_result["processing_time_ms"] = processing_time
        
        # Save audio file (simplified - in production use proper storage)
        # audio_filename = f"user{current_user['_id']}_{int(time.time())}.wav"
        # Save to disk or cloud storage
        
        # Count attempts for this instruction
        attempt_count = await db.pronunciation_attempts.count_documents({
            "user_id": ObjectId(current_user["_id"]),
            "instruction_id": ObjectId(instruction_id) if instruction_id else None,
            "custom_text": custom_text if custom_text else None
        }) + 1
        
        # Save attempt to database
        attempt_doc = {
            "user_id": ObjectId(current_user["_id"]),
            "instruction_id": ObjectId(instruction_id) if instruction_id else None,
            "custom_text": custom_text,
            "group_id": group_id,
            "audio_file_path": "",  # Placeholder
            "audio_duration_seconds": 0,  # Placeholder
            "assessment": assessment_result,
            "attempt_number": attempt_count,
            "created_at": datetime.now(timezone.utc),
            "session_id": session_id
        }
        
        result = await db.pronunciation_attempts.insert_one(attempt_doc)
        attempt_id = str(result.inserted_id)
        
        # Update user stats
        await db.users.update_one(
            {"_id": ObjectId(current_user["_id"])},
            {
                "$inc": {"stats.total_pronunciation_attempts": 1},
                "$set": {"updated_at": datetime.now(timezone.utc)}
            }
        )
        
        # Get updated user stats for this instruction
        all_attempts = await db.pronunciation_attempts.find({
            "user_id": ObjectId(current_user["_id"]),
            "instruction_id": ObjectId(instruction_id) if instruction_id else None
        }).to_list(length=1000)
        
        scores = [a["assessment"]["total_score"] for a in all_attempts if a["assessment"].get("total_score") is not None]
        user_stats = {
            "attempts_count": len(all_attempts),
            "best_score": max(scores) if scores else None,
            "worst_score": min(scores) if scores else None
        }
        
        return APIResponse(
            success=True,
            data={
                "attempt_id": attempt_id,
                "assessment": assessment_result,
                "user_stats": user_stats
            }
        )
        
    except HTTPException:
        raise
    except Exception as e:
        traceback.print_exc()

        raise HTTPException(
            status_code=500,
            detail=str(e)
    )


from typing import Optional
