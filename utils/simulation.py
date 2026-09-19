import math
from typing import Tuple, Optional

def calculate_recommendation(predicted_diners: float, buffer_rate: float = 0.03) -> Tuple[int, int]:
    """
    Calculates recommended portions using the safety buffer rule:
    recommended_portions = ceil(predicted_diners * (1 + buffer_rate))
    Returns: (recommended_portions, buffer_portions)
    """
    predicted_rounded = round(predicted_diners)
    recommended = math.ceil(predicted_diners * (1.0 + buffer_rate))
    buffer_portions = recommended - predicted_rounded
    return recommended, max(0, buffer_portions)

def validate_prediction_inputs(
    expected_students: int,
    meal_type: str,
    menu_category: str
) -> Tuple[bool, str]:
    """Validates user input fields for demand prediction."""
    if expected_students is None or expected_students <= 0:
        return False, "Expected students must be a positive integer greater than zero."
    if not meal_type or not menu_category:
        return False, "Meal type and menu category are required."
    return True, ""

def validate_measurement_inputs(
    actual_diners: int,
    leftovers: int,
    prepared_portions: Optional[int] = None
) -> Tuple[bool, str, str]:
    """
    Validates post-meal actual diner and leftover inputs.
    Returns: (is_valid, error_message, warning_message)
    """
    if actual_diners is None or actual_diners < 0:
        return False, "Actual diners must be a non-negative integer.", ""
        
    if leftovers is None or leftovers < 0:
        return False, "Leftover portions must be a non-negative integer.", ""
        
    warning_msg = ""
    if prepared_portions is not None and prepared_portions > 0:
        if leftovers > prepared_portions:
            warning_msg = f"Warning: Reported leftovers ({leftovers}) exceed recommended preparation quantity ({prepared_portions})."
            
    return True, "", warning_msg
