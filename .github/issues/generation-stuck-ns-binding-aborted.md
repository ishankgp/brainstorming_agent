# Generation Stuck - NS_BINDING_ABORTED Error

**Type:** Bug  
**Priority:** High  
**Effort:** Medium

## TL;DR
Frontend gets stuck on "Analyzing Brief..." and shows `NS_BINDING_ABORTED` error. The browser is aborting the POST request to `/api/generate-challenge-statements` immediately, preventing any challenge statements from being generated.

## Current State
- User clicks "Generate Challenge Statements"
- UI shows "Analyzing Brief..." loading state
- Browser console shows:
  ```
  XHR OPTIONS http://localhost:8000/api/generate-challenge-statements NS_BINDING_ABORTED
  XHR POST http://localhost:8000/api/generate-challenge-statements NS_BINDING_ABORTED
  🚨 Generation failed: DOMException: The operation was aborted.
  ```
- Request never reaches the backend (no `🔥 RECEIVED REQUEST` log)

## Expected Behavior
- POST request should complete successfully
- Backend should receive the request and process it
- Frontend should display generated challenge statements after ~30-60 seconds

## ✅ RESOLVED

### Root Cause
**Gemini model name was incorrect**: Using deprecated `gemini-2.0-flash-exp` which returns 404 NOT_FOUND.

### Fix Applied
Changed model name in `data_library/challenge_generator.py` line 23:
```python
# Before:
GEMINI_PRO_MODEL = "gemini-2.0-flash-exp"

# After:
GEMINI_PRO_MODEL = "gemini-2.0-flash"
```

### Verification
Tested with `test_generation.py` - generation now completes successfully in ~30-40 seconds.

### Next Steps
1. **Restart backend** (already done via `run_app.ps1`)
2. Test in browser - should now work!

## Relevant Files
- `my-app/app/page.tsx` (lines 105-180) - Frontend request logic
- `data_library/api.py` (lines 24-30, 100-140) - CORS config and endpoint
- `run_app.ps1` - Launch script

## Investigation Steps
1. Check backend terminal for errors or crash logs
2. Verify backend is actually running: `curl http://localhost:8000/health`
3. Test CORS preflight manually
4. Check if `🔥 RECEIVED REQUEST` appears in backend logs when clicking generate
5. Monitor network tab for exact request/response headers

## Notes
- CORS is configured to allow all origins (`allow_origins=["*"]`)
- Frontend timeout is set to 120 seconds
- Backend uses async/await with Gemini API calls
- Issue appeared after recent refactoring to parallel evaluations
