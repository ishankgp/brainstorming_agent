# Hardcoded Max Score Assumes 8 Dimensions

**Type:** Bug  
**Priority:** Low  
**Effort:** Small

## TL;DR
`evaluation-panel.tsx` displays "Raw: X/40" assuming 8 dimensions × 5 points max. If dimension count changes, the denominator is wrong.

## Current Behavior
```tsx
// evaluation-panel.tsx line 124
{evaluation.total_score}/40
```
Hardcoded `40` instead of deriving from actual dimension count.

## Expected Behavior
Calculate max dynamically: `dimension_scores.length * 5`

## Files to Touch
- [evaluation-panel.tsx](file:///d:/Github%20clones/brainstorming%20agent/frontend/components/evaluation-panel.tsx) (line 124)

## Fix
```tsx
{evaluation.total_score}/{evaluation.dimension_scores.length * 5}
```

## Notes
Low priority since dimension count is unlikely to change often, but this is a silent failure waiting to happen.
