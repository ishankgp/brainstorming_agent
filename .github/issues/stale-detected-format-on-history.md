# Stale detected_format_id in EvaluationResponse on Reload

**Type:** Bug  
**Priority:** Normal  
**Effort:** Small

## TL;DR
When loading a session from history, the `detected_format_id` inside the evaluation object defaults to "F01", even if the statement itself has a different `selected_format`. This causes issues in the Comparison View for reloaded sessions.

## Current Behavior
In `api.py` `get_session`:
```python
eval_response = EvaluationResponse(
    ...
    detected_format_id="F01" # Default if not present in DB
)
```
The database model `ChallengeEvaluation` doesn't store the `detected_format_id` separately (it was recently added to the AI output). 

## Expected Behavior
1. The `ChallengeEvaluation` model should store the `detected_format_id`.
2. `get_session` should return the stored value, or at high level, the `selected_format` of the parent statement should be used as the default if a specific detection isn't found.

## Files to Touch
- [api.py](file:///d:/Github%20clones/brainstorming%20agent/backend/data_library/api.py)
- [models.py](file:///d:/Github%20clones/brainstorming%20agent/backend/data_library/models.py)
