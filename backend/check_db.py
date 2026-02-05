from data_library.database import get_db_session
from data_library.models import ChallengeSession, ChallengeStatement

db = next(get_db_session())
sessions = db.query(ChallengeSession).all()
print(f"Total Sessions: {len(sessions)}")
for s in sessions:
    print(f"- Session {s.id}: Status={s.status}, StmtCount={len(s.challenge_statements)}")
