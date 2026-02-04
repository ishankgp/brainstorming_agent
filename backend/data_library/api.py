
from fastapi import FastAPI, HTTPException, UploadFile, File, Depends, Form
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Optional, Any, Dict
import asyncio
import json
from pathlib import Path
from datetime import datetime

# Database imports
from sqlalchemy.orm import Session
from data_library.database import get_db_session, engine, Base
from data_library.models import (
    ChallengeSession, ChallengeStatement, ChallengeEvaluation,
    DimensionScore, ResearchReference, ResearchDocument
)
from data_library.challenge_generator import (
    generate_challenges_stream, 
    evaluate_statement_with_ai,
    rewrite_statement_with_ai
)

# Create Tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Challenge Statement Generator API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all for debugging
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ============================================================================
# REQUEST/RESPONSE MODELS
# ============================================================================

class ChallengeRequest(BaseModel):
    brief_text: str
    include_research: bool = False
    selected_research_ids: Optional[List[str]] = None

class DiagnosticsRequest(BaseModel):
    brief_text: str

class ReEvaluationRequest(BaseModel):
    brief_text: str
    statement_text: str
    include_research: bool = False

class RewriteRequest(BaseModel):
    brief_text: str
    statement_text: str
    instruction: str = ""

class DiagnosticPathStepResponse(BaseModel):
    question: str
    answer: str  # "yes" or "no"
    reasoning: str

class DimensionScoreResponse(BaseModel):
    dimension_id: str
    score: int
    notes: str
    has_red_flags: bool

class ResearchReferenceResponse(BaseModel):
    document_id: str
    document_name: str
    relevant_insight: str
    relevance_score: int

class EvaluationResponse(BaseModel):
    dimension_scores: List[DimensionScoreResponse]
    total_score: int
    weighted_score: int
    passes_non_negotiables: bool
    failed_non_negotiables: List[str]
    recommendation: str
    research_references: Optional[List[ResearchReferenceResponse]] = None
    detected_format_id: Optional[str] = "F01"

class ChallengeStatementResponse(BaseModel):
    id: int
    text: str
    selected_format: str
    reasoning: str
    evaluation: Optional[EvaluationResponse] = None

class ChallengeResponse(BaseModel):
    challenge_statements: List[ChallengeStatementResponse]
    diagnostic_summary: str
    diagnostic_path: List[DiagnosticPathStepResponse]
    session_id: str

class SessionSummary(BaseModel):
    id: str
    brief_preview: str
    created_at: str
    status: str
    statement_count: int
    timing_metrics: Optional[Dict] = None


class ResearchDocumentResponse(BaseModel):
    id: str
    name: str
    type: str
    file_type: str
    description: Optional[str]
    uploaded_at: str
    size_kb: int

class RewriteResponse(BaseModel):
    text: str

# ============================================================================
# HEALTH CHECK
# ============================================================================

@app.get("/health")
async def health_check():
    """Simple health check endpoint."""
    return {"status": "ok", "message": "API is running"}

# ============================================================================
# CHALLENGE GENERATION ENDPOINTS
# ============================================================================

@app.post("/api/evaluate-single-statement", response_model=EvaluationResponse)
async def evaluate_single_statement_endpoint(request: ReEvaluationRequest):
    """Evaluate a single statement against the brief."""
    result = await evaluate_statement_with_ai(
        statement_text=request.statement_text,
        brief_text=request.brief_text,
        include_research=request.include_research
    )
    return result

@app.post("/api/rewrite-statement", response_model=RewriteResponse)
async def rewrite_statement_endpoint(request: RewriteRequest):
    """Rewrite a statement using AI."""
    new_text = await rewrite_statement_with_ai(
        original_text=request.statement_text,
        brief_text=request.brief_text,
        instruction=request.instruction
    )
    return {"text": new_text}

async def stream_and_save_generator(request: ChallengeRequest, session: ChallengeSession, db: Session):
    """
    Wraps the core generator to save results to DB while streaming to client.
    """
    try:
        # Fetch research docs for RAG context
        research_docs_data = []
        if request.include_research and request.selected_research_ids:
            docs = db.query(ResearchDocument).filter(ResearchDocument.id.in_(request.selected_research_ids)).all()
            research_docs_data = [
                {"gemini_uri": doc.gemini_uri, "name": doc.name}
                for doc in docs if doc.gemini_uri
            ]

        async for chunk_str in generate_challenges_stream(
            brief_text=request.brief_text,
            include_research=request.include_research,
            selected_research_ids=request.selected_research_ids or [],
            research_docs=research_docs_data
        ):
            # 1. Parse chunk
            try:
                chunk = json.loads(chunk_str)
            except json.JSONDecodeError:
                print(f"Skipping invalid JSON chunk: {chunk_str[:50]}...")
                continue
            
            # 2. Update DB based on chunk type
            try:
                if chunk["type"] == "diagnostic":
                    data = chunk["data"]
                    session.diagnostic_summary = data["diagnostic_summary"]
                    session.diagnostic_path = data["diagnostic_path"]
                    db.commit()
                    
                elif chunk["type"] == "challenge_result":
                    stmt_data = chunk["data"]
                    
                    # Save statement
                    stmt = ChallengeStatement(
                        session_id=session.id,
                        text=stmt_data["text"],
                        selected_format=stmt_data["selected_format"],
                        reasoning=stmt_data["reasoning"],
                        position=stmt_data["position"]
                    )
                    db.add(stmt)
                    db.flush()
                    
                    # Save evaluation
                    if "evaluation" in stmt_data and stmt_data["evaluation"]:
                        eval_data = stmt_data["evaluation"]
                        evaluation = ChallengeEvaluation(
                            statement_id=stmt.id,
                            total_score=eval_data["total_score"],
                            weighted_score=eval_data["weighted_score"],
                            passes_non_negotiables=eval_data["passes_non_negotiables"],
                            failed_non_negotiables=eval_data["failed_non_negotiables"],
                            recommendation=eval_data["recommendation"],
                            detected_format_id=eval_data.get("detected_format_id")
                        )
                        db.add(evaluation)
                        db.flush()
                        
                        # Save scores
                        for dim_data in eval_data["dimension_scores"]:
                            dim_score = DimensionScore(
                                evaluation_id=evaluation.id,
                                dimension_id=dim_data["dimension_id"],
                                score=dim_data["score"],
                                notes=dim_data["notes"],
                                has_red_flags=dim_data["has_red_flags"]
                            )
                            db.add(dim_score)
                    
                            db.add(dim_score)
                            
                        # Save relationships
                        db.commit()
                        
                elif chunk["type"] == "timing_metrics":
                    session.timing_metrics = chunk["data"]
                    db.commit()
                    
            except Exception as db_err:
                print(f"DB Error saving chunk: {db_err}")
                db.rollback()
                # Continue streaming even if save fails, but user should probably know? 
                # For now, just logging keeps the stream alive.
            
            # 3. Yield to client (SSE format)
            yield f"data: {chunk_str}\n\n"
            
        # Stream finished successfully
        session.status = "completed"
        db.commit()
        yield f"data: {json.dumps({'type': 'complete', 'session_id': session.id})}\n\n"
        
    except Exception as e:
        print(f"Stream Error: {e}")
        session.status = "error"
        session.error_message = str(e)
        db.commit()
        yield f"data: {json.dumps({'type': 'error', 'message': str(e)})}\n\n"

@app.post("/api/generate-challenge-statements")
async def generate_challenge_statements(
    request: ChallengeRequest,
    db: Session = Depends(get_db_session)
):
    """
    Generate challenge statements from marketing brief (Streaming).
    """
    print(f"🔥 RECEIVED REQUEST: brief length={len(request.brief_text)}")
    
    # 1. Create session
    session = ChallengeSession(
        brief_text=request.brief_text,
        include_research=request.include_research,
        selected_research_ids=request.selected_research_ids,
        status="generating"
    )
    db.add(session)
    db.commit()
    db.refresh(session)
    
    print(f"📝 Starting streaming generation for session {session.id}...")
    
    return StreamingResponse(
        stream_and_save_generator(request, session, db),
        media_type="text/event-stream"
    )

# ============================================================================
# SESSION HISTORY ENDPOINTS
# ============================================================================

@app.get("/api/sessions", response_model=List[SessionSummary])
def get_sessions(
    limit: int = 20,
    db: Session = Depends(get_db_session)
):
    """Get recent challenge generation sessions."""
    sessions = db.query(ChallengeSession)\
        .order_by(ChallengeSession.created_at.desc())\
        .limit(limit)\
        .all()
    
    return [
        SessionSummary(
            id=s.id,
            brief_preview=s.brief_text[:100] + "..." if len(s.brief_text) > 100 else s.brief_text,
            created_at=s.created_at.isoformat() if s.created_at else "",
            status=s.status,
            statement_count=len(s.challenge_statements),
            timing_metrics=s.timing_metrics
        )
        for s in sessions
    ]

@app.get("/api/sessions/{session_id}", response_model=ChallengeResponse)
def get_session(session_id: str, db: Session = Depends(get_db_session)):
    """Retrieve a specific session with all details."""
    session = db.query(ChallengeSession).filter(ChallengeSession.id == session_id).first()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    
    # Build response
    statements_response = []
    for stmt in sorted(session.challenge_statements, key=lambda x: x.position):
        eval_response = None
        if stmt.evaluation:
            eval_obj = stmt.evaluation
            eval_response = EvaluationResponse(
                dimension_scores=[
                    DimensionScoreResponse(
                        dimension_id=ds.dimension_id,
                        score=ds.score,
                        notes=ds.notes,
                        has_red_flags=ds.has_red_flags
                    )
                    for ds in eval_obj.dimension_scores
                ],
                total_score=eval_obj.total_score,
                weighted_score=eval_obj.weighted_score,
                passes_non_negotiables=eval_obj.passes_non_negotiables,
                failed_non_negotiables=eval_obj.failed_non_negotiables or [],
                recommendation=eval_obj.recommendation,
                research_references=[
                    ResearchReferenceResponse(
                        document_id=ref.document_id,
                        document_name=ref.document_name,
                        relevant_insight=ref.relevant_insight,
                        relevance_score=ref.relevance_score
                    )
                    for ref in eval_obj.research_references
                ] if eval_obj.research_references else None,
                detected_format_id=eval_obj.detected_format_id or stmt.selected_format or "F01"
            )
        
        statements_response.append(
            ChallengeStatementResponse(
                id=stmt.id,
                text=stmt.text,
                selected_format=stmt.selected_format,
                reasoning=stmt.reasoning,
                evaluation=eval_response
            )
        )
    
    return ChallengeResponse(
        challenge_statements=statements_response,
        diagnostic_summary=session.diagnostic_summary or "",
        diagnostic_path=session.diagnostic_path or [],
        session_id=session.id
    )

# ============================================================================
# RESEARCH DOCUMENT ENDPOINTS
# ============================================================================

@app.get("/api/research-documents", response_model=List[ResearchDocumentResponse])
def get_research_documents(db: Session = Depends(get_db_session)):
    """List all research documents."""
    docs = db.query(ResearchDocument).order_by(ResearchDocument.uploaded_at.desc()).all()
    
    return [
        ResearchDocumentResponse(
            id=doc.id,
            name=doc.name,
            type=doc.type,
            file_type=doc.file_type,
            description=doc.description,
            uploaded_at=doc.uploaded_at.isoformat() if doc.uploaded_at else "",
            size_kb=doc.size_kb
        )
        for doc in docs
    ]

@app.post("/api/research-documents/upload")
async def upload_research_document(
    file: UploadFile = File(...),
    type: str = Form(...),
    description: str = Form(None),
    db: Session = Depends(get_db_session)
):
    """Upload research document."""
    
    # Save file
    upload_dir = Path("./data/research")
    upload_dir.mkdir(parents=True, exist_ok=True)
    file_path = upload_dir / file.filename
    
    content = await file.read()
    with open(file_path, "wb") as f:
        f.write(content)
    
    # Create DB record
    doc = ResearchDocument(
        name=file.filename,
        type=type,
        file_type=file.filename.split(".")[-1] if "." in file.filename else "unknown",
        file_path=str(file_path),
        description=description,
        size_kb=len(content) // 1024
    )

    # --- GEMINI UPLOAD ---
    try:
        from data_library.challenge_generator import upload_file_to_gemini_corpus
        gemini_file = await upload_file_to_gemini_corpus(file_path, file.filename)
        if gemini_file:
             doc.gemini_file_id = gemini_file.name # Expected to be the "names/{id}" or "corpora/.../documents/{id}"
             doc.gemini_uri = gemini_file.uri if hasattr(gemini_file, 'uri') else None
    except Exception as e:
        print(f"Gemini Upload Failed: {e}")
        # We proceed even if Gemini fails, but maybe flag it? for now just log.

    db.add(doc)
    db.commit()
    db.refresh(doc)
    
    return {
        "id": doc.id,
        "name": doc.name,
        "type": doc.type,
        "file_type": doc.file_type,
        "description": doc.description,
        "uploaded_at": doc.uploaded_at.strftime("%Y-%m-%d") if doc.uploaded_at else "",
        "size_kb": doc.size_kb
    }

@app.delete("/api/research-documents/{doc_id}")
async def delete_research_document(doc_id: str, db: Session = Depends(get_db_session)):
    """Delete research document."""
    doc = db.query(ResearchDocument).filter(ResearchDocument.id == doc_id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")
    
    # Delete from Gemini (Sync)
    if doc.gemini_file_id:
        try:
            from data_library.challenge_generator import delete_file_from_gemini
            await delete_file_from_gemini(doc.gemini_file_id)
        except Exception as e:
            print(f"Failed to sync delete to Gemini: {e}")

    # Delete file
    try:
        Path(doc.file_path).unlink(missing_ok=True)
    except Exception as e:
        print(f"Failed to delete file: {e}")
    
    # Delete DB record
    db.delete(doc)
    db.commit()
    
    return {"status": "deleted"}

@app.get("/")
def root():
    """Root endpoint."""
    return {
        "service": "Challenge Statement Generator API",
        "version": "1.0.0",
        "endpoints": {
            "generate": "POST /api/generate-challenge-statements",
            "sessions": "GET /api/sessions",
            "session_detail": "GET /api/sessions/{id}",
            "research_docs": "GET /api/research-documents",
            "upload_doc": "POST /api/research-documents/upload",
            "delete_doc": "DELETE /api/research-documents/{id}"
        }
    }
