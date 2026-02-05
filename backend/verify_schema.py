from data_library.database import get_db_session, engine, Base
from data_library.models import ChallengeStatement, ChallengeSession

def verify_schema():
    print("Initializing DB...")
    Base.metadata.create_all(bind=engine)
    db = next(get_db_session())
    
    print("Creating dummy session...")
    session = ChallengeSession(brief_text="Test", status="completed")
    db.add(session)
    db.commit()
    
    print("Creating dummy statement with timing...")
    stmt = ChallengeStatement(
        session_id=session.id,
        text="Test Statement",
        selected_format="F01",
        reasoning="Test",
        position=1,
        generation_time_ms=1234,
        evaluation_time_ms=567
    )
    db.add(stmt)
    db.commit()
    
    print("Reading back...")
    fresh_stmt = db.query(ChallengeStatement).filter_by(id=stmt.id).first()
    
    if fresh_stmt.generation_time_ms == 1234 and fresh_stmt.evaluation_time_ms == 567:
        print("SUCCESS: Timing fields persisted correctly.")
    else:
        print(f"FAILURE: Got gen={fresh_stmt.generation_time_ms}, eval={fresh_stmt.evaluation_time_ms}")

if __name__ == "__main__":
    verify_schema()
