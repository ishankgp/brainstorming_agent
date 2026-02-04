# Dangerous Fallback Values in AI Evaluation

**Type:** Bug / Risk  
**Priority:** High  
**Effort:** Small

## TL;DR
If the AI evaluation fails (e.g., rate limit, malformed JSON), the system falls back to a "perfect" score instead of failing or providing a neutral state.

## Current Behavior
`create_default_evaluation()` in `challenge_generator.py` returns a score of 80% and a "proceed" recommendation.
This means if the AI is broken, every statement looks like a winner, which is a massive failure of the "Diagnostic" purpose.

## Expected Behavior
Fallback should return a `0` score or a specific `error` status, and the recommendation should be `revise` or `unknown`. The UI should reflect that evaluation failed.

## Files to Touch
- [challenge_generator.py](file:///d:/Github%20clones/brainstorming%20agent/backend/data_library/challenge_generator.py)
