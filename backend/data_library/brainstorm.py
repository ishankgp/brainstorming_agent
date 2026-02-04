
import json
import re
import logging
from pathlib import Path
from typing import List, Dict, Any, Optional
from datetime import datetime

from google import genai
from google.genai import types
from data_library.config import GEMINI_API_KEY, GEMINI_THINKING_MODEL
from data_library.file_search import list_files

# Setup Logging
logger = logging.getLogger("data_library.brainstorm")
logging.basicConfig(level=logging.INFO)

# Initialize Client
client = genai.Client(api_key=GEMINI_API_KEY)

# -----------------------------------------------------------------------------
# 1. Local RAG Retrieval (Chunks)
# -----------------------------------------------------------------------------

class Chunk:
    def __init__(self, chunk_id: str, text: str, source: str, location: str):
        self.chunk_id = chunk_id
        self.text = text
        self.source = source
        self.location = location

def chunk_text(text: str, source_name: str, chunk_size: int = 500) -> List[Chunk]:
    """Simple paragraph-based chunking."""
    chunks = []
    paragraphs = text.split('\n\n')
    current_chunk = []
    current_length = 0
    chunk_idx = 0

    for para in paragraphs:
        if not para.strip():
            continue
        
        current_chunk.append(para)
        current_length += len(para)

        if current_length >= chunk_size:
            chunk_text_str = "\n".join(current_chunk)
            chunk_id = f"{source_name}_chk_{chunk_idx}"
            chunks.append(Chunk(chunk_id, chunk_text_str, source_name, f"Segment {chunk_idx}"))
            chunk_idx += 1
            current_chunk = []
            current_length = 0
    
    # Leftover
    if current_chunk:
        chunk_text_str = "\n".join(current_chunk)
        chunk_id = f"{source_name}_chk_{chunk_idx}"
        chunks.append(Chunk(chunk_id, chunk_text_str, source_name, f"Segment {chunk_idx}"))

    return chunks

def retrieve_chunks(query: str, top_k: int = 12) -> List[Dict[str, Any]]:
    """
    Simulated RAG: Reads local documents, chunks them, and performs a 
    simple keyword/overlap search to find relevant segments.
    """
    # 1. Load Documents
    docs_dir = Path("./data/documents")
    if not docs_dir.exists():
        return []

    all_chunks: List[Chunk] = []

    # Read supported files
    for file_path in docs_dir.glob("*"):
        if file_path.suffix.lower() in ['.txt', '.md', '.json']:
            try:
                text = file_path.read_text(encoding='utf-8', errors='ignore')
                all_chunks.extend(chunk_text(text, file_path.name))
            except Exception as e:
                logger.error(f"Failed to read {file_path}: {e}")
    
    if not all_chunks:
        return []

    # 2. Score Chunks (Simple TF-IDF / Overlap)
    # For MVP simplicity without heavy deps, we count query term occurrences.
    query_terms = set(query.lower().split())
    scored_chunks = []

    for chunk in all_chunks:
        score = 0
        chunk_lower = chunk.text.lower()
        for term in query_terms:
            if term in chunk_lower:
                score += 1
        
        # Boost close matches
        if query.lower() in chunk_lower:
            score += 5

        if score > 0:
            scored_chunks.append((score, chunk))
    
    # 3. Sort and Return
    scored_chunks.sort(key=lambda x: x[0], reverse=True)
    top_chunks = scored_chunks[:top_k]

    return [
        {
            "chunk_id": c.chunk_id,
            "text": c.text,  # The snippet
            "source_title": c.source,
            "location_label": c.location,
            "score": s
        }
        for s, c in top_chunks
    ]

# -----------------------------------------------------------------------------
# 2. Logic & Prompts
# -----------------------------------------------------------------------------

RUBRIC_DEFINITIONS = """
1. Business Relevance (High Wt): Addresses primary business problem? Moves KPIs?
2. Audience Truth (High Wt): Grounded in real audience behavior/beliefs?
3. Insight Strength (High Wt): Rooted in true tension/contradiction?
4. Data Alignment (Med Wt): Supported by evidence/data?
5. Lifecycle Fit (Med Wt): Appropriate for pre/post launch?
6. Strategic Focus (Med Wt): Singular tension? Prioritized?
7. Creative Solvability (High Wt): Can creative comms solve this?
8. Longevity (Med Wt): Sustained relevance?
"""

FORMATS_DEFINITIONS = """
(1) Core Mindset-Shift: Move from [Behavior A] to [Behavior B] without [Barrier].
(2) Reframing: Reframe [Belief A] as [Belief B].
(3) Permission-Giving: Give permission to [Action] without [Risk].
(4) Role-Clarification: Define role in [Moment] without overreaching.
(5) Differentiation-Toward-Restraint: Stand apart by focusing on [Strength] instead of [Norm].
(6) Simplification: Simplify [Complexity] so audience can act.
(7) Confidence-Building: Reinforce confidence when [Doubt] works against it.
(8) Redefining Success: Redefine success beyond [Metric].
(9) Risk-of-Inaction: Make cost of inaction visible without fear.
(10) Trust-Repair: Rebuild trust without defending past.
(11) Paradigm-Shift: Let go of [Old] for [New] without feeling reckless.
(12) Behavior-Maintenance: Stay committed to [Behavior] when urgency fades.
"""

def generate_system_instruction(retrieved_chunks_str: str) -> str:
    return f"""
    You are an expert Pharma Brand Strategist Agent. 
    Your goal is to convert draft problem statements into high-quality "Challenge Strings" using specific formatting rules.
    
    **CRITICAL INSTRUCTIONS**:
    1.  **Strict JSON Only**: You must output valid JSON. No markdown fencing (```json) is preferred, but handled.
    2.  **Evidence-Based**: You MUST cite claims using the provided `chunk_id`.
    3.  **Rubric**: Score every candidate on the 8 dimensions (1-5).
    4.  **Formats**: Map every candidate to one of the 12 defined formats.
    
    **The 12 Challenge Formats**:
    {FORMATS_DEFINITIONS}
    
    **The Rubric**:
    {RUBRIC_DEFINITIONS}
    
    **Available Evidence (Grounding)**:
    {retrieved_chunks_str}
    
    **JSON Schema**:
    {{
      "session_summary": {{
        "diagnostic_path": "Path A or B",
        "what_is_broken": "Summary of core issue",
        "recommended_formats": [1, 2],
        "notes": "..."
      }},
      "inputs_analysis": [
        {{
          "input_statement": "...",
          "detected_barriers": ["belief", "fear"],
          "best_fit_format_id": 1,
          "why": "...",
          "gaps": ["..."],
          "supporting_evidence": [
             {{ "chunk_id": "...", "location_label": "...", "supported_claim": "...", "confidence": "high" }}
          ]
        }}
      ],
      "candidate_statements": [
        {{
           "id": "cand_1",
           "statement_text": "How can we...",
           "format_id": 1,
           "format_name": "Core Mindset-Shift",
           "what_this_solves": "...",
           "rubric": {{
              "business_relevance": {{ "score": 5, "rationale": "..." }},
              "audience_truth": {{ "score": 4, "rationale": "..." }},
              "insight_strength": {{ "score": 4, "rationale": "..." }},
              "data_alignment": {{ "score": 3, "rationale": "..." }},
              "lifecycle_fit": {{ "score": 5, "rationale": "..." }},
              "strategic_focus": {{ "score": 4, "rationale": "..." }},
              "creative_solvability": {{ "score": 5, "rationale": "..." }},
              "longevity": {{ "score": 3, "rationale": "..." }}
           }},
           "weighted_score": 0.0,
           "recommended_edits": ["..."],
           "key_citations": [
              {{ "chunk_id": "...", "location_label": "...", "why_relevant": "..." }}
           ],
           "risk_flags": [
              {{ "type": "missing_evidence", "detail": "Claim X not found in docs." }}
           ]
        }}
      ],
      "draft_brief_snippet": {{
         "shortlist_candidate_ids": ["cand_1"],
         "single_best_recommendation": "cand_1",
         "supporting_insight": "...",
         "proof_points": [
            {{ "claim": "...", "citation": {{ "chunk_id": "...", "location_label": "..." }} }}
         ],
         "creative_guardrails": ["..."],
         "open_questions_for_client": ["..."]
      }}
    }}
    
    If you cannot find evidence for a claim, you MUST flag it as 'missing_evidence' in `risk_flags`.
    """

async def run_brainstorm_session(
    marketing_brief: str, 
    lifecycle_stage: str, 
    audience: str, 
    statements: List[str]
) -> Dict[str, Any]:
    
    # 1. Retrieve Evidence
    query = f"{marketing_brief} {audience} " + " ".join(statements)
    evidence_chunks = retrieve_chunks(query, top_k=15)
    
    # Format chunks for Prompt
    chunks_str = ""
    for c in evidence_chunks:
        chunks_str += f"[Chunk ID: {c['chunk_id']}] (Source: {c['source_title']} {c['location_label']})\n{c['text']}\n---\n"
        
    if not chunks_str:
        chunks_str = "NO DOCUMENTS FOUND IN LIBRARY. RELY ON ASSUMPTIONS AND FLAG AS MISSING EVIDENCE."

    # 2. Build Prompt
    user_prompt = f"""
    **Context**:
    - Marketing Brief: {marketing_brief}
    - Lifecycle Stage: {lifecycle_stage}
    - Target Audience: {audience}
    
    **Problem Statements to Analyze**:
    {json.dumps(statements, indent=2)}
    
    Generate the Brainstorm JSON output now.
    """
    
    system_inst = generate_system_instruction(chunks_str)

    # 3. Call Gemini
    try:
        response = client.models.generate_content(
            model=GEMINI_THINKING_MODEL,
            contents=user_prompt,
            config=types.GenerateContentConfig(
                system_instruction=system_inst,
                temperature=0.4, # Lower temp for strict logic
                thinking_config=types.ThinkingConfig(include_thoughts=True)
            )
        )
        
        # 4. Parse Response & Thoughts
        thoughts = []
        json_text = ""
        
        # Helper to extract parts safely
        candidate = response.candidates[0]
        logger.info(f"Processing {len(candidate.content.parts)} parts from Gemini")
        
        if hasattr(candidate.content, 'parts'):
            for i, part in enumerate(candidate.content.parts):
                # Debug logging to see what part is what
                is_thought = getattr(part, 'thought', False)
                logger.info(f"Part {i}: thought={is_thought}, text_len={len(part.text or '')}")
                
                if is_thought: 
                    thoughts.append(part.text)
                else:
                    json_text += part.text
        else:
            json_text = response.text

        # Fallback: If no thoughts captured but model might have used tags
        if not thoughts and "<thought>" in json_text:
            logger.info("Falling back to tag-based thought extraction")
            pattern = re.compile(r"<thought>(.*?)</thought>", re.DOTALL)
            thoughts = pattern.findall(json_text)
            json_text = pattern.sub("", json_text).strip()

        # If no thoughts captured (model might return all as text or diff structure), 
        # ensure we at least have text.
        if not json_text:
            json_text = response.text

        # 5. Parse JSON
        try:
            # Strip markdown
            clean_json = json_text
            if "```json" in clean_json:
                clean_json = clean_json.split("```json")[1].split("```")[0]
            elif "```" in clean_json:
                clean_json = clean_json.split("```")[1].split("```")[0]
            
            data = json.loads(clean_json)
            
            # Inject Thoughts into Output Data for Frontend/Storage
            data["thought_process"] = thoughts
            
            # 5. Compute Weighted Scores (Unit Test logic)
            # Weights: High=1.5, Med=1.0
            def compute_score(rubric):
                high = ["business_relevance", "audience_truth", "insight_strength", "creative_solvability"]
                med = ["data_alignment", "lifecycle_fit", "strategic_focus", "longevity"]
                
                total = 0.0
                weight_sum = 0.0
                
                for k, v in rubric.items():
                    score = v.get("score", 0)
                    weight = 1.5 if k in high else 1.0
                    total += score * weight
                    weight_sum += weight
                    
                return round(total / weight_sum, 1) if weight_sum > 0 else 0

            for cand in data.get("candidate_statements", []):
                if "rubric" in cand:
                    cand["weighted_score"] = compute_score(cand["rubric"])
                    
            return {"output": data, "evidence": evidence_chunks}
            
        except json.JSONDecodeError as je:
            logger.error(f"JSON Parse Error: {je}")
            # If parse fails, return raw logic so we can debug
            return {"error": "Failed to parse JSON", "raw": json_text, "thoughts": thoughts}

    except Exception as e:
        logger.error(f"Gemini Error: {e}")
        return {"error": str(e)}
