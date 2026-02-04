
import os
from dotenv import load_dotenv
from google import genai
from google.genai import types

load_dotenv()
client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

print(f"SDK - ThinkingConfig exists: {hasattr(types, 'ThinkingConfig')}")

models = ["gemini-2.5-flash", "gemini-3-flash-preview"]

for m in models:
    print(f"\nModel: {m}")
    try:
        resp = client.models.generate_content(
            model=m,
            contents="How many r's in strawberry? Show thinking."
        )
        if hasattr(resp, 'candidates') and resp.candidates:
            c = resp.candidates[0]
            # Check for thought parts
            for p in c.content.parts:
                # Naive check for thought attribute or text content
                is_thought = getattr(p, 'thought', False)
                print(f"Part (thought={is_thought}): {p.text[:50]}...")
            
            # Check capabilities
            dirs = dir(c)
            print(f"Candidate Features: {[d for d in dirs if 'thought' in d or 'signature' in d]}")
            
    except Exception as e:
        print(f"Error: {e}")
