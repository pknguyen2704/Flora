"""Pronunciation endpoints."""
from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form
from motor.motor_asyncio import AsyncIOMotorDatabase
from app.db.mongodb import get_database
from app.core.dependencies import get_current_user
from app.schemas.auth import APIResponse
from app.schemas.pronunciation import PronunciationAssessResponse, Assessment, PronunciationError
from app.services.ai_scorer import gemini_scorer
from typing import Dict, Any, Optional
from bson import ObjectId
from datetime import datetime
import time

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


@router.post("/assess", response_model=APIResponse)
async def assess_pronunciation(
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
        if instruction_id:
            instruction = await db.instructions.find_one({"_id": ObjectId(instruction_id)})
            if not instruction:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Instruction not found"
                )
            target_text = instruction["text"]
            group_id = instruction["group_id"]
        else:
            target_text = custom_text
            group_id = None
        
        # Read audio file
        audio_data = await audio_file.read()
        
        # Transcribe audio using Gemini
        try:
            from app.services.speech_to_text import speech_service
            transcript = await speech_service.transcribe_audio(audio_data)
        except Exception as e:
            print(f"Speech-to-text error: {str(e)}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Speech transcription failed: {str(e)}"
            )
        
        if not transcript:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Could not transcribe audio. Please ensure you spoke clearly and try again."
            )
        
        # Get penalty configuration
        config_doc = await db.admin_config.find_one({"config_key": "pronunciation_penalties"})
        penalty_config = config_doc["config_value"] if config_doc else {
            "wrong_word": {"mild": 5, "moderate": 10, "severe": 20},
            "missing_word": {"mild": 5, "moderate": 10, "severe": 15},
            "phoneme_error": {"mild": 3, "moderate": 7, "severe": 15},
            "ending_sound": {"mild": 3, "moderate": 5, "severe": 10},
            "clarity_speed": {"mild": 2, "moderate": 5, "severe": 10}
        }
        
        # Use Gemini to assess
        assessment_result = await gemini_scorer.assess_pronunciation(
            audio_transcript=transcript,
            target_text=target_text,
            penalty_config=penalty_config
        )
        
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
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Assessment failed: {str(e)}"
        )


@router.get("/recommendations", response_model=APIResponse)
async def get_recommendations(
    group_id: Optional[str] = None,
    limit: int = 5,
    current_user: Dict[str, Any] = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """Get recommended instructions based on error history."""
    try:
        # Get user's recent errors
        recent_attempts = await db.pronunciation_attempts.find({
            "user_id": ObjectId(current_user["_id"])
        }).sort("created_at", -1).limit(20).to_list(length=20)
        
        # Count error types
        error_counts = {}
        for attempt in recent_attempts:
            for error in attempt.get("assessment", {}).get("errors", []):
                error_type = error.get("error_type", "")
                error_counts[error_type] = error_counts.get(error_type, 0) + 1
        
        # Get instructions matching error types (simplified recommendation)
        query = {"is_active": True}
        if group_id:
            query["group_id"] = ObjectId(group_id)
        
        all_instructions = await db.instructions.find(query).to_list(length=100)
        
        # Simple scoring: prefer instructions user hasn't practiced much
        recommendations = []
        for inst in all_instructions[:limit]:
            inst["id"] = str(inst.pop("_id"))
            inst["group_id"] = str(inst["group_id"])
            
            # Check if user has practiced this
            attempt_count = await db.pronunciation_attempts.count_documents({
                "user_id": ObjectId(current_user["_id"]),
                "instruction_id": ObjectId(inst["id"])
            })
            
            recommendations.append({
                "instruction_id": inst["id"],
                "text": inst["text"],
                "reason": "Practice this to improve your pronunciation",
                "priority_score": 10 - attempt_count  # Higher priority for less practiced
            })
        
        # Sort by priority
        recommendations.sort(key=lambda x: x["priority_score"], reverse=True)
        
        return APIResponse(
            success=True,
            data={"recommendations": recommendations[:limit]}
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )


from typing import Optional
