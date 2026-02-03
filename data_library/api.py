
from fastapi import FastAPI, HTTPException, UploadFile, File, Depends
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Optional, Any, Dict
import asyncio
import json
from pathlib import Path

# Updated imports
from sqlalchemy.orm import Session
from data_library.database import get_db_session, engine, Base
from data_library.models import BrainstormSession, BrainstormInput, BrainstormRun, BrainstormEvidence, LibraryStatement
from data_library.brainstorm import run_brainstorm_session
from data_library.file_search import list_files, upload_file, delete_file
from data_library.agents import init_db, get_db
from data_library.orchestrator import run_agentic_flow

# Create Tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Agent Studio API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Pydantic Models ---

class CreateSessionRequest(BaseModel):
    marketing_brief_text: Optional[str] = ""
    lifecycle_stage: Optional[str] = "pre_launch"
    target_audience: Optional[str] = ""

class AddInputsRequest(BaseModel):
    statements: List[str]

class LockSessionRequest(BaseModel):
    finals: List[Dict[str, Any]]

class AgentConfig(BaseModel):
    name: str
    description: str
    system_prompt: str
    tools: List[str]

class ChatRequest(BaseModel):
    message: str
    history: List[Any] = []

# --- Endpoints ---

@app.post("/brainstorm/sessions")
def create_session(req: CreateSessionRequest, db: Session = Depends(get_db_session)):
    session = BrainstormSession(
        marketing_brief_text=req.marketing_brief_text,
        lifecycle_stage=req.lifecycle_stage,
        target_audience=req.target_audience
    )
    db.add(session)
    db.commit()
    db.refresh(session)
    return session

@app.get("/brainstorm/sessions/{session_id}")
def get_session(session_id: str, db: Session = Depends(get_db_session)):
    session = db.query(BrainstormSession).filter(BrainstormSession.id == session_id).first()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    
    # Eager load relationships manually if needed, or rely on ORM lazy load (FastAPI handles it if in same thread often)
    # Using Pydantic to serialize SQLAlchemy objects might require conversion, but FastAPI is smart enough for basic dicts
    # constructing a custom response to match frontend needs
    
    inputs = [i.__dict__ for i in session.inputs]
    runs = []
    for r in session.runs:
        runs.append({
            "id": r.id,
            "created_at": r.created_at,
            "output_json": r.output_json,
            "evidence_count": len(r.evidence)
        })
    library = [l.__dict__ for l in session.library_statements]

    return {
        "id": session.id,
        "marketing_brief_text": session.marketing_brief_text,
        "lifecycle_stage": session.lifecycle_stage,
        "target_audience": session.target_audience,
        "status": session.status,
        "inputs": inputs,
        "runs": runs,
        "library": library
    }

@app.post("/brainstorm/sessions/{session_id}/inputs")
def add_inputs(session_id: str, req: AddInputsRequest, db: Session = Depends(get_db_session)):
    session = db.query(BrainstormSession).filter(BrainstormSession.id == session_id).first()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    
    added = []
    for stmt in req.statements:
        if stmt.strip():
            inp = BrainstormInput(session_id=session_id, statement_text=stmt)
            db.add(inp)
            added.append(inp)
            
    db.commit()
    return {"status": "success", "count": len(added)}

@app.post("/brainstorm/sessions/{session_id}/run")
async def run_session(session_id: str, db: Session = Depends(get_db_session)):
    session = db.query(BrainstormSession).filter(BrainstormSession.id == session_id).first()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    
    session.status = "running"
    db.commit()
    
    # Gather inputs
    inputs = [i.statement_text for i in session.inputs]
    if not inputs:
        raise HTTPException(status_code=400, detail="No inputs defined")

    # Run Logic
    result = await run_brainstorm_session(
        marketing_brief=session.marketing_brief_text or "",
        lifecycle_stage=session.lifecycle_stage or "unknown",
        audience=session.target_audience or "General HCPs",
        statements=inputs
    )
    
    if "error" in result:
        session.status = "draft"
        db.commit()
        raise HTTPException(status_code=500, detail=result["error"])
        
    # Store Run
    run = BrainstormRun(
        session_id=session_id,
        model_name="gemini-thinking-exp", # Placeholder
        output_json=result["output"]
    )
    db.add(run)
    db.commit()
    
    # Store Evidence
    for ev in result["evidence"]:
        db_ev = BrainstormEvidence(
            run_id=run.id,
            chunk_id=ev["chunk_id"],
            source_doc_id_or_uri=ev["source_title"], # simple mapping
            source_title=ev["source_title"],
            location_label=ev["location_label"],
            snippet=ev["text"],
            score=ev["score"]
        )
        db.add(db_ev)
        
    session.status = "ready"
    db.commit()
    
    return result["output"] # Returns the parsed JSON

@app.post("/brainstorm/sessions/{session_id}/lock")
def lock_session(session_id: str, req: LockSessionRequest, db: Session = Depends(get_db_session)):
    session = db.query(BrainstormSession).filter(BrainstormSession.id == session_id).first()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
        
    if len(req.finals) < 1:
         raise HTTPException(status_code=400, detail="Must select at least 1 statement")

    for item in req.finals:
        lib = LibraryStatement(
            session_id=session_id,
            locked=True,
            statement_text=item.get("statement_text"),
            format_id=item.get("format_id"),
            rubric_scores=item.get("rubric"),
            weighted_score=item.get("weighted_score"),
            risk_flags=item.get("risk_flags"),
            citations=item.get("key_citations")
        )
        db.add(lib)
        
    session.status = "locked"
    db.commit()
    return {"status": "locked", "count": len(req.finals)}

# --- Legacy/Existing Endpoints (Kept for compatibility) ---

@app.on_event("startup")
def startup_db():
    init_db()

@app.get("/agents")
def get_agents():
    """List all configured agents (personas)."""
    conn = get_db()
    rows = conn.execute("SELECT * FROM agents").fetchall()
    conn.close()
    return [dict(row) for row in rows]

@app.post("/agents")
def create_agent(config: AgentConfig):
    """Create a new agent persona."""
    conn = get_db()
    import json
    conn.execute(
        "INSERT INTO agents (name, description, system_prompt, tools) VALUES (?, ?, ?, ?)",
        (config.name, config.description, config.system_prompt, json.dumps(config.tools))
    )
    conn.commit()
    conn.close()
    return {"status": "created"}

@app.post("/chat")
async def chat_endpoint(request: ChatRequest):
    """Run the unified agentic flow."""
    try:
        response = await run_agentic_flow(request.message, request.history)
        return {"response": str(response)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/documents")
def get_documents():
    """List documents in library."""
    try:
        files = list_files()
        return [{"name": f.name, "display_name": f.display_name, "state": f.state.name, "uri": f.uri} for f in files]
    except Exception as e:
        return []

@app.post("/documents/upload")
async def upload_document_endpoint(file: UploadFile = File(...)):
    """Upload a document to the library."""
    temp_path = Path(f"./data/documents/{file.filename}")
    temp_path.parent.mkdir(parents=True, exist_ok=True)
    
    try:
        with open(temp_path, "wb") as buffer:
            content = await file.read()
            buffer.write(content)
            
        uploaded = upload_file(temp_path)
        return {"status": "success", "file": uploaded.name}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.delete("/documents/{file_name:path}")
def delete_document(file_name: str):
    try:
        delete_file(file_name)
        return {"status": "deleted"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
