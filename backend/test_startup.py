import sys
try:
    print("Checking database import...")
    import data_library.database
    print("Checking api import...")
    import data_library.api
    print("Imports successful!")
except Exception as e:
    print(f"FAILED: {e}")
    import traceback
    traceback.print_exc()
