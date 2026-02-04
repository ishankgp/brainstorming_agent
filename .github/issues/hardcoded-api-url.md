# Hardcoded API URL in StatementCard

**Type:** Bug  
**Priority:** Low  
**Effort:** Small

## TL;DR
`StatementCard` uses hardcoded `http://localhost:8000` for API calls, which will fail in any environment where the backend is not on that specific port/host.

## Current Behavior
```tsx
await fetch('http://localhost:8000/api/rewrite-statement', ...)
```

## Expected Behavior
Use environment variables or relative paths if proxied.

## Files to Touch
- [statement-card.tsx](file:///d:/Github%20clones/brainstorming%20agent/frontend/components/statement-card.tsx)
