
import logging
import time
from pathlib import Path
from google import genai
from google.genai import types
from data_library.config import GEMINI_API_KEY

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("data_library.file_search")

# Initialize Gemini Client
client = genai.Client(api_key=GEMINI_API_KEY)

def upload_file(file_path: Path) -> types.File:
    """Upload a file to Gemini."""
    if not file_path.exists():
        raise FileNotFoundError(f"File not found: {file_path}")

    logger.info(f"Uploading file: {file_path.name}")
    try:
        # Check if SDK expects 'file' or just positional
        # Try 'file' kwarg which is standard in v1
        mimetype = "text/markdown" if file_path.suffix == ".md" else None
        file_obj = client.files.upload(
            file=str(file_path),
            config=types.UploadFileConfig(
                display_name=file_path.name,
                mime_type=mimetype
            )
        )
        
        # Wait for efficient processing
        logger.info(f"Waiting for file processing: {file_obj.name}")
        while file_obj.state.name == "PROCESSING":
            time.sleep(2)
            file_obj = client.files.get(name=file_obj.name)
            
        if file_obj.state.name == "FAILED":
            raise ValueError(f"File upload failed: {file_obj.error.message}")
            
        logger.info(f"File ready: {file_obj.name}")
        return file_obj
        
    except Exception as e:
        logger.error(f"Upload failed: {e}")
        raise

def list_files() -> list[types.File]:
    """List all files in the library."""
    try:
        return list(client.files.list())
    except Exception as e:
        logger.error(f"List files failed: {e}")
        return []

def delete_file(file_name: str):
    """Delete a file by its API name (files/...)."""
    try:
        client.files.delete(name=file_name)
        logger.info(f"Deleted file: {file_name}")
    except Exception as e:
        logger.error(f"Delete file failed: {e}")
        raise

def search_library(query: str, files: list[types.File] = None) -> str:
    """
    Perform a semantic search/query against the library.
    If files list is provided, restricts search to those files.
    Otherwise uses all available files (up to limits).
    """
    if not files:
        files = list_files()
        
    if not files:
        return "Library is empty. Please upload documents first."

    # For valid RAG, we pass files to the generate_content call
    # The model will use them as context
    try:
        # Create a content generation request with the files and query
        response = client.models.generate_content(
            model="gemini-2.0-flash-exp",  # Use latest model
            contents=[
                # Pass file references
                *[types.Content(
                    parts=[types.Part.from_uri(
                        file_uri=f.uri,
                        mime_type=f.mime_type
                    )]
                ) for f in files],
                # Pass the query
                types.Content(parts=[types.Part(text=query)])
            ]
        )
        return response.text
    except Exception as e:
        logger.error(f"Search failed: {e}")
        return f"Error searching library: {e}"
