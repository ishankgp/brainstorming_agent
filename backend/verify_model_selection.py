import requests
import json
import sys

# We use the known valid model name from config.py
TEST_MODEL = "gemini-3-flash-preview"

print(f"Testing Model Selection: Requesting {TEST_MODEL}...")

try:
    r = requests.post(
        "http://localhost:8000/api/generate-challenge-statements",
        json={
            "brief_text": "Test brief for model selection verification.",
            "include_research": False,
            "selected_research_ids": [],
            "generator_config": {
                "diagnostic_model": TEST_MODEL,
                "generation_model": TEST_MODEL,
                "evaluation_model": TEST_MODEL
            }
        },
        stream=True
    )

    if r.status_code != 200:
        print(f"FAILED: Status {r.status_code}")
        print(r.text)
        sys.exit(1)

    found_gen_model = False
    
    for line in r.iter_lines():
        if not line: continue
        decoded = line.decode('utf-8')
        if decoded.startswith("data: "):
            json_str = decoded[6:]
            try:
                data = json.loads(json_str)
                if data["type"] == "challenge_generation":
                    gen_model = data["data"].get("gen_model")
                    print(f"Received Generation Event. Used Model: {gen_model}")
                    if gen_model == TEST_MODEL:
                        print("SUCCESS: Backend used the requested model!")
                        found_gen_model = True
                        break # Success, stop stream
                    else:
                        print(f"FAILURE: Backend used {gen_model} instead of {TEST_MODEL}")
            except Exception as e:
                pass
    
    if not found_gen_model:
        print("WARNING: Stream finished without seeing challenge_generation event (or failed).")

except Exception as e:
    print(f"ERROR: {e}")
