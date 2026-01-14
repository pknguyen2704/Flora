"""Dashboard and statistics endpoints."""
from fastapi import APIRouter, Depends, HTTPException, status
from motor.motor_asyncio import AsyncIOMotorDatabase
from app.db.mongodb import get_database
from app.core.dependencies import get_current_user
from app.schemas.auth import APIResponse
from typing import Dict, Any
from bson import ObjectId
from datetime import datetime, timedelta

router = APIRouter(prefix="/dashboard", tags=["dashboard"])


@router.get("/stats", response_model=APIResponse)
async def get_user_stats(
    current_user: Dict[str, Any] = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """Get user's overall statistics."""
    try:
        user_id = ObjectId(current_user["_id"])
        
        # Get pronunciation stats
        pronunciation_attempts = await db.pronunciation_attempts.find({
            "user_id": user_id
        }).to_list(length=10000)
        
        pron_scores = [a["assessment"]["total_score"] for a in pronunciation_attempts if a["assessment"].get("total_score") is not None]
        
        # Count error types
        error_distribution = {}
        for attempt in pronunciation_attempts:
            for error in attempt.get("assessment", {}).get("errors", []):
                error_type = error.get("error_type", "unknown")
                error_distribution[error_type] = error_distribution.get(error_type, 0) + 1
        
        # Get recent attempts
        recent_pron = sorted(pronunciation_attempts, key=lambda x: x["created_at"], reverse=True)[:5]
        recent_pron_list = []
        for attempt in recent_pron:
            inst_id = attempt.get("instruction_id")
            if inst_id:
                inst = await db.instructions.find_one({"_id": inst_id})
                text = inst["text"] if inst else "Custom text"
            else:
                text = attempt.get("custom_text", "Custom text")
            
            recent_pron_list.append({
                "instruction_text": text,
                "score": attempt["assessment"].get("total_score"),
                "created_at": attempt["created_at"].isoformat()
            })
        
        # Get situation stats
        situation_attempts = await db.situation_attempts.find({
            "user_id": user_id
        }).to_list(length=10000)
        
        total_questions = sum(len(a.get("situations", [])) for a in situation_attempts)
        perfect_answers = sum(a.get("perfect_count", 0) for a in situation_attempts)
        acceptable_answers = sum(a.get("acceptable_count", 0) for a in situation_attempts)
        poor_answers = sum(a.get("poor_count", 0) for a in situation_attempts)
        
        situation_scores = [a.get("total_score", 0) for a in situation_attempts]
        max_scores = [len(a.get("situations", [])) * 100 for a in situation_attempts]
        avg_percentage = sum(s/m*100 for s,m in zip(situation_scores, max_scores) if m > 0) / len(situation_scores) if situation_scores else 0
        
        # Recent quizzes
        recent_situations = sorted(situation_attempts, key=lambda x: x.get("submitted_at", datetime.min), reverse=True)[:5]
        recent_sit_list = []
        for attempt in recent_situations:
            group_id = attempt.get("group_id")
            if group_id:
                group = await db.groups.find_one({"_id": group_id})
                group_name = group["name"] if group else "Unknown"
            else:
                group_name = "Unknown"
            
            max_score = len(attempt.get("situations", [])) * 100
            percentage = (attempt.get("total_score", 0) / max_score * 100) if max_score > 0 else 0
            
            recent_sit_list.append({
                "group_name": group_name,
                "score": attempt.get("total_score", 0),
                "percentage": round(percentage),
                "submitted_at": attempt.get("submitted_at", datetime.utcnow()).isoformat()
            })
        
        # Calculate total study time (estimate from attempts)
        total_study_minutes = len(pronunciation_attempts) * 2 + len(situation_attempts) * 5  # Rough estimate
        
        return APIResponse(
            success=True,
            data={
                "pronunciation": {
                    "total_attempts": len(pronunciation_attempts),
                    "average_score": round(sum(pron_scores) / len(pron_scores), 1) if pron_scores else 0,
                    "best_score": max(pron_scores) if pron_scores else 0,
                    "worst_score": min(pron_scores) if pron_scores else 0,
                    "total_practice_time_minutes": len(pronunciation_attempts) * 2,
                    "error_distribution": error_distribution,
                    "recent_attempts": recent_pron_list
                },
                "situations": {
                    "total_quizzes": len(situation_attempts),
                    "total_questions": total_questions,
                    "perfect_answers": perfect_answers,
                    "acceptable_answers": acceptable_answers,
                    "poor_answers": poor_answers,
                    "average_score_percentage": round(avg_percentage, 1),
                    "recent_quizzes": recent_sit_list
                },
                "activity": {
                    "total_sessions": len(set([a.get("session_id") for a in pronunciation_attempts if a.get("session_id")])),
                    "total_study_time_minutes": total_study_minutes,
                    "last_active": max(
                        [a["created_at"] for a in pronunciation_attempts] +
                        [a.get("submitted_at", datetime.min) for a in situation_attempts]
                    ).isoformat() if (pronunciation_attempts or situation_attempts) else None,
                    "days_active": len(set([a["created_at"].date() for a in pronunciation_attempts])) +
                                  len(set([a.get("submitted_at", datetime.utcnow()).date() for a in situation_attempts]))
                }
            }
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch stats: {str(e)}"
        )


@router.get("/progress/{group_id}", response_model=APIResponse)
async def get_group_progress(
    group_id: str,
    current_user: Dict[str, Any] = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """Get detailed progress for a specific group."""
    try:
        user_id = ObjectId(current_user["_id"])
        group_obj_id = ObjectId(group_id)
        
        # Get group
        group = await db.groups.find_one({"_id": group_obj_id})
        if not group:
            raise HTTPException(status_code=404, detail="Group not found")
        
        # Get all instructions for this group
        instructions = await db.instructions.find({
            "group_id": group_obj_id,
            "is_active": True
        }).sort("instruction_number", 1).to_list(length=100)
        
        # Get user's attempts for each
        instruction_progress = []
        for inst in instructions:
            attempts = await db.pronunciation_attempts.find({
                "user_id": user_id,
                "instruction_id": inst["_id"]
            }).to_list(length=1000)
            
            scores = [a["assessment"]["total_score"] for a in attempts if a["assessment"].get("total_score") is not None]
            best_score = max(scores) if scores else None
            
            # Determine status
            if not attempts:
                status = "not_started"
            elif best_score and best_score >= 90:
                status = "mastered"
            else:
                status = "practicing"
            
            instruction_progress.append({
                "instruction_number": inst["instruction_number"],
                "text": inst["text"],
                "attempts_count": len(attempts),
                "best_score": best_score,
                "status": status
            })
        
        # Get situations for this group
        situations = await db.situations.find({
            "group_id": group_obj_id,
            "is_active": True
        }).sort("situation_number", 1).to_list(length=100)
        
        # Get quiz attempts
        quiz_attempts = await db.situation_attempts.find({
            "user_id": user_id,
            "group_id": group_obj_id
        }).to_list(length=1000)
        
        # Track which situations were encountered
        situation_stats = {}
        for quiz in quiz_attempts:
            for sit_answer in quiz.get("situations", []):
                sit_id = str(sit_answer["situation_id"])
                if sit_id not in situation_stats:
                    situation_stats[sit_id] = {"perfect": 0, "acceptable": 0, "poor": 0, "total": 0}
                
                situation_stats[sit_id]["total"] += 1
                if sit_answer["rating"] == "best":
                    situation_stats[sit_id]["perfect"] += 1
                elif sit_answer["rating"] == "acceptable":
                    situation_stats[sit_id]["acceptable"] += 1
                else:
                    situation_stats[sit_id]["poor"] += 1
        
        situation_progress = []
        for sit in situations:
            sit_id = str(sit["_id"])
            stats = situation_stats.get(sit_id, {"perfect": 0, "acceptable": 0, "poor": 0, "total": 0})
            
            situation_progress.append({
                "situation_number": sit["situation_number"],
                "title": sit["title"],
                "times_answered": stats["total"],
                "perfect_count": stats["perfect"],
                "acceptable_count": stats["acceptable"],
                "poor_count": stats["poor"]
            })
        
        return APIResponse(
            success=True,
            data={
                "group_id": group_id,
                "group_name": group["name"],
                "pronunciation_progress": {
                    "total_instructions": len(instructions),
                    "practiced_count": len([i for i in instruction_progress if i["attempts_count"] > 0]),
                    "mastered_count": len([i for i in instruction_progress if i["status"] == "mastered"]),
                    "instructions": instruction_progress
                },
                "situation_progress": {
                    "total_situations": len(situations),
                    "encountered_count": len([s for s in situation_progress if s["times_answered"] > 0]),
                    "perfect_answers_count": sum(s["perfect_count"] for s in situation_progress),
                    "situations": situation_progress
                }
            }
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch progress: {str(e)}"
        )
