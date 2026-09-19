# RePlate — Technical Requirements Document

## 1. Technical Objective
Build the smallest reliable technical system that demonstrates the RePlate product loop in a 24-hour hackathon.

## 2. Technology Stack
- **Language:** Python
- **UI/Application:** Streamlit
- **Data:** CSV + Pandas
- **ML:** scikit-learn regression
- **Visualization:** Streamlit charts / lightweight plotting
- **Runtime:** Local Python environment

No backend server, database, LLM API, or cloud service is required for the MVP.

## 3. High-Level Architecture
```text
Synthetic CSV
     |
     v
Pandas Data Loader
     |
     v
Feature Preparation
     |
     v
Regression Model
     |
     +----> Evaluation (MAE / MAPE)
     |
     v
Prediction Function
     |
     v
Safety Buffer
     |
     v
Streamlit UI
     |
     v
Post-Meal Entry
     |
     v
Prediction Error + Surplus Analytics
```

## 4. Suggested Project Structure
```text
replate/
├── app.py
├── requirements.txt
├── README.md
├── data/
│   ├── historical_meals.csv
│   └── README.md
├── model/
│   ├── train.py
│   ├── predict.py
│   └── README.md
├── utils/
│   ├── metrics.py
│   └── simulation.py
├── assets/
│   └── logo / screenshots (optional)
└── docs/
```

The final implementation may simplify this structure if time becomes tight. Do not split the code into modules just to make the tree look professional.

Note: per §9, training runs at app startup, so `train.py`'s functions must be imported and called by `app.py` — not built as a separate standalone CLI script that the demo path never actually runs.

## 5. Runtime Flow
1. Load historical CSV.
2. Create numerical and encoded features.
3. Split into train/test sets.
4. Train simple regression model.
5. Calculate MAE and MAPE on test set.
6. Receive user inputs from Streamlit.
7. Transform inputs using the same preprocessing.
8. Predict diner count.
9. Apply safety buffer.
10. Display result.
11. Accept actual diners/leftovers.
12. Calculate post-meal metrics.

## 6. Error Handling
- Reject missing required input.
- Prevent negative diner or leftover values.
- Prevent leftover count from being greater than prepared quantity without warning.
- Handle zero actual diners when calculating percentage error.
- Display a clear message if the CSV is missing or malformed.

## 7. Configuration
Keep only a few simple constants:
- Safety buffer percentage.
- Random seed for reproducible dataset generation.
- Dataset size.
- Test split ratio.

## 8. Security / Privacy
The MVP uses synthetic data and therefore stores no real student personal information.

If the product is later deployed, attendance records should be aggregated and personal identifiers should not be required for demand forecasting.

## 9. Performance
The MVP is small enough that training may occur at application startup. Model inference should be effectively instantaneous for demo use.

## 10. Technical Constraints
- Must run without internet after dependencies are installed.
- Must not require a paid API.
- Must not depend on hardware.
- Must not require a cloud database.

## 11. Definition of Done
A fresh environment can run the app, load the dataset, produce a prediction, show MAE/MAPE, record an actual result, and display the demo analytics without manual code edits.
