
import os
import asyncio
from dotenv import load_dotenv
from google import genai
from openai import AsyncOpenAI

load_dotenv()

GEMINI_KEY = os.getenv("GEMINI_API_KEY")
OPENAI_KEY = os.getenv("OPENAI_API_KEY")

print(f"Gemini Key loaded: {bool(GEMINI_KEY)} (Prefix: {GEMINI_KEY[:4] if GEMINI_KEY else 'None'})")
print(f"OpenAI Key loaded: {bool(OPENAI_KEY)} (Prefix: {OPENAI_KEY[:3] if OPENAI_KEY else 'None'})")

async def test_openai():
    print("\nTesting OpenAI Connection...")
    try:
        client = AsyncOpenAI(api_key=OPENAI_KEY)
        # Simple models list or chat completion
        await client.models.list()
        print("✅ OpenAI Connection Successful!")
    except Exception as e:
        print(f"❌ OpenAI Error: {e}")

def test_gemini():
    print("\nTesting Gemini Connection...")
    try:
        client = genai.Client(api_key=GEMINI_KEY)
        client.models.list()
        print("✅ Gemini Connection Successful!")
    except Exception as e:
        print(f"❌ Gemini Error: {e}")

if __name__ == "__main__":
    if OPENAI_KEY:
        asyncio.run(test_openai())
    if GEMINI_KEY:
        test_gemini()
