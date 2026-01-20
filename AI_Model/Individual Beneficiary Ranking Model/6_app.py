import os
import joblib
import pandas as pd
import numpy as np
import xgboost as xgb
import shap
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from contextlib import asynccontextmanager
from groq import Groq
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configuration
INPUT_DIR = r"c:\Users\priya\OneDrive\Desktop\XGB Model"
STATE_FILE = os.path.join(INPUT_DIR, "location dataset.csv")
MODEL_FILE = os.path.join(INPUT_DIR, "trained_model.json")
PREPROCESSOR_FILE = os.path.join(INPUT_DIR, "preprocessor.joblib")

# Global artifacts
artifacts = {
    'model': None,
    'preprocessor': None,
    'explainer': None,
    'groq_client': None,
    'feature_names': None,
    'state_data': {}
}

def load_artifacts():
    """Load model, preprocessor, and other artifacts."""
    print("Loading artifacts...")
    if not os.path.exists(MODEL_FILE) or not os.path.exists(PREPROCESSOR_FILE):
         print("Warning: Model or preprocessor not found. Prediction will fail.")
         return

    # 1. Load Model
    model = xgb.XGBRegressor()
    model.load_model(MODEL_FILE)
    artifacts['model'] = model
    
    # 2. Load Preprocessor
    preprocessor = joblib.load(PREPROCESSOR_FILE)
    artifacts['preprocessor'] = preprocessor
    
    # 3. Initialize SHAP Explainer
    print("Initializing SHAP explainer...")
    try:
        artifacts['explainer'] = shap.TreeExplainer(model)
    except Exception as e:
        print(f"Warning: Could not initialize SHAP explainer: {e}")

    # 4. Initialize Groq Client
    api_key = os.getenv("GROQ_API_KEY")
    if api_key:
        print("Initializing Groq client...")
        artifacts['groq_client'] = Groq(api_key=api_key)
    else:
        print("Warning: GROQ_API_KEY not found in .env file. LLM explanations will be disabled.")
    
    # 5. Extract feature names
    try:
        numeric_features = ['annual_income', 'is_bpl', 'rural', 'household_size', 'age', 
                            'applied_other_scheme_before', 'benefited_other_scheme_before',
                            'avg_income_per_capita', 'literacy_rate', 'poverty_rate', 
                            'sc_population_share_among_sc']
        cat_features = preprocessor.named_transformers_['cat'].get_feature_names_out()
        artifacts['feature_names'] = numeric_features + list(cat_features)
    except Exception as e:
        print(f"Warning: Could not extract feature names: {e}")

    # 6. Load State Data
    if os.path.exists(STATE_FILE):
        try:
            df = pd.read_csv(STATE_FILE)
            df.columns = df.columns.str.strip()
            if 'state' in df.columns:
                df['state'] = df['state'].str.strip()
            
            for col in ['avg_income_per_capita', 'literacy_rate', 'poverty_rate', 'sc_population_share_among_sc']:
                if col in df.columns:
                    df[col] = pd.to_numeric(df[col], errors='coerce').fillna(0)
            
            artifacts['state_data'] = df.set_index('state').to_dict('index')
        except Exception as e:
            print(f"Warning: Could not load state data: {e}")
    
    print("Artifacts loaded successfully.")

# Initialize immediately (fail fast or load globals)
load_artifacts()

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Already loaded globally, but we can verify or reload if needed.
    # For now, just yield.
    if artifacts['model'] is None:
        print("Model was not loaded on startup. Attempting to reload...")
        load_artifacts()
    yield
    # artifacts.clear() # Verify if clearing is desired. Usually good to keep for restarts if managed by uvicorn workers.

app = FastAPI(lifespan=lifespan)

class BeneficiaryInput(BaseModel):
    state: str
    annual_income: float | None = None
    is_bpl: int | None = None
    rural: int | None = None
    household_size: int | None = None
    age: int | None = None
    gender: str | None = None
    education_level: str | None = None
    employment_status: str | None = None
    applied_other_scheme_before: int | None = None
    benefited_other_scheme_before: int | None = None

@app.post("/predict")
async def predict(input_data: BeneficiaryInput):
    data = input_data.model_dump()
    final_input, X_processed = _process_input(data)
    
    try:
        score = artifacts['model'].predict(X_processed)[0]
        int_score = int(round(score * 100))
        return {
            "priority_score": f"Priority Score: {int_score}/100",
            "raw_score": float(score),
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/explain")
async def explain(input_data: BeneficiaryInput):
    data = input_data.model_dump()
    final_input, X_processed = _process_input(data)
    
    try:
        # Predict first
        score = artifacts['model'].predict(X_processed)[0]
        int_score = int(round(score * 100))
        
        # Calculate SHAP values
        shap_values = artifacts['explainer'].shap_values(X_processed)
        
        # Since we are predicting for a single instance, shape is (1, n_features)
        # flatten to get 1D array
        instance_shap = shap_values[0]
        
        explanation_text = []
        feature_names = artifacts.get('feature_names')
        
        if feature_names and len(feature_names) == len(instance_shap):
            # Create (feature, shap_value) pairs
            feature_impacts = list(zip(feature_names, instance_shap))
            
            # Sort by absolute impact (magnitude) and take top 5
            feature_impacts.sort(key=lambda x: abs(x[1]), reverse=True)
            top_factors = feature_impacts[:5]
            
            # Prepare data for LLM
            factors_text = ""
            for name, value in top_factors:
                clean_name = name.replace("cat__", "").replace("_", " ").title()
                # Determine direction for prompt context
                full_feature_name = name # Keep original for lookup if needed, but we use clean_name for display
                
                # Get the actual input value for context
                # X_processed is a numpy array, we need to map back to input_data if possible, 
                # but since X_processed is transformed (normalized/OHE), passing the original input `final_input` is better for context.
                # However, mapping 'clean_name' back to 'final_input' key is tricky for OHE features.
                # For now, we will focus on the IMPACT (SHAP value) which is what matters for the explanation.
                
                direction = "INCREASED" if value > 0 else "DECREASED"
                factors_text += f"- Feature: {clean_name}, Impact: {value:.2f} ({direction} priority)\n"

            # Generate explanation using LLM if client is available
            if artifacts.get('groq_client'):
                try:
                    prompt = f"""
                    You are an expert caseworker assistant for a government beneficiary scheme.
                    Your goal is to explain a beneficiary's Priority Score (0-100) clearly and concisely based on the provided factors.
                    
                    Beneficiary Priority Score: {int_score}/100
                    
                    Top Factors influencing this score:
                    {factors_text}
                    
                    Instructions:
                    1. Do NOT mention "SHAP values", "math", or "algorithms".
                    2. Explain WHY the score is high or low based on the factors.
                    3. Be objective, professional, and empathetic.
                    4. Keep it to 2-3 sentences max.
                    5. Example: Your priority score is this high because your income is low and living below the poverty line....
                    """
                    
                    completion = artifacts['groq_client'].chat.completions.create(
                        messages=[
                            {"role": "system", "content": "You are a helpful assistant."},
                            {"role": "user", "content": prompt}
                        ],
                        model="llama-3.1-8b-instant",
                    )
                    explanation_text = completion.choices[0].message.content
                except Exception as llm_error:
                    print(f"LLM Error: {llm_error}")
                    # Fallback to simple rule-based if LLM fails
                    explanation_text = "Key factors: " + "; ".join([f"{n.replace('cat__', '').replace('_', ' ').title()}" for n, v in top_factors])
            else:
                 # Fallback if no API key
                 explanation_text = "Key factors: " + "; ".join([f"{n.replace('cat__', '').replace('_', ' ').title()} ({'+' if v>0 else ''}{v:.2f})" for n, v in top_factors])

        else:
            explanation_text = "Feature names could not be mapped to explanations."

        return {
            "priority_score": f"Priority Score: {int_score}/100",
            "raw_score": float(score),
            "explanation": explanation_text
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

def _process_input(data: dict):
    """Helper to process input data into model-ready format"""
    state = data.get('state')
    
    # 1. Enrich with state data
    state_metrics = artifacts['state_data'].get(state, {})
    if not state_metrics:
        # Fallback values if state not found
        state_metrics = {
            'avg_income_per_capita': 0, 'literacy_rate': 0, 
            'poverty_rate': 0, 'sc_population_share_among_sc': 0
        }
    data.update(state_metrics)
    
    # 2. Defaults for missing beneficiary fields (Training modes/medians)
    defaults = {
        'annual_income': 60000, 
        'is_bpl': 1, 
        'rural': 1, 
        'household_size': 4, 
        'age': 36, 
        'gender': 'Male', 
        'education_level': 'Secondary', 
        'employment_status': 'Casual Labor',
        'applied_other_scheme_before': 0, 
        'benefited_other_scheme_before': 0
    }
    
    # Prepare final input dict, preferring user input over defaults
    final_input = {k: (data.get(k) if data.get(k) is not None else v) for k, v in defaults.items()}
    # Enriched state data must be present
    final_input.update(state_metrics)
    # Ensure categorical fields that were part of user input but might be missing in defaults (state is handled)
    final_input['state'] = state
    
    # Create DataFrame for prediction
    df = pd.DataFrame([final_input])
    
    # Preprocess
    X_processed = artifacts['preprocessor'].transform(df)
    
    return final_input, X_processed


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
