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
        # Aggregated stats for all users
        pronunciation_attempts = await db.pronunciation_attempts.find().to_list(length=100000)
        situation_attempts = await db.situation_attempts.find().to_list(length=100000)
        users_count = await db.users.count_documents({})
        
        # 1. Activity Timeline (Last 14 days)
        now_naive = datetime.utcnow()
        start_date = (now_naive - timedelta(days=13)).replace(hour=0, minute=0, second=0, microsecond=0)
        
        timeline = { (start_date + timedelta(days=i)).date(): {
            "date": (start_date + timedelta(days=i)).date().isoformat(), 
            "pronunciation": 0, 
            "quizzes": 0,
            "accuracy_sum": 0,
            "accuracy_count": 0
        } for i in range(14) }
        
        for a in pronunciation_attempts:
            dt = a.get("created_at")
            if isinstance(dt, str):
                try: dt = datetime.fromisoformat(dt.replace('Z', ''))
                except: dt = None
            
            if isinstance(dt, datetime) and dt.date() in timeline:
                timeline[dt.date()]["pronunciation"] += 1
                score = a.get("assessment", {}).get("total_score") if a.get("assessment") else None
                if score is not None:
                    timeline[dt.date()]["accuracy_sum"] += score
                    timeline[dt.date()]["accuracy_count"] += 1

        for a in situation_attempts:
            dt = a.get("submitted_at")
            if isinstance(dt, str):
                try: dt = datetime.fromisoformat(dt.replace('Z', ''))
                except: dt = None

            if isinstance(dt, datetime) and dt.date() in timeline:
                timeline[dt.date()]["quizzes"] += 1
                score = a.get("total_score")
                max_score = len(a.get("situations", [])) * 100
                if score is not None and max_score > 0:
                    timeline[dt.date()]["accuracy_sum"] += (score / max_score) * 100
                    timeline[dt.date()]["accuracy_count"] += 1

        # Calculate average accuracy per day
        for d in timeline.values():
            d["avg_accuracy"] = round(d["accuracy_sum"] / d["accuracy_count"], 1) if d["accuracy_count"] > 0 else 0
            del d["accuracy_sum"]
            del d["accuracy_count"]

        activity_timeline = sorted(timeline.values(), key=lambda x: x["date"])

        # 1.1 User Growth (Last 14 days)
        all_users = await db.users.find().to_list(length=users_count)
        growth_timeline = []
        for i in range(14):
            check_date = (start_date + timedelta(days=i)).replace(hour=23, minute=59, second=59)
            # Count users created on or before this date
            count = 0
            for u in all_users:
                created_at = u.get("created_at")
                if isinstance(created_at, str):
                    try: created_at = datetime.fromisoformat(created_at.replace('Z', ''))
                    except: created_at = None
                
                if isinstance(created_at, datetime):
                    # Ensure created_at is naive for comparison
                    if created_at.tzinfo is not None:
                        created_at = created_at.replace(tzinfo=None)
                    
                    if created_at <= check_date:
                        count += 1
                elif not created_at: # Fallback for old users
                    count += 1
            
            growth_timeline.append({
                "date": check_date.date().isoformat(),
                "cumulative_users": count
            })

        # 2. Group Performance
        group_stats = defaultdict(lambda: {"total_score": 0, "attempts": 0, "name": "Unknown"})
        groups = await db.groups.find({"is_active": True}).to_list(length=100)
        group_names = {str(g["_id"]): g["name"] for g in groups}

        # Calculate pronunciation scores by group (via instruction_id)
        # First, map instructions to groups
        instructions = await db.instructions.find({"is_active": True}).to_list(length=2000)
        inst_to_group = {str(i["_id"]): str(i.get("group_id", "")) for i in instructions}

        for a in pronunciation_attempts:
            inst_id = str(a.get("instruction_id")) if a.get("instruction_id") else None
            score = a.get("assessment", {}).get("total_score") if a.get("assessment") else None
            if inst_id and inst_id in inst_to_group and score is not None:
                gid = inst_to_group[inst_id]
                group_stats[gid]["total_score"] += score
                group_stats[gid]["attempts"] += 1
                group_stats[gid]["name"] = group_names.get(gid, "Unknown")

        # Add situation scores by group
        for a in situation_attempts:
            gid = str(a.get("group_id")) if a.get("group_id") else None
            score = a.get("total_score")
            max_score = len(a.get("situations", [])) * 100
            if gid and score is not None and max_score > 0:
                percentage = (score / max_score) * 100
                group_stats[gid]["total_score"] += percentage
                group_stats[gid]["attempts"] += 1
                group_stats[gid]["name"] = group_names.get(gid, "Unknown")

        group_performance = []
        for gid, gs in group_stats.items():
            if gs["attempts"] > 0:
                group_performance.append({
                    "id": gid,
                    "name": gs["name"],
                    "average_score": round(gs["total_score"] / gs["attempts"], 1),
                    "total_attempts": gs["attempts"]
                })
        group_performance = sorted(group_performance, key=lambda x: x["total_attempts"], reverse=True)[:8]

        # 3. User Engagement (Top Users)
        user_engagement = defaultdict(int)
        for a in pronunciation_attempts:
            user_engagement[str(a.get("user_id"))] += 1
        for a in situation_attempts:
            user_engagement[str(a.get("user_id"))] += 1
        
        top_users_data = []
        sorted_users = sorted(user_engagement.items(), key=lambda x: x[1], reverse=True)[:10]
        for uid, count in sorted_users:
            if uid and uid != "None" and len(uid) == 24:
                u = await db.users.find_one({"_id": ObjectId(uid)})
            else:
                u = None
            if u:
                top_users_data.append({
                    "id": uid,
                    "name": u.get("full_name", "Unknown"),
                    "username": u.get("username"),
                    "activity_count": count,
                    "avatar_color": u.get("avatar_color", "#757575")
                })

        # --- RESTORED STATS ---
        # Calculate Pronunciation Stats
        pron_scores = []
        mastery_map = {} # user_id -> instruction_id -> best_score
        error_distribution = {}
        
        for a in pronunciation_attempts:
            user_id = str(a.get("user_id"))
            score = a.get("assessment", {}).get("total_score") if a.get("assessment") else None
            if score is not None:
                pron_scores.append(score)
                
                # Mastery tracking
                inst_id = str(a.get("instruction_id")) if a.get("instruction_id") else None
                if inst_id:
                    if user_id not in mastery_map:
                        mastery_map[user_id] = {}
                    current_best = mastery_map[user_id].get(inst_id, 0)
                    mastery_map[user_id][inst_id] = max(current_best, score)

            # Error distribution
            if a.get("assessment"):
                for error in a["assessment"].get("errors", []):
                    err_type = error.get("error_type", "unknown")
                    error_distribution[err_type] = error_distribution.get(err_type, 0) + 1

        # Calculate average mastery % across all users
        user_mastery_percentages = []
        for user_id, inst_scores in mastery_map.items():
            total_unique = len(inst_scores)
            if total_unique > 0:
                mastered = len([s for s in inst_scores.values() if s >= 90])
                user_mastery_percentages.append((mastered / total_unique) * 100)
        
        avg_mastery = sum(user_mastery_percentages) / len(user_mastery_percentages) if user_mastery_percentages else 0

        # Calculate Situation Stats
        total_questions = sum(len(a.get("situations", [])) for a in situation_attempts)
        perfect_answers = sum(a.get("perfect_count", 0) for a in situation_attempts)
        acceptable_answers = sum(a.get("acceptable_count", 0) for a in situation_attempts)
        poor_answers = sum(a.get("poor_count", 0) for a in situation_attempts)
        
        situation_scores_sums = [] # normalized percentages
        for a in situation_attempts:
            max_s = len(a.get("situations", [])) * 100
            if max_s > 0:
                situation_scores_sums.append((a.get("total_score", 0) / max_s) * 100)
        # --- END RESTORED STATS ---

        return {
            "success": True,
            "data": {
                "overview": {
                    "total_users": users_count,
                    "total_pronunciation_attempts": len(pronunciation_attempts),
                    "total_quizzes_completed": len(situation_attempts),
                    "active_users_today": len(set([str(a["user_id"]) for a in pronunciation_attempts if (a.get("created_at") if isinstance(a.get("created_at"), datetime) else datetime.min).replace(tzinfo=None).date() == now_naive.date()]))
                },
                "activity_timeline": activity_timeline,
                "user_growth_timeline": growth_timeline,
                "group_performance": group_performance,
                "top_users": top_users_data,
                "pronunciation": {
                    "average_score": round(sum(pron_scores) / len(pron_scores), 1) if pron_scores else 0,
                    "average_mastery": round(avg_mastery, 1),
                    "error_distribution": error_distribution
                },
                "situations": {
                    "average_accuracy": round(sum(situation_scores_sums) / len(situation_scores_sums), 1) if situation_scores_sums else 0,
                    "total_questions": total_questions,
                    "perfect_answers": perfect_answers,
                    "acceptable_answers": acceptable_answers,
                    "poor_answers": poor_answers
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
@router.post("/content/groups")
async def create_group(group: dict, db=Depends(get_database)):
    """Create a new instruction group."""
    group["created_at"] = datetime.utcnow()
    group["is_active"] = True
    result = await db.groups.insert_one(group)
    return {"success": True, "id": str(result.inserted_id)}


@router.patch("/content/groups/{group_id}")
async def update_group(group_id: str, group_update: dict, db=Depends(get_database)):
    """Update instruction group."""
    result = await db.groups.update_one(
        {"_id": ObjectId(group_id)},
        {"$set": group_update}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Group not found")
    return {"success": True}


@router.delete("/content/groups/{group_id}")
async def delete_group(group_id: str, db=Depends(get_database)):
    """Delete instruction group (soft delete)."""
    await db.groups.update_one(
        {"_id": ObjectId(group_id)},
        {"$set": {"is_active": False}}
    )
    return {"success": True}


# 2. Instructions Management
@router.get("/content/instructions")
async def get_instructions(group_id: str = None, db=Depends(get_database)):
    """Fetch instructions, optionally filtered by group."""
    query = {"is_active": True}
    if group_id:
        query["group_id"] = ObjectId(group_id)
    
    instructions = await db.instructions.find(query).sort("instruction_number", 1).to_list(length=1000)
    for inst in instructions:
        inst["id"] = str(inst.pop("_id"))
        inst["group_id"] = str(inst["group_id"])
    return {"success": True, "data": instructions}


@router.post("/content/instructions")
async def create_instruction(inst: dict, db=Depends(get_database)):
    """Create a new instruction."""
    inst["group_id"] = ObjectId(inst["group_id"])
    inst["created_at"] = datetime.utcnow()
    inst["is_active"] = True
    result = await db.instructions.insert_one(inst)
    return {"success": True, "id": str(result.inserted_id)}


@router.patch("/content/instructions/{id}")
async def update_instruction(id: str, inst_update: dict, db=Depends(get_database)):
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
async def delete_instruction(id: str, db=Depends(get_database)):
    """Delete instruction."""
    await db.instructions.update_one(
        {"_id": ObjectId(id)},
        {"$set": {"is_active": False}}
    )
    return {"success": True}


# 3. Situations Management
@router.get("/content/situations")
async def get_situations(group_id: str = None, db=Depends(get_database)):
    """Fetch situations, optionally filtered by group."""
    query = {"is_active": True}
    if group_id:
        query["group_id"] = ObjectId(group_id)
    
    situations = await db.situations.find(query).sort("situation_number", 1).to_list(length=1000)
    for sit in situations:
        sit["id"] = str(sit.pop("_id"))
        sit["group_id"] = str(sit["group_id"])
    return {"success": True, "data": situations}


@router.post("/content/situations")
async def create_situation(sit: dict, db=Depends(get_database)):
    """Create a new situation."""
    sit["group_id"] = ObjectId(sit["group_id"])
    sit["created_at"] = datetime.utcnow()
    sit["is_active"] = True
    result = await db.situations.insert_one(sit)
    return {"success": True, "id": str(result.inserted_id)}


@router.patch("/content/situations/{id}")
async def update_situation(id: str, sit_update: dict, db=Depends(get_database)):
    """Update situation."""
    if "group_id" in sit_update:
        sit_update["group_id"] = ObjectId(sit_update["group_id"])
    
    result = await db.situations.update_one(
        {"_id": ObjectId(id)},
        {"$set": sit_update}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Situation not found")
    return {"success": True}


@router.delete("/content/situations/{id}")
async def delete_situation(id: str, db=Depends(get_database)):
    """Delete situation."""
    await db.situations.update_one(
        {"_id": ObjectId(id)},
        {"$set": {"is_active": False}}
    )
    return {"success": True}
    
