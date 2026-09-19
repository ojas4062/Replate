# RePlate — UI Specification

## 1. Layout
Use a single Streamlit page with a strong top-to-bottom narrative.

```text
--------------------------------------------------
REPLATE
Predict better. Prepare smarter. Waste less.

[Prototype uses simulated historical data]
--------------------------------------------------

01 PREDICT
[Date] [Meal] [Menu] [Expected Students]
[Holiday] [Exam Day]
(Day of week is derived from Date — not a separate input field.)

[ Predict Demand ]

--------------------------------------------------

02 PREPARE
[ Predicted Diners ] [ Recommended Portions ] [ Buffer ]

--------------------------------------------------

03 MEASURE
[ Actual Diners ] [ Leftovers ]

[ Prediction Error ] [ Percentage Error ]

--------------------------------------------------

Analytics
[Prediction chart]
[Surplus comparison chart]
--------------------------------------------------
```

## 2. Components
### Header
- Product name
- One-line value proposition
- Small prototype/data disclaimer

### Metric Cards
Use Streamlit `st.metric` for:
- Predicted diners
- Recommended portions
- Safety buffer
- Actual diners
- Prediction error
- MAPE / MAE

### Inputs
Use simple Streamlit controls:
- `st.date_input`
- `st.selectbox`
- `st.number_input`
- `st.checkbox`
- `st.button`

### Charts
Keep to two useful charts:
1. Predicted vs actual diners.
2. Baseline/simulated surplus vs current simulated surplus.

## 3. UI Rules
- No dashboard sidebar as the primary navigation.
- No excessive cards.
- No decorative widgets with no decision value.
- No fake live data.
- No unexplained technical jargon.
- Use consistent numeric units: diners / portions.
