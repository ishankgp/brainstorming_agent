
from google import genai
from google.genai import types
from data_library.config import GEMINI_API_KEY, GEMINI_THINKING_MODEL
from data_library.agents import get_all_tools, get_system_instruction

# Initialize client
client = genai.Client(api_key=GEMINI_API_KEY)

async def run_agentic_flow(user_input: str, chat_history: list = None) -> str:
    """
    Run the unified agentic flow using Gemini 2.0 Flash Thinking.
    """
    
    tools = get_all_tools()
    system_instruction = get_system_instruction()
    
    # Configure the chat session
    # Note: For simplicity in this v1 migration, we treat each call as a new turn 
    # or we can pass history. The 'Thinking' model maintains context well.
    
    try:
        # We start a chat or generate content. 
        # For tool Use, ChatSession is usually easier to handle multi-turn tool loops automatically?
        # SDK v1 doesn't always auto-loop tools in 'generate_content'.
        # 'chats.create' with 'automatic_function_calling=True' is best.
        
        chat = client.chats.create(
            model=GEMINI_THINKING_MODEL,
            config=types.GenerateContentConfig(
                system_instruction=system_instruction,
                tools=tools,
                temperature=0.7, # Thinking models often prefer lower temp, but 0.7 is standard
                automatic_function_calling=types.AutomaticFunctionCallingConfig(
                        disable=False,
                        maximum_remote_calls=15 # Safety limit
                    ),
            ),
            history=chat_history or []
        )
        
        response = chat.send_message(user_input)
        
        # In the future, we can extract thought traces from response.candidates[0].content.parts
        return response.text
        
    except Exception as e:
        return f"Error in Agent Flow: {str(e)}"
