# RePlate Documentation Pack

RePlate is a 24-hour hackathon MVP for predicting college meal demand and measuring preparation outcomes.

## Locked MVP
- Simulated historical CSV with realistic random noise.
- Simple regression model.
- Predicted diners.
- Predicted diners + small safety buffer for recommended preparation.
- Post-meal actual diners + leftovers.
- MAE / MAPE for model evaluation.
- Surplus comparison labeled as simulation.
- Streamlit UI with `st.metric`.
- No Gemini in MVP.

## Core Loop
**Predict → Prepare → Measure → Improve**

## Document Index
- `PRD.md` — product requirements
- `TRD.md` — technical requirements
- `UX.md` — user experience specification
- `UI.md` — interface specification
- `DATA.md` — data generation and schema
- `MODEL.md` — ML model and metrics
- `SPIRIT.md` — engineering/product principles
- `ASSET-LIST.md` — required assets
- `TEST-PLAN.md` — testing and release gate
- `DEMO.md` — live demo sequence
- `PITCH.md` — pitch-ready messaging

## Build Rule
Do not add new architecture or features unless the core demo already works end-to-end.
