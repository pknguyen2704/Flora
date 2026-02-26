"""Dashboard and statistics endpoints."""
from fastapi import APIRouter, Depends, HTTPException, status
from motor.motor_asyncio import AsyncIOMotorDatabase
from app.db.mongodb import get_database
from app.core.dependencies import get_current_user
from app.schemas.auth import APIResponse
from pydantic import BaseModel
from typing import Dict, Any, List
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
        
        pron_scores = []
        for a in pronunciation_attempts:
            score = a.get("assessment", {}).get("total_score") if a.get("assessment") else None
            if score is not None:
                pron_scores.append(score)
        
        # Get recent attempts
        recent_pron = sorted(pronunciation_attempts, key=lambda x: x.get("created_at", datetime.min), reverse=True)[:5]
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
                "score": attempt.get("assessment", {}).get("total_score") if attempt.get("assessment") else None,
                "created_at": attempt.get("created_at", datetime.utcnow()).isoformat() + "Z"
            })
        
        # Get quiz stats (both group-based situations and global quizzes)
        situation_attempts = await db.situation_attempts.find({"user_id": user_id}).to_list(length=10000)
        global_quiz_attempts = await db.quiz_attempts.find({"user_id": user_id}).to_list(length=10000)
        
        # Process all quiz-like attempts
        quiz_data_points = []
        for a in situation_attempts:
            max_score = len(a.get("situations", [])) * 100
            if max_score > 0:
                quiz_data_points.append({
                    "score": a.get("total_score", 0),
                    "max_score": max_score,
                    "submitted_at": a.get("submitted_at") if isinstance(a.get("submitted_at"), datetime) else datetime.utcnow(),
                    "type": "Group Quiz",
                    "group_id": a.get("group_id")
                })
        
        for a in global_quiz_attempts:
            max_score = len(a.get("results", [])) * 100
            if max_score > 0:
                quiz_data_points.append({
                    "score": a.get("total_score", 0),
                    "max_score": max_score,
                    "submitted_at": a.get("submitted_at") if isinstance(a.get("submitted_at"), datetime) else datetime.utcnow(),
                    "type": "Global Quiz",
                    "group_id": None
                })
        
        # Calculate summary stats
        avg_percentage = sum(p["score"] / p["max_score"] * 100 for p in quiz_data_points) / len(quiz_data_points) if quiz_data_points else 0
        
        # Count unique scenarios encountered
        encountered_ids = set()
        for a in situation_attempts:
            for s in a.get("situations", []):
                encountered_ids.add(str(s.get("situation_id")))
        for a in global_quiz_attempts:
            for r in a.get("results", []):
                encountered_ids.add(str(r.get("quiz_id")))
        
        total_quizzes = len(quiz_data_points) # Total attempts
        total_encountered = len(encountered_ids) # Unique questions
        
        # Recent quizzes combined
        recent_attempts = sorted(quiz_data_points, key=lambda x: x["submitted_at"], reverse=True)[:5]
        recent_quiz_list = []
        for attempt in recent_attempts:
            if attempt["type"] == "Group Quiz" and attempt["group_id"]:
                group = await db.groups.find_one({"_id": attempt["group_id"]})
                display_name = group["name"] if group else "Group Quiz"
            else:
                display_name = "Global Quiz Challenge"
            
            percentage = (attempt["score"] / attempt["max_score"] * 100) if attempt["max_score"] > 0 else 0
            
            recent_quiz_list.append({
                "group_name": display_name,
                "score": attempt["score"],
                "percentage": round(percentage),
                "submitted_at": attempt["submitted_at"].isoformat() + "Z"
            })
        
        
        # Get per-group high-level stats
        groups = await db.groups.find().sort("group_number", 1).to_list(length=100)
        groups_progress = []
        
        for group in groups:
            group_id = group["_id"]
            
            # Pronunciation stats for this group
            inst_count = await db.instructions.count_documents({"group_id": group_id, "is_active": True})
            
            # Get detailed pronunciation progress (only attempted ones)
            # Find all attempts for this user in this group
            # We need instruction details, so let's do an aggregation
            pipeline = [
                {"$match": {"user_id": user_id}},
                {"$lookup": {
                    "from": "instructions",
                    "localField": "instruction_id",
                    "foreignField": "_id",
                    "as": "instruction"
                }},
                {"$unwind": "$instruction"},
                {"$match": {"instruction.group_id": group_id}},
                {"$group": {
                    "_id": "$instruction_id",
                    "text": {"$first": "$instruction.text"},
                    "instruction_number": {"$first": "$instruction.instruction_number"},
                    "best_score": {"$max": "$assessment.total_score"}
                }},
                {"$sort": {"instruction_number": 1}}
            ]
            pron_progress_cursor = db.pronunciation_attempts.aggregate(pipeline)
            pron_progress_list = await pron_progress_cursor.to_list(length=1000)
            
            detailed_pronunciation = []
            mastered_count = 0
            
            for p in pron_progress_list:
                score = p.get("best_score", 0)
                status = "mastered" if score >= 90 else "practicing"
                if status == "mastered":
                    mastered_count += 1
                
                detailed_pronunciation.append({
                    "instruction_number": p["instruction_number"],
                    "text": p["text"],
                    "best_score": score,
                    "status": status
                })

            # Situation stats for this group
            sit_count = await db.situations.count_documents({"group_id": group_id, "is_active": True})
            
            # Get detailed situation progress
            # We can use the existing sit_attempts logic but we need situation TITLES.
            # Efficient way: Get all situations for this group (usually small # per group) map ID -> Title
            group_situations = await db.situations.find({"group_id": group_id}).to_list(length=100)
            sit_map = {str(s["_id"]): s["title"] for s in group_situations}
            sit_number_map = {str(s["_id"]): s["situation_number"] for s in group_situations}
            
            sit_attempts = await db.situation_attempts.find({"user_id": user_id, "group_id": group_id}).to_list(length=1000)
            
            sit_stats_map = {}
            encountered_sits = set()
            
            for att in sit_attempts:
                for s in att.get("situations", []):
                    sid = str(s.get("situation_id"))
                    encountered_sits.add(sid)
                    
                    if sid not in sit_stats_map:
                         sit_stats_map[sid] = {"perfect": 0, "acceptable": 0, "poor": 0, "total": 0}
                    
                    sit_stats_map[sid]["total"] += 1
                    rating = s.get("rating")
                    if rating == "best":
                        sit_stats_map[sid]["perfect"] += 1
                    elif rating == "acceptable":
                        sit_stats_map[sid]["acceptable"] += 1
                    else:
                        sit_stats_map[sid]["poor"] += 1

            detailed_situations = []
            for sid, stats in sit_stats_map.items():
                if sid in sit_map:
                    detailed_situations.append({
                        "situation_number": sit_number_map.get(sid, 0),
                        "title": sit_map[sid],
                        "times_answered": stats["total"],
                        "perfect_count": stats["perfect"],
                        "acceptable_count": stats["acceptable"],
                        "poor_count": stats["poor"]
                    })
            
            # Sort by situation number
            detailed_situations.sort(key=lambda x: x["situation_number"])

            groups_progress.append({
                "group_id": str(group_id),
                "group_number": group.get("group_number"),
                "name": group["name"],
                "description": group.get("description", ""),
                "color": group.get("color_hex", "#0052D4"),
                "pronunciation": {
                    "total": inst_count,
                    "mastered": mastered_count,
                    "practiced": len(pron_progress_list),
                    "instructions": detailed_pronunciation
                },
                "situations": {
                    "total": sit_count,
                    "encountered": len(encountered_sits),
                    "situations": detailed_situations
                }
            })

        return APIResponse(
            success=True,
            data={
                "learning_summary": {
                    "total_study_time_minutes": current_user.get("stats", {}).get("total_study_time_minutes", 0),
                    "total_cups": current_user.get("stats", {}).get("total_cups", 0),
                    "total_tests": current_user.get("stats", {}).get("total_tests_completed", 0),
                    "total_lessons": current_user.get("stats", {}).get("total_lessons_completed", 0)
                },
                "groups_progress": groups_progress,
                "pronunciation": {
                    "total_attempts": len(pronunciation_attempts),
                    "average_score": round(sum(pron_scores) / len(pron_scores), 1) if pron_scores else 0,
                    "recent_attempts": recent_pron_list
                },
                "situations": {
                    "total_quizzes": total_quizzes,
                    "total_encountered": total_encountered,
                    "average_score_percentage": round(avg_percentage, 1),
                    "recent_quizzes": recent_quiz_list
                },
                "activity": {
                    "total_sessions": len(set([a.get("session_id") for a in pronunciation_attempts if a.get("session_id")])),
                    "last_active": max(
                        [a.get("created_at", datetime.min) if isinstance(a.get("created_at"), datetime) else datetime.min for a in pronunciation_attempts] +
                        [p["submitted_at"] for p in quiz_data_points] +
                        [datetime.min]
                    ).isoformat() + "Z" if (pronunciation_attempts or quiz_data_points) else None,
                    "days_active": len(set([a["created_at"].date() for a in pronunciation_attempts if isinstance(a.get("created_at"), datetime)]).union(
                                  set([p["submitted_at"].date() for p in quiz_data_points])))
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
