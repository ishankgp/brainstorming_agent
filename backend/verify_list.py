import requests
import json
import time

BASE_URL = "http://localhost:8000"

def wait_for_backend():
    print("Waiting for backend...")
    for _ in range(10):
        try:
            r = requests.get(f"{BASE_URL}/health")
            if r.status_code == 200:
                return True
        except:
            pass
        time.sleep(1)
    return False

def test_list_structure():
    if not wait_for_backend():
        print("Backend failed to start.")
        return

    print("Testing GET /api/research-documents structure...")
    try:
        r = requests.get(f"{BASE_URL}/api/research-documents")
        if r.status_code != 200:
            print(f"GET failed: {r.status_code}")
            return
            
        docs = r.json()
        print(f"Found {len(docs)} docs.")
        
        if not docs:
            print("No docs found. Uploading one to test...")
            # create and upload
            with open("temp_test.txt", "w") as f: f.write("test")
            files = {'file': ("temp_test.txt", open("temp_test.txt", "rb"), 'text/plain')}
            r_up = requests.post(f"{BASE_URL}/api/research-documents/upload", files=files, data={'type': 'other'})
            if r_up.status_code == 200:
                docs = [r_up.json()]
            else:
                print("Upload failed.")
                return

        first_doc = docs[0]
        print(json.dumps(first_doc, indent=2))
        
        if "key_insights" in first_doc:
            print("SUCCESS: key_insights present.")
        else:
            print("FAILURE: key_insights MISSING.")

    except Exception as e:
        print(f"Test failed: {e}")

if __name__ == "__main__":
    test_list_structure()
