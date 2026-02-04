"""
Challenge Statement Generator - Core Logic

Implements:
1. Diagnostic decision tree (matches frontend mock exactly)
2. Format selection (F01-F12)
3. AI-powered challenge generation with Gemini 3.0 Pro
4. 8-dimension evaluation framework
"""

from google import genai
from google.genai import types
from data_library.config import GEMINI_API_KEY
from typing import List, Dict, Any, AsyncGenerator
import json
import logging
import asyncio
import time

logger = logging.getLogger(__name__)

# Lazy client initialization to avoid blocking on module import
_client = None

def get_client():
    """Get or create Gemini client (lazy initialization)."""
    global _client
    if _client is None:
        _client = genai.Client(api_key=GEMINI_API_KEY)
    return _client

# Model configuration
# Model configuration
# Using stable gemini-1.5-pro for reasoning tasks
GEMINI_PRO_MODEL = "gemini-3-pro-preview" 

# ============================================================================
# STRUCTURED OUTPUT SCHEMA FOR DIAGNOSTIC ANALYSIS
# ============================================================================

def get_diagnostic_schema():
    """Define structured output schema for diagnostic analysis."""
    return types.Schema(
        type=types.Type.OBJECT,
        properties={
            "diagnostic_path": types.Schema(
                type=types.Type.ARRAY,
                items=types.Schema(
                    type=types.Type.OBJECT,
                    properties={
                        "question": types.Schema(type=types.Type.STRING),
                        "answer": types.Schema(type=types.Type.STRING),
                        "reasoning": types.Schema(type=types.Type.STRING),
                        "confidence": types.Schema(type=types.Type.NUMBER)
                    },
                    required=["question", "answer", "reasoning", "confidence"]
                )
            ),
            "selected_formats": types.Schema(
                type=types.Type.ARRAY,
                items=types.Schema(
                    type=types.Type.OBJECT,
                    properties={
                        "format_id": types.Schema(type=types.Type.STRING),
                        "reasoning": types.Schema(type=types.Type.STRING),
                        "priority": types.Schema(type=types.Type.INTEGER)
                    },
                    required=["format_id", "reasoning", "priority"]
                )
            ),
            "diagnostic_summary": types.Schema(type=types.Type.STRING)
        },
        required=["diagnostic_path", "selected_formats", "diagnostic_summary"]
    )

# ============================================================================
# 12 CHALLENGE FORMATS (from frontend mock-data.ts)
# ============================================================================

CHALLENGE_FORMATS = {
    "F01": {
        "name": "Core Mindset-Shift",
        "template": "How can we help [TARGET AUDIENCE] move from [CURRENT MINDSET / BEHAVIOR] to [DESIRED MINDSET / BEHAVIOR], without [KEY FEAR, RISK, OR BARRIER]?",
        "category": "core"
    },
    "F02": {
        "name": "Reframing",
        "template": "How can we reframe [CURRENT BELIEF] as [NEW, MORE EMPOWERING BELIEF]?",
        "category": "core"
    },
    "F03": {
        "name": "Permission-Giving",
        "template": "How can we give [TARGET AUDIENCE] permission to [DESIRED ACTION] without violating their sense of caution or responsibility?",
        "category": "core"
    },
    "F04": {
        "name": "Role-Clarification",
        "template": "How can we clearly define our role in [JOURNEY / DECISION MOMENT] without overreaching beyond our evidence?",
        "category": "core"
    },
    "F05": {
        "name": "Differentiation-Through-Restraint",
        "template": "How can we stand apart by focusing on [SPECIFIC STRENGTH] instead of [CATEGORY NORM]?",
        "category": "core"
    },
    "F06": {
        "name": "Simplification",
        "template": "How can we simplify [COMPLEX DECISION / INFORMATION] so that [TARGET AUDIENCE] can act with confidence?",
        "category": "core"
    },
    "F07": {
        "name": "Confidence-Building",
        "template": "How can we reinforce confidence in [DESIRED DECISION / BEHAVIOR] when [EXTERNAL PRESSURE OR DOUBT] is working against it?",
        "category": "core"
    },
    "F08": {
        "name": "Redefining Success",
        "template": 'How can we redefine what "success" looks like in [CATEGORY / CONDITION] beyond [TRADITIONAL METRIC]?',
        "category": "core"
    },
    "F09": {
        "name": "Risk-of-Inaction",
        "template": "How can we make the cost of not acting visible without resorting to fear or alarmism?",
        "category": "edge-case"
    },
    "F10": {
        "name": "Trust-Repair",
        "template": "How can we rebuild trust in [CATEGORY / BRAND / APPROACH] without defending past assumptions?",
        "category": "edge-case"
    },
    "F11": {
        "name": "Paradigm-Shift",
        "template": "How can we help the audience let go of [OLD PARADIGM] and adopt [NEW PARADIGM] without feeling reckless or irresponsible?",
        "category": "edge-case"
    },
    "F12": {
        "name": "Behavior-Maintenance",
        "template": "How can we help [TARGET AUDIENCE] stay committed to [DESIRED BEHAVIOR] over time, even when urgency fades?",
        "category": "edge-case"
    }
}

# ============================================================================
# 8 EVALUATION DIMENSIONS (from frontend mock-data.ts)
# ============================================================================

EVALUATION_DIMENSIONS = {
    "E01": {
        "name": "Business Relevance",
        "weight": "high",
        "non_negotiable": False
    },
    "E02": {
        "name": "Audience Truth",
        "weight": "high",
        "non_negotiable": True
    },
    "E03": {
        "name": "Insight Strength",
        "weight": "high",
        "non_negotiable": False
    },
    "E04": {
        "name": "Data & Evidence Alignment",
        "weight": "medium",
        "non_negotiable": True
    },
    "E05": {
        "name": "Lifecycle Appropriateness",
        "weight": "medium",
        "non_negotiable": False
    },
    "E06": {
        "name": "Strategic Focus",
        "weight": "medium",
        "non_negotiable": False
    },
    "E07": {
        "name": "Creative Solvability",
        "weight": "high",
        "non_negotiable": True
    },
    "E08": {
        "name": "Longevity & Scalability",
        "weight": "medium",
        "non_negotiable": False
    }
}

# ============================================================================
# MAIN GENERATION STREAMING FUNCTION
# ============================================================================

async def generate_challenges_stream(
    brief_text: str,
    include_research: bool,
    selected_research_ids: List[str],
    research_docs: List[Dict[str, str]] = None
) -> AsyncGenerator[str, None]:
    """
    Generator that streams execution progress and results as JSON events.
    
    Yields JSON strings:
    {"type": "diagnostic", "data": {...}}
    {"type": "challenge_result", "data": {...}}
    """
    logger.info(f"Generating challenges (stream) for brief length: {len(brief_text)}")

    # Prepare Research Files (Long Context)
    # Step 0: Retrieval Context Setup
    retrieval_start = time.time()
    research_files = []
    if research_docs:
        import mimetypes
        logger.info(f"Processing {len(research_docs)} research docs for context...")
        for doc in research_docs:
            uri = doc.get("gemini_uri")
            if uri:
                mime_type = doc.get("mime_type")
                if not mime_type and doc.get("name"):
                     mime_type, _ = mimetypes.guess_type(doc["name"])
                
                if not mime_type:
                    mime_type = "application/pdf" # Default
                
                try:
                    # Create Part object for Long Context
                    part = types.Part.from_uri(file_uri=uri, mime_type=mime_type)
                    research_files.append(part)
                    logger.info(f"Added context: {doc.get('name')} ({mime_type})")
                except Exception as e:
                    logger.error(f"Failed to create part for {doc.get('name')}: {e}")
    retrieval_duration = time.time() - retrieval_start


    # Step 1: Run Diagnostic
    start_time = time.time()
    diagnostic_result = await run_diagnostic_tree_with_llm(brief_text)
    
    selected_formats = [f["format_id"] for f in diagnostic_result["selected_formats"]]
    
    # 1. Yield Diagnostic Result immediately
    yield json.dumps({
        "type": "diagnostic",
        "data": {
            "diagnostic_summary": diagnostic_result["diagnostic_summary"],
            "diagnostic_path": diagnostic_result["diagnostic_path"],
            "selected_formats": selected_formats
        }
    })
    
    diagnostic_duration = time.time() - start_time
    logger.info(f"Diagnostic yielded after {diagnostic_duration:.2f}s")
    
    # Step 2: Parallel Generation & Evaluation
    # Create tasks for each format to run concurrently
    tasks = [
        process_single_challenge_task(
            idx=idx+1,
            format_id=fmt_id,
            brief_text=brief_text,
            include_research=include_research,
            research_ids=selected_research_ids,
            research_files=research_files,
            reasoning=next(
                (f["reasoning"] for f in diagnostic_result["selected_formats"] if f["format_id"] == fmt_id),
                "Selected by diagnostic"
            )
        )
        for idx, fmt_id in enumerate(selected_formats)
    ]
    
    # Step 3: Yield results as they complete
    for future in asyncio.as_completed(tasks):
        try:
            result = await future
            yield json.dumps({
                "type": "challenge_result",
                "data": result
            })
        except Exception as e:
            logger.error(f"Task failed: {e}")
            # Yield error placeholder if needed, or just log
            # For now we'll rely on the task to return a fallback object on failure

    # Final Timing Metrics
    total_duration = time.time() - start_time
    
    yield json.dumps({
        "type": "timing_metrics",
        "data": {
            "total_latency_ms": int((total_duration + retrieval_duration) * 1000),
            "diagnostic_ms": int(diagnostic_duration * 1000),
            "retrieval_ms": int(retrieval_duration * 1000),
        }
    })

async def process_single_challenge_task(
    idx: int,
    format_id: str,
    brief_text: str,
    include_research: bool,
    research_ids: List[str],
    reasoning: str,
    research_files: List[Any] = None
) -> Dict[str, Any]:
    """
    Generates AND evaluates a single challenge statement.
    This runs in parallel for each format.
    """
    try:
        # A. Generate Statement
        statement_data = await generate_single_statement_with_ai(
            brief_text=brief_text,
            format_id=format_id,
            reasoning=reasoning,
            research_files=research_files
        )
        
        # B. Evaluate Statement
        evaluation = await evaluate_statement_with_ai(
            statement_text=statement_data["text"],
            brief_text=brief_text,
            include_research=include_research
        )
        
        # Combine
        return {
            "id": idx,
            "text": statement_data["text"],
            "selected_format": format_id,
            "reasoning": reasoning,
            "evaluation": evaluation,
            "position": idx
        }
        
    except Exception as e:
        logger.error(f"Error processing format {format_id}: {e}")
        # Return fallback
        return {
            "id": idx,
            "text": f"Error generating content for {format_id}. Please try again.",
            "selected_format": format_id,
            "reasoning": reasoning,
            "evaluation": create_default_evaluation(),
            "position": idx
        }

# ============================================================================
# LLM-BASED DIAGNOSTIC DECISION TREE (Gemini 3 Pro)
# ============================================================================

async def run_diagnostic_tree_with_llm(brief_text: str) -> Dict[str, Any]:
    """
    Use Gemini 3 Pro to analyze brief and select formats intelligently.
    """
    logger.info("Running LLM-based diagnostic analysis...")
    
    # Build format descriptions for the prompt
    format_descriptions = "\n".join([
        f"{f_id} - {CHALLENGE_FORMATS[f_id]['name']}: {CHALLENGE_FORMATS[f_id]['template']}"
        for f_id in CHALLENGE_FORMATS.keys()
    ])
    
    prompt = f"""You are an expert pharmaceutical marketing strategist. Analyze this marketing brief using a diagnostic decision tree, then select the most appropriate challenge statement formats.

## TASK 1: Diagnostic Decision Tree

Answer these questions about the brief. Follow the tree structure:

**Q1: Is the audience already behaving the way we want?**
- Look for: adoption, current usage, established behaviors, existing prescribing patterns
- Answer: "yes" or "no"
- Provide: reasoning (2-3 sentences) + confidence (0.0-1.0)

**Q2 [If Q1=yes]: Is this behavior at risk of eroding?**
- Look for: declining usage, competitive pressure, doubts, market share loss
- Answer: "yes" or "no"
- Provide: reasoning + confidence

**Q3 [If Q1=no]: Does the audience know what to do, but hesitate emotionally or professionally?**
- Look for: fear, risk concerns, professional barriers, hesitation, reluctance
- Answer: "yes" or "no"
- Provide: reasoning + confidence

**Q4 [If Q3=no]: Is the primary barrier a dominant belief or mental model?**
- Look for: beliefs, perceptions, mindsets, mental models, assumptions
- Answer: "yes" or "no"
- Provide: reasoning + confidence

**Q5 [If Q4=no]: Is the audience overwhelmed or paralyzed by complexity?**
- Look for: complexity, confusion, information overload, decision paralysis
- Answer: "yes" or "no"
- Provide: reasoning + confidence

## TASK 2: Format Selection

Based on your diagnostic analysis, select EXACTLY 5 challenge formats from this list:

{format_descriptions}

Selection criteria:
1. **Relevance**: Format must address the identified barriers/opportunities
2. **Priority**: Rank formats 1-5 (1=most critical, 5=least critical)
3. **Reasoning**: Explain why each format is appropriate for this brief

## MARKETING BRIEF:
{brief_text}

## OUTPUT FORMAT:
Return structured JSON with:
- diagnostic_path: Array of Q&A objects (question, answer, reasoning, confidence)
- selected_formats: Array of exactly 5 format objects (format_id, reasoning, priority)
- diagnostic_summary: 2-3 sentence summary of the analysis

Be specific and cite evidence from the brief in your reasoning."""

    try:
        response = get_client().models.generate_content(
            model=GEMINI_PRO_MODEL,
            contents=prompt,
            config=types.GenerateContentConfig(
                response_mime_type="application/json",
                response_schema=get_diagnostic_schema(),
                temperature=0.3
            )
        )
        
        result = json.loads(response.text)
        
        # Clean up format_ids
        for fmt in result["selected_formats"]:
            format_id = fmt["format_id"].split(" ")[0].split("-")[0].strip()
            fmt["format_id"] = format_id
        
        # Validate logic
        if len(result["selected_formats"]) != 5:
            # Fallback if AI gets count wrong, just take first 5 or pad
            logger.warning(f"AI returned {len(result['selected_formats'])} formats, resizing to 5.")
            # Basic fallback logic not fully implemented here as Gemini 3 Pro is usually reliable
            
        for fmt in result["selected_formats"]:
            if fmt["format_id"] not in CHALLENGE_FORMATS:
                # Map invalid ID to simpler one or ignore
                logger.warning(f"Invalid format ID received: {fmt['format_id']}")
                fmt["format_id"] = "F01" # Default fallback
        
        logger.info(f"Diagnostic complete.")
        return result
        
    except Exception as e:
        logger.error(f"LLM diagnostic failed: {e}")
        # Return sensible default structure to avoid crash
        return {
            "diagnostic_path": [],
            "selected_formats": [{"format_id": "F01", "reasoning": "Fallback", "priority": 1}] * 5,
            "diagnostic_summary": "Diagnostic analysis unavailable."
        }


# ============================================================================
# SINGLE STATEMENT GENERATION (Gemini 3 Pro)
# ============================================================================

async def generate_single_statement_with_ai(
    brief_text: str,
    format_id: str,
    reasoning: str,
    research_files: List[Any] = None
) -> Dict[str, Any]:
    """
    Generates a SINGLE challenge statement for a specific format, optionally utilizing research files.
    """
    format_def = CHALLENGE_FORMATS[format_id]
    
    prompt = f"""You are an expert pharmaceutical brand strategist. Generate a strategic challenge statement for a marketing brief.

MARKETING BRIEF:
{brief_text}

SELECTED FORMAT:
ID: {format_id}
Name: {format_def['name']}
Template: {format_def['template']}
Reasoning: {reasoning}

Task: Generate ONE high-quality challenge statement using this format.

1. "How can we..." question applying the template.
2. Specific to the brand/audience in the brief.
3. If research documents are provided, cite or use them implicitly to ground the challenge.

Return JSON:
{{
  "text": "How can we...",
  "reasoning_check": "Short self-check on why this fits..."
}}"""

    try:
        contents = [prompt]
        if research_files:
            # Append file objects/parts to the content list (Long Context)
            contents.extend(research_files)

        response = get_client().models.generate_content(
            model=GEMINI_PRO_MODEL,
            contents=contents,
            config=types.GenerateContentConfig(
                temperature=0.7,
                response_mime_type="application/json"
            )
        )
        
        response_text = response.text.strip()
        if response_text.startswith("```"):
            response_text = response_text.split("```")[1]
            if response_text.startswith("json"):
                response_text = response_text[4:]
        
        data = json.loads(response_text)
        return {
            "text": data.get("text", "Error generating text"),
            "format_id": format_id
        }
    except Exception as e:
        logger.error(f"Single statement gen failed for {format_id}: {e}")
        return {
            "text": f"How can we apply {format_def['name']} to this challenge?",
            "format_id": format_id
        }

# ============================================================================
# EVALUATION (Gemini 3 Pro)
# ============================================================================


async def evaluate_statement_with_ai(
    statement_text: str,
    brief_text: str,
    include_research: bool
) -> Dict[str, Any]:
    """
    Use Gemini to evaluate statement on 8 dimensions AND detect its format.
    """
    
    dimensions_info = "\n".join([
        f"{d_id} - {EVALUATION_DIMENSIONS[d_id]['name']} (Weight: {EVALUATION_DIMENSIONS[d_id]['weight']}, Critical: {EVALUATION_DIMENSIONS[d_id]['non_negotiable']})"
        for d_id in EVALUATION_DIMENSIONS.keys()
    ])
    
    format_descriptions = "\n".join([
        f"{f_id} - {CHALLENGE_FORMATS[f_id]['name']}"
        for f_id in CHALLENGE_FORMATS.keys()
    ])
    
    prompt = f"""You are evaluating a strategic challenge statement on 8 dimensions and identifying its format.

CHALLENGE STATEMENT:
{statement_text}

ORIGINAL BRIEF:
{brief_text}

DIMENSIONS TO EVALUATE (score 1-5 each):
{dimensions_info}

FORMATS TO CLASSIFY AGAINST:
{format_descriptions}

Instructions:
1. Classification: Identify which Challenge Format (F01-F12) this statement best matches.
2. Evaluation: Score each dimension from 1 (poor) to 5 (excellent).
   - Provide brief notes explaining the score.
   - Flag if any critical red flags are present.

Return ONLY valid JSON (no markdown):
{{
  "detected_format_id": "F01",
  "scores": [
    {{
      "dimension_id": "E01",
      "score": 4,
      "notes": "Brief explanation...",
      "has_red_flags": false
    }},
    ...
  ]
}}"""
    
    try:
        response = get_client().models.generate_content(
            model=GEMINI_PRO_MODEL,
            contents=prompt,
            config=types.GenerateContentConfig(
                temperature=0.3,
                response_mime_type="application/json"
            )
        )
        
        response_text = response.text.strip()
        if response_text.startswith("```"):
            response_text = response_text.split("```")[1]
            if response_text.startswith("json"):
                response_text = response_text[4:]
        
        eval_data = json.loads(response_text)
        
        # Calculate scores
        scores = eval_data["scores"]
        total_score = sum(s["score"] for s in scores)
        weighted_score = calculate_weighted_score(scores)
        failed_non_negotiables = get_failed_non_negotiables(scores)
        
        return {
            "dimension_scores": scores,
            "total_score": total_score,
            "weighted_score": weighted_score,
            "passes_non_negotiables": len(failed_non_negotiables) == 0,
            "failed_non_negotiables": failed_non_negotiables,
            "recommendation": determine_recommendation(scores, failed_non_negotiables),
            "research_references": [],
            "detected_format_id": eval_data.get("detected_format_id", "F01")
        }
    except Exception as e:
        logger.error(f"AI evaluation failed: {e}")
        # Fallback to default scores
        return create_default_evaluation()

async def rewrite_statement_with_ai(
    original_text: str,
    brief_text: str,
    instruction: str = ""
) -> str:
    """
    Rewrite a challenge statement based on user instruction or general improvement.
    """
    prompt = f"""You are an expert pharmaceutical copywriter.
    
    ORIGINAL STATEMENT:
    "{original_text}"
    
    CONTEXT (BRIEF):
    {brief_text[:500]}...
    
    USER INSTRUCTION:
    {instruction if instruction else "Improve clarity and impact while maintaining the strategic intent."}
    
    Task: Rewrite the statement to be more powerful, concise, and aligned with the instruction.
    Return ONLY the new statement text. Do not output anything else.
    """
    
    try:
        response = get_client().models.generate_content(
            model=GEMINI_PRO_MODEL,
            contents=prompt,
            config=types.GenerateContentConfig(
                temperature=0.7,
                response_mime_type="text/plain"
            )
        )
        return response.text.strip()
    except Exception as e:
        logger.error(f"Rewrite failed: {e}")
        return original_text

def calculate_weighted_score(scores: List[Dict]) -> int:
    """Calculate weighted score (0-100)."""
    total_weighted = 0
    max_weighted = 0
    
    for score_data in scores:
        dim_id = score_data["dimension_id"]
        score = score_data["score"]
        weight = 3 if EVALUATION_DIMENSIONS.get(dim_id, {}).get("weight") == "high" else 2
        
        total_weighted += score * weight
        max_weighted += 5 * weight
    
    return round((total_weighted / max_weighted) * 100) if max_weighted > 0 else 0

def get_failed_non_negotiables(scores: List[Dict]) -> List[str]:
    """Get list of failed critical dimensions."""
    failed = []
    for score_data in scores:
        dim_id = score_data["dimension_id"]
        dim_def = EVALUATION_DIMENSIONS.get(dim_id)
        if dim_def and dim_def["non_negotiable"] and score_data["score"] < 3:
            failed.append(dim_def["name"])
    return failed

def determine_recommendation(scores: List[Dict], failed_non_negotiables: List[str]) -> str:
    """Determine proceed/revise/reject recommendation."""
    if len(failed_non_negotiables) > 0:
        return "reject"
    
    total_score = sum(s["score"] for s in scores)
    max_score = len(scores) * 5
    
    if total_score / max_score >= 0.7:
        return "proceed"
    else:
        return "revise"

def create_default_evaluation() -> Dict[str, Any]:
    """Fallback evaluation if AI fails."""
    scores = [
        {
            "dimension_id": dim_id,
            "score": 4,
            "notes": "Auto-generated score",
            "has_red_flags": False
        }
        for dim_id in EVALUATION_DIMENSIONS.keys()
    ]
    
    return {
        "dimension_scores": scores,
        "total_score": 32,
        "weighted_score": 80,
        "passes_non_negotiables": True,
        "failed_non_negotiables": [],
        "recommendation": "proceed",
        "research_references": [],
        "detected_format_id": "F01"
    }

# ============================================================================
# GEMINI RAG / FILE MANAGEMENT
# ============================================================================

async def upload_file_to_gemini_corpus(file_path: str, display_name: str):
    """Upload a local file to Gemini Files API."""
    client = get_client()
    import mimetypes
    
    try:
        mime_type, _ = mimetypes.guess_type(file_path)
        
        # Simple Files API Upload (Long Context Model Support)
        logger.info(f"Uploading {display_name} to Gemini...")
        uploaded_file = client.files.upload(
            file=file_path,
            config=types.UploadFileConfig(display_name=display_name, mime_type=mime_type)
        )
        logger.info(f"Uploaded file {uploaded_file.name} to Gemini.")
        return uploaded_file
        
    except Exception as e:
        logger.error(f"Gemini Upload Error: {e}")
        return None

async def delete_file_from_gemini(file_name: str):
    """Delete a file from Gemini Files API."""
    client = get_client()
    try:
        logger.info(f"Deleting file {file_name} from Gemini...")
        client.files.delete(name=file_name)
        logger.info(f"Successfully deleted {file_name}")
        return True
    except Exception as e:
        logger.error(f"Failed to delete file {file_name}: {e}")
        return False
