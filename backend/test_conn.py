
import os
import sys
from dotenv import load_dotenv

# Add current dir to path to find data_library
sys.path.append(os.getcwd())

load_dotenv()
api_key = os.getenv("GEMINI_API_KEY")

print(f"API Key present: {bool(api_key)}")
if api_key:
    print(f"API Key start: {api_key[:4]}...")

from google import genai
from google.genai import types

try:
    client = genai.Client(api_key=api_key)
    print("Client created.")
    
    print("Listing ALL models:")
    try:
        # Pager object, iterate
        for m in client.models.list():
            print(f"- {m.name}")
    except Exception as e:
        print(f"List failed: {e}")

except Exception as e:
    print(f"Error: {e}")
    import traceback
    traceback.print_exc()
