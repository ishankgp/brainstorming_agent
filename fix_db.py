import os
import sys

# Add backend to path
sys.path.append(os.path.join(os.getcwd(), 'backend'))

from data_library.database import engine, Base
from data_library.models import ResearchDocument # Ensure registered

db_path = os.path.join(os.getcwd(), 'backend', 'data', 'agents.db')
if os.path.exists(db_path):
    print(f"Removing {db_path}...")
    os.remove(db_path)
else:
    print(f"{db_path} does not exist.")

print("Creating tables...")
Base.metadata.create_all(bind=engine)
print("Tables created.")

# Verify schema
from sqlalchemy import inspect
inspector = inspect(engine)
columns = [c['name'] for c in inspector.get_columns('research_documents')]
print("Columns in research_documents:", columns)

if 'gemini_file_id' in columns and 'gemini_uri' in columns:
    print("SUCCESS: Schema is correct.")
else:
    print("FAILURE: Schema missing columns.")
