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

MONGODB_URL = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
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
    
    # 4. Create Situations
    print("\n🎭 Creating situations...")
    
    # Support both old and new structure (fallback if needed, but we expect new)
    situations_by_group = data.get('situationsByGroup')
    situations = []
    
    if situations_by_group:
        print("   Found grouped situations structure.")
        for group_num_str, templates in situations_by_group.items():
            try:
                group_num = int(group_num_str)
                # group_ids is 0-indexed, group_number is 1-indexed
                if group_num < 1 or group_num > len(group_ids):
                    print(f"   ⚠️  Skipping group {group_num}: No matching group created.")
                    continue
                
                group_id = group_ids[group_num - 1]
                
                for i, template in enumerate(templates):
                    situation_number = i + 1
                    situations.append({
                        "group_id": group_id,
                        "situation_number": situation_number,
                        "title": f"Scenario {situation_number}",
                        "question": template.get("question") or template.get("description"), # Map to question
                        "choices": template["choices"],
                        "best_choice_id": template["best_choice_id"],
                        "detailed_explanation": template.get("detailed_explanation"),
                        "created_at": datetime.utcnow(),
                        "is_active": True
                    })
            except ValueError:
                print(f"   ⚠️  Skipping invalid group key: {group_num_str}")
    else:
        # Fallback for old structure (or if parse failed)
        print("   ⚠️  Using legacy flat situations structure.")
        situation_templates = data.get('situations', [])
        situations_per_group = 10
        target_groups = 5
        
        for i, template in enumerate(situation_templates):
            if i >= situations_per_group * target_groups:
                break
                
            group_index = i // situations_per_group
            if group_index >= len(group_ids):
                break
                
            group_id = group_ids[group_index]
            situation_number = (i % situations_per_group) + 1
            
            situations.append({
                "group_id": group_id,
                "situation_number": situation_number,
                "title": f"Scenario {situation_number}",
                "question": template.get("question") or template.get("description"), # Map to question
                "choices": template["choices"],
                "best_choice_id": template["best_choice_id"],
                "detailed_explanation": template.get("detailed_explanation"),
                "created_at": datetime.utcnow(),
                "is_active": True
            })
            
    if situations:
        await db.situations.insert_many(situations)
        print(f"   ✓ Created {len(situations)} situations")
        
        # Update group situation counts
        # We need to count per group now properly
        for idx, group_id in enumerate(group_ids):
            # idx is 0-based, group_num is idx+1
            group_num = idx + 1
            count = 0
            
            # Count from our new list? Or just check if key exists
            if situations_by_group and str(group_num) in situations_by_group:
                 count = len(situations_by_group[str(group_num)])
            elif not situations_by_group and idx < 5:
                 count = 10 # Legacy fallback
            
            await db.groups.update_one(
                {"_id": group_id},
                {"$set": {"situation_count": count}}
            )
    
    print("\n" + "=" * 50)
    print("✅ Database reloaded successfully!")
    print("\n📌 Summary:")
    print(f"   Users: {len(users)}")
    print(f"   Groups: {len(groups_data)}")
    print(f"   Instructions: {len(instructions)}")
    print(f"   Situations: {len(situations)}")
    print("\n")
    
    client.close()


if __name__ == "__main__":
    asyncio.run(reload_database())
