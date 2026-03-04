"""
Database seed script.
Run: python -m backend.seed.seed_db
"""
import json
import asyncio
from pathlib import Path
from uuid import uuid4

SEED_DIR = Path(__file__).parent


def load_json(filename: str):
    """Load a JSON seed file."""
    filepath = SEED_DIR / filename
    with open(filepath, "r", encoding="utf-8") as f:
        return json.load(f)


async def seed_database():
    """
    Seed the database with initial data.
    
    This script loads JSON fixtures and inserts them into the database.
    It's idempotent — running it multiple times won't create duplicates.
    """
    # Lazy import to avoid circular imports
    from backend.app.core.database import async_session, engine, Base
    from backend.app.models.user import User
    from backend.app.models.task import Task

    print("🌱 Starting database seed...")

    # Create tables
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    # Load fixtures
    users_data = load_json("users.json")
    tasks_data = load_json("tasks.json")

    async with async_session() as session:
        # Seed users
        for user_data in users_data:
            user = User(
                id=uuid4(),
                email=user_data["email"],
                full_name=user_data["full_name"],
                role=user_data["role"],
                college=user_data.get("college"),
                hashed_password=user_data["password_hash"],
            )
            session.add(user)
        
        # Seed tasks
        for task_data in tasks_data:
            task = Task(
                id=uuid4(),
                title=task_data["title"],
                description=task_data["description"],
                task_type=task_data["task_type"],
                difficulty=task_data["difficulty"],
                language=task_data.get("language", "python"),
                time_limit_minutes=task_data.get("time_limit_minutes", 30),
                starter_code=task_data.get("starter_code"),
                test_cases=task_data.get("test_cases"),
                evaluation_rubric=task_data.get("evaluation_rubric"),
            )
            session.add(task)

        try:
            await session.commit()
            print(f"  ✅ Seeded {len(users_data)} users")
            print(f"  ✅ Seeded {len(tasks_data)} tasks")
        except Exception as e:
            await session.rollback()
            print(f"  ⚠️  Seed skipped (data may already exist): {e}")

    print("🌱 Database seed complete!")


if __name__ == "__main__":
    asyncio.run(seed_database())
