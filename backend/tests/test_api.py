"""
Quick test script for the new challenge generation API
"""
import requests
import json

API_URL = "http://localhost:8000"

def test_generate():
    """Test the main generation endpoint."""
    print("🧪 Testing challenge generation endpoint...")
    
    payload = {
        "brief_text": """
CLIENT MARKETING BRIEF

Brand: Velozia (enzalutinib)
Indication: EGFR+ NSCLC  
Stage: Pre-Launch

CHALLENGE:
Tagrisso dominates with 62% market share. Oncologists hesitate to prescribe 
new entrants due to comfort with established agents. We need to establish 
CNS protection as a core differentiator without appearing to over-claim.
        """,
        "include_research": False
    }
    
    try:
        response = requests.post(
            f"{API_URL}/api/generate-challenge-statements",
            json=payload,
            timeout=30
        )
        
        if response.status_code == 200:
            data = response.json()
            print("✅ SUCCESS!")
            print(f"\nSession ID: {data['session_id']}")
            print(f"\nDiagnostic Summary: {data['diagnostic_summary']}")
            print(f"\nDiagnostic Path: {len(data['diagnostic_path'])} steps")
            print(f"\nGenerated {len(data['challenge_statements'])} challenge statements:\n")
            
            for idx, stmt in enumerate(data['challenge_statements'], 1):
                print(f"{idx}. [{stmt['selected_format']}] {stmt['text'][:100]}...")
                if stmt['evaluation']:
                    print(f"   Score: {stmt['evaluation']['weighted_score']}/100 ({stmt['evaluation']['recommendation']})")
                print()
            
            return True
        else:
            print(f"❌ FAILED: {response.status_code}")
            print(response.text)
            return False
            
    except Exception as e:
        print(f"❌ ERROR: {e}")
        return False

def test_health():
    """Test health check endpoint."""
    print("🧪 Testing health endpoint...")
    try:
        response = requests.get(f"{API_URL}/health")
        if response.status_code == 200:
            print("✅ Server is healthy")
            print(f"   {response.json()}")
            return True
        else:
            print(f"❌ Health check failed: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ ERROR: {e}")
        return False

if __name__ == "__main__":
    print("=" * 60)
    print("CHALLENGE GENERATION API - TEST SUITE")
    print("=" * 60)
    print()
    
    # Test 1: Health check
    if not test_health():
        print("\n⚠️  Server not responding. Make sure backend is running on port 8000")
        exit(1)
    
    print("\n" + "-" * 60 + "\n")
    
    # Test 2: Generate challenges
    if test_generate():
        print("\n" + "=" * 60)
        print("✅ ALL TESTS PASSED!")
        print("=" * 60)
    else:
        print("\n" + "=" * 60)
        print("❌ TESTS FAILED")
        print("=" * 60)
