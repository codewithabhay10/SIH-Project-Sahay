import pandas as pd
import numpy as np
import xgboost as xgb
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.metrics import mean_squared_error
import joblib
import os

# Configuration
INPUT_FILE = r"c:\Users\priya\OneDrive\Desktop\XGB Model\synthetic_beneficiaries.csv"
OUTPUT_DIR = r"c:\Users\priya\OneDrive\Desktop\XGB Model"
MODEL_FILE = os.path.join(OUTPUT_DIR, "trained_model.json")
PREPROCESSOR_FILE = os.path.join(OUTPUT_DIR, "preprocessor.joblib")
IMPORTANCE_FILE = os.path.join(OUTPUT_DIR, "feature_importances.csv")
METRICS_FILE = os.path.join(OUTPUT_DIR, "training_metrics.txt")

def train_model():
    print("Loading synthetic data...")
    if not os.path.exists(INPUT_FILE):
        print("Input file not found. Run 1_synthesize_data.py first.")
        return

    df = pd.read_csv(INPUT_FILE)
    df.columns = df.columns.str.strip()
    
    target = 'priority_score'
    categorical_features = ['state', 'gender', 'education_level', 'employment_status']
    numeric_features = ['annual_income', 'is_bpl', 'rural', 'household_size', 'age', 
                        'applied_other_scheme_before', 'benefited_other_scheme_before',
                        'avg_income_per_capita', 'literacy_rate', 'poverty_rate', 
                        'sc_population_share_among_sc']
    
    X = df[categorical_features + numeric_features]
    y = df[target]
    
    print("Preprocessing...")
    preprocessor = ColumnTransformer(
        transformers=[
            ('num', 'passthrough', numeric_features),
            ('cat', OneHotEncoder(handle_unknown='ignore', sparse_output=False), categorical_features)
        ])
    
    X_train, X_val, y_train, y_val = train_test_split(X, y, test_size=0.2, random_state=69)
    
    X_train_processed = preprocessor.fit_transform(X_train)
    X_val_processed = preprocessor.transform(X_val)
    
    print("Training XGBoost...")
    model = xgb.XGBRegressor(
        objective='reg:squarederror',
        eval_metric='rmse',
        n_estimators=100,
        max_depth=6,
        learning_rate=0.1,
        random_state=42
    )
    
    model.fit(X_train_processed, y_train, eval_set=[(X_train_processed, y_train), (X_val_processed, y_val)], verbose=False)
    
    # Metrics
    train_rmse = np.sqrt(mean_squared_error(y_train, model.predict(X_train_processed)))
    val_rmse = np.sqrt(mean_squared_error(y_val, model.predict(X_val_processed)))
    metrics_txt = f"Train RMSE: {train_rmse:.4f}\nValidation RMSE: {val_rmse:.4f}"
    print(metrics_txt)
    
    # Save Artifacts
    print("Saving artifacts...")
    model.save_model(MODEL_FILE)
    joblib.dump(preprocessor, PREPROCESSOR_FILE)
    
    # Feature Importance
    try:
        num_names = numeric_features
        cat_names = preprocessor.named_transformers_['cat'].get_feature_names_out(categorical_features)
        feature_names = list(num_names) + list(cat_names)
        
        importances = model.feature_importances_
        imp_df = pd.DataFrame({'Feature': feature_names, 'Importance': importances})
        imp_df = imp_df.sort_values(by='Importance', ascending=False)
        imp_df.to_csv(IMPORTANCE_FILE, index=False)
    except Exception as e:
        print(f"Could not save feature importances: {e}")

    with open(METRICS_FILE, "w") as f:
        f.write(metrics_txt)

    print("Training Complete.")

if __name__ == "__main__":
    train_model()
