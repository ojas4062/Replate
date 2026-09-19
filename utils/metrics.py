import math
import numpy as np
import pandas as pd
from typing import Tuple, Dict, Any

def calculate_mae(y_true: np.ndarray, y_pred: np.ndarray) -> float:
    """Calculates Mean Absolute Error in diner units."""
    y_true = np.asarray(y_true, dtype=float)
    y_pred = np.asarray(y_pred, dtype=float)
    return float(np.mean(np.abs(y_true - y_pred)))

def calculate_mape(y_true: np.ndarray, y_pred: np.ndarray) -> float:
    """
    Calculates Mean Absolute Percentage Error (as a percentage, e.g., 4.25 for 4.25%).
    Handles zero values safely to avoid division by zero.
    """
    y_true = np.asarray(y_true, dtype=float)
    y_pred = np.asarray(y_pred, dtype=float)
    
    # Filter out zero ground truth values to prevent division by zero
    non_zero_mask = y_true != 0
    if not np.any(non_zero_mask):
        return 0.0
        
    mape = np.mean(np.abs((y_true[non_zero_mask] - y_pred[non_zero_mask]) / y_true[non_zero_mask])) * 100.0
    return float(mape)

def calculate_single_error(actual_diners: int, predicted_diners: float) -> Tuple[float, float]:
    """
    Calculates absolute error and percentage error for a single meal prediction.
    Returns: (abs_error, pct_error)
    """
    abs_err = abs(actual_diners - round(predicted_diners))
    if actual_diners > 0:
        pct_err = (abs_err / actual_diners) * 100.0
    else:
        pct_err = 0.0
    return float(abs_err), float(pct_err)

def calculate_surplus_comparison(
    expected_students: int,
    actual_diners: int,
    recommended_portions: int
) -> Dict[str, Any]:
    """
    Calculates live baseline vs RePlate surplus comparison according to DATA.md §8a:
    baseline_surplus = max(0, expected_students - actual_diners)
    current_surplus  = max(0, recommended_portions - actual_diners)
    surplus_reduction_pct = (baseline_surplus - current_surplus) / baseline_surplus
    """
    baseline_surplus = max(0, expected_students - actual_diners)
    current_surplus = max(0, recommended_portions - actual_diners)
    
    if baseline_surplus > 0:
        reduction_pct = ((baseline_surplus - current_surplus) / baseline_surplus) * 100.0
    else:
        reduction_pct = 0.0
        
    portions_saved = max(0, baseline_surplus - current_surplus)
    
    return {
        "baseline_surplus": baseline_surplus,
        "current_surplus": current_surplus,
        "portions_saved": portions_saved,
        "surplus_reduction_pct": reduction_pct
    }

def calculate_aggregate_surplus(
    df: pd.DataFrame,
    predictions: np.ndarray,
    buffer_rate: float = 0.03
) -> Dict[str, Any]:
    """
    Computes cumulative surplus performance over a dataset/test-set split.
    """
    actuals = df["actual_diners"].values
    expected = df["expected_students"].values
    
    recommended = np.ceil(predictions * (1.0 + buffer_rate)).astype(int)
    
    baseline_surpluses = np.maximum(0, expected - actuals)
    replate_surpluses = np.maximum(0, recommended - actuals)
    
    total_baseline_surplus = int(np.sum(baseline_surpluses))
    total_replate_surplus = int(np.sum(replate_surpluses))
    total_portions_saved = max(0, total_baseline_surplus - total_replate_surplus)
    
    if total_baseline_surplus > 0:
        total_reduction_pct = (total_portions_saved / total_baseline_surplus) * 100.0
    else:
        total_reduction_pct = 0.0
        
    return {
        "total_baseline_surplus": total_baseline_surplus,
        "total_replate_surplus": total_replate_surplus,
        "total_portions_saved": total_portions_saved,
        "total_reduction_pct": total_reduction_pct,
        "baseline_series": baseline_surpluses,
        "replate_series": replate_surpluses
    }
