import pandas as pd
import numpy as np
import xgboost as xgb
import joblib
import os
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.metrics import mean_squared_error, precision_score, recall_score, f1_score

# Configuration
INPUT_DIR = r"c:\Users\priya\OneDrive\Desktop\XGB Model"
DATA_FILE = os.path.join(INPUT_DIR, "synthetic_beneficiaries.csv")
MODEL_FILE = os.path.join(INPUT_DIR, "trained_model.json")
PREPROCESSOR_FILE = os.path.join(INPUT_DIR, "preprocessor.joblib")
HEATMAP_FILE = os.path.join(INPUT_DIR, "correlation_matrix.png")

# Set random seed to match training script
RANDOM_STATE = 69

def analyze_model():
    print("Loading data and artifacts...")
    if not os.path.exists(DATA_FILE) or not os.path.exists(MODEL_FILE):
        print("Data or model not found.")
        return

    df = pd.read_csv(DATA_FILE)
    df.columns = df.columns.str.strip()
    
    # 1. Reproduce Split and Preprocessing
    target = 'priority_score'
    categorical_features = ['state', 'gender', 'education_level', 'employment_status']
    numeric_features = ['annual_income', 'is_bpl', 'rural', 'household_size', 'age', 
                        'applied_other_scheme_before', 'benefited_other_scheme_before',
                        'avg_income_per_capita', 'literacy_rate', 'poverty_rate', 
                        'sc_population_share_among_sc']
    
    X = df[categorical_features + numeric_features]
    y = df[target]
    
    # Load preprocessor to ensure we use the fitted one
    preprocessor = joblib.load(PREPROCESSOR_FILE)
    
    # Split
    X_train, X_val, y_train, y_val = train_test_split(X, y, test_size=0.2, random_state=RANDOM_STATE)
    
    X_train_processed = preprocessor.transform(X_train)
    X_val_processed = preprocessor.transform(X_val)
    
    # Load Model
    model = xgb.XGBRegressor()
    model.load_model(MODEL_FILE)
    
    # 2. Overfitting Check (RMSE)
    print("\n--- Overfitting Check ---")
    train_preds = model.predict(X_train_processed)
    val_preds = model.predict(X_val_processed)
    
    train_rmse = np.sqrt(mean_squared_error(y_train, train_preds))
    val_rmse = np.sqrt(mean_squared_error(y_val, val_preds))
    
    print(f"Train RMSE: {train_rmse:.4f}")
    print(f"Validation RMSE: {val_rmse:.4f}")
    diff = val_rmse - train_rmse
    if diff > 0.05:
        print("Warning: Potential overfitting (Val RMSE significantly higher than Train RMSE).")
    elif diff < -0.01:
        print("Note: Validation error lower than train (could be data distribution or regularization).")
    else:
        print("Model seems to generalize well.")

    # 3. Precision/Recall (Classification View)
    print("\n--- Classification Metrics (Threshold=0.7) ---")
    THRESHOLD = 0.7
    
    y_val_binary = (y_val >= THRESHOLD).astype(int)
    val_preds_binary = (val_preds >= THRESHOLD).astype(int)
    
    precision = precision_score(y_val_binary, val_preds_binary)
    recall = recall_score(y_val_binary, val_preds_binary)
    f1 = f1_score(y_val_binary, val_preds_binary)
    
    print(f"Precision: {precision:.4f}")
    print(f"Recall:    {recall:.4f}")
    print(f"F1 Score:  {f1:.4f}")
    
    # 4. Feature Correlation Matrix
    print("\n--- Generating Correlation Heatmap ---")
    # Only numeric features
    numeric_df = df[numeric_features + [target]]
    corr_matrix = numeric_df.corr()
    
    plt.figure(figsize=(12, 10))
    sns.heatmap(corr_matrix, annot=True, cmap='coolwarm', fmt=".2f", linewidths=0.5)
    plt.title("Feature Correlation Matrix")
    plt.tight_layout()
    plt.savefig(HEATMAP_FILE)
    print(f"Heatmap saved to {HEATMAP_FILE}")

if __name__ == "__main__":
    analyze_model()
