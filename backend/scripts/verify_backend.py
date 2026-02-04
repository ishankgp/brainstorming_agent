
import asyncio
from data_library.file_search import upload_file
from data_library.orchestrator import run_agentic_flow
from pathlib import Path

async def main():
    print("--- Final Backend Verification ---")
    
    # 1. Upload
    doc_path = Path("data/documents/sample_zenoflozin.md")
    print(f"Uploading {doc_path}...")
    try:
        f = upload_file(doc_path)
        print(f"✅ Uploaded: {f.display_name}")
    except Exception as e:
        print(f"❌ Upload failed: {e}")
        # Continue anyway, file might already be there
    
    # 2. Query
    query = "What is the primary endpoint result for HbA1c in the Zenoflozin trial?"
    print(f"\nQuerying: {query}")
    try:
        result = await run_agentic_flow(query, verbose=True)
        print("\n--- AGENT RESPONSE ---")
        print(result)
        print("-----------------------")
    except Exception as e:
        print(f"❌ Query failed: {e}")

if __name__ == "__main__":
    asyncio.run(main())
