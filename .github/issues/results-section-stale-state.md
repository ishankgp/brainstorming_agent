# ResultsSection Doesn't Sync Streaming Updates

**Type:** Bug  
**Priority:** Normal  
**Effort:** Small

## TL;DR
`ResultsSection` initializes `localResult` from the `result` prop once. If parent streams new statements after mount, they won't appear.

## Current Behavior
```tsx
const [localResult, setLocalResult] = useState<GenerationResult>(result)
```
- `useState(result)` only captures the initial value.
- Subsequent updates to `result` prop are ignored.

## Expected Behavior
When `result` prop changes (new statements streamed in), `localResult` should update to reflect them.

## Files to Touch
- [results-section.tsx](file:///d:/Github%20clones/brainstorming%20agent/frontend/components/results-section.tsx) (line 36)

## Fix
Add a `useEffect` to sync when `result` changes:
```tsx
useEffect(() => {
  setLocalResult(result)
}, [result])
```
