"""
Test script to diagnose Gemini API hanging issue.
"""
import asyncio
import sys
from data_library.challenge_generator import generate_challenges

async def test_generation():
    print("🧪 Testing challenge generation...")
    print("=" * 60)
    
    brief = """
    Test brief for pharmaceutical product launch.
    Target audience: oncologists.
    Key challenge: market dominated by competitor.
    """
    
    try:
        print("📝 Calling generate_challenges()...")
        result = await generate_challenges(
            brief_text=brief,
            include_research=False,
            selected_research_ids=[]
        )
        print("✅ SUCCESS!")
        print(f"Generated {len(result['challenge_statements'])} statements")
        print(f"Diagnostic summary: {result['diagnostic_summary'][:100]}...")
        return True
    except Exception as e:
        print(f"❌ FAILED: {type(e).__name__}: {e}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == "__main__":
    print("Starting test...")
    success = asyncio.run(test_generation())
    sys.exit(0 if success else 1)
