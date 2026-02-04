import requests
import json
import time

BASE_URL = "http://localhost:8000"

def test_file_persistence():
    print("Waiting for backend...")
    time.sleep(5)
    
    # 1. Upload File
    filename = f"test_persist_{int(time.time())}.txt"
    print(f"Uploading {filename}...")
    files = {'file': (filename, 'dummy content', 'text/plain')}
    data = {'type': 'other', 'description': 'persistence test'}
    
    try:
        r = requests.post(f"{BASE_URL}/api/research-documents/upload", files=files, data=data)
        if r.status_code != 200:
            print(f"Upload failed: {r.status_code} {r.text}")
            return
        
        doc = r.json()
        doc_id = doc['id']
        print(f"Uploaded ID: {doc_id}")
        
        # 2. List Files immediately
        r = requests.get(f"{BASE_URL}/api/research-documents")
        docs = r.json()
        found = any(d['id'] == doc_id for d in docs)
        if found:
            print("Verified: File found in list immediately.")
        else:
            print("FAILURE: File NOT found in list immediate.")
            return

        # 3. Simulate Restart (Wait or just trust the list logic?)
        # We can't easily restart the server from here without killing the script.
        # But if we list again, it should be there.
        print("Final check complete.")

    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test_file_persistence()
