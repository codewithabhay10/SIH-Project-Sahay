import pandas as pd
import numpy as np
import xgboost as xgb
import joblib
import os

# Configuration
INPUT_DIR = r"c:\Users\priya\OneDrive\Desktop\XGB Model"
STATE_FILE = os.path.join(INPUT_DIR, "location dataset.csv")
MODEL_FILE = os.path.join(INPUT_DIR, "trained_model.json")
PREPROCESSOR_FILE = os.path.join(INPUT_DIR, "preprocessor.joblib")

class ScorePredictor:
    def __init__(self):
        self.model = None
        self.preprocessor = None
        self.state_df = None
        self.state_data_dict = {}
        
        # Defaults based on training distribution modes/medians
        self.defaults = {
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

    def load_artifacts(self):
        print("Loading artifacts...")
        if not os.path.exists(MODEL_FILE) or not os.path.exists(PREPROCESSOR_FILE):
             raise FileNotFoundError("Model or preprocessor not found. Run training script first.")
             
        self.model = xgb.XGBRegressor()
        self.model.load_model(MODEL_FILE)
        self.preprocessor = joblib.load(PREPROCESSOR_FILE)
        
        if os.path.exists(STATE_FILE):
            self.state_df = pd.read_csv(STATE_FILE)
            self.state_df.columns = self.state_df.columns.str.strip()
            # Clean state data like in synthesis
            for col in ['avg_income_per_capita', 'literacy_rate', 'poverty_rate']:
                if col in self.state_df.columns:
                     self.state_df[col] = pd.to_numeric(self.state_df[col], errors='coerce').fillna(0)
            
            self.state_data_dict = self.state_df.set_index('state').to_dict('index')
        else:
            print("Warning: State file not found. State enrichment will fail.")

    def predict_score(self, input_dict):
        """
        Predicts score for a single beneficiary input dictionary.
        """
        # Copy to avoid mutating original
        data = input_dict.copy()
        
        # 1. Enrich with state data
        state_name = data.get('state')
        if state_name and state_name in self.state_data_dict:
            state_info = self.state_data_dict[state_name]
            data.update(state_info)
        else:
            # Fill missing state metrics with defaults (e.g. 0 or mean)
            # Training expects these columns to exist
            keys = ['avg_income_per_capita', 'literacy_rate', 'poverty_rate', 
                     'sc_population_share_among_sc']
            for k in keys:
                if k not in data:
                    data[k] = 0

        # 2. Fill missing beneficiary fields
        for key, default_val in self.defaults.items():
            if key not in data or data[key] is None:
                data[key] = default_val
        
        # 3. Create DataFrame
        df = pd.DataFrame([data])
        
        # 4. Preprocess
        X_processed = self.preprocessor.transform(df)
        
        # 5. Predict
        score = self.model.predict(X_processed)[0]
        
        return float(np.clip(score, 0, 1))

def main():
    predictor = ScorePredictor()
    try:
        predictor.load_artifacts()
    except Exception as e:
        print(f"Error: {e}")
        return

    print("\n--- Running Test Predictions ---\n")
    
    test_cases = [
        {
            'description': "High poverty state, low income, BPL",
            'input': {'state': 'Bihar', 'annual_income': 25000, 'is_bpl': 1, 'rural': 1}
        },
        {
            'description': "Rich state, high income, not BPL",
            'input': {'state': 'Goa', 'annual_income': 250000, 'is_bpl': 0, 'rural': 0}
        },
        {
            'description': "Average case (Karnataka)",
            'input': {'state': 'Karnataka', 'annual_income': 80000, 'is_bpl': 1}
        }
    ]
    
    for case in test_cases:
        score = predictor.predict_score(case['input'])
        print(f"Case: {case['description']}")
        print(f"Input State: {case['input'].get('state')}, Income: {case['input'].get('annual_income')}")
        print(f"Predicted Priority Score: {score:.4f}\n")

if __name__ == "__main__":
    main()
