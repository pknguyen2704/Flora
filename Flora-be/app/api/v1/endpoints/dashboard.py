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
        
        # 1. Fetch all data in bulk to minimize round-trips
        pron_attempts_task = db.pronunciation_attempts.find({"user_id": user_id}).to_list(length=1000)
        sit_attempts_task = db.situation_attempts.find({"user_id": user_id}).to_list(length=1000)
        global_quiz_attempts_task = db.quiz_attempts.find({"user_id": user_id}).to_list(length=1000)
        groups_task = db.groups.find().sort("group_number", 1).to_list(length=100)
        
        # Await all primary data fetches
        import asyncio
        pronunciation_attempts, situation_attempts, global_quiz_attempts, groups = await asyncio.gather(
            pron_attempts_task, sit_attempts_task, global_quiz_attempts_task, groups_task
        )
        
        # 2. Pre-process pronunciation attempts
        pron_scores = []
        recent_pron_attempts = sorted(pronunciation_attempts, key=lambda x: x.get("created_at", datetime.min), reverse=True)
        
        # Fetch instructions mapping for recent attempts if needed
        recent_pron_instruction_ids = [a["instruction_id"] for a in recent_pron_attempts[:5] if a.get("instruction_id")]
        instruction_map = {}
        if recent_pron_instruction_ids:
            instructions = await db.instructions.find({"_id": {"$in": recent_pron_instruction_ids}}).to_list(length=10)
            instruction_map = {inst["_id"]: inst["text"] for inst in instructions}

        recent_pron_list = []
        for attempt in recent_pron_attempts[:5]:
            score = attempt.get("assessment", {}).get("total_score")
            if score is not None:
                pron_scores.append(score)
            text = instruction_map.get(attempt.get("instruction_id"), attempt.get("custom_text", "Custom text"))
            recent_pron_list.append({
                "instruction_text": text,
                "score": score,
                "created_at": attempt.get("created_at", datetime.utcnow()).isoformat() + "Z"
            })
            
        # 3. Process quiz and situation attempts
        quiz_data_points = []
        group_sit_stats = {} # group_id -> list of attempts
        encountered_ids = set()

        for a in situation_attempts:
            gid = str(a.get("group_id"))
            if gid not in group_sit_stats: group_sit_stats[gid] = []
            group_sit_stats[gid].append(a)
            
            sits = a.get("situations", [])
            n_sits = len(sits)
            if n_sits > 0:
                score = a.get("total_score", 0)
                if score > 100 or (score > 0 and score % 100 == 0): score /= 100
                quiz_data_points.append({
                    "score": score, "max_score": n_sits,
                    "submitted_at": a.get("submitted_at") if isinstance(a.get("submitted_at"), datetime) else datetime.utcnow(),
                    "type": "Group Quiz", "group_id": a.get("group_id")
                })
                for s in sits: encountered_ids.add(str(s.get("situation_id")))

        for a in global_quiz_attempts:
            results = a.get("results", [])
            n_results = len(results)
            if n_results > 0:
                score = a.get("total_score", 0)
                if score > 100 or (score > 0 and score % 100 == 0): score /= 100
                quiz_data_points.append({
                    "score": score, "max_score": n_results,
                    "submitted_at": a.get("submitted_at") if isinstance(a.get("submitted_at"), datetime) else datetime.utcnow(),
                    "type": "Global Quiz", "group_id": None
                })
                for r in results: encountered_ids.add(str(r.get("quiz_id")))

        # 4. Map group names for recent quizzes
        recent_attempts_sorted = sorted(quiz_data_points, key=lambda x: x["submitted_at"], reverse=True)
        recent_quiz_list = []
        group_name_map = {str(g["_id"]): g["name"] for g in groups}
        for attempt in recent_attempts_sorted[:5]:
            display_name = group_name_map.get(str(attempt["group_id"]), "Global Quiz Challenge") if attempt["group_id"] else "Global Quiz Challenge"
            pct = (attempt["score"] / attempt["max_score"] * 100) if attempt["max_score"] > 0 else 0
            recent_quiz_list.append({
                "group_name": display_name,
                "score": attempt["score"],
                "percentage": int(round(pct)),
                "submitted_at": attempt["submitted_at"].isoformat() + "Z"
            })

        # 5. Build group progress map efficiently
        # Get all pronunciation attempts by group
        pipeline = [
            {"$match": {"user_id": user_id, "instruction_id": {"$exists": True}}},
            {"$lookup": {"from": "instructions", "localField": "instruction_id", "foreignField": "_id", "as": "inst"}},
            {"$unwind": "$inst"},
            {"$project": {"group_id": "$inst.group_id", "score": "$assessment.total_score", "created_at": 1}},
        ]
        all_group_pron_res = await db.pronunciation_attempts.aggregate(pipeline).to_list(length=5000)
        group_pron_map = {}
        for r in all_group_pron_res:
            gid = str(r["group_id"])
            if gid not in group_pron_map: group_pron_map[gid] = []
            group_pron_map[gid].append(r)

        groups_progress = []
        for g in groups:
            gid_str = str(g["_id"])
            
            # Situations
            g_sit_atts = group_sit_stats.get(gid_str, [])
            total_sit_answered = 0
            avg_sit_score = 0.0
            highest_sit_score = {"point": 0, "total": 0, "percentage": 0.0}
            latest_sit_score = {"point": 0, "total": 0}
            
            if g_sit_atts:
                g_sit_atts = sorted(g_sit_atts, key=lambda x: x.get("submitted_at", datetime.min), reverse=True)
                total_pct = 0.0
                for ga in g_sit_atts:
                    n = len(ga.get("situations", []))
                    total_sit_answered += n
                    if n > 0:
                        s = ga.get("total_score", 0)
                        if s > 100 or (s > 0 and s % 100 == 0): s /= 100
                        p = (s / n) * 100
                        total_pct += p
                        if s > highest_sit_score["point"] or (s == highest_sit_score["point"] and p > highest_sit_score["percentage"]):
                            highest_sit_score = {"point": int(s), "total": n, "percentage": p}
                avg_sit_score = total_pct / len(g_sit_atts)
                latest_ga = g_sit_atts[0]
                n_latest = len(latest_ga.get("situations", []))
                s_latest = latest_ga.get("total_score", 0)
                if s_latest > 100 or (s_latest > 0 and s_latest % 100 == 0): s_latest /= 100
                latest_sit_score = {"point": int(s_latest), "total": n_latest}

            # Pronunciation
            g_pron_atts = group_pron_map.get(gid_str, [])
            avg_p_score = 0.0; latest_p_score = 0.0; highest_p_score = 0.0
            if g_pron_atts:
                g_pron_atts = sorted(g_pron_atts, key=lambda x: x.get("created_at", datetime.min), reverse=True)
                avg_p_score = sum(pr.get("score", 0.0) for pr in g_pron_atts) / len(g_pron_atts)
                latest_p_score = g_pron_atts[0].get("score", 0.0)
                highest_p_score = max(pr.get("score", 0.0) for pr in g_pron_atts)

            groups_progress.append({
                "group_id": gid_str, "group_number": g.get("group_number"), "name": g["name"],
                "description": g.get("description", ""), "color": g.get("color_hex", "#0052D4"),
                "total_answers": total_sit_answered + len(g_pron_atts),
                "situation_score": {"average": round(float(avg_sit_score), 1), "highest": highest_sit_score, "latest": latest_sit_score},
                "pronunciation_score": {
                    "average": round(float(avg_p_score/10 if avg_p_score > 10 else avg_p_score), 1),
                    "highest": round(float(highest_p_score/10 if highest_p_score > 10 else highest_p_score), 1),
                    "latest": round(float(latest_p_score/10 if latest_p_score > 10 else latest_p_score), 1)
                }
            })

        # 6. Final aggregated stats
        avg_percentage = sum(p["score"] / p["max_score"] * 100 for p in quiz_data_points) / len(quiz_data_points) if quiz_data_points else 0
        total_quizzes = len(quiz_data_points)
        total_encountered = len(encountered_ids)
        
        all_activities = [p.get("created_at") for p in pronunciation_attempts if isinstance(p.get("created_at"), datetime)] + \
                         [q["submitted_at"] for q in quiz_data_points]
        last_active_dt = max(all_activities) if all_activities else None
        days_active = len(set(dt.date() for dt in all_activities))

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
                    "last_active": last_active_dt.isoformat() + "Z" if last_active_dt else None,
                    "days_active": days_active
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
                    situation_stats[sit_id] = {"correct": 0, "incorrect": 0, "total": 0}
                
                situation_stats[sit_id]["total"] += 1
                if sit_answer.get("rating") == "best" or sit_answer.get("rating") == "correct" or sit_answer.get("is_correct") or sit_answer.get("is_best_choice"):
                    situation_stats[sit_id]["correct"] += 1
                else:
                    situation_stats[sit_id]["incorrect"] += 1
        
        situation_progress = []
        for sit in situations:
            sit_id = str(sit["_id"])
            stats = situation_stats.get(sit_id, {"perfect": 0, "acceptable": 0, "poor": 0, "total": 0})
            
            situation_progress.append({
                "situation_number": sit["situation_number"],
                "title": sit["title"],
                "times_answered": stats["total"],
                "correct_count": stats["correct"],
                "incorrect_count": stats["incorrect"]
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
                    "correct_answers_count": sum(s["correct_count"] for s in situation_progress),
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
