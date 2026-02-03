from sqlalchemy import Column, String, Integer, Text, Boolean, ForeignKey, JSON, Float, DateTime, func
from sqlalchemy.orm import relationship
from data_library.database import Base
import uuid

def generate_uuid():
    return str(uuid.uuid4())

class BrainstormSession(Base):
    __tablename__ = "brainstorm_sessions"

    id = Column(String, primary_key=True, default=generate_uuid)
    marketing_brief_text = Column(Text, nullable=True)
    marketing_brief_id = Column(String, nullable=True)
    lifecycle_stage = Column(String, nullable=True) # pre_launch, post_launch, unknown
    target_audience = Column(Text, nullable=True)
    created_by = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    status = Column(String, default="draft") # draft, running, ready, locked

    inputs = relationship("BrainstormInput", back_populates="session", cascade="all, delete-orphan")
    runs = relationship("BrainstormRun", back_populates="session", cascade="all, delete-orphan")
    library_statements = relationship("LibraryStatement", back_populates="session", cascade="all, delete-orphan")

class BrainstormInput(Base):
    __tablename__ = "brainstorm_inputs"

    id = Column(String, primary_key=True, default=generate_uuid)
    session_id = Column(String, ForeignKey("brainstorm_sessions.id"))
    statement_text = Column(Text, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    session = relationship("BrainstormSession", back_populates="inputs")

class BrainstormRun(Base):
    __tablename__ = "brainstorm_runs"

    id = Column(String, primary_key=True, default=generate_uuid)
    session_id = Column(String, ForeignKey("brainstorm_sessions.id"))
    model_name = Column(String, nullable=True)
    prompt_version = Column(String, nullable=True)
    retrieval_params = Column(JSON, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    completed_at = Column(DateTime(timezone=True), nullable=True)
    output_json = Column(JSON, nullable=True)

    session = relationship("BrainstormSession", back_populates="runs")
    evidence = relationship("BrainstormEvidence", back_populates="run", cascade="all, delete-orphan")

class BrainstormEvidence(Base):
    __tablename__ = "brainstorm_evidence"

    id = Column(String, primary_key=True, default=generate_uuid)
    run_id = Column(String, ForeignKey("brainstorm_runs.id"))
    chunk_id = Column(String, nullable=True)
    source_doc_id_or_uri = Column(String, nullable=True)
    source_title = Column(String, nullable=True)
    location_label = Column(String, nullable=True)
    snippet = Column(Text, nullable=True)
    score = Column(Float, nullable=True)

    run = relationship("BrainstormRun", back_populates="evidence")

class LibraryStatement(Base):
    __tablename__ = "library_statements"

    id = Column(String, primary_key=True, default=generate_uuid)
    session_id = Column(String, ForeignKey("brainstorm_sessions.id"))
    locked = Column(Boolean, default=True)
    statement_text = Column(Text, nullable=False)
    format_id = Column(Integer, nullable=True)
    rubric_scores = Column(JSON, nullable=True)
    weighted_score = Column(Float, nullable=True)
    risk_flags = Column(JSON, nullable=True)
    citations = Column(JSON, nullable=True)
    version = Column(Integer, default=1)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    created_by = Column(String, nullable=True)

    session = relationship("BrainstormSession", back_populates="library_statements")

# ============================================================================
# NEW CHALLENGE GENERATION MODELS (for my-app frontend)
# ============================================================================

class ChallengeSession(Base):
    """Store challenge generation sessions with full history."""
    __tablename__ = "challenge_sessions"
    
    id = Column(String, primary_key=True, default=generate_uuid)
    brief_text = Column(Text, nullable=False)
    include_research = Column(Boolean, default=False)
    selected_research_ids = Column(JSON, nullable=True)  # ["RD001", "RD002"]
    
    # Results
    diagnostic_summary = Column(Text, nullable=True)
    diagnostic_path = Column(JSON, nullable=True)  # DiagnosticPathStep[]
    
    # Metadata
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    status = Column(String, default="draft")  # draft, generating, completed, error
    error_message = Column(Text, nullable=True)
    
    # Relationships
    challenge_statements = relationship("ChallengeStatement", back_populates="session", cascade="all, delete-orphan")

class ChallengeStatement(Base):
    """Individual generated challenge statements."""
    __tablename__ = "challenge_statements"
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    session_id = Column(String, ForeignKey("challenge_sessions.id"))
    
    # Core fields
    text = Column(Text, nullable=False)
    selected_format = Column(String, nullable=False)  # "F01", "F02", etc.
    reasoning = Column(Text, nullable=False)
    
    # Display order
    position = Column(Integer, nullable=False)  # 1-5
    
    # Relationships
    session = relationship("ChallengeSession", back_populates="challenge_statements")
    evaluation = relationship("ChallengeEvaluation", uselist=False, back_populates="statement", cascade="all, delete-orphan")

class ChallengeEvaluation(Base):
    """Evaluation scores for each challenge statement."""
    __tablename__ = "challenge_evaluations"
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    statement_id = Column(Integer, ForeignKey("challenge_statements.id"))
    
    # Summary scores
    total_score = Column(Integer, nullable=False)  # Sum of dimension scores
    weighted_score = Column(Integer, nullable=False)  # 0-100
    passes_non_negotiables = Column(Boolean, nullable=False)
    failed_non_negotiables = Column(JSON, nullable=True)  # ["Audience Truth", ...]
    recommendation = Column(String, nullable=False)  # "proceed", "revise", "reject"
    
    # Relationships
    statement = relationship("ChallengeStatement", back_populates="evaluation")
    dimension_scores = relationship("DimensionScore", back_populates="evaluation", cascade="all, delete-orphan")
    research_references = relationship("ResearchReference", back_populates="evaluation", cascade="all, delete-orphan")

class DimensionScore(Base):
    """Score for each of 8 evaluation dimensions."""
    __tablename__ = "dimension_scores"
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    evaluation_id = Column(Integer, ForeignKey("challenge_evaluations.id"))
    
    dimension_id = Column(String, nullable=False)  # "E01", "E02", etc.
    score = Column(Integer, nullable=False)  # 1-5
    notes = Column(Text, nullable=False)
    has_red_flags = Column(Boolean, default=False)
    
    evaluation = relationship("ChallengeEvaluation", back_populates="dimension_scores")

class ResearchReference(Base):
    """Link to research documents used in evaluation."""
    __tablename__ = "research_references"
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    evaluation_id = Column(Integer, ForeignKey("challenge_evaluations.id"))
    
    document_id = Column(String, nullable=False)  # "RD001"
    document_name = Column(String, nullable=False)
    relevant_insight = Column(Text, nullable=False)
    relevance_score = Column(Integer, nullable=False)  # 1-5
    
    evaluation = relationship("ChallengeEvaluation", back_populates="research_references")

class ResearchDocument(Base):
    """Uploaded research documents (no key insights extraction)."""
    __tablename__ = "research_documents"
    
    id = Column(String, primary_key=True, default=generate_uuid)
    name = Column(String, nullable=False)
    type = Column(String, nullable=False)  # "clinical-trial", "market-research", etc.
    file_type = Column(String, nullable=False)  # "pdf", "ppt", "docx"
    file_path = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    
    # Metadata
    uploaded_at = Column(DateTime(timezone=True), server_default=func.now())
    size_kb = Column(Integer, nullable=False)
