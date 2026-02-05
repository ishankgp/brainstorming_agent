import requests
import json
import time

BASE_URL = "http://localhost:8000"

def trigger_gen():
    print("Triggering generation...")
    payload = {
        "brief_text": "We need to convince doctors to prescribe our new drug for patients with high cholesterol. Current behavior is to prescribe statins.",
        "include_research": False,
        "selected_research_ids": []
    }
    
    try:
        # Start generation
        r = requests.post(f"{BASE_URL}/api/generate-challenge-statements", json=payload, stream=True)
        if r.status_code != 200:
            print(f"Failed to start: {r.status_code} {r.text}")
            return

        print("Generation started. consuming stream...")
        for line in r.iter_lines():
            if line:
                decoded = line.decode('utf-8')
                if decoded.startswith("data: "):
                    data_str = decoded[6:]
                    try:
                        data = json.loads(data_str)
                        if data["type"] == "timing_metrics":
                            print("\nSUCCESS! Received timing metrics:")
                            print(json.dumps(data["data"], indent=2))
                            return
                    except:
                        pass
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    trigger_gen()
