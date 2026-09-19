# RePlate — Data Specification

## 1. Purpose
Define the minimum synthetic dataset required to train and evaluate the prototype regression model.

## 2. Data Source
The hackathon MVP uses a **synthetically generated historical dataset**. Records are generated from simple demand relationships plus random noise so the model must learn an imperfect pattern rather than reproduce deterministic rules.

Suggested pitch wording:
> Trained on simulated historical data with realistic variation; in deployment, the same pipeline learns from a mess's actual attendance and leftover records.

## 3. Minimum Dataset Size
Recommended: **300–1,000 meal records**.

300 records is enough for a simple demo. More records are acceptable only if generation remains simple.

## 4. Schema
| Field | Type | Example | Description |
|---|---|---|---|
| date | date | 2026-08-24 | Meal date |
| day_of_week | category | Sunday | Day label |
| meal_type | category | Lunch | Breakfast / Lunch / Dinner |
| menu_category | category | Biryani | Broad menu category |
| expected_students | integer | 500 | Registered/expected population |
| holiday | boolean | false | Whether it is a holiday |
| exam_day | boolean | true | Whether it overlaps an exam period |
| actual_diners | integer | 461 | Simulated ground truth |
| prepared_portions | integer | 482 | Portions prepared |
| leftover_portions | integer | 19 | Portions left after meal |

## 5. Synthetic Generation Rules
The generator may start with a baseline such as:

`actual_diners = expected_students × day_effect × menu_effect × event_effect + noise`

Example conceptual factors:
- Weekday / weekend effect.
- Meal effect.
- Menu effect.
- Holiday effect.
- Exam-day effect.
- Random noise.

Do not make these relationships deterministic.

## 6. Noise Requirement
Add realistic random variation to each generated record.

A simple approach is a percentage jitter, for example ±10%, with clipping to sensible minimum/maximum values.

The exact noise level is a prototype choice, not a real-world claim.

## 7. Train / Test Split
Use a reproducible split, e.g.:
- 80% train
- 20% test

Set a random seed so the demo is repeatable.

## 8. Data Leakage Avoidance
Do not generate `actual_diners` and then accidentally include `actual_diners` as a prediction feature. The model should predict `actual_diners` only from information available before the meal.

`actual_diners`, `prepared_portions`, and `leftover_portions` are outcome/descriptive columns only. None of the three may be used as a model input feature — they exist in the historical CSV for evaluation and for computing the baseline comparison in §8a, not for training.

## 8a. Baseline Surplus Definition
The "baseline vs current" surplus comparison referenced in UI.md, UX.md, and DEMO.md must use a single, explicitly defined baseline so the number shown in the demo is reproducible and defensible:

```text
baseline_surplus = expected_students − actual_diners
current_surplus  = recommended_portions − actual_diners
```

`baseline_surplus` represents the naive approach of preparing food for every registered/expected student with no forecasting. `current_surplus` represents RePlate's forecast-plus-buffer approach. Both values are computed per record from the same simulated dataset — never hand-typed — and any "% surplus reduction" shown in the app or pitch must be `(baseline_surplus − current_surplus) / baseline_surplus` computed live, not a fixed claimed number.

## 9. Data Validation
Check:
- Counts are non-negative integers.
- Actual diners do not exceed expected capacity unless intentionally modeled.
- Leftovers are non-negative.
- Leftovers do not exceed prepared portions.
- Required categories are valid.

## 10. Production Data Mapping
In a real mess, the conceptual mapping would be:

```text
Mess register / attendance count → actual_diners
Kitchen preparation record      → prepared_portions
Post-meal kitchen measurement   → leftover_portions
Academic calendar               → holiday / exam_day
Menu plan                       → menu_category
```

No personal student identity is required for the forecasting model.
