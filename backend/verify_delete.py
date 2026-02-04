import requests
import time
import os

BASE_URL = "http://localhost:8000"

def test_delete_flow():
    # 1. Upload
    print("Uploading file for deletion test...")
    if not os.path.exists("test_delete.txt"):
        with open("test_delete.txt", "w") as f:
            f.write("Temp file for deletion.")
            
    files = {'file': ("test_delete.txt", open("test_delete.txt", "rb"), 'text/plain')}
    data = {'type': 'temp', 'description': 'To be deleted'}
    
    try:
        r = requests.post(f"{BASE_URL}/api/research-documents/upload", files=files, data=data)
        if r.status_code != 200:
            print(f"Upload failed: {r.text}")
            return
            
        doc_id = r.json()['id']
        print(f"Uploaded Doc ID: {doc_id}")
        
        # 2. Delete
        print(f"Deleting Doc ID: {doc_id}...")
        r = requests.delete(f"{BASE_URL}/api/research-documents/{doc_id}")
        print(f"Delete Status: {r.status_code}")
        print(f"Delete Response: {r.text}")
        
    except Exception as e:
        print(f"Test failed: {e}")

if __name__ == "__main__":
    test_delete_flow()
