
import os
import sys
from pathlib import Path

# Add current dir to path to import local modules
sys.path.append(os.getcwd())

from data_library.file_search import upload_file

def main():
    docs_dir = Path("./data/documents")
    mock_files = [
        "Mock_Clinical_Study.md",
        "Mock_HCP_Interviews.md",
        "Mock_Competitor_Analysis.md"
    ]
    
    for filename in mock_files:
        path = docs_dir / filename
        if path.exists():
            print(f"Uploading {filename}...")
            try:
                upload_file(path)
                print(f"Successfully uploaded {filename}")
            except Exception as e:
                print(f"Failed to upload {filename}: {e}")
        else:
            print(f"Skip: {filename} not found locally.")

if __name__ == "__main__":
    main()
