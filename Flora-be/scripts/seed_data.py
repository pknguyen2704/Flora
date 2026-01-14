"""Database seed script for development."""
import asyncio
import sys
import os
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


async def seed_database():
    """Seed the database with initial data."""
    client = AsyncIOMotorClient(MONGODB_URL)
    db = client[MONGODB_DB_NAME]
    
    print(f"\n🌱 Seeding database: {MONGODB_DB_NAME}")
    print("=" * 50)
    
    # Clear existing data (be careful in production!)
    print("\n⚠️  Clearing existing data...")
    await db.users.delete_many({})
    await db.groups.delete_many({})
    await db.instructions.delete_many({})
    await db.situations.delete_many({})
    await db.admin_config.delete_many({})
    
    # 1. Create Users
    print("\n📝 Creating users...")
    users = [
        {
            "username": "admin",
            "email": "admin@flora.local",
            "password_hash": hash_password("admin123"),
            "full_name": "Admin User",
            "role": "admin",
            "is_active": True,
            "created_at": datetime.utcnow(),
            "stats": {
                "total_pronunciation_attempts": 0,
                "total_situation_attempts": 0,
                "average_pronunciation_score": 0,
                "total_study_time_minutes": 0
            }
        },
        {
            "username": "student001",
            "email": "student001@flora.local",
            "password_hash": hash_password("password123"),
            "full_name": "Nguyễn Văn A",
            "role": "user",
           "is_active": True,
            "created_at": datetime.utcnow(),
            "stats": {
                "total_pronunciation_attempts": 0,
                "total_situation_attempts": 0,
                "average_pronunciation_score": 0,
                "total_study_time_minutes": 0
            }
        },
        {
            "username": "student002",
            "email": "student002@flora.local",
            "password_hash": hash_password("password123"),
            "full_name": "Trần Thị B",
            "role": "user",
            "is_active": True,
            "created_at": datetime.utcnow(),
            "stats": {
                "total_pronunciation_attempts": 0,
                "total_situation_attempts": 0,
                "average_pronunciation_score": 0,
                "total_study_time_minutes": 0
            }
        }
    ]
    await db.users.insert_many(users)
    print(f"   ✓ Created {len(users)} users")
    
    # 2. Create Groups
    print("\n📚 Creating groups...")
    groups_data = [
        {
            "group_number": 1,
            "name": "Classroom Management",
            "description": "Instructions and situations for managing classroom behavior and activities",
            "color_hex": "#0066CC",
            "is_active": True,
            "created_at": datetime.utcnow(),
            "instruction_count": 0,
            "situation_count": 0
        },
        {
            "group_number": 2,
            "name": "Time Management",
            "description": "Instructions for managing time, transitions, and schedules",
            "color_hex": "#00AA66",
            "is_active": True,
            "created_at": datetime.utcnow(),
            "instruction_count": 0,
            "situation_count": 0
        },
        {
            "group_number": 3,
            "name": "Student Engagement",
            "description": "Instructions for encouraging participation and attention",
            "color_hex": "#FF6600",
            "is_active": True,
            "created_at": datetime.utcnow(),
            "instruction_count": 0,
            "situation_count": 0
        },
        {
            "group_number": 4,
            "name": "Academic Support",
            "description": "Instructions for helping students with learning tasks",
            "color_hex": "#9900CC",
            "is_active": True,
            "created_at": datetime.utcnow(),
            "instruction_count": 0,
            "situation_count": 0
        },
        {
            "group_number": 5,
            "name": "Classroom Procedures",
            "description": "Instructions for daily routines and class procedures",
            "color_hex": "#CC0066",
            "is_active": True,
            "created_at": datetime.utcnow(),
            "instruction_count": 0,
            "situation_count": 0
        }
    ]
    group_result = await db.groups.insert_many(groups_data)
    group_ids = list(group_result.inserted_ids)
    print(f"   ✓ Created {len(groups_data)} groups")
    
    # 3. Create Instructions (20 per group)
    print("\n💬 Creating instructions...")
    instruction_templates = [
        "Please open your books to page thirty-three.",
        "Take out your homework and place it on your desk.",
        "Listen carefully to the instructions.",
        "Raise your hand if you have a question.",
        "Work quietly with your partner.",
        "Think before you speak.",
        "Please line up at the door.",
        "Put away your materials.",
        "Look at the board.",
        "Complete the worksheet on your own.",
        "Share your ideas with the class.",
        "Remember to write your name on your paper.",
        "Use a pencil for this assignment.",
        "Check your work when you finish.",
        "Ask your neighbor for help if needed.",
        "Stay in your seat until the bell rings.",
        "Speak loudly enough for everyone to hear.",
        "Follow along as I read.",
        "Turn in your assignment when you're done.",
        "Wait for everyone to be ready before we start."
    ]
    
    instructions = []
    for group_id in group_ids:
        for i, text in enumerate(instruction_templates, 1):
            instructions.append({
                "group_id": group_id,
                "instruction_number": i,
                "text": text,
                "difficulty_level": ["easy", "medium", "hard"][i % 3],
                "phonetic_focus": ["th-sound", "r-sound", "consonant-cluster", "vowel-sounds"][i % 4],
                "audio_url": f"/audio/reference/group{group_ids.index(group_id)+1}_inst{i}.mp3",
                "created_at": datetime.utcnow(),
                "is_active": True
            })
    
    await db.instructions.insert_many(instructions)
    print(f"   ✓ Created {len(instructions)} instructions")
    
    # Update group instruction counts
    for group_id in group_ids:
        await db.groups.update_one(
            {"_id": group_id},
            {"$set": {"instruction_count": 20}}
        )
    
    # 4. Create Situations (20 per group)
    print("\n🎭 Creating situations...")
    situation_templates = [
        {
            "title": "Noisy Student",
            "description": "A student is talking loudly while you are explaining the lesson. What do you say?",
            "choices": [
                {"choice_id": "A", "text": "Please be quiet and listen.", "rating": "best", "explanation": "Direct, clear, and respectful. Sets clear expectations."},
                {"choice_id": "B", "text": "Could you please keep your voice down?", "rating": "acceptable", "explanation": "Polite but less direct. May need repetition."},
                {"choice_id": "C", "text": "Stop talking now!", "rating": "not_recommended", "explanation": "Too harsh and may create confrontation."}
            ],
            "best_choice_id": "A"
        },
        {
            "title": "Student Forgot Homework",
            "description": "A student tells you they forgot their homework at home. How do you respond?",
            "choices": [
                {"choice_id": "A", "text": "Please bring it tomorrow.", "rating": "best", "explanation": "Understanding while maintaining expectations."},
                {"choice_id": "B", "text": "That's okay, don't worry about it.", "rating": "not_recommended", "explanation": "Too lenient, doesn't reinforce responsibility."},
                {"choice_id": "C", "text": "You need to be more responsible.", "rating": "acceptable", "explanation": "Addresses the issue but could be more constructive."}
            ],
            "best_choice_id": "A"
        },
        # More situations would be added here...
    ]
    
    situations = []
    for group_id in group_ids:
        for i in range(1, 21):
            template = situation_templates[i % len(situation_templates)]
            situations.append({
                "group_id": group_id,
                "situation_number": i,
                "title": f"{template['title']} (Scenario {i})",
                "description": template["description"],
                "choices": template["choices"],
                "best_choice_id": template["best_choice_id"],
                "created_at": datetime.utcnow(),
                "is_active": True
            })
    
    await db.situations.insert_many(situations)
    print(f"   ✓ Created {len(situations)} situations")
    
    # Update group situation counts
    for group_id in group_ids:
        await db.groups.update_one(
            {"_id": group_id},
            {"$set": {"situation_count": 20}}
        )
    
    # 5. Create Admin Config
    print("\n⚙️  Creating admin config...")
    config = {
        "config_key": "pronunciation_penalties",
        "config_value": {
            "wrong_word": {"mild": 5, "moderate": 10, "severe": 20},
            "missing_word": {"mild": 5, "moderate": 10, "severe": 15},
            "phoneme_error": {"mild": 3, "moderate": 7, "severe": 15},
            "ending_sound": {"mild": 3, "moderate": 5, "severe": 10},
            "clarity_speed": {"mild": 2, "moderate": 5, "severe": 10}
        },
        "description": "Point penalties for pronunciation errors",
        "updated_at": datetime.utcnow()
    }
    await db.admin_config.insert_one(config)
    print("   ✓ Created admin config")
    
    print("\n" + "=" * 50)
    print("✅ Database seeded successfully!")
    print("\n📌 Test Accounts:")
    print("   Admin:  admin / admin123")
    print("   User 1: student001 / password123")
    print("   User 2: student002 / password123")
    print("\n")
    
    client.close()


if __name__ == "__main__":
    asyncio.run(seed_database())
