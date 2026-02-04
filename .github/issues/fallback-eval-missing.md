# Fallback Statements Lack Evaluation Object

**Type:** Bug / UX  
**Priority:** Normal  
**Effort:** Small

## TL;DR
When a parallel generation task fails, the fallback result returned to the frontend is missing the `evaluation` object, which may lead to rendering errors or empty score badges in the UI.

## Current Behavior
Returns a simple dict with `text`, `id`, `selected_format`, but NO `evaluation`.

## Expected Behavior
Return a neutral/zeroed `evaluation` object so the UI can still render a "Failed" or "NA" state consistently.

## Files to Touch
- [challenge_generator.py](file:///d:/Github%20clones/brainstorming%20agent/backend/data_library/challenge_generator.py)
