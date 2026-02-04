# Research Library Broken for Real Uploads

**Type:** Bug / Feature Gap  
**Priority:** High  
**Effort:** Medium

## TL;DR
The `ResearchDocument` database model and API response are missing the `key_insights` field, but the frontend `ResearchLibrary` component requires this field to render insight bullet points.

## Current Behavior
- `models.py`: `ResearchDocument` has no `key_insights` column.
- `api.py`: `ResearchDocumentResponse` has no `key_insights` field.
- `research-library.tsx`: Calls `doc.key_insights.map(...)`.
- **Result:** Uploaded documents return `undefined` for insights, causing a frontend crash.

## Expected Behavior
1. Add `key_insights = Column(JSON, nullable=True)` to `ResearchDocument` model.
2. Update API response model.
3. (Bonus) Implement a simple AI hook to extract insights upon upload.

## Files to Touch
- [models.py](file:///d:/Github%20clones/brainstorming%20agent/backend/data_library/models.py)
- [api.py](file:///d:/Github%20clones/brainstorming%20agent/backend/data_library/api.py)
- [research-library.tsx](file:///d:/Github%20clones/brainstorming%20agent/frontend/components/research-library.tsx) (for safety checks)
