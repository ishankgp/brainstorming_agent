# Result List Flash-to-Empty During Early Streaming

**Type:** UX Bug  
**Priority:** Low  
**Effort:** Small

## TL;DR
When the diagnostic completes, the app switches from "Loading" to "Success" state. However, since no challenge statements have arrived yet via the stream, the UI shows a "0 statements generated" message for a few seconds which feels like a failure.

## Current Behavior
1. User clicks Generate.
2. `LoadingSkeleton` shows.
3. `diagnostic` event arrives. `appState` -> "success".
4. `ResultsSection` renders. `challenge_statements` is empty.
5. UI shows: "0 statements generated from your brief".
6. A few seconds later, statements start popping in one-by-one.

## Expected Behavior
- Show a specific "Generating statements..." indicator when the list is empty during an active stream.
- Or, better yet, show 5 greyed-out "ghost" placeholders (since we know the diagnostic selected 5 formats).

## Files to Touch
- [results-section.tsx](file:///d:/Github%20clones/brainstorming%20agent/frontend/components/results-section.tsx)
- [page.tsx](file:///d:/Github%20clones/brainstorming%20agent/frontend/app/page.tsx)
