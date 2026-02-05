import requests
import sys

try:
    print("Pinging Backend Root...")
    r = requests.get("http://localhost:8000/")
    print(f"Status: {r.status_code}")
    print(f"Response: {r.text}")
    
    print("\nPinging Sessions API...")
    r = requests.get("http://localhost:8000/api/sessions")
    print(f"Status: {r.status_code}")
    print(f"Sessions: {len(r.json())}")

    print("\nTesting POST Generation...")
    brief = "Test brief for connectivity check."
    r = requests.post(
        "http://localhost:8000/api/generate-challenge-statements",
        json={
            "brief_text": brief,
            "include_research": False,
            "selected_research_ids": []
        },
        stream=True
    )
    print(f"POST Status: {r.status_code}")
    if r.status_code == 200:
        print("Reading stream...")
        for line in r.iter_lines():
            if line:
                print(f"Stream line: {line.decode('utf-8')[:50]}...")
                # checking first few lines is enough
                break
    else:
        print(f"POST Failed: {r.text}")
    
except Exception as e:
    print(f"FAILED: {e}")
