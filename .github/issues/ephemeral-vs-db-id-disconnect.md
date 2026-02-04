# Disconnect Between Ephemeral Stream IDs and DB IDs

**Type:** Bug  
**Priority:** Normal  
**Effort:** Medium

## TL;DR
During streaming, statements are assigned temporary IDs (1, 2, 3...) based on their loop index. However, the database assigns its own auto-incrementing IDs. This causes a disconnect after the session is saved or reloaded.

## Current Behavior
1. Stream sends `id: 1` to frontend.
2. Backend saves to DB; DB assigns `id: 142`.
3. Client uses `id: 1` for local state tracking (e.g., `handleUpdateStatement`).
4. If the page is refreshed or history is loaded, the statement now has `id: 142`.

If any logic relies on the ID being consistent across sessions, it will break.

## Expected Behavior
The backend should ideally return the database ID in the stream, or the frontend should handle the ID re-mapping once the `complete` event is received with the real session data.

## Files to Touch
- [api.py](file:///d:/Github%20clones/brainstorming%20agent/backend/data_library/api.py)
- [page.tsx](file:///d:/Github%20clones/brainstorming%20agent/frontend/app/page.tsx)
