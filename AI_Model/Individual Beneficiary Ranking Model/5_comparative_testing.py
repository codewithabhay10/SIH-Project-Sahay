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

class ComparativeTester:
    def __init__(self):
        self.model = None
        self.preprocessor = None
        self.state_data_dict = {}
        self.load_artifacts()

    def load_artifacts(self):
        print("Loading artifacts...")
        if not os.path.exists(MODEL_FILE) or not os.path.exists(PREPROCESSOR_FILE):
             raise FileNotFoundError("Model or preprocessor not found.")
             
        self.model = xgb.XGBRegressor()
        self.model.load_model(MODEL_FILE)
        self.preprocessor = joblib.load(PREPROCESSOR_FILE)
        
        if os.path.exists(STATE_FILE):
            df = pd.read_csv(STATE_FILE)
            df.columns = df.columns.str.strip()
            df['state'] = df['state'].str.strip()
            # Clean state data
            for col in ['avg_income_per_capita', 'literacy_rate', 'poverty_rate']:
                if col in df.columns:
                     df[col] = pd.to_numeric(df[col], errors='coerce').fillna(0)
            for col in ['sc_population_share_among_sc']:
                if col in df.columns:
                    df[col] = pd.to_numeric(df[col], errors='coerce').fillna(0)
            
            self.state_data_dict = df.set_index('state').to_dict('index')

    def predict_score(self, input_dict):
        # Enrich with state data
        state = input_dict.get('state')
        if state in self.state_data_dict:
            state_data = self.state_data_dict[state]
            input_dict.update(state_data)
        else:
            # Fill 0 if state not found
            input_dict.update({
                'avg_income_per_capita': 0, 'literacy_rate': 0, 
                'poverty_rate': 0, 'sc_population_share_among_sc': 0
            })
            
        # Defaults
        defaults = {
            'annual_income': 60000, 'is_bpl': 1, 'rural': 1, 'household_size': 4, 
            'age': 36, 'gender': 'Male', 'education_level': 'Secondary', 
            'employment_status': 'Casual Labor', 'applied_other_scheme_before': 0, 
            'benefited_other_scheme_before': 0
        }
        
        # Merge defaults
        final_input = {k: input_dict.get(k, defaults.get(k)) for k in defaults}
        final_input.update(input_dict) # Ensure input overrides defaults
        
        # DataFrame
        df = pd.DataFrame([final_input])
        
        # Preprocess
        X_processed = self.preprocessor.transform(df)
        
        # Predict
        score = self.model.predict(X_processed)[0]
        return float(score)

    def run_comparison(self, case_name, person_a, person_b, description_a, description_b):
        print(f"\n--- {case_name} ---")
        score_a = self.predict_score(person_a)
        score_b = self.predict_score(person_b)
        
        print(f"Person A ({description_a}): {score_a:.4f}")
        print(f"Person B ({description_b}): {score_b:.4f}")
        
        diff = score_a - score_b
        if diff > 0:
            print(f"Result: Person A is favored by {diff:.4f}")
        elif diff < 0:
            print(f"Result: Person B is favored by {-diff:.4f}")
        else:
            print("Result: Validated Equal")

if __name__ == "__main__":
    tester = ComparativeTester()
    
    # Common base profile
    base_profile = {
        'age': 35, 'gender': 'Male', 'education_level': 'Primary',
        'employment_status': 'Casual Labor', 'household_size': 5
    }

    # Case 1: State Dominance
    # Same poor person, different states (Bihar=High Priority, Goa=Low Priority)
    p1_a = base_profile.copy()
    p1_a.update({'state': 'Bihar', 'annual_income': 30000, 'is_bpl': 1, 'rural': 1})
    
    p1_b = base_profile.copy()
    p1_b.update({'state': 'Goa', 'annual_income': 30000, 'is_bpl': 1, 'rural': 1})
    
    tester.run_comparison("Case 1: State Dominance", p1_a, p1_b, "Poor in Bihar", "Poor in Goa")

    # Case 2: BPL Edge
    # Same State(Karnataka), Same Income, BPL vs Non-BPL
    p2_a = base_profile.copy()
    p2_a.update({'state': 'Karnataka', 'annual_income': 45000, 'is_bpl': 1, 'rural': 1})
    
    p2_b = base_profile.copy()
    p2_b.update({'state': 'Karnataka', 'annual_income': 45000, 'is_bpl': 0, 'rural': 1})
    
    tester.run_comparison("Case 2: BPL Impact", p2_a, p2_b, "BPL Card Holder", "Non-BPL")

    # Case 3: Income Sensitivity
    # Same State(Karnataka), BPL, Income 40k vs 45k
    p3_a = base_profile.copy()
    p3_a.update({'state': 'Karnataka', 'annual_income': 40000, 'is_bpl': 1, 'rural': 1})
    
    p3_b = base_profile.copy()
    p3_b.update({'state': 'Karnataka', 'annual_income': 45000, 'is_bpl': 1, 'rural': 1})
    
    tester.run_comparison("Case 3: Income Sensitivity", p3_a, p3_b, "Income 40k", "Income 45k")

    # Case 4: Rural Preference
    # Same State, Income, BPL. Rural vs Urban
    p4_a = base_profile.copy()
    p4_a.update({'state': 'Karnataka', 'annual_income': 40000, 'is_bpl': 1, 'rural': 1})
    
    p4_b = base_profile.copy()
    p4_b.update({'state': 'Karnataka', 'annual_income': 40000, 'is_bpl': 1, 'rural': 0})
    
    tester.run_comparison("Case 4: Rural Preference", p4_a, p4_b, "Rural Resident", "Urban Resident")
