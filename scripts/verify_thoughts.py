
import os
import sys
import logging
from dotenv import load_dotenv
from google import genai
from google.genai import types

# Load env vars
load_dotenv()
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
# Use the config value directly to be sure
GEMINI_THINKING_MODEL = "gemini-3-flash-preview"

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("verify_thoughts")

def main():
    if not GEMINI_API_KEY:
        print("Error: GEMINI_API_KEY not set")
        return

    client = genai.Client(api_key=GEMINI_API_KEY)
    
    print(f"Testing model: {GEMINI_THINKING_MODEL}")
    prompt = "Explain why the sky is blue. Think step by step."
    
    try:
        response = client.models.generate_content(
            model=GEMINI_THINKING_MODEL,
            contents=prompt,
            config=types.GenerateContentConfig(
                temperature=0.4,
                thinking_config=types.ThinkingConfig(include_thoughts=True)
            )
        )
        
        print("\n--- Response Object Structure ---")
        has_thought = False
        if getattr(response, 'candidates', None):
            for i, cand in enumerate(response.candidates):
                if hasattr(cand.content, 'parts'):
                    for j, part in enumerate(cand.content.parts):
                        # Check native thought attribute
                        is_thought = getattr(part, 'thought', False)
                        print(f"Part {j}: thought={is_thought}")
                        if is_thought:
                            has_thought = True
                            print(f"  Thought Content: {part.text[:50]}...")
                            
        if has_thought:
            print("\nRESULT: SUCCESS - Native thinking supported.")
        else:
            print("\nRESULT: FAILURE - No native thinking traces found.")

    except Exception as e:
        print(f"Generation failed: {e}")

if __name__ == "__main__":
    main()
