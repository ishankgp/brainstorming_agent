# Research Documents List API Missing `key_insights`

**Type**: Bug
**Priority**: High
**Effort**: Low

## TL;DR
The frontend crashes with `Cannot read properties of undefined (reading 'length')` when loading persisted research documents. This is because the `GET /api/research-documents` endpoint uses a Pydantic model (`ResearchDocumentResponse`) that is missing the `key_insights` field, causing it to be stripped from the response.

## Current Behavior
- `GET /api/research-documents` returns objects like `{"id": "...", "name": "...", ...}` without `key_insights`.
- Frontend raises TypeError when accessing `doc.key_insights.length`.

## Expected Behavior
- API should return `key_insights: []` (or populated list) for all documents.

## Relevant Files
- `backend/data_library/api.py`: `ResearchDocumentResponse` class and `get_research_documents` function.
