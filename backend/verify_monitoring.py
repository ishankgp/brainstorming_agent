import requests
import json
import time

BASE_URL = "http://localhost:8000"

def test_monitoring_endpoint():
    print("Waiting for backend...")
    time.sleep(5) 
    
    print("Testing GET /api/sessions...")
    try:
        r = requests.get(f"{BASE_URL}/api/sessions")
        if r.status_code != 200:
            print(f"FAILED: {r.status_code}")
            print(r.text)
            return

        sessions = r.json()
        print(f"Found {len(sessions)} sessions.")
        
        if len(sessions) > 0:
            first = sessions[0]
            print("Latest session structure:")
            print(json.dumps(first, indent=2))
            
            if "timing_metrics" in first:
                print("SUCCESS: timing_metrics field present.")
            else:
                print("FAILURE: timing_metrics missing.")
        else:
            print("No sessions to check. Run a generation first.")

    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test_monitoring_endpoint()
