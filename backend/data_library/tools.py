from data_library.file_search import search_library, list_files
import logging

logger = logging.getLogger("data_library.tools")

def search_data_library(query: str) -> str:
    """
    Search the pharma data library for information.
    Use this to find clinical trials, market data, competitor intelligence, etc.
    Returns a summary of relevant information found in the documents.
    """
    logger.info(f"Searching library for: {query}")
    # Get all files to search against
    files = list_files()
    if not files:
        return "No documents found in the library."
        
    # Perform search (using Gemini 2.0's massive context window as the 'RAG' engine)
    # in a real RAG setup with 10k+ docs we'd use semantic retrieval, 
    # but for workshop scale (<50 docs), full context is superior.
    return search_library(query, files)

def analyze_brand_positioning(statement: str) -> str:
    """
    Analyze a brand positioning statement against the data library.
    Identifies gaps in evidence, contradictions, and detailed risks.
    """
    logger.info(f"Analyzing positioning: {statement}")
    prompt = f"""
    Analyze this positioning statement: "{statement}"
    
    Check against the data library for:
    1. Evidence Gaps: Claims unsupported by clinical/market data.
    2. Contradictions: Claims refutable by available data.
    3. Risks: Regulatory or competitive risks.
    
    Cite specific documents where possible.
    """
    return search_library(prompt)

def check_regulatory_compliance(claims: str) -> str:
    """
    Check specific marketing claims against regulatory guidelines and clinical evidence.
    """
    logger.info(f"Checking compliance for: {claims}")
    prompt = f"""
    Review these claims for regulatory compliance: "{claims}"
    
    Flag any:
    - Overstated efficacy
    - Minimized safety risks
    - Off-label promotion cues
    - Lack of substantial evidence
    """
    return search_library(prompt)
