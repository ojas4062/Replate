import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

import pandas as pd
from sklearn.pipeline import Pipeline
from typing import Dict, Any

def predict_demand(pipeline: Pipeline, input_data: Dict[str, Any]) -> float:
    """
    Predicts expected diner count using trained RePlate model.
    
    input_data schema:
    {
        "day_of_week": str ("Monday"..."Sunday"),
        "meal_type": str ("Breakfast", "Lunch", "Dinner"),
        "menu_category": str ("Standard", "Biryani / Special", etc.),
        "expected_students": int,
        "holiday": bool,
        "exam_day": bool
    }
    """
    df_input = pd.DataFrame([{
        "day_of_week": str(input_data["day_of_week"]),
        "meal_type": str(input_data["meal_type"]),
        "menu_category": str(input_data["menu_category"]),
        "expected_students": int(input_data["expected_students"]),
        "holiday": int(bool(input_data["holiday"])),
        "exam_day": int(bool(input_data["exam_day"]))
    }])
    
    prediction = pipeline.predict(df_input)[0]
    # Ensure sensible positive prediction bounds
    max_bound = int(input_data["expected_students"]) + 50
    prediction_bounded = float(max(10.0, min(prediction, max_bound)))
    return prediction_bounded
