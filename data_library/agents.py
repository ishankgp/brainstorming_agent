
import sqlite3
import json
from data_library.config import DB_PATH
from data_library.tools import (
    search_data_library, 
    analyze_brand_positioning, 
    check_regulatory_compliance
)

# Tool mapping
TOOL_MAP = {
    "search_data_library": search_data_library,
    "analyze_brand_positioning": analyze_brand_positioning,
    "check_regulatory_compliance": check_regulatory_compliance
}

def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    """Initialize the agent configuration database."""
    conn = get_db()
    conn.execute("""
        CREATE TABLE IF NOT EXISTS agents (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            description TEXT NOT NULL,
            system_prompt TEXT NOT NULL,
            tools TEXT,  -- JSON list of tool names
            is_active BOOLEAN DEFAULT 1
        )
    """)
    
    # Seed default agents if empty
    cursor = conn.execute("SELECT count(*) FROM agents")
    if cursor.fetchone()[0] == 0:
        seed_agents(conn)
        
    conn.commit()
    conn.close()

def seed_agents(conn):
    """Seed default pharma agents details."""
    # Note: In the Gemini Unified architecture, these serve as "Personas" that the Orchestrator can adopt
    # or as descriptions of capabilities.
    agents = [
        (
            "Research Specialist",
            "Specializes in finding clinical evidence and market data.",
            "You are a pharma research specialist...",
            json.dumps(["search_data_library"])
        ),
        (
            "Strategy Expert",
            "Analyzes brand positioning and differentiation.",
            "You are a brand strategy expert...",
            json.dumps(["analyze_brand_positioning"])
        ),
        (
            "Compliance Officer",
            "Identifies regulatory risks.",
            "You are a regulatory affairs officer...",
            json.dumps(["check_regulatory_compliance"])
        )
    ]
    conn.executemany(
        "INSERT INTO agents (name, description, system_prompt, tools) VALUES (?, ?, ?, ?)",
        agents
    )

def get_all_tools():
    """Return all available function tools for the Orchestrator."""
    return list(TOOL_MAP.values())

def get_system_instruction():
    """Construct the dynamic system instruction including all potential agent personas."""
    # We load agents to inform the Orchestrator about its capabilities
    init_db()
    conn = get_db()
    rows = conn.execute("SELECT * FROM agents WHERE is_active = 1").fetchall()
    conn.close()
    
    instructions = """
    You are the **Pharma Brand Workshop Orchestrator**.
    Your goal is to help the team develop a launch strategy by leveraging your internal sub-specialists and tools.
    
    **Your Capabilities (Specialists):**
    """
    
    for row in rows:
        instructions += f"\n- **{row['name']}**: {row['description']}"
        
    instructions += """
    
    **Instructions:**
    1. Analyze the user's query.
    2. Use your "Thinking" process to decompose the problem.
    3. Call the appropriate tools directly (you have access to all of them).
    4. Provide a coherent, synthesized answer.
    
    Always cite the documents you find in the Data Library.
    """
    
    return instructions
