# No Pagination for Session History

**Type:** UX Bug / Scalability  
**Priority:** Low  
**Effort:** Small

## TL;DR
The `/api/sessions` endpoint is hard-limited to 20 results with no way to load older history.

## Current Behavior
- Returns exactly 20 most recent sessions.
- No `offset` or `page` parameters.
- No `hasMore` or `total_count` metadata.

## Expected Behavior
Add standard pagination support or a "Load More" mechanism.

## Files to Touch
- [api.py](file:///d:/Github%20clones/brainstorming%20agent/backend/data_library/api.py)
