"""Admin endpoints for user management."""
from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from bson import ObjectId
from app.core.dependencies import get_current_user
from app.db.mongodb import get_database
from app.models.user import UserResponse
from pydantic import BaseModel, EmailStr, Field
from app.core.security import hash_password
from datetime import datetime, timezone, timedelta
from collections import defaultdict
import random
import string

router = APIRouter(prefix="/admin", tags=["admin"])


class UserUpdate(BaseModel):
    """Schema for updating user information."""
    fullname: str | None = None
    email: EmailStr | None = None
    username: str | None = Field(None, min_length=3)
    password: str | None = Field(None, min_length=5)
    role: str | None = None


class UserCreate(BaseModel):
    """Schema for creating a new user."""
    username: str = Field(..., min_length=3)
    email: EmailStr
    fullname: str
    password: str = Field(..., min_length=5)
    role: str = "user"


async def require_admin(current_user: dict = Depends(get_current_user)) -> dict:
    """Dependency to check if user is admin."""
    # Check both role and is_admin fields for flexibility
    is_admin = (
        current_user.get("role") == "admin" or 
        current_user.get("is_admin", False)
    )
    
    if not is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required"
        )
    return current_user


@router.get("/users", response_model=List[UserResponse])
async def get_all_users(
    current_admin: dict = Depends(require_admin),
    db=Depends(get_database)
):
    """Get all users (admin only)."""
    users_collection = db.users
    users = await users_collection.find().to_list(length=None)
    
    # Convert ObjectId to string and rename _id to id for each user
    for user in users:
        user["id"] = str(user["_id"])
        del user["_id"]
    
    return users


@router.post("/users", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def create_user(
    user_in: UserCreate,
    current_admin: dict = Depends(require_admin),
    db=Depends(get_database)
):
    """Create a new user (admin only)."""
    users_collection = db.users

    # Check if username already exists
    if await users_collection.find_one({"username": user_in.username}):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already exists"
        )

    # Check if email already exists
    if await users_collection.find_one({"email": user_in.email}):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )

    # Prepare user data
    user_dict = {
        "username": user_in.username,
        "email": user_in.email,
        "full_name": user_in.fullname,
        "password_hash": hash_password(user_in.password),
        "role": user_in.role,
        "is_active": True,
        "created_at": datetime.now(timezone.utc),
        "stats": {
            "total_pronunciation_attempts": 0,
            "total_situation_attempts": 0,
            "average_pronunciation_score": 0,
            "total_study_time_minutes": 0
        }
    }

    # Insert user
    result = await users_collection.insert_one(user_dict)
    
    # Return created user
    created_user = await users_collection.find_one({"_id": result.inserted_id})
    created_user["id"] = str(created_user["_id"])
    del created_user["_id"]
    return created_user


@router.patch("/users/{user_id}", response_model=UserResponse)
async def update_user(
    user_id: str,
    user_update: UserUpdate,
    current_admin: dict = Depends(require_admin),
    db=Depends(get_database)
):
    """Update user information (admin only)."""
    users_collection = db.users
    
    # Validate user_id
    try:
        object_id = ObjectId(user_id)
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid user ID"
        )
    
    # Check if user exists
    user = await users_collection.find_one({"_id": object_id})
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    # Prepare update data
    update_data = {}
    
    if user_update.fullname is not None:
        update_data["full_name"] = user_update.fullname
    
    if user_update.email is not None:
        # Check if email is already taken
        existing_user = await users_collection.find_one({
            "email": user_update.email,
            "_id": {"$ne": object_id}
        })
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )
        update_data["email"] = user_update.email
    
    if user_update.username is not None:
        # Check if username is already taken
        existing_user = await users_collection.find_one({
            "username": user_update.username,
            "_id": {"$ne": object_id}
        })
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Username already taken"
            )
        update_data["username"] = user_update.username
    
    if user_update.password is not None:
        # Hash the new password and use the correct field name
        update_data["password_hash"] = hash_password(user_update.password)
    
    if user_update.role is not None:
        update_data["role"] = user_update.role
    
    if not update_data:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No update data provided"
        )
    
    # Update user
    await users_collection.update_one(
        {"_id": object_id},
        {"$set": update_data}
    )
    
    # Return updated user
    updated_user = await users_collection.find_one({"_id": object_id})
    updated_user["id"] = str(updated_user["_id"])
    del updated_user["_id"]
    return updated_user


@router.delete("/users/{user_id}")
async def delete_user(
    user_id: str,
    current_admin: dict = Depends(require_admin),
    db=Depends(get_database)
):
    """Delete a user (admin only)."""
    users_collection = db.users
    
    # Validate user_id
    try:
        object_id = ObjectId(user_id)
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid user ID"
        )
    
    # Check if user exists
    user = await users_collection.find_one({"_id": object_id})
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    # Prevent deleting yourself
    if str(current_admin["_id"]) == user_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot delete your own account"
        )
    
    # Delete user
    await users_collection.delete_one({"_id": object_id})
    
    return {"message": "User deleted successfully"}


@router.patch("/users/{user_id}/toggle-admin", response_model=UserResponse)
async def toggle_admin_status(
    user_id: str,
    current_admin: dict = Depends(require_admin),
    db=Depends(get_database)
):
    """Toggle admin status of a user (admin only)."""
    users_collection = db.users
    
    # Validate user_id
    try:
        object_id = ObjectId(user_id)
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid user ID"
        )
    
    # Check if user exists
    user = await users_collection.find_one({"_id": object_id})
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    # Prevent toggling your own admin status
    if str(current_admin["_id"]) == user_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot modify your own admin status"
        )
    
    # Toggle admin status
    new_admin_status = not user.get("is_admin", False)
    await users_collection.update_one(
        {"_id": object_id},
        {"$set": {"is_admin": new_admin_status, "role": "admin" if new_admin_status else "user"}}
    )
    
    # Return updated user
    updated_user = await users_collection.find_one({"_id": object_id})
    updated_user["id"] = str(updated_user["_id"])
    del updated_user["_id"]
    return updated_user


@router.get("/users/{user_id}/stats")
async def get_specific_user_stats(
    user_id: str,
    current_admin: dict = Depends(require_admin),
    db=Depends(get_database)
):
    """Get detailed statistics for a specific user (admin only)."""
    try:
        user_obj_id = ObjectId(user_id)
        
        # Check if user exists
        user = await db.users.find_one({"_id": user_obj_id})
        if not user:
            raise HTTPException(status_code=404, detail="User not found")

        # Get pronunciation stats
        pronunciation_attempts = await db.pronunciation_attempts.find({
            "user_id": user_obj_id
        }).to_list(length=10000)
        
        pron_scores = []
        for a in pronunciation_attempts:
            score = a.get("assessment", {}).get("total_score") if a.get("assessment") else None
            if score is not None:
                pron_scores.append(score)
        
        # Get recent attempts
        recent_pron = sorted(pronunciation_attempts, key=lambda x: x.get("created_at", datetime.min), reverse=True)[:10]
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
        
        # Get situation stats
        situation_attempts = await db.situation_attempts.find({
            "user_id": user_obj_id
        }).to_list(length=10000)
        
        situation_scores = [a.get("total_score", 0) for a in situation_attempts]
        max_scores = [len(a.get("situations", [])) * 100 for a in situation_attempts]
        avg_percentage = sum(s/m*100 for s,m in zip(situation_scores, max_scores) if m > 0) / len(situation_scores) if situation_scores else 0
        
        # Recent quizzes
        recent_situations = sorted(situation_attempts, key=lambda x: x.get("submitted_at", datetime.min) if isinstance(x.get("submitted_at"), datetime) else datetime.min, reverse=True)[:10]
        recent_sit_list = []
        
        # Distribution counts for radial charts
        perfect_count = sum(a.get("perfect_count", 0) for a in situation_attempts)
        acceptable_count = sum(a.get("acceptable_count", 0) for a in situation_attempts)
        poor_count = sum(a.get("poor_count", 0) for a in situation_attempts)

        for attempt in recent_situations:
            group_id = attempt.get("group_id")
            if group_id:
                group = await db.groups.find_one({"_id": group_id})
                group_name = group["name"] if group else "Unknown"
            else:
                group_name = "Unknown"
            
            max_score = len(attempt.get("situations", [])) * 100
            percentage = (attempt.get("total_score", 0) / max_score * 100) if max_score > 0 else 0
            
            submitted_at = attempt.get("submitted_at")
            if not isinstance(submitted_at, datetime):
                submitted_at = datetime.utcnow()
            
            recent_sit_list.append({
                "group_name": group_name,
                "score": attempt.get("total_score", 0),
                "percentage": round(percentage),
                "submitted_at": submitted_at.isoformat() + "Z"
            })
        
        # Performance Timeline (Last 30 days)
        now_naive = datetime.utcnow()
        user_timeline_map = {} # date -> {accuracy_sum, count}
        for i in range(30):
            d = (now_naive - timedelta(days=i)).date()
            user_timeline_map[d] = {"accuracy_sum": 0, "count": 0}
        
        for a in pronunciation_attempts:
            dt = a.get("created_at")
            if isinstance(dt, str):
                try: dt = datetime.fromisoformat(dt.replace('Z', ''))
                except: dt = None
            if isinstance(dt, datetime) and dt.date() in user_timeline_map:
                score = a.get("assessment", {}).get("total_score") if a.get("assessment") else None
                if score is not None:
                    user_timeline_map[dt.date()]["accuracy_sum"] += score
                    user_timeline_map[dt.date()]["count"] += 1

        for a in situation_attempts:
            dt = a.get("submitted_at")
            if isinstance(dt, str):
                try: dt = datetime.fromisoformat(dt.replace('Z', ''))
                except: dt = None
            if isinstance(dt, datetime) and dt.date() in user_timeline_map:
                score = a.get("total_score")
                max_score = len(a.get("situations", [])) * 100
                if score is not None and max_score > 0:
                    user_timeline_map[dt.date()]["accuracy_sum"] += (score / max_score) * 100
                    user_timeline_map[dt.date()]["count"] += 1
        
        performance_timeline = []
        for d in sorted(user_timeline_map.keys()):
            stats = user_timeline_map[d]
            performance_timeline.append({
                "date": d.isoformat(),
                "accuracy": round(stats["accuracy_sum"] / stats["count"], 1) if stats["count"] > 0 else 0
            })

        return {
            "success": True,
            "data": {
                "user_info": {
                    "fullname": user.get("full_name"),
                    "email": user.get("email"),
                    "username": user.get("username")
                },
                "pronunciation": {
                    "total_attempts": len(pronunciation_attempts),
                    "average_score": round(sum(pron_scores) / len(pron_scores), 1) if pron_scores else 0,
                    "recent_attempts": recent_pron_list
                },
                "situations": {
                    "total_quizzes": len(situation_attempts),
                    "average_score_percentage": round(avg_percentage, 1),
                    "recent_quizzes": recent_sit_list,
                    "score_distribution": {
                        "perfect": perfect_count,
                        "acceptable": acceptable_count,
                        "poor": poor_count
                    }
                },
                "performance_timeline": performance_timeline,
                "activity": {
                    "total_sessions": len(set([a.get("session_id") for a in pronunciation_attempts if a.get("session_id")])),
                    "last_active": max(
                        [a.get("created_at", datetime.min) if isinstance(a.get("created_at"), datetime) else datetime.min for a in pronunciation_attempts] +
                        [a.get("submitted_at", datetime.min) if isinstance(a.get("submitted_at"), datetime) else datetime.min for a in situation_attempts] +
                        [datetime.min]
                    ).isoformat() + "Z" if (pronunciation_attempts or situation_attempts) else None,
                    "days_active": len(set([a["created_at"].date() for a in pronunciation_attempts if isinstance(a.get("created_at"), datetime)])) +
                                  len(set([a["submitted_at"].date() for a in situation_attempts if isinstance(a.get("submitted_at"), datetime)]))
                }
            }
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch user stats: {str(e)}"
        )


@router.get("/dashboard/stats")
async def get_global_dashboard_stats(
    current_admin: dict = Depends(require_admin),
    db=Depends(get_database)
):
    """Get global platform statistics for the admin dashboard (admin only)."""
    try:
        now = datetime.now(timezone.utc)
        yesterday = (now - timedelta(days=1)).replace(tzinfo=None)
        two_weeks_ago = (now - timedelta(days=14)).replace(tzinfo=None)

        # 1. Total Counts (Efficient)
        users_count = await db.users.count_documents({})
        pronunciation_attempts_count = await db.pronunciation_attempts.count_documents({})
        situation_attempts_count = await db.situation_attempts.count_documents({})
        global_quiz_attempts_count = await db.quiz_attempts.count_documents({})
        total_quizzes_count = situation_attempts_count + global_quiz_attempts_count
        
        # 2. Activity Today (Wait, we need to compare with UTC dates)
        active_today = await db.pronunciation_attempts.distinct("user_id", {"created_at": {"$gte": yesterday}})
        active_today_sit = await db.situation_attempts.distinct("user_id", {"submitted_at": {"$gte": yesterday}})
        active_today_quiz = await db.quiz_attempts.distinct("user_id", {"submitted_at": {"$gte": yesterday}})
        active_users_today = len(set(active_today + active_today_sit + active_today_quiz))

        # 3. Activity Timeline (Aggregation)
        timeline_pipeline = [
            {"$match": {"created_at": {"$gte": two_weeks_ago}}},
            {"$project": {
                "date": {"$dateToString": {"format": "%Y-%m-%d", "date": "$created_at"}},
                "score": "$assessment.total_score"
            }},
            {"$group": {
                "_id": "$date",
                "count": {"$sum": 1},
                "avg_score": {"$avg": "$score"}
            }},
            {"$project": {"_id": 1, "count": 1, "avg_score": 1}}
        ]
        pron_timeline = await db.pronunciation_attempts.aggregate(timeline_pipeline).to_list(None)
        
        sit_timeline_pipeline = [
            {"$match": {"submitted_at": {"$gte": two_weeks_ago}}},
            {"$project": {
                "date": {"$dateToString": {"format": "%Y-%m-%d", "date": "$submitted_at"}},
                "total_score": "$total_score",
                "max_score": {"$multiply": [{"$size": {"$ifNull": ["$situations", []]}}, 100]}
            }},
            {"$group": {
                "_id": "$date",
                "count": {"$sum": 1},
                "avg_accuracy": {"$avg": {"$cond": [{"$gt": ["$max_score", 0]}, {"$divide": ["$total_score", "$max_score"]}, 0]}}
            }},
            {"$project": {"_id": 1, "count": 1, "avg_accuracy": 1}}
        ]
        sit_timeline = await db.situation_attempts.aggregate(sit_timeline_pipeline).to_list(None)

        quiz_timeline_pipeline = [
            {"$match": {"submitted_at": {"$gte": two_weeks_ago}}},
            {"$project": {
                "date": {"$dateToString": {"format": "%Y-%m-%d", "date": "$submitted_at"}},
                "total_score": "$total_score",
                "max_score": {"$multiply": [{"$size": {"$ifNull": ["$results", []]}}, 100]}
            }},
            {"$group": {
                "_id": "$date",
                "count": {"$sum": 1},
                "avg_accuracy": {"$avg": {"$cond": [{"$gt": ["$max_score", 0]}, {"$divide": ["$total_score", "$max_score"]}, 0]}}
            }},
            {"$project": {"_id": 1, "count": 1, "avg_accuracy": 1}}
        ]
        quiz_timeline = await db.quiz_attempts.aggregate(quiz_timeline_pipeline).to_list(None)

        # 4. User Growth Timeline (Aggregation - Last 30 Days)
        one_month_ago = (now - timedelta(days=30)).replace(tzinfo=None)
        growth_pipeline = [
            {"$match": {"created_at": {"$gte": one_month_ago}}},
            {"$group": {
                "_id": {"$dateToString": {"format": "%Y-%m-%d", "date": "$created_at"}},
                "count": {"$sum": 1}
            }},
            {"$sort": {"_id": 1}},
            {"$project": {"date": "$_id", "count": 1, "_id": 0}}
        ]
        user_growth_timeline = await db.users.aggregate(growth_pipeline).to_list(None)

        # Merge activity timelines and use standard keys
        timeline_map = {}
        for r in pron_timeline:
            timeline_map[r["_id"]] = {"date": r["_id"], "pronunciation": r["count"], "quizzes": 0, "accuracy": r["avg_score"] or 0}
        
        for r in sit_timeline:
            if r["_id"] not in timeline_map:
                timeline_map[r["_id"]] = {"date": r["_id"], "pronunciation": 0, "quizzes": r["count"], "accuracy": (r["avg_accuracy"] or 0) * 100}
            else:
                timeline_map[r["_id"]]["quizzes"] += r["count"]
                # Adjusted weighted average
                timeline_map[r["_id"]]["accuracy"] = round((timeline_map[r["_id"]]["accuracy"] + (r["avg_accuracy"] or 0) * 100) / 2, 1)

        for r in quiz_timeline:
            if r["_id"] not in timeline_map:
                timeline_map[r["_id"]] = {"date": r["_id"], "pronunciation": 0, "quizzes": r["count"], "accuracy": (r["avg_accuracy"] or 0) * 100}
            else:
                timeline_map[r["_id"]]["quizzes"] += r["count"]
                timeline_map[r["_id"]]["accuracy"] = round((timeline_map[r["_id"]]["accuracy"] + (r["avg_accuracy"] or 0) * 100) / 2, 1)

        activity_timeline = sorted(timeline_map.values(), key=lambda x: x["date"])

        # 5. Error Distribution (Pronunciation) - Top 8
        error_pipeline = [
            {"$unwind": "$assessment.errors"},
            {"$group": {"_id": "$assessment.errors.error_type", "count": {"$sum": 1}}},
            {"$sort": {"count": -1}},
            {"$limit": 8},
            {"$project": {"type": "$_id", "count": 1, "_id": 0}}
        ]
        error_distribution = await db.pronunciation_attempts.aggregate(error_pipeline).to_list(None)

        # 6. Top Users (Engagement)
        top_users_pipeline = [
            {"$group": {"_id": "$user_id", "activity_count": {"$sum": 1}}},
            {"$sort": {"activity_count": -1}},
            {"$limit": 10},
            {"$lookup": {"from": "users", "localField": "_id", "foreignField": "_id", "as": "user"}},
            {"$unwind": "$user"},
            {"$project": {
                "id": {"$toString": "$user._id"},
                "name": {"$ifNull": ["$user.full_name", "Unknown"]},
                "username": "$user.username",
                "activity_count": 1,
                "avatar_color": {"$ifNull": ["$user.avatar_color", "#757575"]}
            }},
            {"$project": {"_id": 0, "id": 1, "name": 1, "username": 1, "activity_count": 1, "avatar_color": 1}}
        ]
        top_users = await db.pronunciation_attempts.aggregate(top_users_pipeline).to_list(None)

        # 7. Group Performance (Aggregation)
        group_perf_pipeline = [
            {"$match": {"group_id": {"$ne": None}}},
            {"$group": {
                "_id": "$group_id",
                "total_score": {"$sum": "$total_score"},
                "max_score": {"$sum": {"$multiply": [{"$size": {"$ifNull": ["$situations", []]}}, 100]}},
                "total_attempts": {"$sum": 1}
            }},
            {"$lookup": {"from": "groups", "localField": "_id", "foreignField": "_id", "as": "group"}},
            {"$unwind": "$group"},
            {"$project": {
                "id": {"$toString": "$_id"},
                "name": "$group.name",
                "avg_score": {"$cond": [{"$gt": ["$max_score", 0]}, {"$divide": [{"$multiply": ["$total_score", 100]}, "$max_score"]}, 0]},
                "count": "$total_attempts",
                "_id": 0
            }},
            {"$sort": {"count": -1}},
            {"$limit": 8}
        ]
        group_performance = await db.situation_attempts.aggregate(group_perf_pipeline).to_list(None)
        for g in group_performance: g["avg_score"] = round(g["avg_score"], 1)

        # 8. Situation Distribution (Perfect, Acceptable, Poor)
        sit_counts_pipeline = [
            {"$group": {
                "_id": None,
                "perfect": {"$sum": {"$ifNull": ["$perfect_count", 0]}},
                "acceptable": {"$sum": {"$ifNull": ["$acceptable_count", 0]}},
                "poor": {"$sum": {"$ifNull": ["$poor_count", 0]}},
                "total_questions": {"$sum": {"$size": {"$ifNull": ["$situations", []]}}},
                "total_score_sum": {"$sum": "$total_score"},
                "max_score_sum": {"$sum": {"$multiply": [{"$size": {"$ifNull": ["$situations", []]}}, 100]}}
            }},
            {"$project": {"_id": 0, "perfect": 1, "acceptable": 1, "poor": 1, "total_questions": 1, "total_score_sum": 1, "max_score_sum": 1}}
        ]
        sit_res = await db.situation_attempts.aggregate(sit_counts_pipeline).to_list(None)

        # 9. All-time global accuracy (Pronunciation)
        overall_pron_res = await db.pronunciation_attempts.aggregate([
            {"$group": {"_id": None, "avg_score": {"$avg": "$assessment.total_score"}}}
        ]).to_list(None)
        avg_pron_score = round(overall_pron_res[0]["avg_score"], 1) if overall_pron_res else 0

        # Aggregated stats for frontend
        return {
            "success": True,
            "data": {
                "overview": {
                    "total_users": users_count,
                    "total_pronunciation_attempts": pronunciation_attempts_count,
                    "total_quizzes_completed": total_quizzes_count,
                    "active_users_today": active_users_today
                },
                "activity_timeline": activity_timeline,
                "user_growth_timeline": user_growth_timeline,
                "group_performance": {
                    "pronunciation_top": group_performance # Used by frontend
                },
                "top_users": top_users,
                "pronunciation_metrics": {
                    "avg_score": avg_pron_score,
                    "error_distribution": error_distribution
                },
                "situation_metrics": {
                    "avg_accuracy": round((sit_res[0]["total_score_sum"] / (sit_res[0]["max_score_sum"] or 1) * 100) if sit_res else 0, 1),
                    "total_answered": sit_res[0]["total_questions"] if sit_res else 0,
                    "perfect_count": sit_res[0]["perfect"] if sit_res else 0,
                    "acceptable_count": sit_res[0]["acceptable"] if sit_res else 0,
                    "poor_count": sit_res[0]["poor"] if sit_res else 0
                }
            }
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch global stats: {str(e)}"
        )


# --- Content Management System (CMS) Endpoints ---

# 1. Groups Management
@router.get("/content/groups")
async def get_all_groups(db=Depends(get_database), current_admin: dict = Depends(require_admin)):
    """Fetch all groups including inactive ones for management."""
    groups = await db.groups.find().sort("group_number", 1).to_list(length=1000)
    for g in groups:
        g["id"] = str(g.pop("_id"))
    return {"success": True, "data": groups}


@router.post("/content/groups")
async def create_group(group: dict, db=Depends(get_database), current_admin: dict = Depends(require_admin)):
    """Create a new instruction group."""
    group["created_at"] = datetime.now(timezone.utc).replace(tzinfo=None)
    group["is_active"] = True
    result = await db.groups.insert_one(group)
    return {"success": True, "id": str(result.inserted_id)}


@router.patch("/content/groups/{group_id}")
async def update_group(group_id: str, group_update: dict, db=Depends(get_database), current_admin: dict = Depends(require_admin)):
    """Update instruction group."""
    result = await db.groups.update_one(
        {"_id": ObjectId(group_id)},
        {"$set": group_update}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Group not found")
    return {"success": True}


@router.delete("/content/groups/{group_id}")
async def delete_group(group_id: str, db=Depends(get_database), current_admin: dict = Depends(require_admin)):
    """Delete instruction group (soft delete)."""
    await db.groups.update_one(
        {"_id": ObjectId(group_id)},
        {"$set": {"is_active": False}}
    )
    return {"success": True}


# 2. Instructions Management
@router.get("/content/instructions")
async def get_instructions(group_id: str = None, db=Depends(get_database), current_admin: dict = Depends(require_admin)):
    """Fetch instructions, optionally filtered by group."""
    query = {}
    if group_id:
        query["group_id"] = ObjectId(group_id)
    
    instructions = await db.instructions.find(query).sort("instruction_number", 1).to_list(length=2000)
    for inst in instructions:
        inst["id"] = str(inst.pop("_id"))
        inst["group_id"] = str(inst["group_id"])
    return {"success": True, "data": instructions}


@router.post("/content/instructions")
async def create_instruction(inst: dict, db=Depends(get_database), current_admin: dict = Depends(require_admin)):
    """Create a new instruction."""
    inst["group_id"] = ObjectId(inst["group_id"])
    inst["created_at"] = datetime.now(timezone.utc).replace(tzinfo=None)
    if "is_active" not in inst: inst["is_active"] = True
    result = await db.instructions.insert_one(inst)
    return {"success": True, "id": str(result.inserted_id)}


@router.patch("/content/instructions/{id}")
async def update_instruction(id: str, inst_update: dict, db=Depends(get_database), current_admin: dict = Depends(require_admin)):
    """Update instruction."""
    if "group_id" in inst_update:
        inst_update["group_id"] = ObjectId(inst_update["group_id"])
    
    result = await db.instructions.update_one(
        {"_id": ObjectId(id)},
        {"$set": inst_update}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Instruction not found")
    return {"success": True}


@router.delete("/content/instructions/{id}")
async def delete_instruction(id: str, db=Depends(get_database), current_admin: dict = Depends(require_admin)):
    """Delete instruction (soft delete)."""
    await db.instructions.update_one(
        {"_id": ObjectId(id)},
        {"$set": {"is_active": False}}
    )
    return {"success": True}


# 3. Lessons Management
@router.get("/content/lessons")
async def get_lessons(group_id: str = None, db=Depends(get_database), current_admin: dict = Depends(require_admin)):
    """Fetch lessons, optionally filtered by group."""
    query = {}
    if group_id:
        query["group_id"] = ObjectId(group_id)
    
    lessons = await db.lessons.find(query).sort("lesson_number", 1).to_list(length=1000)
    for l in lessons:
        l["id"] = str(l.pop("_id"))
        if "group_id" in l: l["group_id"] = str(l["group_id"])
    return {"success": True, "data": lessons}


@router.post("/content/lessons")
async def create_lesson(lesson: dict, db=Depends(get_database), current_admin: dict = Depends(require_admin)):
    """Create a new lesson content."""
    if "group_id" in lesson: lesson["group_id"] = ObjectId(lesson["group_id"])
    lesson["created_at"] = datetime.now(timezone.utc).replace(tzinfo=None)
    if "is_active" not in lesson: lesson["is_active"] = True
    result = await db.lessons.insert_one(lesson)
    return {"success": True, "id": str(result.inserted_id)}


@router.patch("/content/lessons/{id}")
async def update_lesson(id: str, lesson_update: dict, db=Depends(get_database), current_admin: dict = Depends(require_admin)):
    """Update lesson content."""
    if "group_id" in lesson_update:
        lesson_update["group_id"] = ObjectId(lesson_update["group_id"])
    
    result = await db.lessons.update_one(
        {"_id": ObjectId(id)},
        {"$set": lesson_update}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Lesson not found")
    return {"success": True}


@router.delete("/content/lessons/{id}")
async def delete_lesson(id: str, db=Depends(get_database), current_admin: dict = Depends(require_admin)):
    """Delete lesson content (soft delete)."""
    await db.lessons.update_one(
        {"_id": ObjectId(id)},
        {"$set": {"is_active": False}}
    )
    return {"success": True}


# 4. Questions/Situations Management (Unified in quizzes collection)
@router.get("/content/quizzes")
async def get_quizzes(group_id: str = None, global_only: bool = False, db=Depends(get_database), current_admin: dict = Depends(require_admin)):
    """Fetch questions/quizzes from the unified 'quizzes' collection."""
    query = {}
    if global_only:
        query["group_id"] = None
    elif group_id:
        query["group_id"] = ObjectId(group_id)
    
    quizzes = await db.quizzes.find(query).sort("quiz_number", 1).to_list(length=2000)
    for q in quizzes:
        q["id"] = str(q.pop("_id"))
        if q.get("group_id"):
            q["group_id"] = str(q["group_id"])
    return {"success": True, "data": quizzes}


@router.post("/content/quizzes")
async def create_quiz(quiz: dict, db=Depends(get_database), current_admin: dict = Depends(require_admin)):
    """Create a new question/situation in the quizzes collection."""
    if quiz.get("group_id"):
        quiz["group_id"] = ObjectId(quiz["group_id"])
    else:
        quiz["group_id"] = None
        
    quiz["created_at"] = datetime.now(timezone.utc).replace(tzinfo=None)
    if "is_active" not in quiz: quiz["is_active"] = True
    
    result = await db.quizzes.insert_one(quiz)
    return {"success": True, "id": str(result.inserted_id)}


@router.patch("/content/quizzes/{id}")
async def update_quiz(id: str, quiz_update: dict, db=Depends(get_database), current_admin: dict = Depends(require_admin)):
    """Update quiz/question."""
    if quiz_update.get("group_id"):
        quiz_update["group_id"] = ObjectId(quiz_update["group_id"])
    
    result = await db.quizzes.update_one(
        {"_id": ObjectId(id)},
        {"$set": quiz_update}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Question not found")
    return {"success": True}


@router.delete("/content/quizzes/{id}")
async def delete_quiz(id: str, db=Depends(get_database), current_admin: dict = Depends(require_admin)):
    """Delete quiz/question (soft delete)."""
    await db.quizzes.update_one(
        {"_id": ObjectId(id)},
        {"$set": {"is_active": False}}
    )
    return {"success": True}


# Legacy Situation endpoints (pointing to quizzes collection now)
@router.get("/content/situations")
async def get_situations_legacy(group_id: str = None, db=Depends(get_database), current_admin: dict = Depends(require_admin)):
    return await get_quizzes(group_id=group_id, db=db, current_admin=current_admin)

@router.post("/content/situations")
async def create_situation_legacy(sit: dict, db=Depends(get_database), current_admin: dict = Depends(require_admin)):
    return await create_quiz(quiz=sit, db=db, current_admin=current_admin)

@router.patch("/content/situations/{id}")
async def update_situation_legacy(id: str, sit_update: dict, db=Depends(get_database), current_admin: dict = Depends(require_admin)):
    return await update_quiz(id=id, quiz_update=sit_update, db=db, current_admin=current_admin)

@router.delete("/content/situations/{id}")
async def delete_situation_legacy(id: str, db=Depends(get_database), current_admin: dict = Depends(require_admin)):
    return await delete_quiz(id=id, db=db, current_admin=current_admin)

    
