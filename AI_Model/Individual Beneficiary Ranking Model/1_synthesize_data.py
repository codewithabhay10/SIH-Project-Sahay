import pandas as pd
import numpy as np
import os

# Configuration
INPUT_FILE = r"c:\Users\priya\OneDrive\Desktop\XGB Model\location dataset.csv"
OUTPUT_FILE = r"c:\Users\priya\OneDrive\Desktop\XGB Model\synthetic_beneficiaries.csv"

# Set random seed
np.random.seed(67)

def load_and_clean_state_data(filepath):
    print(f"Loading {filepath}...")
    df = pd.read_csv(filepath)
    df.columns = df.columns.str.strip()
    
    # Fill missing values
    for col in ['sc_population', 'sc_population_share_among_sc']:
        if col in df.columns:
            df[col] = pd.to_numeric(df[col], errors='coerce').fillna(0)
            
    for col in ['avg_income_per_capita', 'literacy_rate', 'poverty_rate']:
        if col in df.columns:
            df[col] = pd.to_numeric(df[col], errors='coerce')
            df[col] = df[col].fillna(df[col].mean())

    return df

def generate_beneficiaries(state_df, num_samples=10000):
    print(f"Synthesizing {num_samples} beneficiaries...")
    
    # 1. State Assignment
    probs = state_df['sc_population_share_among_sc'].values
    if probs.sum() == 0:
        probs = np.ones(len(probs)) / len(probs)
    else:
        probs = probs / probs.sum()
        
    sampled_states_indices = np.random.choice(state_df.index, size=num_samples, p=probs)
    sampled_states = state_df.iloc[sampled_states_indices].reset_index(drop=True)
    
    # 2. Generate Features
    income = np.random.lognormal(mean=11.0, sigma=0.8, size=num_samples)
    income = np.clip(income, 20000, 300000)
    
    is_bpl = np.random.binomial(1, 0.55, size=num_samples)
    rural = np.random.binomial(1, 0.68, size=num_samples)
    hh_size = np.clip(np.random.poisson(4.3, size=num_samples), 1, 10)
    age = np.clip(np.random.normal(36, 12, size=num_samples), 18, 75)
    
    gender = np.random.choice(['Male', 'Female'], size=num_samples)
    education = np.random.choice(['None', 'Primary', 'Secondary', 'Graduate'], size=num_samples, p=[0.2, 0.3, 0.3, 0.2])
    employment = np.random.choice(['Unemployed', 'Casual Labor', 'Self Employed', 'Salaried'], size=num_samples, p=[0.25, 0.35, 0.25, 0.15])
    
    applied_before = np.random.binomial(1, 0.28, size=num_samples)
    benefited_before = np.random.binomial(1, 0.12, size=num_samples)
    
    data = pd.DataFrame({
        'annual_income': income,
        'is_bpl': is_bpl,
        'rural': rural,
        'household_size': hh_size,
        'age': age,
        'gender': gender,
        'education_level': education,
        'employment_status': employment,
        'applied_other_scheme_before': applied_before,
        'benefited_other_scheme_before': benefited_before
    })
    
    return pd.concat([data, sampled_states], axis=1)

def calculate_priority_score(df):
    print("Calculating priority scores...")
    inc_score = 1 - (df['annual_income'] / 300000)
    bpl_score = df['is_bpl'] * 0.3
    rural_score = df['rural'] * 0.2
    female_score = (df['gender'] == 'Female').astype(int) * 0.1
    state_pov_score = df['poverty_rate']
    infra_score = (1 - df['literacy_rate'])
    overlap_penalty = df['benefited_other_scheme_before'] * 0.4
    
    # Strategy B: Balanced Weights
    # Income: 0.4, BPL: 0.6, Rural: 0.4, State: 0.6, Infra: 0.4
    raw_score = (
        inc_score * 0.4 +
        bpl_score * 0.6 + 
        rural_score * 0.4 + 
        female_score + 
        state_pov_score * 0.6 + 
        infra_score * 0.4 - 
        overlap_penalty
    )
    
    # Strategy B: High Noise (0.15)
    noise = np.random.normal(0, 0.15, size=len(df))
    return np.clip(raw_score + noise, 0, 1)

if __name__ == "__main__":
    if not os.path.exists(INPUT_FILE):
        print(f"File not found: {INPUT_FILE}")
    else:
        state_df = load_and_clean_state_data(INPUT_FILE)
        syn_df = generate_beneficiaries(state_df)
        syn_df['priority_score'] = calculate_priority_score(syn_df)
        
        syn_df.to_csv(OUTPUT_FILE, index=False)
        print(f"Saved synthetic data to {OUTPUT_FILE}")
