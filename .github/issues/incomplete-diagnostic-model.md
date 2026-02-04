# DiagnosticPathStepResponse Missing Confidence Field

**Type:** Bug  
**Priority:** Low  
**Effort:** Small

## TL;DR
The Pydantic model `DiagnosticPathStepResponse` is missing the `confidence` field, which is returned by the AI and stored in the database.

## Current Behavior
```python
# api.py
class DiagnosticPathStepResponse(BaseModel):
    question: str
    answer: str
    reasoning: str
```
Fetching sessions via `/api/sessions/{id}` may cause Pydantic validation warnings or errors if the DB contains the `confidence` field in the JSON blob.

## Expected Behavior
Include `confidence: float` in the Pydantic model.

## Files to Touch
- [api.py](file:///d:/Github%20clones/brainstorming%20agent/backend/data_library/api.py)
