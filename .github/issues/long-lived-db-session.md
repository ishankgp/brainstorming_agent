# Potential DB Session Timeout during Streaming

**Type:** Infrastructure / Bug  
**Priority:** Low  
**Effort:** Medium

## TL;DR
The `stream_and_save_generator` uses a single database session injected via FastAPI dependency. Since the generator can stay open for minutes (while AI generates 5 statements sequentially), the underlying DB connection might time out or be closed by the server, causing the stream to crash.

## Current Behavior
```python
# api.py
async def stream_and_save_generator(request: ChallengeRequest, session: ChallengeSession, db: Session):
    async for chunk_str in generate_challenges_stream(...):
        # ...
        db.commit() # Uses the same db session repeatedly over minutes
```

## Expected Behavior
For long-running streams, it might be safer to open/close a new session for each database write, or ensure the pool has aggressive "keep-alive" settings.

## Files to Touch
- [api.py](file:///d:/Github%20clones/brainstorming%20agent/backend/data_library/api.py)
- [database.py](file:///d:/Github%20clones/brainstorming%20agent/backend/data_library/database.py)
