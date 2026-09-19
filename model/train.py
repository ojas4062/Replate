import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.linear_model import LinearRegression
from typing import Tuple, Dict, Any

from utils.metrics import calculate_mae, calculate_mape

FEATURE_COLS_CAT = ["day_of_week", "meal_type", "menu_category"]
FEATURE_COLS_NUM = ["expected_students", "holiday", "exam_day"]
TARGET_COL = "actual_diners"

def build_pipeline() -> Pipeline:
    """Creates a scikit-learn ML pipeline with OneHotEncoding and Linear Regression."""
    categorical_transformer = OneHotEncoder(handle_unknown="ignore", sparse_output=False)
    
    preprocessor = ColumnTransformer(
        transformers=[
            ("cat", categorical_transformer, FEATURE_COLS_CAT),
            ("num", "passthrough", FEATURE_COLS_NUM)
        ]
    )
    
    pipeline = Pipeline(
        steps=[
            ("preprocessor", preprocessor),
            ("regressor", LinearRegression())
        ]
    )
    return pipeline

def train_replate_model(
    df: pd.DataFrame,
    test_size: float = 0.20,
    random_seed: int = 42
) -> Tuple[Pipeline, Dict[str, Any]]:
    """
    Trains the RePlate demand prediction model on synthetic/historical dataset.
    Returns the fitted pipeline and evaluation metrics on the held-out test set.
    """
    # Ensure boolean columns are integers for numerical processing
    df_clean = df.copy()
    df_clean["holiday"] = df_clean["holiday"].astype(int)
    df_clean["exam_day"] = df_clean["exam_day"].astype(int)
    
    X = df_clean[FEATURE_COLS_CAT + FEATURE_COLS_NUM]
    y = df_clean[TARGET_COL]
    
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=test_size, random_state=random_seed
    )
    
    pipeline = build_pipeline()
    pipeline.fit(X_train, y_train)
    
    # Evaluate on held-out test set
    y_test_pred = pipeline.predict(X_test)
    
    mae = calculate_mae(y_test.values, y_test_pred)
    mape = calculate_mape(y_test.values, y_test_pred)
    
    metrics = {
        "mae": mae,
        "mape": mape,
        "test_size": len(X_test),
        "train_size": len(X_train),
        "X_test": X_test,
        "y_test": y_test,
        "y_test_pred": y_test_pred
    }
    
    return pipeline, metrics

if __name__ == "__main__":
    from data.generator import generate_synthetic_data
    df = generate_synthetic_data()
    model, metrics = train_replate_model(df)
    print(f"Model trained successfully! Test MAE: {metrics['mae']:.2f}, Test MAPE: {metrics['mape']:.2f}%")
