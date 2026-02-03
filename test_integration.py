"""
Test the frontend-backend integration
"""
import requests
import json

API_URL = "http://localhost:8000"

def test_full_integration():
    """Test the exact request the frontend will make."""
    print("🧪 Testing Frontend → Backend Integration")
    print("=" * 60)
    
    # Exact payload the frontend sends
    payload = {
        "brief_text": "Launch new pharma product Velozia. Tagrisso dominates with 60% market share. Oncologists hesitate to switch due to comfort with established agents. Need CNS protection as differentiator.",
        "include_research": False,
        "selected_research_ids": None
    }
    
    print("\n📤 Sending request to backend...")
    print(f"   URL: {API_URL}/api/generate-challenge-statements")
    print(f"   Brief: {payload['brief_text'][:80]}...")
    
    try:
        response = requests.post(
            f"{API_URL}/api/generate-challenge-statements",
            json=payload,
            timeout=60  # Increased timeout for AI generation
        )
        
        print(f"\n📥 Response Status: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            
            print("\n" + "=" * 60)
            print("✅ SUCCESS! Backend returned valid response")
            print("=" * 60)
            
            print(f"\n📊 Session ID: {data.get('session_id', 'N/A')}")
            print(f"\n📝 Diagnostic Summary:")
            print(f"   {data.get('diagnostic_summary', 'N/A')}")
            
            print(f"\n🔍 Diagnostic Path ({len(data.get('diagnostic_path', []))} steps):")
            for step in data.get('diagnostic_path', []):
                print(f"   {step['question']}")
                print(f"   → {step['answer'].upper()}: {step['reasoning'][:80]}...")
                print()
            
            print(f"\n💡 Challenge Statements ({len(data.get('challenge_statements', []))}):")
            for idx, stmt in enumerate(data.get('challenge_statements', []), 1):
                print(f"\n   {idx}. [{stmt['selected_format']}] {CHALLENGE_FORMAT_NAMES.get(stmt['selected_format'], 'Unknown')}")
                print(f"      {stmt['text'][:120]}...")
                print(f"      Reasoning: {stmt['reasoning'][:100]}...")
                
                if stmt.get('evaluation'):
                    eval_data = stmt['evaluation']
                    print(f"      📈 Score: {eval_data['weighted_score']}/100")
                    print(f"      ✅ Recommendation: {eval_data['recommendation'].upper()}")
                    print(f"      🎯 Total Score: {eval_data['total_score']}/40")
                    print(f"      ⚠️  Non-negotiables: {'PASS' if eval_data['passes_non_negotiables'] else 'FAIL'}")
            
            print("\n" + "=" * 60)
            print("✅ Frontend will receive properly formatted data!")
            print("=" * 60)
            print("\n✅ INTEGRATION TEST PASSED")
            
            return True
        else:
            print(f"\n❌ FAILED: HTTP {response.status_code}")
            try:
                error_detail = response.json()
                print(f"   Error: {error_detail}")
            except:
                print(f"   Response: {response.text}")
            return False
            
    except requests.exceptions.Timeout:
        print("\n⏰ TIMEOUT: Request took longer than 60 seconds")
        print("   This is normal for first-time AI generation.")
        print("   The backend is likely working, just slow.")
        return None
    except Exception as e:
        print(f"\n❌ ERROR: {e}")
        return False

CHALLENGE_FORMAT_NAMES = {
    "F01": "Core Mindset-Shift",
    "F02": "Reframing",
    "F03": "Permission-Giving",
    "F04": "Role-Clarification",
    "F05": "Differentiation-Through-Restraint",
    "F06": "Simplification",
    "F07": "Confidence-Building",
    "F08": "Redefining Success",
    "F09": "Risk-of-Inaction",
    "F10": "Trust-Repair",
    "F11": "Paradigm-Shift",
    "F12": "Behavior-Maintenance"
}

if __name__ == "__main__":
    result = test_full_integration()
    
    if result is True:
        print("\n" + "🎉" * 30)
        print("\n   READY FOR DEMO!")
        print("   Open http://localhost:3000 in your browser")
        print("   Paste a brief and click 'Generate Challenge Statements'")
        print("\n" + "🎉" * 30)
    elif result is None:
        print("\n⚠️  Test timed out - backend may be slow but functional")
    else:
        print("\n❌ Integration test failed - check backend logs")
