# Fragile Format Selection Logic in Diagnostic

**Type:** Bug / Robustness  
**Priority:** Low  
**Effort:** Small

## TL;DR
The logic for parsing the format ID from the AI's diagnostic output is fragile and assumes a specific string format.

## Current Behavior
```python
format_id = fmt["format_id"].split(" ")[0].split("-")[0].strip()
```
If the AI returns "Format F01" or "Mindset Shift (F01)", this logic will likely fail to extract "F01".

## Expected Behavior
Use a more robust regex to find IDs matching `F\d{2}` within the string, or strictly enforce the schema using Gemini's response formatting features more effectively.

## Files to Touch
- [challenge_generator.py](file:///d:/Github%20clones/brainstorming%20agent/backend/data_library/challenge_generator.py)
