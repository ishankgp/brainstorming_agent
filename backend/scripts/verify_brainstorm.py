
import asyncio
from data_library.brainstorm import analyze_problem_statements

async def main():
    print("--- Verifying Brainstorm Agent (Gemini Thinking) ---")
    
    statements = [
        "Our drug Zenoflozin is safer than Metformin for all patients.",
        "Patients prefer the monthly dosing schedule."
    ]
    
    print(f"Input: {statements}")
    print("Analyzing... (This uses the Thinking model, might take 10-20s)")
    
    try:
        result = await analyze_problem_statements(statements)
        print("\n--- RAW RESULT ---")
        print(result)
        
        if isinstance(result, dict) and "error" in result:
            print(f"\n❌ Error: {result['error']}")
        else:
            print("\n✅ Success! Parsed JSON:")
            import json
            print(json.dumps(result, indent=2))
            
    except Exception as e:
        print(f"\n❌ Exception: {e}")

if __name__ == "__main__":
    asyncio.run(main())
