# RePlate — Test Plan

## 1. Goal
Verify that the MVP works reliably for the complete demo flow and does not make misleading calculations.

## 2. Functional Tests
### Prediction
- Valid inputs produce a prediction.
- Same inputs produce reproducible output for the same model/data version.
- Missing required inputs are rejected.

### Recommendation
- Recommended portions are greater than or equal to predicted diners.
- Safety buffer is applied consistently.
- Output is an integer number of portions.

### Measurement
- Actual diners can be entered.
- Leftovers can be entered.
- Negative values are rejected.
- Leftovers greater than prepared portions produce a warning.

### Metrics
- MAE is non-negative.
- MAPE handles zero actual values safely.
- Prediction error is calculated from predicted vs actual diners.

## 3. Data Tests
- CSV loads successfully.
- Expected columns exist.
- No impossible negative values.
- Categorical fields contain valid categories.
- Target column is not included as a prediction feature.

## 4. UI Tests
- Main page loads without exceptions.
- Primary button is visible without scrolling excessively.
- Metrics are legible.
- Prototype/simulated-data disclaimer is visible.
- Charts render after data is available.

## 5. Demo Test
Run exactly this sequence before presenting:
1. Launch app.
2. Enter sample meal inputs.
3. Predict.
4. Record sample actual diners and leftovers.
5. Confirm error metrics update.
6. Confirm simulated surplus comparison is labeled.
7. Refresh app and repeat once.

## 6. Anti-Fake Test
Pitch numbers and screenshots must not contradict live app output. Do not manually type final metrics into the UI.

## 7. Release Gate
The MVP is demo-ready only when the complete flow works on the machine that will be used for judging.
