# Dangling Stream on Reset or Retry

**Type:** Bug  
**Priority:** Normal  
**Effort:** Medium

## TL;DR
When a user resets the app state or retries a generation while a stream is active, the `reader.read()` loop in `page.tsx` continues to run in the background.

## Current Behavior
- `handleGenerate` initiates a `while(true)` loop to read the stream.
- `handleReset` clears the UI state but doesn't abort the active fetch or stop the reader.
- Background updates continue to call `setResult` on a state that should be "idle", potentially causing UI jumps or memory leaks.

## Expected Behavior
- Generation should be linked to an `AbortController`.
- Any existing generation should be aborted before starting a new one or resetting.

## Files to Touch
- [page.tsx](file:///d:/Github%20clones/brainstorming%20agent/frontend/app/page.tsx)
