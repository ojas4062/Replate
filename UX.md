# RePlate — UX Specification

## 1. UX Principle
**Make the product understandable before making it impressive.**

A judge should understand what RePlate does within one screen and one interaction.

## 2. Primary UX Flow
```text
01 Predict
   ↓
02 Prepare
   ↓
03 Measure
```

## 3. Screen / Section 1 — Predict
Purpose: enter tomorrow's meal context.

Inputs:
- Date (day of week is derived automatically from this — never a separate selectable field, to avoid a date/weekday mismatch corrupting the model input)
- Meal type
- Menu category
- Expected students
- Holiday / special event
- Exam day

Primary CTA:
**Predict Demand**

Output:
- Predicted diners
- Recommended preparation

## 4. Section 2 — Prepare
Purpose: translate the prediction into an operational recommendation.

Show three large metrics:
- Expected diners
- Recommended portions
- Safety buffer

The recommendation should be framed as a decision aid, not a guarantee.

## 5. Section 3 — Measure
Purpose: record what actually happened.

Inputs:
- Actual diners
- Leftover portions

Outputs:
- Absolute prediction error
- Percentage error when valid
- Surplus comparison

## 6. Visual Hierarchy
Priority 1: prediction and recommendation.  
Priority 2: actual outcome and error.  
Priority 3: charts and supporting context.

Use `st.metric` for the primary numerical story.

## 7. UX Copy Rules
Prefer:
- “Predicted diners”
- “Recommended preparation”
- “Actual diners”
- “Prediction error”
- “Simulated surplus comparison”

Avoid:
- “Perfect prediction”
- “Guaranteed waste reduction”
- “97.6% accurate AI”
- “AI knows how much food to cook”

## 8. Feedback States
### Success
“Prediction generated.”

### Validation
“Enter a non-negative number of actual diners.”

### Empty state
“No post-meal result recorded yet.”

### Data note
“Prototype uses simulated historical data with realistic variation.”

## 9. Demo UX
The interface should require as few clicks as possible. Avoid tabs, nested navigation, login pages, settings pages, or configuration screens during the main demo.
