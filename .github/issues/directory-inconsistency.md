# Missing Directory Creation for Research Documents

**Type:** Bug / IO  
**Priority:** Low  
**Effort:** Small

## TL;DR
`config.py` ensures the `data/documents` directory exists, but the `upload` endpoint in `api.py` uses `data/research`. If the user has never uploaded anything, the first upload might fail if parent directories aren't created in the right order or if permissions differ.

## Current Behavior
`upload_dir = Path("./data/research")` is created via `.mkdir()` on every upload call, but this is inconsistent with the `DOCS_PATH` defined in config.

## Expected Behavior
Consolidate directory management in `config.py` and use the defined constants.

## Files to Touch
- [config.py](file:///d:/Github%20clones/brainstorming%20agent/backend/data_library/config.py)
- [api.py](file:///d:/Github%20clones/brainstorming%20agent/backend/data_library/api.py)
