# RePlate — Model Specification

## 1. Model Goal
Predict the number of students likely to eat a specific upcoming meal.

## 2. Target
`actual_diners`

## 3. Features
Minimum feature set:
- expected_students
- day_of_week
- meal_type
- menu_category
- holiday
- exam_day

Optional only if readily available:
- previous meal attendance summary
- recent attendance average

Do not add extra features simply to make the model sound sophisticated.

## 4. Recommended Model
Use a simple regression baseline such as:
- Linear Regression, or
- a small tree-based regressor if the team already knows it.

For a beginner team, **Linear Regression is the default** because it is easy to explain.

## 5. Preprocessing
- One-hot encode categorical variables.
- Keep numeric fields numeric.
- Fit preprocessing only on the training split.
- Apply the same transformation at prediction time.

## 6. Evaluation Metrics
### MAE
Mean Absolute Error represents average diner-count error in the same unit as the prediction.

### MAPE
Mean Absolute Percentage Error gives a percentage-based error measure. Handle zero actual values safely.

Do not call these “accuracy.”

## 7. Safety Buffer
Recommended preparation:

`recommended_portions = ceil(predicted_diners × (1 + buffer_rate))`

Use a small configurable buffer, e.g. 3%.

The buffer is an operational assumption for the prototype, not a validated industry standard.

## 8. Prediction Example
Input:
- Expected students: 500
- Day: Sunday
- Meal: Lunch
- Menu: Biryani
- Holiday: No
- Exam day: No

Output example:
- Predicted diners: 468
- Safety buffer: 3%
- Recommended portions: 483 (`ceil(468 × 1.03)`)

These values are illustrative; the live app should display values produced by the trained model. Recommended portions must always be computed from the formula in §7, never hand-typed — if the example number and the formula ever disagree, the formula wins.

## 9. Model Transparency
The MVP should show model evaluation numbers and input fields but does not need a complex explainability layer.

Do not add an LLM “reasoning” panel to the MVP.

## 10. Failure Conditions
A prediction should be flagged if:
- Required inputs are missing.
- Input values are outside expected ranges.
- Model artifacts cannot be loaded.

## 11. Future Work (Not MVP)
- Rolling retraining from real historical records.
- Time-series forecasting.
- Confidence intervals.
- Per-menu calibration.
- Online error monitoring.
