# RePlate — Demo Script

## 1. Demo Objective
Show the complete product loop in roughly 90 seconds.

## 2. Opening
> “College messes have to decide how much food to prepare before they know exactly how many students will eat. RePlate predicts demand, recommends a preparation quantity, and then measures how well that decision performed.”

## 3. Step 1 — Predict
Enter a meal example such as:
- Expected students: 500
- Day: Sunday
- Meal: Lunch
- Menu: Biryani
- Holiday: No
- Exam day: No

Click **Predict Demand**.

Show:
- Predicted diners
- Recommended portions
- Safety buffer

Note: whatever numbers appear here must come from the live model, not be pre-typed — see TEST-PLAN.md §6 (Anti-Fake Test). Do not rehearse fixed numbers in this script as if they're guaranteed output.

## 4. Step 2 — Prepare
Pause on the three large metrics and explain:
> “Instead of preparing directly from the registered student count, the mess gets a forecast plus a small safety buffer.”

## 5. Step 3 — Measure
Enter post-meal values such as:
- Actual diners: 461
- Leftovers: 19

Show:
- Prediction error
- Percentage error
- Surplus comparison

## 6. Close
> “The important part is the loop: predict before the meal, measure what actually happened, and use those records to improve future forecasts.”

## 7. Data Disclosure
> “For this prototype, the historical dataset is simulated with realistic variation. In deployment, the same pipeline would learn from the mess’s actual attendance and leftover records.”

## 8. Demo Rules
- Never invent a metric during the presentation.
- Never claim simulated results are production validation.
- Do not spend time opening code unless a judge asks.
- Keep the live path short.
