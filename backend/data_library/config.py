
import os
from pathlib import Path
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# API Keys
# API Keys
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

# Model Configuration
# We use standard Flash for prompt engineering for thought traces
GEMINI_THINKING_MODEL = "gemini-3-flash-preview"
# We use standard Flash for fast File Search retrieval
GEMINI_RAG_MODEL = "gemini-3-flash-preview"
GEMINI_CORPUS_NAME = "brainstorming-research-library"

if not GEMINI_API_KEY:
    raise ValueError("GEMINI_API_KEY not found in .env file")

# Constants
FILE_SEARCH_STORE_NAME = "pharma-brand-library"
# Resolve paths relative to this file to ensure consistency regardless of CWD
BASE_DIR = Path(__file__).resolve().parent.parent
DB_PATH = BASE_DIR / "data" / "agents_v2.db"
SESSIONS_DB_PATH = BASE_DIR / "data" / "sessions.db"
DOCS_PATH = BASE_DIR / "data" / "documents"

# Ensure directories exist
DB_PATH.parent.mkdir(parents=True, exist_ok=True)
DOCS_PATH.mkdir(parents=True, exist_ok=True)
