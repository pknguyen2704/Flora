"""Global Quiz endpoints."""
from fastapi import APIRouter, Depends, HTTPException, status
from motor.motor_asyncio import AsyncIOMotorDatabase
from app.db.mongodb import get_database
from app.core.dependencies import get_current_user
from app.schemas.auth import APIResponse
from typing import Dict, Any, List, Optional
from bson import ObjectId
from datetime import datetime, timezone
import random
import string

router = APIRouter(prefix="/quiz", tags=["quiz"])


@router.get("/all", response_model=APIResponse)
async def get_all_quizzes(
    current_user: Dict[str, Any] = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """Get all global quiz questions."""
    try:
        quizzes = await db.quizzes.find({"is_active": True}).to_list(length=50)
        
        # Convert ObjectIds to strings
        for q in quizzes:
            q["id"] = str(q.pop("_id"))
            
        return APIResponse(
            success=True,
            data={"quizzes": quizzes}
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch quizzes: {str(e)}"
        )


@router.get("/random", response_model=APIResponse)
async def get_random_quizzes(
    limit: int = 10,
    current_user: Dict[str, Any] = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """Get a random subset of quiz questions."""
    try:
        all_quizzes = await db.quizzes.find({"is_active": True}).to_list(length=50)
        
        if not all_quizzes:
            return APIResponse(success=True, data={"quizzes": []})
            
        selected = random.sample(all_quizzes, min(len(all_quizzes), limit))
        
        # Convert ObjectIds to strings
        for q in selected:
            q["id"] = str(q.pop("_id"))
            
        return APIResponse(
            success=True,
            data={"quizzes": selected}
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch random quizzes: {str(e)}"
        )


@router.post("/submit", response_model=APIResponse)
async def submit_quiz(
    submission: Dict[str, Any],
    current_user: Dict[str, Any] = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """Submit quiz answers and get results."""
    try:
        quiz_id = submission.get("quiz_id", f"global_quiz_{datetime.utcnow().strftime('%Y%m%d_%H%M%S')}")
        answers = submission.get("answers", [])
        
        if not answers:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="answers are required"
            )
        
        results = []
        total_score = 0
        perfect_count = 0
        acceptable_count = 0
        poor_count = 0
        
        for answer in answers:
            q_id = answer.get("quiz_id")
            selected_choice_id = answer.get("selected_choice_id")
            
            # Get quiz question
            quiz_q = await db.quizzes.find_one({"_id": ObjectId(q_id)})
            if not quiz_q:
                continue
            
            # Find selected choice
            selected_choice = next(
                (c for c in quiz_q["choices"] if c["choice_id"] == selected_choice_id),
                None
            )
            
            if not selected_choice:
                continue
            
            # Score
            rating = selected_choice["rating"]
            if rating == "best":
                score = 100
                perfect_count += 1
            elif rating == "acceptable":
                score = 60
                acceptable_count += 1
            else:
                score = 0
                poor_count += 1
                
            total_score += score
            
            # Best choice for feedback
            best_choice = next(
                (c for c in quiz_q["choices"] if c["rating"] == "best"),
                None
            )
            
            results.append({
                "quiz_id": q_id,
                "question": quiz_q["question"],
                "selected_choice_id": selected_choice_id,
                "selected_choice_text": selected_choice["text"],
                "rating": rating,
                "score": score,
                "explanation": quiz_q.get("explanation"),
                "principle": quiz_q.get("principle"),
                "best_choice": {
                    "choice_id": best_choice["choice_id"] if best_choice else "",
                    "text": best_choice["text"] if best_choice else ""
                }
            })
            
        # Optional: Save attempt
        attempt_doc = {
            "user_id": ObjectId(current_user["_id"]),
            "type": "global_quiz",
            "quiz_id": quiz_id,
            "total_score": total_score,
            "perfect_count": perfect_count,
            "acceptable_count": acceptable_count,
            "poor_count": poor_count,
            "submitted_at": datetime.now(timezone.utc),
            "results": results
        }
        await db.quiz_attempts.insert_one(attempt_doc)
        
        # Update user stats
        await db.users.update_one(
            {"_id": ObjectId(current_user["_id"])},
            {"$inc": {"stats.total_situation_attempts": 1}}
        )
        
        return APIResponse(
            success=True,
            data={
                "total_score": total_score,
                "max_score": len(answers) * 100,
                "percentage": round((total_score / (len(answers) * 100)) * 100) if answers else 0,
                "perfect_count": perfect_count,
                "acceptable_count": acceptable_count,
                "poor_count": poor_count,
                "results": results
            }
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to submit quiz: {str(e)}"
        )
