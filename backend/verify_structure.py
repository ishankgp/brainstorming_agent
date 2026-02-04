import requests
import json

BASE_URL = "http://localhost:8000"

def test_upload_response():
    print("Testing upload response structure...")
    
    # Create temp file
    with open("test_structure.txt", "w") as f:
        f.write("Content")
        
    files = {'file': ("test_structure.txt", open("test_structure.txt", "rb"), 'text/plain')}
    data = {'type': 'temp', 'description': 'Structure Test'}
    
    try:
        r = requests.post(f"{BASE_URL}/api/research-documents/upload", files=files, data=data)
        if r.status_code != 200:
            print(f"Upload failed: {r.text}")
            return
            
        json_resp = r.json()
        print(json.dumps(json_resp, indent=2))
        
        required_fields = ["id", "name", "description", "key_insights", "uploaded_at"]
        missing = [f for f in required_fields if f not in json_resp]
        
        if missing:
            print(f"FAILURE: Missing fields: {missing}")
        else:
            print("SUCCESS: JSON structure is valid for frontend.")
            
    except Exception as e:
        print(f"Test failed: {e}")

if __name__ == "__main__":
    test_upload_response()
