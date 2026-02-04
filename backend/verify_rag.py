import requests
import time
import os

BASE_URL = "http://localhost:8000"

def wait_for_health():
    print("Waiting for backend...")
    for _ in range(30):
        try:
            r = requests.get(f"{BASE_URL}/health")
            if r.status_code == 200:
                print("Backend up!")
                return True
        except:
            pass
        time.sleep(1)
    return False

def test_rag_flow():
    if not wait_for_health():
        print("Backend failed to start.")
        return

    # 1. Upload Document
    print("Uploading document...")
    file_path = "test_rag_doc.txt"
    files = {'file': (file_path, open(file_path, 'rb'), 'text/plain')}
    data = {'type': 'clinical-trial', 'description': 'Test Doc for RAG'}
    
    try:
        r = requests.post(f"{BASE_URL}/api/research-documents/upload", files=files, data=data)
        print(f"Upload Status: {r.status_code}")
        print(f"Upload Response: {r.text}")
        
        if r.status_code != 200:
            print("Upload failed.")
            return

        resp_json = r.json()
        doc_id = resp_json['id']
        gemini_status = resp_json.get('gemini_status')
        print(f"Doc ID: {doc_id}")
        print(f"Gemini Status: {gemini_status}")
        
        if gemini_status != "synced":
            print("WARNING: Gemini Sync failed/missing.")
        
        # 2. Trigger Generation with Research
        print("Triggering Generation...")
        # We use stream endpoint but just read first few chunks
        payload = {
            "brief_text": "Launch Brand X to doctors who are skeptical.",
            "include_research": True,
            "selected_research_ids": [doc_id]
        }
        
        with requests.post(f"{BASE_URL}/api/generate-challenge-statements", json=payload, stream=True) as s:
            print(f"Generation Status: {s.status_code}")
            start = time.time()
            for line in s.iter_lines():
                if line:
                    print(f"Chunk: {line[:100]}...") # Print first 100 chars
                    if b"challenge_result" in line:
                        print("Received challenge result! Success.")
                        break
                if time.time() - start > 30:
                    print("Timeout waiting for generation.")
                    break
                    
    except Exception as e:
        print(f"Test failed: {e}")

if __name__ == "__main__":
    test_rag_flow()
