# RePlate — Data Directory

This directory contains the synthetic historical meal dataset used by RePlate.

## Files
- `historical_meals.csv` — Synthetic dataset (500 records) containing historical meal features and outcome counts.
- `generator.py` — Script to generate reproducible synthetic meal data with realistic variation.

## Schema
| Column | Type | Description |
|---|---|---|
| `date` | string (YYYY-MM-DD) | Meal date |
| `day_of_week` | string | Monday – Sunday |
| `meal_type` | string | Breakfast, Lunch, Dinner |
| `menu_category` | string | Standard, Biryani / Special, South Indian, Continental, Comfort Food |
| `expected_students` | integer | Total registered/expected students |
| `holiday` | boolean | True if holiday/vacation day |
| `exam_day` | boolean | True if exam day |
| `actual_diners` | integer | Ground truth diners count (Target variable for ML) |
| `prepared_portions` | integer | Historical naive prepared portions |
| `leftover_portions` | integer | Historical leftovers |

*Note: `actual_diners`, `prepared_portions`, and `leftover_portions` are post-meal outcome fields and are NEVER used as input features for prediction.*
