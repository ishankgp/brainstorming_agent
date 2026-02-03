
from fastapi import FastAPI, HTTPException, UploadFile, File, Depends, Form
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Optional, Any, Dict
import asyncio
from pathlib import Path
from datetime import datetime

# Database imports
from sqlalchemy.orm import Session
from data_library.database import get_db_session, engine, Base
from data_library.models import (
    ChallengeSession, ChallengeStatement, ChallengeEvaluation,
    DimensionScore, ResearchReference, ResearchDocument
)
from data_library.challenge_generator import generate_challenges

# Create Tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Challenge Statement Generator API")

# Configure CORS for Next.js
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],  # Next.js dev server
    allow_credentials=True,
    allow_methods=["GET", "POST", "DELETE", "OPTIONS"],
    allow_headers=["Content-Type"],
)

# ============================================================================
# REQUEST/RESPONSE MODELS
# ============================================================================

class ChallengeRequest(BaseModel):
    brief_text: str
    include_research: bool = False
    selected_research_ids: Optional[List[str]] = None

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

class ResearchDocumentResponse(BaseModel):
    id: str
    name: str
    type: str
    file_type: str
    description: Optional[str]
    uploaded_at: str
    size_kb: int

# ============================================================================
# CHALLENGE GENERATION ENDPOINTS
# ============================================================================

@app.post("/api/generate-challenge-statements", response_model=ChallengeResponse)
async def generate_challenge_statements(
    request: ChallengeRequest,
    db: Session = Depends(get_db_session)
):
    """
    Generate challenge statements from marketing brief.
    
    Steps:
    1. Create session in DB (status: generating)
    2. Run diagnostic decision tree
    3. Generate 5 challenge statements with Gemini
    4. Evaluate each statement
    5. Save to DB (status: completed)
    6. Return structured response
    """
    try:
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
        
        # 2. Generate challenges
        result = await generate_challenges(
            brief_text=request.brief_text,
            include_research=request.include_research,
            selected_research_ids=request.selected_research_ids or []
        )
        
        # 3. Save results to DB
        session.diagnostic_summary = result["diagnostic_summary"]
        session.diagnostic_path = result["diagnostic_path"]
        session.status = "completed"
        
        for idx, stmt_data in enumerate(result["challenge_statements"]):
            stmt = ChallengeStatement(
                session_id=session.id,
                text=stmt_data["text"],
                selected_format=stmt_data["selected_format"],
                reasoning=stmt_data["reasoning"],
                position=idx + 1
            )
            db.add(stmt)
            db.flush()  # Get statement ID
            
            # Save evaluation
            if "evaluation" in stmt_data and stmt_data["evaluation"]:
                eval_data = stmt_data["evaluation"]
                evaluation = ChallengeEvaluation(
                    statement_id=stmt.id,
                    total_score=eval_data["total_score"],
                    weighted_score=eval_data["weighted_score"],
                    passes_non_negotiables=eval_data["passes_non_negotiables"],
                    failed_non_negotiables=eval_data["failed_non_negotiables"],
                    recommendation=eval_data["recommendation"]
                )
                db.add(evaluation)
                db.flush()
                
                # Save dimension scores
                for dim_data in eval_data["dimension_scores"]:
                    dim_score = DimensionScore(
                        evaluation_id=evaluation.id,
                        dimension_id=dim_data["dimension_id"],
                        score=dim_data["score"],
                        notes=dim_data["notes"],
                        has_red_flags=dim_data["has_red_flags"]
                    )
                    db.add(dim_score)
                
                # Save research references
                if "research_references" in eval_data and eval_data["research_references"]:
                    for ref_data in eval_data["research_references"]:
                        ref = ResearchReference(
                            evaluation_id=evaluation.id,
                            document_id=ref_data["document_id"],
                            document_name=ref_data["document_name"],
                            relevant_insight=ref_data["relevant_insight"],
                            relevance_score=ref_data["relevance_score"]
                        )
                        db.add(ref)
        
        db.commit()
        db.refresh(session)
        
        # 4. Build response from saved data
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
                    ] if eval_obj.research_references else None
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
            diagnostic_summary=session.diagnostic_summary,
            diagnostic_path=session.diagnostic_path or [],
            session_id=session.id
        )
        
    except Exception as e:
        # Save error to session if it exists
        if 'session' in locals() and session.id:
            session.status = "error"
            session.error_message = str(e)
            db.commit()
        
        raise HTTPException(status_code=500, detail=f"Generation failed: {str(e)}")

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
            statement_count=len(s.challenge_statements)
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
                ] if eval_obj.research_references else None
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
    db.add(doc)
    db.commit()
    db.refresh(doc)
    
    return {"id": doc.id, "status": "uploaded"}

@app.delete("/api/research-documents/{doc_id}")
def delete_research_document(doc_id: str, db: Session = Depends(get_db_session)):
    """Delete research document."""
    doc = db.query(ResearchDocument).filter(ResearchDocument.id == doc_id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")
    
    # Delete file
    try:
        Path(doc.file_path).unlink(missing_ok=True)
    except Exception as e:
        print(f"Failed to delete file: {e}")
    
    # Delete DB record
    db.delete(doc)
    db.commit()
    
    return {"status": "deleted"}

# ============================================================================
# HEALTH CHECK
# ============================================================================

@app.get("/health")
def health_check():
    """Health check endpoint."""
    return {"status": "healthy", "service": "Challenge Statement Generator API"}

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
