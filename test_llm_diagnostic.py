"""
Test LLM-based diagnostic tree implementation.
"""
import asyncio
from data_library.challenge_generator import run_diagnostic_tree_with_llm

SAMPLE_BRIEF = """
Product: Oncology drug for advanced melanoma
Audience: Oncologists
Current Situation: Physicians are hesitant to prescribe due to concerns about severe side effects and patient quality of life impact, despite strong efficacy data.
Goal: Increase adoption among oncologists treating advanced melanoma patients.
"""

async def test_llm_diagnostic():
    print("🧪 Testing LLM-based diagnostic tree...")
    print("=" * 60)
    
    try:
        result = await run_diagnostic_tree_with_llm(SAMPLE_BRIEF)
        
        print("\n✅ SUCCESS! Diagnostic analysis complete.\n")
        
        print("📊 DIAGNOSTIC PATH:")
        for step in result["diagnostic_path"]:
            print(f"\nQ: {step['question']}")
            print(f"A: {step['answer']} (confidence: {step['confidence']:.2f})")
            print(f"Reasoning: {step['reasoning']}")
        
        print("\n\n🎯 SELECTED FORMATS:")
        for fmt in result["selected_formats"]:
            print(f"\n{fmt['format_id']} (Priority {fmt['priority']})")
            print(f"Reasoning: {fmt['reasoning']}")
        
        print(f"\n\n📝 SUMMARY:")
        print(result["diagnostic_summary"])
        
        print("\n" + "=" * 60)
        print("✅ Test passed!")
        
    except Exception as e:
        print(f"\n❌ Test failed: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    asyncio.run(test_llm_diagnostic())
