# Unused expandedDoc State in ResearchLibrary

**Type:** Tech Debt  
**Priority:** Low  
**Effort:** Small

## TL;DR
`research-library.tsx` maintains an `expandedDoc` state and calculates `isExpanded`, but doesn't actually hide/show any UI elements based on it.

## Current Behavior
```tsx
const [expandedDoc, setExpandedDoc] = useState<string | null>(null)
// ...
const isExpanded = expandedDoc === doc.id
```
The "Key Insights" section is always visible regardless of this state.

## Expected Behavior
Either implement the expansion logic to hide/show insights or remove the unused state.

## Files to Touch
- [research-library.tsx](file:///d:/Github%20clones/brainstorming%20agent/frontend/components/research-library.tsx)
