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

            if "challenges" in first and len(first["challenges"]) > 0:
                first_chal = first["challenges"][0]
                if "gen_input_tokens" in first_chal:
                    print(f"SUCCESS: Tokens captured (Gen Input: {first_chal.get('gen_input_tokens')})")
                else:
                    print("FAILURE: gen_input_tokens missing.")
                
                if "gen_model" in first_chal:
                    print(f"SUCCESS: Model captured ({first_chal.get('gen_model')})")
                else:
                    print("FAILURE: gen_model missing.")
        else:
            print("No sessions to check. Run a generation first.")

    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test_monitoring_endpoint()
