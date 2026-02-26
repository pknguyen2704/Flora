"""Situation quiz endpoints."""
from fastapi import APIRouter, Depends, HTTPException, status
from motor.motor_asyncio import AsyncIOMotorDatabase
from app.db.mongodb import get_database
from app.core.dependencies import get_current_user
from app.schemas.auth import APIResponse
from typing import Dict, Any, List
from bson import ObjectId
from datetime import datetime, timezone
import random
import string

router = APIRouter(prefix="/situations", tags=["situations"])


@router.get("/quiz/{group_id}", response_model=APIResponse)
async def start_quiz(
    group_id: str,
    current_user: Dict[str, Any] = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """Start a new situationquiz with random 5 questions."""
    try:
        # Get all situations for this group
        all_situations = await db.quizzes.find({
            "group_id": ObjectId(group_id),
            "is_active": True
        }).to_list(length=100)
        
        if len(all_situations) == 0:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="No situations found for this group"
            )
        
        # Sort by quiz_number for sequential order
        selected_situations = sorted(all_situations, key=lambda x: x.get("quiz_number", 0))
        
        # Get group info
        group = await db.groups.find_one({"_id": ObjectId(group_id)})
        
        # Generate quiz ID
        quiz_id = f"quiz_{datetime.utcnow().strftime('%Y%m%d_%H%M%S')}_{random.choice(string.ascii_lowercase)}"
        
        # Prepare questions (hide ratings and explanations)
        questions = []
        for i, sit in enumerate(selected_situations, 1):
            questions.append({
                "question_number": i,
                "situation_id": str(sit["_id"]),
                "title": sit.get("title", ""),
                "question": sit["question"],
                "choices": [
                    {
                        "choice_id": choice["choice_id"],
                        "text": choice["text"]
                    }
                    for choice in sit["choices"]
                ]
            })
        
        return APIResponse(
            success=True,
            data={
                "quiz_id": quiz_id,
                "group_id": group_id,
                "group_name": group["name"] if group else "",
                "questions": questions,
                "started_at": datetime.utcnow().isoformat() + "Z"
            }
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )


@router.post("/submit", response_model=APIResponse)
async def submit_quiz(
    submission: Dict[str, Any],
    current_user: Dict[str, Any] = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """Submit quiz answers and get results."""
    try:
        quiz_id = submission.get("quiz_id")
        answers = submission.get("answers", [])
        
        if not quiz_id or not answers:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="quiz_id and answers are required"
            )
        
        # Process each answer
        results = []
        total_score = 0
        perfect_count = 0
        acceptable_count = 0
        poor_count = 0
        
        for answer in answers:
            situation_id = answer.get("situation_id")
            selected_choice_id = answer.get("selected_choice_id")
            time_spent = answer.get("time_spent_seconds", 0)
            
            # Get situation
            situation = await db.quizzes.find_one({"_id": ObjectId(situation_id)})
            if not situation:
                continue
            
            # Find selected choice
            selected_choice = next(
                (c for c in situation["choices"] if c["choice_id"] == selected_choice_id),
                None
            )
            
            if not selected_choice:
                continue
            
            # Determine score based on rating
            if selected_choice_id == situation.get("best_choice_id"):
                rating = "best"
                score = 100
                is_best_choice = True
                perfect_count += 1
            else:
                rating = "not_recommended"
                score = 0
                is_best_choice = False
                poor_count += 1
            
            total_score += score
            
            # Find best choice for feedback
            best_choice = next(
                (c for c in situation["choices"] if c["choice_id"] == situation.get("best_choice_id")),
                None
            )
            
            results.append({
                "question_number": len(results) + 1,
                "situation_id": situation_id,
                "title": situation.get("title", ""),
                "question": situation["question"],
                "selected_choice_id": selected_choice_id,
                "selected_choice_text": selected_choice["text"],
                "is_best_choice": is_best_choice,
                "rating": rating,
                "score": score,
                "detailed_explanation": situation.get("explanation"),
                "principle": situation.get("principle"),
                "best_choice": {
                    "choice_id": best_choice["choice_id"] if best_choice else "",
                    "text": best_choice["text"] if best_choice else ""
                } if best_choice else None,
                "time_spent_seconds": time_spent
            })
        
        # Get group_id from first situation
        first_situation = await db.quizzes.find_one({"_id": ObjectId(answers[0]["situation_id"])})
        group_id = first_situation["group_id"] if first_situation else None
        
        # Save to database
        attempt_doc = {
            "user_id": ObjectId(current_user["_id"]),
            "group_id": group_id,
            "quiz_id": quiz_id,
            "situations": [
                {
                    "situation_id": ObjectId(answer["situation_id"]),
                    "selected_choice_id": answer["selected_choice_id"],
                    "is_best_choice": results[i]["is_best_choice"],
                    "rating": results[i]["rating"],
                    "score": results[i]["score"],
                    "time_spent_seconds": answer.get("time_spent_seconds", 0)
                }
                for i, answer in enumerate(answers)
            ],
            "total_score": total_score,
            "perfect_count": perfect_count,
            "acceptable_count": acceptable_count,
            "poor_count": poor_count,
            "started_at": datetime.now(timezone.utc),  # Should come from client
            "submitted_at": datetime.now(timezone.utc),
            "total_time_seconds": sum(answer.get("time_spent_seconds", 0) for answer in answers)
        }
        
        await db.situation_attempts.insert_one(attempt_doc)
        
        # Update user stats
        await db.users.update_one(
            {"_id": ObjectId(current_user["_id"])},
            {
                "$inc": {"stats.total_situation_attempts": 1},
                "$set": {"updated_at": datetime.now(timezone.utc)}
            }
        )
        
        return APIResponse(
            success=True,
            data={
                "quiz_id": quiz_id,
                "total_score": total_score,
                "max_score": len(answers) * 100,
                "percentage": round((total_score / (len(answers) * 100)) * 100) if answers else 0,
                "perfect_count": perfect_count,
                "acceptable_count": acceptable_count,
                "poor_count": poor_count,
                "results": results,
                "submitted_at": datetime.utcnow().isoformat() + "Z"
            }
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to submit quiz: {str(e)}"
        )
