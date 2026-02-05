import asyncio
import os
import logging
from data_library.challenge_generator import generate_challenges_stream
from data_library.config import GEMINI_API_KEY

logging.basicConfig(level=logging.INFO)

async def main():
    print("🚀 Starting Debug Generator...")
    brief = "We are launching a new drug for diabetes. Target audience: Endocrinologists. Competitors: Metformin."
    
    try:
        async for chunk in generate_challenges_stream(
            brief_text=brief,
            include_research=False,
            selected_research_ids=[]
        ):
            print(f"📦 RECEIVED CHUNK: {chunk[:100]}...")
    except Exception as e:
        print(f"❌ STREAM ERROR: {e}")

if __name__ == "__main__":
    asyncio.run(main())
