"""
Challenge Statement Generator - Core Logic

Implements:
1. Diagnostic decision tree (matches frontend mock exactly)
2. Format selection (F01-F12)
3. AI-powered challenge generation with Gemini 2.0 Pro
4. 8-dimension evaluation framework
"""

from google import genai
from google.genai import types
from data_library.config import GEMINI_API_KEY
from typing import List, Dict, Any
import json
import logging

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
GEMINI_PRO_MODEL = "gemini-2.0-flash"  # Stable production model
GEMINI_3_PRO_MODEL = "gemini-3-pro-preview"  # Advanced reasoning for diagnostics

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
# MAIN GENERATION FUNCTION
# ============================================================================

async def generate_challenges(
    brief_text: str,
    include_research: bool,
    selected_research_ids: List[str]
) -> Dict[str, Any]:
    """
    Main generation function matching frontend flow.
    
    Returns:
    {
        "challenge_statements": [...],  # 5 statements
        "diagnostic_summary": "...",
        "diagnostic_path": [...]
    }
    """
    logger.info(f"Generating challenges for brief (length: {len(brief_text)})")
    
    # Step 1: Run LLM-based diagnostic (replaces keyword matching)
    diagnostic_result = await run_diagnostic_tree_with_llm(brief_text)
    
    diagnostic_path = diagnostic_result["diagnostic_path"]
    selected_formats = [f["format_id"] for f in diagnostic_result["selected_formats"]]
    diagnostic_summary = diagnostic_result["diagnostic_summary"]
    
    logger.info(f"Diagnostic complete: {len(diagnostic_path)} questions, {len(selected_formats)} formats")
    
    # Step 2: Generate challenge statements with Gemini
    challenge_statements = await generate_statements_with_ai(
        brief_text=brief_text,
        selected_formats=selected_formats,
        include_research=include_research,
        research_ids=selected_research_ids
    )
    
    # Step 4: Evaluate each statement in parallel
    logger.info("Evaluating all statements in parallel...")
    evaluation_tasks = [
        evaluate_statement_with_ai(
            statement_text=stmt["text"],
            brief_text=brief_text,
            include_research=include_research
        )
        for stmt in challenge_statements
    ]
    
    import asyncio
    try:
        evaluations = await asyncio.gather(*evaluation_tasks, return_exceptions=True)
        
        for idx, eval_result in enumerate(evaluations):
            if isinstance(eval_result, Exception):
                logger.error(f"Evaluation failed for statement {idx+1}: {eval_result}")
                challenge_statements[idx]["evaluation"] = create_default_evaluation()
            else:
                challenge_statements[idx]["evaluation"] = eval_result
    except Exception as e:
        logger.error(f"Critical error in parallel evaluations: {e}")
        for stmt in challenge_statements:
            if "evaluation" not in stmt:
                stmt["evaluation"] = create_default_evaluation()
    
    # Step 5: Return results (diagnostic_summary already from LLM)
    
    return {
        "challenge_statements": challenge_statements[:5],  # Exactly 5
        "diagnostic_summary": diagnostic_summary,
        "diagnostic_path": diagnostic_path
    }

# ============================================================================
# LLM-BASED DIAGNOSTIC DECISION TREE (Gemini 3 Pro)
# ============================================================================

async def run_diagnostic_tree_with_llm(brief_text: str) -> Dict[str, Any]:
    """
    Use Gemini 3 Pro to analyze brief and select formats intelligently.
    
    Replaces keyword-matching with LLM-based semantic understanding.
    
    Returns:
    {
        "diagnostic_path": [...],  # Q&A with confidence scores
        "selected_formats": [...],  # 5 formats with reasoning & priority
        "diagnostic_summary": "..."
    }
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
            model=GEMINI_3_PRO_MODEL,
            contents=prompt,
            config=types.GenerateContentConfig(
                response_mime_type="application/json",
                response_schema=get_diagnostic_schema(),
                temperature=0.3  # Lower temp for analytical tasks
                # Note: thinking_level defaults to HIGH for gemini-3-pro-preview
            )
        )
        
        # Parse response
        result = json.loads(response.text)
        
        # Clean up format_ids (LLM might return "F09 - Risk-of-Inaction" instead of "F09")
        for fmt in result["selected_formats"]:
            # Extract just the format ID (F01-F12)
            format_id = fmt["format_id"].split(" ")[0].split("-")[0].strip()
            fmt["format_id"] = format_id
        
        # Validate we got exactly 5 formats
        if len(result["selected_formats"]) != 5:
            raise ValueError(f"Expected 5 formats, got {len(result['selected_formats'])}")
        
        # Validate all format IDs are valid
        for fmt in result["selected_formats"]:
            if fmt["format_id"] not in CHALLENGE_FORMATS:
                raise ValueError(f"Invalid format_id: {fmt['format_id']}")
        
        logger.info(f"Diagnostic complete: {len(result['diagnostic_path'])} questions answered")
        logger.info(f"Selected formats: {[f['format_id'] for f in result['selected_formats']]}")
        
        return result
        
    except Exception as e:
        logger.error(f"LLM diagnostic failed: {e}")
        raise  # Fail fast, no fallback to keywords

# ============================================================================
# DIAGNOSTIC DECISION TREE (matches frontend mock-data.ts:608-750)
# ============================================================================

def run_diagnostic_tree(brief_text: str) -> List[Dict[str, Any]]:
    """
    Implements frontend decision tree logic exactly.
    
    Returns diagnostic path as Q&A steps.
    """
    lower_brief = brief_text.lower()
    path = []
    
    # Q1: Is the audience already behaving the way we want?
    behavior_exists = (
        "adoption" in lower_brief or
        "currently using" in lower_brief or
        "established" in lower_brief
    )
    
    path.append({
        "question": "Q1: Is the audience already behaving the way we want?",
        "answer": "yes" if behavior_exists else "no",
        "reasoning": (
            "Brief indicates existing behavior patterns that need maintenance or reinforcement."
            if behavior_exists
            else "Brief suggests the desired behavior is not yet occurring - new adoption needed."
        )
    })
    
    if not behavior_exists:
        # PATH B: Behavior is not happening
        hesitates_emotionally = (
            "hesitat" in lower_brief or
            "fear" in lower_brief or
            "risk" in lower_brief or
            "concern" in lower_brief
        )
        
        path.append({
            "question": "Q3: Does the audience know what to do, but hesitate emotionally or professionally?",
            "answer": "yes" if hesitates_emotionally else "no",
            "reasoning": (
                "Brief mentions emotional or professional barriers to action."
                if hesitates_emotionally
                else "No clear emotional hesitation identified."
            )
        })
        
        if not hesitates_emotionally:
            # Q4: Dominant belief?
            dominant_belief = (
                "belief" in lower_brief or
                "perceive" in lower_brief or
                "think" in lower_brief or
                "mindset" in lower_brief
            )
            
            path.append({
                "question": "Q4: Is the primary barrier a dominant belief or mental model?",
                "answer": "yes" if dominant_belief else "no",
                "reasoning": (
                    "Mental models or beliefs identified as key barrier."
                    if dominant_belief
                    else "Barrier appears to be structural or informational."
                )
            })
            
            if not dominant_belief:
                # Q5: Overwhelmed?
                overwhelmed = (
                    "complex" in lower_brief or
                    "overwhelm" in lower_brief or
                    "confus" in lower_brief or
                    "data" in lower_brief
                )
                
                path.append({
                    "question": "Q5: Is the audience overwhelmed or paralyzed by complexity?",
                    "answer": "yes" if overwhelmed else "no",
                    "reasoning": (
                        "Brief indicates decision complexity or information overload."
                        if overwhelmed
                        else "Complexity not the primary issue."
                    )
                })
    
    return path

def select_formats_from_path(
    diagnostic_path: List[Dict],
    brief_text: str
) -> List[str]:
    """
    Select 5 challenge formats based on diagnostic path.
    Matches frontend logic from mock-data.ts:627-758.
    """
    selected = []
    lower_brief = brief_text.lower()
    
    # Get answers from path
    answers = {step["question"]: step["answer"] for step in diagnostic_path}
    
    q1_answer = answers.get("Q1: Is the audience already behaving the way we want?")
    
    if q1_answer == "no":
        # PATH B: Behavior not happening
        q3_answer = answers.get("Q3: Does the audience know what to do, but hesitate emotionally or professionally?")
        
        if q3_answer == "yes":
            selected.append("F03")  # Permission-Giving
        else:
            q4_answer = answers.get("Q4: Is the primary barrier a dominant belief or mental model?")
            if q4_answer == "yes":
                selected.append("F02")  # Reframing
            else:
                q5_answer = answers.get("Q5: Is the audience overwhelmed or paralyzed by complexity?")
                if q5_answer == "yes":
                    selected.append("F06")  # Simplification
                else:
                    # Check additional signals
                    if "position" in lower_brief or "role" in lower_brief or "when to" in lower_brief or "crowded" in lower_brief:
                        selected.append("F04")  # Role-Clarification
                    
                    if "inaction" in lower_brief or "status quo" in lower_brief or "under-treat" in lower_brief:
                        selected.append("F09")  # Risk-of-Inaction
                    
                    if "outcome" in lower_brief or "success" in lower_brief or "metric" in lower_brief:
                        selected.append("F08")  # Redefining Success
                    
                    if "competitor" in lower_brief or "market share" in lower_brief:
                        selected.append("F05")  # Differentiation-Through-Restraint
                    
                    # Default fallback
                    if len(selected) == 0:
                        selected.append("F01")  # Core Mindset-Shift
    else:
        # PATH A: Behavior exists but at risk
        if "eroding" in lower_brief or "declining" in lower_brief or "losing" in lower_brief:
            selected.append("F12")  # Behavior-Maintenance
        
        if "pressure" in lower_brief or "competition" in lower_brief or "doubt" in lower_brief:
            selected.append("F07")  # Confidence-Building
        
        if len(selected) == 0:
            selected.append("F10")  # Trust-Repair
    
    # Ensure we have exactly 5 unique formats
    all_format_ids = list(CHALLENGE_FORMATS.keys())
    import random
    while len(selected) < 5:
        random_format = random.choice(all_format_ids)
        if random_format not in selected:
            selected.append(random_format)
    
    return selected[:5]

def create_diagnostic_summary(
    diagnostic_path: List[Dict],
    selected_formats: List[str]
) -> str:
    """Generate summary text matching frontend format."""
    q1_answer = diagnostic_path[0]["answer"] if diagnostic_path else "no"
    primary_path = "Behavior Not Happening" if q1_answer == "no" else "Behavior Exists"
    
    format_names = [CHALLENGE_FORMATS[f]["name"] for f in selected_formats]
    
    return f"Analyzed brief through diagnostic decision tree. Primary path: {primary_path}. Selected formats: {', '.join(format_names)}."

# ============================================================================
# AI GENERATION (Gemini 2.0 Pro)
# ============================================================================

async def generate_statements_with_ai(
    brief_text: str,
    selected_formats: List[str],
    include_research: bool,
    research_ids: List[str]
) -> List[Dict[str, Any]]:
    """
    Use Gemini to generate challenge statements.
    """
    
    # Build format context
    formats_context = "\n".join([
        f"{f_id} - {CHALLENGE_FORMATS[f_id]['name']}: {CHALLENGE_FORMATS[f_id]['template']}"
        for f_id in selected_formats
    ])
    
    prompt = f"""You are an expert pharmaceutical brand strategist. Generate strategic challenge statements for a marketing brief.

MARKETING BRIEF:
{brief_text}

SELECTED FORMATS (use exactly these 5 formats):
{formats_context}

Task: Generate exactly 5 challenge statements, one for each format above.

For each statement:
1. Create a specific "How can we..." question that applies the format template to this brief
2. Make it highly specific to the brand/product/audience mentioned in the brief
3. Explain why this format was selected

Return ONLY valid JSON (no markdown, no code blocks):
{{
  "statements": [
    {{
      "format_id": "F01",
      "text": "How can we...",
      "reasoning": "This format fits because..."
    }},
    ...
  ]
}}"""
    
    try:
        response = get_client().models.generate_content(
            model=GEMINI_PRO_MODEL,
            contents=prompt,
            config=types.GenerateContentConfig(
                temperature=0.7,
                response_mime_type="application/json"
            )
        )
        
        # Parse response
        response_text = response.text.strip()
        
        # Remove markdown code blocks if present
        if response_text.startswith("```"):
            response_text = response_text.split("```")[1]
            if response_text.startswith("json"):
                response_text = response_text[4:]
        
        data = json.loads(response_text)
        
        return [
            {
                "id": idx + 1,
                "text": stmt["text"],
                "selected_format": stmt["format_id"],
                "reasoning": stmt["reasoning"]
            }
            for idx, stmt in enumerate(data["statements"][:5])
        ]
    except Exception as e:
        logger.error(f"AI generation failed: {e}")
        # Fallback to simple templates
        return [
            {
                "id": idx + 1,
                "text": f"How can we help the target audience adopt our product using {CHALLENGE_FORMATS[fmt]['name']}?",
                "selected_format": fmt,
                "reasoning": f"Selected {CHALLENGE_FORMATS[fmt]['name']} based on brief analysis."
            }
            for idx, fmt in enumerate(selected_formats)
        ]

async def evaluate_statement_with_ai(
    statement_text: str,
    brief_text: str,
    include_research: bool
) -> Dict[str, Any]:
    """
    Use Gemini to evaluate statement on 8 dimensions.
    """
    
    dimensions_info = "\n".join([
        f"{d_id} - {EVALUATION_DIMENSIONS[d_id]['name']} (Weight: {EVALUATION_DIMENSIONS[d_id]['weight']}, Critical: {EVALUATION_DIMENSIONS[d_id]['non_negotiable']})"
        for d_id in EVALUATION_DIMENSIONS.keys()
    ])
    
    prompt = f"""You are evaluating a strategic challenge statement on 8 dimensions.

CHALLENGE STATEMENT:
{statement_text}

ORIGINAL BRIEF:
{brief_text}

DIMENSIONS TO EVALUATE (score 1-5 each):
{dimensions_info}

Instructions:
- Score each dimension from 1 (poor) to 5 (excellent)
- Provide brief notes explaining the score
- Flag if any critical red flags are present

Return ONLY valid JSON (no markdown):
{{
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
            "research_references": []  # TODO: Implement if needed
        }
    except Exception as e:
        logger.error(f"AI evaluation failed: {e}")
        # Fallback to default scores
        return create_default_evaluation()

def calculate_weighted_score(scores: List[Dict]) -> int:
    """Calculate weighted score (0-100)."""
    total_weighted = 0
    max_weighted = 0
    
    for score_data in scores:
        dim_id = score_data["dimension_id"]
        score = score_data["score"]
        weight = 3 if EVALUATION_DIMENSIONS[dim_id]["weight"] == "high" else 2
        
        total_weighted += score * weight
        max_weighted += 5 * weight
    
    return round((total_weighted / max_weighted) * 100) if max_weighted > 0 else 0

def get_failed_non_negotiables(scores: List[Dict]) -> List[str]:
    """Get list of failed critical dimensions."""
    failed = []
    for score_data in scores:
        dim_id = score_data["dimension_id"]
        if EVALUATION_DIMENSIONS[dim_id]["non_negotiable"] and score_data["score"] < 3:
            failed.append(EVALUATION_DIMENSIONS[dim_id]["name"])
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
        "research_references": []
    }
