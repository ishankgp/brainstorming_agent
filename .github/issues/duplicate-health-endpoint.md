# Duplicate `/health` Endpoint in API

**Type:** Bug  
**Priority:** Low  
**Effort:** Small

## TL;DR
`api.py` has two `/health` endpoints defined. FastAPI silently uses the last one, making behavior unpredictable.

## Current Behavior
- Line 123-126: `async def health_check()` returns `{"status": "ok", ...}`
- Line 417-420: `def health_check()` returns `{"status": "healthy", ...}`

Only the second one is active; the first is dead code.

## Expected Behavior
Single `/health` endpoint with consistent response.

## Files to Touch
- [api.py](file:///d:/Github%20clones/brainstorming%20agent/backend/data_library/api.py) (lines 123-126 or 417-420)

## Fix
Remove one of the duplicate definitions.
