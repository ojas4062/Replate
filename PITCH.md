# RePlate — Pitch Sheet

## One-Liner
**RePlate helps college messes predict daily meal demand, recommend preparation quantities, and measure whether the decision matched reality.**

## Problem
College messes must prepare food before actual attendance is known. Attendance changes with days, menus, holidays, and exams, making fixed estimates unreliable.

## Solution
RePlate turns simple pre-meal information into a demand forecast, adds a small safety buffer, and records post-meal attendance and leftovers for continuous measurement.

## How It Works
**Predict → Prepare → Measure → Improve**

## Technology
- Python
- Pandas
- scikit-learn
- Streamlit

## Data Honesty
> “Trained on simulated historical data with realistic variation; in deployment, the same pipeline learns from a mess's actual attendance and leftover records.”

## Why This MVP Is Credible
- Uses a clear prediction target.
- Evaluates the model with MAE and MAPE.
- Keeps model complexity explainable.
- Measures post-meal outcomes instead of stopping at a prediction.
- Avoids unnecessary APIs and infrastructure.

## What the Prototype Does Not Claim
- It is not validated on live college data.
- It does not guarantee a specific reduction in food waste.
- Its simulated surplus comparison is illustrative.

## Suggested Closing
> “RePlate is not trying to tell a mess exactly what will happen. It gives the kitchen a measurable forecast, records what actually happened, and creates the data loop needed to improve decisions over time.”
