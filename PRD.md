# RePlate — Product Requirements Document

## 1. Product
**Name:** RePlate  
**Tagline:** Predict better. Prepare smarter. Waste less.

## 2. Product Summary
RePlate is a hackathon MVP for college messes that predicts the number of diners for an upcoming meal, recommends a preparation quantity with a small safety buffer, and records post-meal results to evaluate prediction quality and surplus.

The MVP uses simulated historical data with realistic random variation. In a real deployment, the same pipeline would learn from a mess's actual attendance and leftover records.

## 3. Problem
College messes often prepare food using rough estimates rather than a demand forecast. Student attendance varies by day, meal, menu, holidays, and academic schedules. Over-preparation can create unnecessary surplus and food waste, while under-preparation can create shortages.

## 4. Goal
Create a simple, reliable prototype that demonstrates the full loop:

**Predict → Prepare → Measure → Improve**

## 5. Target User
Primary user: **college mess manager / food-service operator**.

Secondary stakeholder: **college administration / sustainability team**.

## 6. MVP Scope
### Must Have
- Synthetic historical CSV dataset with realistic noise.
- Simple regression model for diner prediction.
- Prediction form for an upcoming meal.
- Recommended preparation quantity using a small safety buffer.
- Post-meal entry for actual diners and leftovers.
- MAE and MAPE model evaluation.
- Surplus comparison clearly labeled as simulation.
- Streamlit interface using `st.metric` and simple charts.
- Clear 3-step UI: Predict, Prepare, Measure.

### Explicitly Out of Scope
- Real college integrations.
- QR attendance hardware.
- Computer vision plate detection.
- IoT sensors.
- Production authentication.
- Multi-college SaaS architecture.
- LLM/Gemini assistant.
- Real-time deployment infrastructure.
- Complex ML models.

## 7. Core User Flow
1. User selects date/day, meal, menu category, expected students, and event flags.
2. User clicks **Predict Demand**.
3. Model returns expected diners.
4. System applies safety buffer and shows recommended preparation.
5. After the meal, user enters actual diners and leftovers.
6. System calculates prediction error and updates analytics.

## 8. Functional Requirements
### FR-01: Prediction
The system shall accept meal context and return a predicted diner count.

### FR-02: Recommendation
The system shall calculate a recommended preparation quantity from predicted diners plus a configurable small safety buffer.

### FR-03: Measurement
The system shall allow actual diners and leftover portions to be entered after a meal.

### FR-04: Evaluation
The system shall display MAE and MAPE for the model using a held-out test set.

### FR-05: Analytics
The system shall display current prediction error and historical/simulated surplus comparisons.

### FR-06: Transparency
The UI shall distinguish clearly between model results and simulated impact results.

## 9. Non-Functional Requirements
- Runs locally with one command after dependencies are installed.
- No external API dependency for the MVP.
- Prediction response should feel immediate in the demo.
- UI must be readable on a laptop screen.
- No unsupported claims about real-world waste reduction.

## 10. Success Criteria
The MVP is complete when a user can demonstrate the full Predict → Prepare → Measure loop without changing code during the demo and can explain exactly where the dataset and metrics came from.

## 11. Hackathon Demo Success
The demo should make three things immediately visible:
1. A prediction is generated from meal inputs.
2. A preparation recommendation follows from that prediction.
3. Post-meal results produce a measurable error and surplus comparison.
