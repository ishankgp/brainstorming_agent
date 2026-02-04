# onUpdateRules Prop Never Used in FormatLibrary

**Type:** Bug  
**Priority:** Normal  
**Effort:** Small

## TL;DR
The `onUpdateRules` function is passed to `FormatLibrary` but never destructured or called, meaning users cannot save modified diagnostic rules.

## Current Behavior
```tsx
// format-library.tsx
export function FormatLibrary({
  isOpen,
  onClose,
  formats,
  onUpdateFormats,
  diagnosticRules,
}: FormatLibraryProps) {
```
The `onUpdateRules` prop is omitted from the function arguments, despite being in the interface.

## Expected Behavior
Destructure `onUpdateRules` and call it whenever rules are modified.

## Files to Touch
- [format-library.tsx](file:///d:/Github%20clones/brainstorming%20agent/frontend/components/format-library.tsx)
