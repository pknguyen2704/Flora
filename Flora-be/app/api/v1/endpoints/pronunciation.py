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
from datetime import datetime, timezone, timedelta
import time
import random
from collections import Counter

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
        
        # Save to temporary file for Whisper and MFA processing
        import tempfile
        import os
        from app.services.mfa_scorer import rule_engine
        
        with tempfile.NamedTemporaryFile(delete=False, suffix=".wav", mode="wb") as tmp_audio:
            tmp_audio.write(audio_data)
            tmp_audio.flush()
            tmp_audio_path = tmp_audio.name
            
        try:
            # Use new Rule-based Engine (Whisper + MFA)
            assessment_result = await rule_engine.assess_pronunciation(
                audio_file_path=tmp_audio_path,
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
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Assessment failed: {str(e)}"
        )


@router.get("/recommendations", response_model=APIResponse)
async def get_recommendations(
    group_id: Optional[str] = None,
    exclude_instruction_id: Optional[str] = None,
    limit: int = 5,
    current_user: Dict[str, Any] = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """Get recommended instructions based on error history."""
    try:
        # 1. Get user's recent errors (last 50 attempts for better history)
        recent_attempts = await db.pronunciation_attempts.find({
            "user_id": ObjectId(current_user["_id"])
        }).sort("created_at", -1).to_list(length=50)
        
        # 2. Extract words and error types they struggle with
        missed_words = []
        error_types = []
        for attempt in recent_attempts:
            errors = attempt.get("assessment", {}).get("errors", [])
            for error in errors:
                word = error.get("word", "").lower().strip()
                if word and word != "all":  # Exclude generic "all" errors
                    missed_words.append(word)
                error_types.append(error.get("error_type", ""))
        
        word_counts = Counter(missed_words)
        common_missed_words = [word for word, count in word_counts.most_common(10)]
        
        # 3. Get potential instructions
        query = {"is_active": True}
        if group_id:
            query["group_id"] = ObjectId(group_id)
        
        # Exclude the just-practiced instruction
        if exclude_instruction_id:
            query["_id"] = {"$ne": ObjectId(exclude_instruction_id)}
        
        all_instructions = await db.instructions.find(query).to_list(length=200)
        
        # 4. Score each instruction based on relevance to user's history
        scored_instructions = []
        for inst in all_instructions:
            inst_text = inst["text"].lower()
            score = 0
            matched_words = []
            
            # Higher bonus for same group if group_id is specified
            if group_id and str(inst["group_id"]) == group_id:
                score += 20  # Strong preference for same group
            
            # Bonus for containing missed words
            for word in common_missed_words:
                if word in inst_text:
                    word_score = 5 * word_counts[word]  # More missed = higher priority
                    score += word_score
                    matched_words.append(word)
            
            # Check if user has practiced this (prefer less practiced or poorly performed)
            attempts = await db.pronunciation_attempts.find({
                "user_id": ObjectId(current_user["_id"]),
                "instruction_id": inst["_id"]
            }).to_list(length=100)
            
            if not attempts:
                score += 10  # New material is good
            else:
                best_score = max([a["assessment"].get("total_score", 0) for a in attempts])
                if best_score < 70:
                    score += 15  # Struggling with this one
                elif best_score < 90:
                    score += 5   # Can improve
            
            # Add some randomness to avoid staleness
            score += random.uniform(0, 5)
            
            # Generate detailed reason
            if matched_words:
                words_str = ", ".join([f"'{w}'" for w in matched_words[:3]])  # Show max 3 words
                reason = f"Contains words you often mispronounce: {words_str}"
            elif not attempts:
                reason = "New practice material for you"
            elif best_score < 70:
                reason = "You can improve on this one"
            else:
                reason = "Recommended to strengthen your skills"
            
            scored_instructions.append({
                "instruction_id": str(inst["_id"]),
                "text": inst["text"],
                "instruction_number": inst.get("instruction_number"),
                "group_id": str(inst["group_id"]),
                "score": score,
                "reason": reason,
                "matched_error_words": matched_words[:3]  # For UI to highlight
            })
            
        # 5. Sort by score and take top N
        scored_instructions.sort(key=lambda x: x["score"], reverse=True)
        recommendations = scored_instructions[:limit]
        
        return APIResponse(
            success=True,
            data={"recommendations": recommendations}
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )


from typing import Optional
