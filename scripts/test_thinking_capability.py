
import os
import time
import logging
from dotenv import load_dotenv
from google import genai
from google.genai import types

# Load env vars
load_dotenv()
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("model_research")

def test_model(client, model_name):
    print(f"\n------------------------------------------------")
    print(f"Testing Model: {model_name}")
    print(f"------------------------------------------------")
    
    try:
        # We don't use system instructions for thoughts in native models usually,
        # but the prompt should trigger reasoning.
        response = client.models.generate_content(
            model=model_name,
            contents="Explain how a bicycle works. Use your thinking process.",
            config=types.GenerateContentConfig(
                temperature=0.4,
                # Some models might need this explicit config if supported, 
                # but standard thinking models do it by default.
                # thinking_config=types.ThinkingConfig(include_thoughts=True) # Hypothetical SDK usage
            )
        )
        
        has_thoughts = False
        if hasattr(response, 'candidates') and response.candidates:
            for part in response.candidates[0].content.parts:
                # Check 1: Native Attribute
                if getattr(part, 'thought', False):
                    print(f"SUCCESS! Found native 'thought' attribute in {model_name}")
                    print(f"Snippet: {part.text[:100]}...")
                    has_thoughts = True
                    break
        
        if not has_thoughts:
            print(f"Result: No native thought text found for {model_name}")
            
    except Exception as e:
        print(f"FAILED: {model_name} - {str(e)}")

def main():
    if not GEMINI_API_KEY:
        print("Error: GEMINI_API_KEY not set")
        return

    client = genai.Client(api_key=GEMINI_API_KEY)
    
    # 1. List of suspects based on Web Search & Common Knowledge
    candidates = [
        "gemini-2.0-flash-thinking-exp-01-21", # The 'new' one
        "gemini-2.0-flash-thinking-exp-1219", # The 'old' one
        "gemini-2.0-flash-thinking-exp",      # The alias
        "gemini-2.0-pro-exp-02-05",           # Potential new pro
        "gemini-exp-1206",                    # Often capable
    ]
    
    for m in candidates:
        test_model(client, m)
        time.sleep(1) # rate limits

if __name__ == "__main__":
    main()
