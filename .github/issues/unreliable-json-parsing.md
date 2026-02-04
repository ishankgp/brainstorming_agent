# Unreliable JSON Parsing in Stream

**Type:** Robustness  
**Priority:** Normal  
**Effort:** Small

## TL;DR
If the AI returns a chunk that isn't valid JSON (e.g., mixed with Markdown or an error message), the backend stream will crash, leaving the user with a broken UI.

## Current Behavior
```python
chunk = json.loads(chunk_str)
```
No `try/except` block or sanitization.

## Expected Behavior
Implement robust JSON extraction or use the Gemini `response_mime_type: "application/json"` feature to ensure valid output.

## Files to Touch
- [api.py](file:///d:/Github%20clones/brainstorming%20agent/backend/data_library/api.py)
- [challenge_generator.py](file:///d:/Github%20clones/brainstorming%20agent/backend/data_library/challenge_generator.py)
