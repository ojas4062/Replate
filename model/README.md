# RePlate — Model Directory

This directory contains the machine learning modules for RePlate's meal demand forecasting.

## Architecture
- `train.py` — Trains a scikit-learn regression pipeline (`ColumnTransformer` + `LinearRegression`) using 80/20 train/test split.
- `predict.py` — Predicts expected diners for a specific upcoming meal based on context inputs.

## Input Features
- `day_of_week` (Categorical: Monday–Sunday)
- `meal_type` (Categorical: Breakfast, Lunch, Dinner)
- `menu_category` (Categorical: Standard, Biryani / Special, South Indian, Continental, Comfort Food)
- `expected_students` (Numerical: integer count)
- `holiday` (Numerical/Binary: 0 or 1)
- `exam_day` (Numerical/Binary: 0 or 1)

## Target Variable
- `actual_diners` (Numerical: integer count)

## Metrics
- **MAE** (Mean Absolute Error in diners)
- **MAPE** (Mean Absolute Percentage Error %)
