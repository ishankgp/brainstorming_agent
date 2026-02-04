# Duplicate Filenames Overwrite During Upload

**Type:** Bug / Data Integrity  
**Priority:** Normal  
**Effort:** Small

## TL;DR
If two users upload documents with the same filename (e.g., `study.pdf`), the second upload will overwrite the physical file of the first one on disk, even though they remain separate entries in the database.

## Current Behavior
```python
file_path = upload_dir / file.filename
with open(file_path, "wb") as f:
    f.write(content)
```

## Expected Behavior
Filenames should be uniquely salted (e.g., `<uuid>_<filename>`) to prevent collisions.

## Files to Touch
- [api.py](file:///d:/Github%20clones/brainstorming%20agent/backend/data_library/api.py)
