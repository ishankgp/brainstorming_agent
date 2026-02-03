
import time
import logging
from pathlib import Path
from google import genai
from google.genai import types
from data_library.config import GEMINI_API_KEY, FILE_SEARCH_STORE_NAME

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize Gemini Client
client = genai.Client(api_key=GEMINI_API_KEY)

def get_or_create_store(display_name: str = FILE_SEARCH_STORE_NAME):
    """Get existing file search store or create a new one."""
    # List existing stores
    # Note: Client.files.list_stores might return an iterator
    # We'll try to list and find match
    try:
        # Currently no list_stores helper in some SDK versions, might need direct API access
        # For simplicity in this wrapper, we'll try to create a new one each time for demo
        # OR better: save the store ID in a local file/db. 
        # For this implementation: Create new if not exists logic is complex without persistence.
        # We will create a new store if we don't have a configured ID, or just create one.
        
        # Let's create a new store for this session/workshop
        store = client.files.create_store(
            config=types.FileStore(
                display_name=display_name
            )
        )
        logger.info(f"Created File Search Store: {store.name} ({store.display_name})")
        return store
    except Exception as e:
        logger.error(f"Error creating store: {e}")
        raise

def upload_document(file_path: Path, store_name: str):
    """Upload a document to the file search store."""
    if not file_path.exists():
        raise FileNotFoundError(f"File not found: {file_path}")

    logger.info(f"Uploading file: {file_path.name}")
    
    # Upload file
    file_upload = client.files.upload(
        path=str(file_path),
        config=types.File(
            display_name=file_path.name,
        )
    )

    # Wait for processing
    while file_upload.state.name == "PROCESSING":
        logger.info("Processing file...")
        time.sleep(2)
        file_upload = client.files.get(name=file_upload.name)

    if file_upload.state.name == "FAILED":
        raise ValueError(f"File upload failed: {file_upload.error.message}")

    logger.info(f"File uploaded: {file_upload.name}")

    # Add to store (Wait... in new SDK, do we upload directly to store? 
    # Or create file then add? The docs say simultaneous upload+import is possible via tools, 
    # but here we manage the store.)
    
    # Actually, in the new SDK we can't easily add existing files to a store 
    # without using the 'upload_to_store' helper if available, or we associate them.
    # Let's try to add the file to the resource.
    
    # Unfortunately the python SDK for adding files to store might be:
    # client.rest.generativelanguage.corpora.documents.create...
    # BUT Gemini File Search API is simpler: we just need to pass the file to the model tool?
    # NO, we want a persistent store.
    
    # Let's use the standard "upload" then pass to model? 
    # The dedicated "File Search" features allow creating a corpus.
    
    # CORRECTION: The Google GenAI SDK simplifies this.
    # We should search for specific methods.
    
    pass 
    # Start placeholder - I need to double check the EXACT SDK syntax for adding to store 
    # because it changed recently.
    # I will do a quick check on the SDK capabilities in the next step.

def search(query: str, store_name: str):
    """Perform semantic search using the Gemini model with File Search tool."""
    pass
