# Documentation: Browser Extension Console Noise (`runtime.lastError`)

**Type**: Maintenance / Documentation
**Priority**: Low
**Effort**: Low

## TL;DR
Frequent console errors stating `Unchecked runtime.lastError: Could not establish connection. Receiving end does not exist.` appear in the developer console. This is documented external noise caused by browser extensions (e.g., password managers, devtools) and is not caused by the Brainstorming Agent codebase.

## Current State
- Error appears in Chrome DevTools during development.
- Grep of codebase confirms no `chrome.runtime` or extension-specific APIs are used.

## Expected Outcome
- Developers should be aware this is safe to ignore.
- This issue serves as a reference for the root cause.

## Root Cause Analysis
- Browser extensions try to communicate between content scripts and background scripts.
- Connection is lost during page refresh or script injection timing issues.
- Solution for extensions: Add a listener check for `chrome.runtime.lastError`.

## Relevant Files
- N/A (External to project)
