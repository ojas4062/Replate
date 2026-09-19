import sys
import os
import unittest
import pandas as pd
import numpy as np

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from data.generator import generate_synthetic_data
from model.train import train_replate_model
from model.predict import predict_demand
from utils.metrics import (
    calculate_mae,
    calculate_mape,
    calculate_single_error,
    calculate_surplus_comparison,
    calculate_aggregate_surplus
)
from utils.simulation import (
    calculate_recommendation,
    validate_prediction_inputs,
    validate_measurement_inputs
)

class TestRePlateSystem(unittest.TestCase):

    def test_synthetic_data_generation(self):
        df = generate_synthetic_data(num_records=100, random_seed=42)
        self.assertEqual(len(df), 100)
        required_cols = [
            "date", "day_of_week", "meal_type", "menu_category",
            "expected_students", "holiday", "exam_day",
            "actual_diners", "prepared_portions", "leftover_portions"
        ]
        for col in required_cols:
            self.assertIn(col, df.columns)
            
        self.assertTrue((df["actual_diners"] >= 0).all())
        self.assertTrue((df["expected_students"] > 0).all())

    def test_model_training_and_prediction(self):
        df = generate_synthetic_data(num_records=300, random_seed=42)
        model, metrics = train_replate_model(df)
        
        self.assertGreater(metrics["mae"], 0)
        self.assertGreater(metrics["mape"], 0)
        
        input_payload = {
            "day_of_week": "Sunday",
            "meal_type": "Lunch",
            "menu_category": "Biryani / Special",
            "expected_students": 500,
            "holiday": False,
            "exam_day": False
        }
        pred = predict_demand(model, input_payload)
        self.assertIsInstance(pred, float)
        self.assertGreater(pred, 100)
        self.assertLessEqual(pred, 550)

    def test_safety_buffer_recommendation(self):
        pred_diners = 468.2
        rec, buf = calculate_recommendation(pred_diners, buffer_rate=0.03)
        # ceil(468.2 * 1.03) = ceil(482.246) = 483
        self.assertEqual(rec, 483)
        self.assertEqual(buf, 483 - 468)

    def test_surplus_metrics_calculation(self):
        # Baseline: expected 500, actual 460 -> baseline surplus = 40
        # RePlate rec: 474, actual 460 -> replate surplus = 14
        # Surplus reduction: (40 - 14)/40 = 65%
        res = calculate_surplus_comparison(expected_students=500, actual_diners=460, recommended_portions=474)
        self.assertEqual(res["baseline_surplus"], 40)
        self.assertEqual(res["current_surplus"], 14)
        self.assertEqual(res["portions_saved"], 26)
        self.assertAlmostEqual(res["surplus_reduction_pct"], 65.0, places=1)

    def test_validation_functions(self):
        val_p, msg_p = validate_prediction_inputs(500, "Lunch", "Standard")
        self.assertTrue(val_p)
        
        val_m, msg_m, warn_m = validate_measurement_inputs(actual_diners=450, leftovers=10, prepared_portions=470)
        self.assertTrue(val_m)
        self.assertEqual(warn_m, "")
        
        val_m_warn, _, warn_m_warn = validate_measurement_inputs(actual_diners=400, leftovers=500, prepared_portions=470)
        self.assertTrue(val_m_warn)
        self.assertIn("Warning", warn_m_warn)

    def test_zero_handling_in_mape(self):
        y_true = np.array([0, 100, 200])
        y_pred = np.array([10, 110, 190])
        # Should not raise ZeroDivisionError
        mape = calculate_mape(y_true, y_pred)
        self.assertGreater(mape, 0)

if __name__ == "__main__":
    unittest.main()
