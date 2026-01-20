import os
import google.generativeai as genai
from dotenv import load_dotenv
from pathlib import Path

# 1. Load the NEW key from .env
env_path = Path(__file__).parent / ".env"
load_dotenv(dotenv_path=env_path)

MY_API_KEY = os.getenv("GOOGLE_API_KEY")

if not MY_API_KEY:
    print("⚠️ WARNING: API Key not found in backend/.env")

# 2. Configure Gemini
genai.configure(api_key=MY_API_KEY)

def call_llm(
    system_prompt: str, 
    user_prompt: str, 
    # FIX: Set back to the stable 1.5 Flash model
    model: str = "gemini-1.5-flash" 
) -> str:
    """
    Call Google Gemini securely.
    """
    try:
        model_instance = genai.GenerativeModel(
            model_name=model,
            system_instruction=system_prompt
        )
        
        response = model_instance.generate_content(user_prompt)
        return response.text.strip()
        
    except Exception as e:
        error_msg = str(e)
        print(f"⚠️ Model '{model}' failed: {error_msg}")
        
        # FALLBACK: If specific version fails, use the generic alias
        # This fixes the '404' error if your region names it differently
        if "404" in error_msg or "not found" in error_msg.lower():
            try:
                print("🔄 Switching to 'gemini-flash-latest'...")
                fallback = genai.GenerativeModel("gemini-flash-latest")
                combined_prompt = f"System: {system_prompt}\n\nUser: {user_prompt}"
                response = fallback.generate_content(combined_prompt)
                return response.text.strip()
            except Exception as e2:
                return f"System Error: {str(e2)}"
                
        return f"LLM Error: {error_msg}"