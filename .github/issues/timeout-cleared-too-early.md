# Timeout Cleared Too Early During Streaming

**Type:** Bug  
**Priority:** Normal  
**Effort:** Small

## TL;DR
The 120s timeout is cleared immediately after the HTTP response starts, but the stream can still be reading for much longer. If streaming takes >120s, abort never fires.

## Current Behavior
```tsx
// page.tsx lines 143-147
// 3. Cleanup timeout immediately
if (timeoutRef.current) {
  clearTimeout(timeoutRef.current)
  timeoutRef.current = null
}
```
- Timeout is cleared right after `await fetch()` resolves
- Stream reading loop (`while (true) { await reader.read() }`) runs AFTER this
- If 5 statements take 30s each = 150s, no abort will happen

## Expected Behavior
Keep timeout active until stream completes or errors. Clear it in both:
- The `while` loop exit (`if (done) break`)
- The `catch` block (already done)

## Files to Touch
- [page.tsx](file:///d:/Github%20clones/brainstorming%20agent/frontend/app/page.tsx) (lines 143-147, 175)

## Fix
Move the timeout clearing to after the streaming loop exits:
```tsx
while (true) {
  const { done, value } = await reader.read()
  if (done) break
  // ...processing...
}

// Clear timeout AFTER stream completes
if (timeoutRef.current) {
  clearTimeout(timeoutRef.current)
  timeoutRef.current = null
}
```
