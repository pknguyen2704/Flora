#!/usr/bin/env python3
"""
Reload database from data.js configuration file.
Usage: python reload_data.py
"""
import asyncio
import sys
import os
import json
import subprocess
from pathlib import Path

# Add parent directory to Python path
sys.path.insert(0, str(Path(__file__).parent.parent))

from motor.motor_asyncio import AsyncIOMotorClient
from datetime import datetime
from app.core.security import hash_password
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

MONGODB_URL = os.getenv("MONGO_URI") or os.getenv("MONGODB_URL", "mongodb://localhost:27017")
MONGODB_DB_NAME = os.getenv("MONGODB_DB_NAME", "flora_db")


def load_data_js():
    """Load data from data.js file using Node.js."""
    try:
        # Use Node.js to parse the JavaScript file
        result = subprocess.run(
            ['node', '-e', 'const data = require("./data.js"); console.log(JSON.stringify(data));'],
            cwd=Path(__file__).parent,
            capture_output=True,
            text=True,
            encoding='utf-8',
            check=True
        )
        return json.loads(result.stdout)
    except subprocess.CalledProcessError as e:
        print(f"❌ Error loading data.js: {e.stderr}")
        sys.exit(1)
    except json.JSONDecodeError as e:
        print(f"❌ Error parsing data.js output: {e}")
        sys.exit(1)


async def reload_database():
    """Reload the database with data from data.js."""
    client = AsyncIOMotorClient(MONGODB_URL)
    db = client[MONGODB_DB_NAME]
    
    print(f"\n🔄 Reloading database: {MONGODB_DB_NAME}")
    print("=" * 50)
    
    # Load data from data.js
    print("\n📂 Loading data from data.js...")
    data = load_data_js()
    print("   ✓ Data loaded successfully")
    
    # Clear existing data
    print("\n⚠️  Clearing existing data...")
    await db.users.delete_many({})
    await db.groups.delete_many({})
    await db.instructions.delete_many({})
    await db.situations.delete_many({})
    print("   ✓ Data cleared")
    
    # 1. Create Users
    print("\n📝 Creating users...")
    users = []
    for user_data in data.get('users', []):
        users.append({
            "username": user_data["username"],
            "email": user_data["email"],
            "password_hash": hash_password(user_data["password"]),
            "full_name": user_data["full_name"],
            "role": user_data["role"],
            "is_active": True,
            "created_at": datetime.utcnow(),
            "stats": {
                "total_pronunciation_attempts": 0,
                "total_situation_attempts": 0,
                "average_pronunciation_score": 0,
                "total_study_time_minutes": 0
            }
        })
    
    if users:
        await db.users.insert_many(users)
        print(f"   ✓ Created {len(users)} users")
    
    # 2. Create Groups
    print("\n📚 Creating groups...")
    groups_data = []
    for group in data.get('groups', []):
        groups_data.append({
            "group_number": group["group_number"],
            "name": group["name"],
            "description": group["description"],
            "color_hex": group["color_hex"],
            "is_active": True,
            "created_at": datetime.utcnow(),
            "instruction_count": 0,
            "situation_count": 0
        })
    
    group_result = await db.groups.insert_many(groups_data)
    group_ids = list(group_result.inserted_ids)
    print(f"   ✓ Created {len(groups_data)} groups")
    
    # 3. Create Instructions
    print("\n💬 Creating instructions...")
    instructions_by_group = data.get('instructionsByGroup', {})
    instructions = []
    
    for idx, group_id in enumerate(group_ids, 1):
        group_instructions = instructions_by_group.get(str(idx), [])
        for i, text in enumerate(group_instructions, 1):
            instructions.append({
                "group_id": group_id,
                "instruction_number": i,
                "text": text,
                "difficulty_level": ["easy", "medium", "hard"][i % 3],
                "phonetic_focus": ["th-sound", "r-sound", "consonant-cluster", "vowel-sounds"][i % 4],
                "audio_url": f"/audio/reference/group{idx}_inst{i}.mp3",
                "created_at": datetime.utcnow(),
                "is_active": True
            })
    
    if instructions:
        await db.instructions.insert_many(instructions)
        print(f"   ✓ Created {len(instructions)} instructions")
        
        # Update group instruction counts
        for idx, group_id in enumerate(group_ids, 1):
            group_instructions = instructions_by_group.get(str(idx), [])
            await db.groups.update_one(
                {"_id": group_id},
                {"$set": {"instruction_count": len(group_instructions)}}
            )
    
    # 4. Create Quizzes
    print("\n🎭 Creating group quizzes...")
    
    quizzes_by_group = data.get('quizzes', {})
    quizzes = []
    
    for idx, group_id in enumerate(group_ids, 1):
        group_quizzes = quizzes_by_group.get(str(idx), [])
        for i, q in enumerate(group_quizzes, 1):
            quizzes.append({
                "group_id": group_id,
                "quiz_number": i,
                "question": q["question"],
                "choices": q["choices"],
                "best_choice_id": q["best_choice_id"],
                "explanation": q.get("explanation"),
                "principle": q.get("principle"),
                "created_at": datetime.utcnow(),
                "is_active": True
            })
            
    if quizzes:
        await db.quizzes.insert_many(quizzes)
        print(f"   ✓ Created {len(quizzes)} group quizzes")
        
        # Update group situation_count (quizzes)
        for idx, group_id in enumerate(group_ids, 1):
            group_quizzes = quizzes_by_group.get(str(idx), [])
            await db.groups.update_one(
                {"_id": group_id},
                {"$set": {"situation_count": len(group_quizzes)}}
            )
    
    print("\n" + "=" * 50)
    print("✅ Database reloaded successfully!")
    print("\n📌 Summary:")
    print(f"   Users: {len(users)}")
    print(f"   Groups: {len(groups_data)}")
    print(f"   Instructions: {len(instructions)}")
    print(f"   Quizzes: {len(quizzes)}")
    print("\n")
    
    client.close()


if __name__ == "__main__":
    asyncio.run(reload_database())
