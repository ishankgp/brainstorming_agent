"""
Check recent sessions in the database to debug backend issues
"""
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from data_library.models import ChallengeSession, Base, generate_uuid
import os

# Connect to DB
db_path = "sqlite:///./brainstorm_challenge.db"
if not os.path.exists("./brainstorm_challenge.db"):
    db_path = "sqlite:///./brainstorm.db" # Callback to old name if needed?
    # Actually my api.py uses ./brainstorm_challenge.db via config?
    # Let's check api.py or database.py for the actual path.
    # checking database.py assumption:
    pass

from data_library.database import engine

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def check_sessions():
    db = SessionLocal()
    try:
        print("🔍 Checking recent sessions...")
        sessions = db.query(ChallengeSession).order_by(ChallengeSession.created_at.desc()).limit(5).all()
        
        if not sessions:
            print("❌ No sessions found in database.")
            return

        for s in sessions:
            print(f"ID: {s.id}")
            print(f"Created: {s.created_at}")
            print(f"Status: {s.status}")
            if s.error_message:
                print(f"Error: {s.error_message}")
            print(f"Statements: {len(s.challenge_statements)}")
            print("-" * 30)
            
    except Exception as e:
        print(f"❌ Error reading database: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    check_sessions()
