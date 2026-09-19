import os
import pandas as pd
import numpy as np
from datetime import datetime, timedelta

def generate_synthetic_data(num_records: int = 500, random_seed: int = 42) -> pd.DataFrame:
    """
    Generates a realistic synthetic historical meal dataset for RePlate.
    
    Factors considered:
    - Meal type (Breakfast, Lunch, Dinner)
    - Day of week (Weekdays vs Weekends)
    - Menu category (Standard, Biryani / Special, South Indian, Continental, Comfort Food)
    - Holiday effect (significant attendance drop)
    - Exam day effect (higher attendance on campus)
    - Random Gaussian noise
    """
    np.random.seed(random_seed)
    
    start_date = datetime(2026, 3, 1)
    days_needed = (num_records // 3) + 10
    
    dates = []
    days_of_week = []
    meal_types = []
    menu_categories = []
    expected_students_list = []
    holidays = []
    exam_days = []
    actual_diners_list = []
    prepared_portions_list = []
    leftover_portions_list = []
    
    meals = ["Breakfast", "Lunch", "Dinner"]
    menus = ["Standard", "Biryani / Special", "South Indian", "Continental", "Comfort Food"]
    
    cur_date = start_date
    record_count = 0
    
    while record_count < num_records:
        day_str = cur_date.strftime("%A")
        is_weekend = day_str in ["Saturday", "Sunday"]
        
        # Holiday chance ~ 8%
        is_holiday = bool(np.random.rand() < 0.08)
        # Exam day chance ~ 12% (if not holiday)
        is_exam = bool((not is_holiday) and (np.random.rand() < 0.12))
        
        # Base expected population (e.g. 480 to 520)
        base_expected = int(np.random.normal(500, 10))
        
        for meal in meals:
            if record_count >= num_records:
                break
                
            menu = np.random.choice(menus, p=[0.4, 0.2, 0.15, 0.12, 0.13])
            
            # Base attendance multiplier
            meal_mult = {"Breakfast": 0.70, "Lunch": 0.90, "Dinner": 0.82}[meal]
            
            # Day multiplier
            if day_str == "Saturday":
                day_mult = 0.78
            elif day_str == "Sunday":
                day_mult = 0.65
            else:
                day_mult = 1.0
                
            # Menu multiplier
            menu_mult = {
                "Biryani / Special": 1.12,
                "South Indian": 1.04,
                "Standard": 1.00,
                "Continental": 0.96,
                "Comfort Food": 0.94
            }[menu]
            
            # Event multipliers
            holiday_mult = 0.60 if is_holiday else 1.0
            exam_mult = 1.08 if is_exam else 1.0
            
            # Calculate mean demand
            mean_demand = base_expected * meal_mult * day_mult * menu_mult * holiday_mult * exam_mult
            
            # Add Gaussian noise
            noise = np.random.normal(0, 18)
            actual_diners = int(np.clip(round(mean_demand + noise), 50, base_expected + 25))
            
            # Baseline prep historically: kitchen prepared for base_expected
            prepared_portions = base_expected
            leftovers = max(0, prepared_portions - actual_diners)
            
            dates.append(cur_date.strftime("%Y-%m-%d"))
            days_of_week.append(day_str)
            meal_types.append(meal)
            menu_categories.append(menu)
            expected_students_list.append(base_expected)
            holidays.append(is_holiday)
            exam_days.append(is_exam)
            actual_diners_list.append(actual_diners)
            prepared_portions_list.append(prepared_portions)
            leftover_portions_list.append(leftovers)
            
            record_count += 1
            
        cur_date += timedelta(days=1)
        
    df = pd.DataFrame({
        "date": dates,
        "day_of_week": days_of_week,
        "meal_type": meal_types,
        "menu_category": menu_categories,
        "expected_students": expected_students_list,
        "holiday": holidays,
        "exam_day": exam_days,
        "actual_diners": actual_diners_list,
        "prepared_portions": prepared_portions_list,
        "leftover_portions": leftover_portions_list
    })
    
    return df

def save_synthetic_data(file_path: str = "data/historical_meals.csv", num_records: int = 500) -> pd.DataFrame:
    os.makedirs(os.path.dirname(file_path), exist_ok=True)
    df = generate_synthetic_data(num_records=num_records)
    df.to_csv(file_path, index=False)
    return df

if __name__ == "__main__":
    df = save_synthetic_data()
    print(f"Generated {len(df)} synthetic records saved to data/historical_meals.csv")
