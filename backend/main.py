"""
Simple Translation API - FastAPI Backend
Uses only Google Translate for reliable translations
"""
import os
from typing import Optional
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from deep_translator import GoogleTranslator # pyright: ignore[reportMissingImports]

# Load environment variables
load_dotenv()

# Configuration
ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://localhost:3001",
    "http://127.0.0.1:3000",
    "*",
]

# Service init
app = FastAPI(
    title="Simple Translation API",
    description="Google Translate API for reliable translations",
    version="2.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Models
class TranslationRequest(BaseModel):
    text: str = Field(..., min_length=1, description="Source text to translate")
    source_lang: str = Field(..., description="Source language code (e.g., 'en')")
    target_lang: str = Field(..., description="Target language code (e.g., 'hi')")

    class Config:
        json_schema_extra = {
            "example": {
                "text": "Hello, how are you?",
                "source_lang": "en",
                "target_lang": "hi",
            }
        }


class TranslationResponse(BaseModel):
    original_text: str
    final_translation: str
    groq_translation: str  # Keep for compatibility
    similarity_score: float  # Keep for compatibility
    iterations_used: int  # Keep for compatibility
    threshold_met: bool  # Keep for compatibility
    source_lang: str
    target_lang: str


# Translation helper
def translate_with_google(text: str, source_lang: str, target_lang: str) -> str:
    """Translate text using Google Translate"""
    try:
        # Handle 'auto' source language
        if source_lang.lower() == 'auto':
            translator = GoogleTranslator(source='auto', target=target_lang)
        else:
            translator = GoogleTranslator(source=source_lang, target=target_lang)
        
        translated = translator.translate(text)
        return translated if translated else text
    except Exception as exc:
        print(f"Translation error: {exc}")
        raise HTTPException(status_code=500, detail=f"Translation error: {str(exc)}")


# API Endpoints
@app.get("/")
async def root():
    return {
        "status": "online",
        "service": "Simple Translation API",
        "version": "2.0.0",
        "provider": "Google Translate"
    }


@app.post("/translate", response_model=TranslationResponse)
async def translate(request: TranslationRequest):
    """Translate text using Google Translate"""
    try:
        translation = translate_with_google(
            request.text,
            request.source_lang,
            request.target_lang
        )
        
        return TranslationResponse(
            original_text=request.text,
            final_translation=translation,
            groq_translation=translation,  # Same as final for compatibility
            similarity_score=1.0,  # Perfect score for compatibility
            iterations_used=1,
            threshold_met=True,
            source_lang=request.source_lang,
            target_lang=request.target_lang,
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "provider": "Google Translate",
        "reliable": True,
    }


@app.get("/languages")
async def get_supported_languages():
    return {
        "indian_regional_languages": [
            {"code": "hi", "name": "Hindi"},
            {"code": "bn", "name": "Bengali"},
            {"code": "te", "name": "Telugu"},
            {"code": "mr", "name": "Marathi"},
            {"code": "ta", "name": "Tamil"},
            {"code": "gu", "name": "Gujarati"},
            {"code": "kn", "name": "Kannada"},
            {"code": "ml", "name": "Malayalam"},
            {"code": "or", "name": "Odia"},
            {"code": "pa", "name": "Punjabi"},
            {"code": "as", "name": "Assamese"},
            {"code": "ur", "name": "Urdu"},
            {"code": "sa", "name": "Sanskrit"},
            {"code": "ne", "name": "Nepali"},
        ],
        "popular_languages": [
            {"code": "en", "name": "English"},
            {"code": "zh-CN", "name": "Chinese (Simplified)"},
            {"code": "zh-TW", "name": "Chinese (Traditional)"},
            {"code": "es", "name": "Spanish"},
            {"code": "fr", "name": "French"},
            {"code": "de", "name": "German"},
            {"code": "ja", "name": "Japanese"},
            {"code": "ko", "name": "Korean"},
            {"code": "ar", "name": "Arabic"},
            {"code": "pt", "name": "Portuguese"},
            {"code": "ru", "name": "Russian"},
            {"code": "it", "name": "Italian"},
            {"code": "th", "name": "Thai"},
            {"code": "vi", "name": "Vietnamese"},
            {"code": "id", "name": "Indonesian"},
            {"code": "tr", "name": "Turkish"},
            {"code": "fa", "name": "Persian"},
            {"code": "pl", "name": "Polish"},
            {"code": "nl", "name": "Dutch"},
            {"code": "sv", "name": "Swedish"},
        ],
        "note": "Powered by Google Translate (100+ languages)",
    }


# Local dev entrypoint
if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "main_simple:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
    )
