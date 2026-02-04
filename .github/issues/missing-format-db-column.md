# Missing DB Column for Format Classification

**Type:** Bug  
**Priority:** Normal  
**Effort:** Medium

## TL;DR
The backend now detects the challenge format during evaluation, but this information is not persisted in the database.

## Current Behavior
- `api.py` includes `detected_format_id` in the `EvaluationResponse`.
- `challenge_generator.py` returns it from the LLM.
- **BUT** `models.py`'s `ChallengeEvaluation` table does not have a column for it.
- In `api.py`, `get_session` hardcodes `detected_format_id="F01"` because it can't find it in the DB.

## Expected Behavior
The detected format should be stored in the DB so that edited statements maintain their correctly classified format upon reloading the session.

## Files to Touch
- [models.py](file:///d:/Github%20clones/brainstorming%20agent/backend/data_library/models.py)
- [api.py](file:///d:/Github%20clones/brainstorming%20agent/backend/data_library/api.py) (to save/load it)
- [challenge_generator.py](file:///d:/Github%20clones/brainstorming%20agent/backend/data_library/challenge_generator.py) (already returns it, but check logic)
