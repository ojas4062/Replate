"""
RePlate Flask API
Run with: python api.py
Exposes POST /predict for the React frontend.
"""
import os
import sys
import math

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from flask import Flask, request, jsonify
from data.generator import save_synthetic_data
from model.train import train_replate_model
from model.predict import predict_demand
from utils.simulation import calculate_recommendation
import pandas as pd

app = Flask(__name__)

# Train once at startup (same as Streamlit's @st.cache_resource)
def _load_model():
    csv_path = os.path.join("data", "historical_meals.csv")
    if not os.path.exists(csv_path):
        df = save_synthetic_data(file_path=csv_path)
    else:
        df = pd.read_csv(csv_path)
    pipeline, metrics = train_replate_model(df)
    print(f"Model ready — MAE: {metrics['mae']:.2f}, MAPE: {metrics['mape']:.2f}%")
    return pipeline

_pipeline = _load_model()

# Day-of-week map from React's dayOfWeek strings to model's expected values
_DAY_ALIASES = {
    "Monday": "Monday", "Tuesday": "Tuesday", "Wednesday": "Wednesday",
    "Thursday": "Thursday", "Friday": "Friday", "Saturday": "Saturday", "Sunday": "Sunday"
}

@app.post("/predict")
def predict():
    body = request.get_json(silent=True) or {}

    day_of_week      = _DAY_ALIASES.get(body.get("dayOfWeek", "Friday"), "Friday")
    meal_type        = body.get("mealType", "Dinner")          # React sends mealType
    menu_category    = body.get("menuCategory", "Standard")    # React sends menuCategory
    expected         = int(body.get("expectedBookings", 350))
    is_holiday       = bool(body.get("isHoliday", False))
    is_exam          = bool(body.get("isExam", False))
    buffer_rate      = float(body.get("bufferRate", 0.05))

    pred = predict_demand(_pipeline, {
        "day_of_week":       day_of_week,
        "meal_type":         meal_type,
        "menu_category":     menu_category,
        "expected_students": expected,
        "holiday":           is_holiday,
        "exam_day":          is_exam,
    })

    recommended, buffer_count = calculate_recommendation(pred, buffer_rate=buffer_rate)
    waste_saved_kg = round(max(0, expected - recommended) * 0.35, 1)

    return jsonify({
        "predictedDiners":      round(pred),
        "recommendedPortions":  recommended,
        "bufferPortions":       buffer_count,
        "estimatedWasteSavedKg": waste_saved_kg,
    })


if __name__ == "__main__":
    app.run(port=5001, debug=False)
