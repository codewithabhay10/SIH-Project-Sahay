import google.generativeai as genai
import os
from dotenv import load_dotenv
from pathlib import Path

# Load .env from backend folder
env_path = Path(__file__).parent / ".env"
load_dotenv(dotenv_path=env_path)

api_key = os.getenv("GOOGLE_API_KEY")
genai.configure(api_key=api_key)

print(f"Checking models for Key starting with: {api_key[:5]}...")

try:
    for m in genai.list_models():
        if 'generateContent' in m.supported_generation_methods:
            print(f"- {m.name}")
except Exception as e:
    print(f"Error: {e}")