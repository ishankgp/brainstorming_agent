# Accept Doesn't Update Statement Format

**Type:** Bug  
**Priority:** Normal  
**Effort:** Small

## TL;DR
When user accepts an edited statement, `selected_format` stays as the original even though `detected_format_id` changed.

## Current Behavior
In `handleUpdateStatement` (results-section.tsx, line 38-46):
```tsx
{ ...stmt, text: newText, evaluation: newEvaluation }
```
- Only `text` and `evaluation` are updated.
- `selected_format` remains unchanged.

The comparison UI shows `detected_format_id` from the new evaluation, but after accepting, the card still displays the old format badge.

## Expected Behavior
If `detected_format_id` differs from `selected_format`, update `selected_format` to reflect the new classification.

## Files to Touch
- [results-section.tsx](file:///d:/Github%20clones/brainstorming%20agent/frontend/components/results-section.tsx) (line 38-46)

## Fix
```tsx
const handleUpdateStatement = (statementId: number, newText: string, newEvaluation: any) => {
  setLocalResult((prev) => ({
    ...prev,
    challenge_statements: prev.challenge_statements.map((stmt) =>
      stmt.id === statementId
        ? { 
            ...stmt, 
            text: newText, 
            evaluation: newEvaluation,
            selected_format: newEvaluation.detected_format_id || stmt.selected_format 
          }
        : stmt
    ),
  }))
}
```
