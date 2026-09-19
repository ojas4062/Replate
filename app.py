import os
import sys
import math
import time
import requests
from datetime import datetime, date
import pandas as pd
import numpy as np
import streamlit as st
from st_aggrid import AgGrid, GridOptionsBuilder
from streamlit_lottie import st_lottie

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

# Local modules
from data.generator import save_synthetic_data, generate_synthetic_data
from model.train import train_replate_model
from model.predict import predict_demand
from utils.metrics import (
    calculate_single_error,
    calculate_surplus_comparison,
    calculate_aggregate_surplus
)
from utils.simulation import (
    calculate_recommendation,
    validate_prediction_inputs,
    validate_measurement_inputs
)

# Page configuration
st.set_page_config(
    page_title="RePlate — Predict Better. Prepare Smarter. Waste Less.",
    page_icon="🍲",
    layout="wide",
    initial_sidebar_state="expanded"
)

# --- Session State ---
if "predicted_diners" not in st.session_state:
    st.session_state.predicted_diners = None
if "predicted_inputs" not in st.session_state:
    st.session_state.predicted_inputs = None
if "prediction_count" not in st.session_state:
    st.session_state.prediction_count = 0
if "last_preset" not in st.session_state:
    st.session_state.last_preset = None
if "theme" not in st.session_state:
    st.session_state.theme = "light"
if "surplus_listings" not in st.session_state:
    st.session_state.surplus_listings = [
        {"id": 1, "title": "Leftover Lunch Biryani", "quantity": 15, "location": "Cafeteria A", "time": "2:30 PM"},
        {"id": 2, "title": "Assorted Sandwiches", "quantity": 8, "location": "Main Hall", "time": "3:00 PM"},
    ]
if "next_listing_id" not in st.session_state:
    st.session_state.next_listing_id = 3
if "my_added_items" not in st.session_state:
    st.session_state.my_added_items = []

# --- Theme Toggle Logic ---
def toggle_theme():
    if st.session_state.theme == "light":
        st.session_state.theme = "dark"
    else:
        st.session_state.theme = "light"

# ─── Master CSS ──────────────────────────────────────────────────────────────
light_css = """
  .stApp { background: linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 40%, #f0f9ff 100%); background-attachment: fixed; color: #0F172A; }
  .card-bg { background: white; border: 1px solid rgba(16,185,129,0.15); box-shadow: 0 4px 20px rgba(16,185,129,0.06); }
  .text-main { color: #047857; }
  .text-sub { color: #6B7280; }
  .hero-banner { background: linear-gradient(135deg, #064E3B 0%, #065F46 35%, #047857 65%, #059669 100%); }
  div[data-testid="stMetric"] { background: white; border: 1px solid #E2E8F0; }
  div[data-testid="stMetricValue"] { color: #0F172A !important; }
  .predict-result { background: linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 100%); border: 2px solid #10B981; }
  .rec-highlight { background: linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 100%); border: 1.5px solid #10B981; }
  .flow-header { background: white; border-left: 4px solid #10B981; }
  .flow-title { color: #0F172A; }
"""

dark_css = """
  .stApp { background: #0F172A; background-attachment: fixed; color: #F8FAFC; }
  .card-bg { background: #1E293B; border: 1px solid rgba(16,185,129,0.3); box-shadow: 0 4px 20px rgba(0,0,0,0.5); }
  .text-main { color: #34D399; }
  .text-sub { color: #94A3B8; }
  .hero-banner { background: linear-gradient(135deg, #022C22 0%, #064E3B 35%, #065F46 65%, #047857 100%); }
  div[data-testid="stMetric"] { background: #1E293B; border: 1px solid #334155; }
  div[data-testid="stMetricLabel"] { color: #94A3B8 !important; }
  div[data-testid="stMetricValue"] { color: #F8FAFC !important; }
  .predict-result { background: linear-gradient(135deg, #064E3B 0%, #065F46 100%); border: 2px solid #34D399; color: white;}
  .predict-result-label { color: #A7F3D0 !important; }
  .predict-result-sub { color: #E2E8F0 !important; }
  .predict-result-num { color: #6EE7B7 !important; }
  .rec-highlight { background: linear-gradient(135deg, #064E3B 0%, #065F46 100%); border: 1.5px solid #34D399; }
  .rec-label { color: #A7F3D0 !important; }
  .rec-sub { color: #E2E8F0 !important; }
  .rec-big { color: #6EE7B7 !important; }
  .flow-header { background: #1E293B; border-left: 4px solid #34D399; }
  .flow-title { color: #F8FAFC; }
  .info-callout { background: #1E3A8A; border: 1.5px solid #3B82F6; color: #DBEAFE; }
"""

theme_css = dark_css if st.session_state.theme == "dark" else light_css

st.markdown(f"""
<style>
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,400&display=swap');
  html, body, [class*="css"] {{ font-family: 'Plus Jakarta Sans', sans-serif !important; }}
  ::-webkit-scrollbar {{ width: 6px; }}
  ::-webkit-scrollbar-track {{ background: transparent; }}
  ::-webkit-scrollbar-thumb {{ background: #10B981; border-radius: 3px; }}
  
  {theme_css}

  /* ── HERO ── */
  .hero-banner {{
    border-radius: 20px; padding: 36px 40px; color: white; margin-bottom: 28px;
    box-shadow: 0 20px 60px -10px rgba(5,150,105,0.4), 0 4px 20px rgba(0,0,0,0.1);
    position: relative; overflow: hidden; animation: heroSlideIn 0.6s cubic-bezier(0.16,1,0.3,1) both;
  }}
  @keyframes heroSlideIn {{ from {{ opacity: 0; transform: translateY(-20px); }} to {{ opacity: 1; transform: translateY(0); }} }}
  .hero-inner {{ display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 20px; position: relative; z-index: 1; }}
  .hero-logo-row {{ display: flex; align-items: center; gap: 14px; }}
  .hero-emoji {{ font-size: 3rem; animation: float 3s ease-in-out infinite; }}
  @keyframes float {{ 0%, 100% {{ transform: translateY(0px); }} 50% {{ transform: translateY(-6px); }} }}
  .hero-title {{ font-size: 2.6rem; font-weight: 800; margin: 0; letter-spacing: -1px; line-height: 1; background: linear-gradient(to right, #ECFDF5, #A7F3D0); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }}
  .hero-tagline {{ font-size: 1rem; opacity: 0.85; margin-top: 6px; font-weight: 500; }}
  .hero-right {{ display: flex; flex-direction: column; align-items: flex-end; gap: 10px; }}
  .hero-badge {{ background: rgba(255,255,255,0.15); backdrop-filter: blur(10px); border: 1px solid rgba(255,255,255,0.3); padding: 8px 18px; border-radius: 30px; font-size: 0.82rem; font-weight: 600; color: #ECFDF5; }}
  .hero-sdg-badge {{ background: rgba(251,191,36,0.2); border: 1px solid rgba(251,191,36,0.4); padding: 6px 14px; border-radius: 20px; font-size: 0.78rem; font-weight: 600; color: #FEF3C7; }}

  /* ── IMPACT STRIP ── */
  .impact-strip {{ display: flex; gap: 16px; margin-bottom: 28px; flex-wrap: wrap; }}
  .impact-card {{ flex: 1; min-width: 140px; border-radius: 16px; padding: 20px 22px; text-align: center; transition: transform 0.25s ease, box-shadow 0.25s ease; animation: fadeUp 0.5s ease both; }}
  .impact-card:hover {{ transform: translateY(-4px); box-shadow: 0 12px 30px rgba(16,185,129,0.15); }}
  .impact-num {{ font-size: 1.9rem; font-weight: 800; line-height: 1; margin-bottom: 4px; }}
  .impact-label {{ font-size: 0.72rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; }}
  .impact-icon {{ font-size: 1.3rem; margin-bottom: 6px; }}
  @keyframes fadeUp {{ from {{ opacity: 0; transform: translateY(16px); }} to {{ opacity: 1; transform: translateY(0); }} }}

  /* ── FLOW HEADERS ── */
  .flow-header {{ display: flex; align-items: center; gap: 14px; margin-bottom: 20px; padding: 16px 20px; border-radius: 14px; box-shadow: 0 2px 12px rgba(0,0,0,0.04); }}
  .flow-step-badge {{ background: linear-gradient(135deg, #10B981, #047857); color: white; font-size: 0.72rem; font-weight: 800; padding: 5px 13px; border-radius: 20px; letter-spacing: 0.8px; white-space: nowrap; box-shadow: 0 3px 10px rgba(16,185,129,0.3); }}
  .flow-icon {{ font-size: 1.5rem; }}

  /* ── METRIC CARDS ── */
  div[data-testid="stMetric"] {{ border-radius: 14px; padding: 18px 20px !important; box-shadow: 0 2px 12px rgba(0,0,0,0.04); transition: transform 0.2s ease, box-shadow 0.2s ease; }}
  div[data-testid="stMetric"]:hover {{ transform: translateY(-2px); box-shadow: 0 6px 20px rgba(0,0,0,0.08); }}
  div[data-testid="stMetricLabel"] {{ font-size: 0.76rem !important; font-weight: 700 !important; text-transform: uppercase !important; letter-spacing: 0.5px !important; }}
  div[data-testid="stMetricValue"] {{ font-size: 1.5rem !important; font-weight: 800 !important; }}

  /* ── BUTTONS ── */
  .stButton > button {{ background: linear-gradient(135deg, #10B981 0%, #047857 100%) !important; color: white !important; font-family: 'Plus Jakarta Sans', sans-serif !important; font-weight: 700 !important; font-size: 0.95rem !important; border-radius: 12px !important; border: none !important; padding: 12px 24px !important; box-shadow: 0 4px 16px rgba(16,185,129,0.3) !important; transition: all 0.2s cubic-bezier(0.16,1,0.3,1) !important; }}
  .stButton > button:hover {{ transform: translateY(-2px) scale(1.02) !important; box-shadow: 0 8px 24px rgba(16,185,129,0.45) !important; }}
  
  /* ── SKELETON LOADER ── */
  .skeleton-box {{
    display: inline-block; height: 1em; position: relative; overflow: hidden; background-color: #E2E8F0; border-radius: 6px;
  }}
  .skeleton-box::after {{
    position: absolute; top: 0; right: 0; bottom: 0; left: 0; transform: translateX(-100%);
    background-image: linear-gradient(90deg, rgba(255,255,255,0) 0, rgba(255,255,255,0.4) 20%, rgba(255,255,255,0.6) 60%, rgba(255,255,255,0));
    animation: shimmer 1.5s infinite; content: '';
  }}
  @keyframes shimmer {{ 100% {{ transform: translateX(100%); }} }}
  .sk-block {{ width: 100%; height: 100px; margin-bottom: 12px; }}

  /* ── PREDICT RESULT ── */
  .predict-result {{ border-radius: 16px; padding: 20px 24px; margin-top: 16px; display: flex; align-items: center; gap: 16px; animation: popIn 0.4s cubic-bezier(0.16,1,0.3,1) both; }}
  @keyframes popIn {{ from {{ opacity: 0; transform: scale(0.92); }} to {{ opacity: 1; transform: scale(1); }} }}
  .predict-result-num {{ font-size: 3rem; font-weight: 800; line-height: 1; }}
  .predict-result-label {{ font-size: 0.9rem; font-weight: 600; }}
  .predict-result-sub {{ font-size: 0.78rem; margin-top: 2px; }}

  /* ── REC HIGHLIGHT ── */
  .rec-highlight {{ border-radius: 14px; padding: 20px 24px; display: flex; flex-direction: column; gap: 6px; animation: popIn 0.3s ease both; margin-top: 16px; }}
  .rec-big {{ font-size: 2.4rem; font-weight: 800; line-height: 1; }}
  .rec-label {{ font-size: 0.85rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.4px; }}
  .rec-sub {{ font-size: 0.8rem; margin-top: 2px; }}

  /* ── INFO CALLOUT ── */
  .info-callout {{ border-radius: 14px; padding: 16px 20px; font-size: 0.88rem; font-weight: 500; display: flex; align-items: center; gap: 10px; }}

  /* ── WORKFLOW BAR ── */
  .workflow-bar {{ display: flex; align-items: center; justify-content: center; gap: 0; margin: 8px 0 24px 0; flex-wrap: wrap; }}
  .wf-step {{ display: flex; align-items: center; gap: 6px; background: white; border: 1.5px solid #E2E8F0; border-radius: 30px; padding: 8px 18px; font-size: 0.82rem; font-weight: 700; color: #6B7280; transition: all 0.3s ease; white-space: nowrap; }}
  .wf-step.active {{ background: linear-gradient(135deg, #ECFDF5, #D1FAE5); border-color: #10B981; color: #047857; box-shadow: 0 4px 12px rgba(16,185,129,0.15); }}
  .wf-arrow {{ color: #D1D5DB; font-size: 1.1rem; padding: 0 4px; }}

  /* ── DIVIDER ── */
  .section-divider {{ height: 1px; background: linear-gradient(to right, transparent, #D1FAE5, #10B981, #D1FAE5, transparent); margin: 28px 0; border: none; }}

  /* ── SDG PILLS ── */
  .sdg-section {{ border-radius: 20px; padding: 28px; }}
  .sdg-title {{ font-size: 1.1rem; font-weight: 800; margin-bottom: 16px; display: flex; align-items: center; gap: 8px; }}
  .sdg-grid {{ display: flex; gap: 12px; flex-wrap: wrap; }}
  .sdg-pill {{ display: flex; align-items: center; gap: 8px; padding: 10px 16px; border-radius: 40px; font-size: 0.82rem; font-weight: 700; transition: transform 0.2s ease, box-shadow 0.2s ease; }}
  .sdg-pill:hover {{ transform: scale(1.04); box-shadow: 0 4px 16px rgba(0,0,0,0.1); }}
  .sdg-2  {{ background: #FEF3C7; color: #92400E; border: 1.5px solid #FCD34D; }}
  .sdg-12 {{ background: #FEE2E2; color: #991B1B; border: 1.5px solid #FCA5A5; }}
  .sdg-13 {{ background: #D1FAE5; color: #065F46; border: 1.5px solid #6EE7B7; }}
</style>
""", unsafe_allow_html=True)


# --- Load and Train (cached) ---
@st.cache_resource
def load_and_train():
    csv_path = os.path.join("data", "historical_meals.csv")
    if not os.path.exists(csv_path):
        df = save_synthetic_data(file_path=csv_path, num_records=500)
    else:
        df = pd.read_csv(csv_path)
    pipeline, metrics = train_replate_model(df)
    return df, pipeline, metrics

def load_lottieurl(url: str):
    r = requests.get(url)
    if r.status_code != 200:
        return None
    return r.json()

with st.spinner("Warming up RePlate prediction engine..."):
    df_historical, pipeline, model_metrics = load_and_train()
    lottie_loading = load_lottieurl("https://lottie.host/801aeb4b-14e3-4f93-bcde-510065f403f3/3o7hE5k5aO.json")
    lottie_chef = load_lottieurl("https://lottie.host/362a7848-18e0-4a87-adcd-eec128796f64/C0lqM5mC5a.json")

# Pre-compute global aggregate stats
_X_test_g  = model_metrics["X_test"]
_y_test_g  = model_metrics["y_test"]
_y_pred_g  = model_metrics["y_test_pred"]
_test_df_g = _X_test_g.copy()
_test_df_g["actual_diners"] = _y_test_g
_agg_g     = calculate_aggregate_surplus(_test_df_g, _y_pred_g, buffer_rate=0.03)

total_meals = len(df_historical)
sim_saved   = _agg_g["total_portions_saved"]
sim_redpct  = _agg_g["total_reduction_pct"]
sim_kg      = round(sim_saved * 0.35, 0)
sim_co2     = round(sim_saved * 0.6, 0)

# ===== SIDEBAR =====
with st.sidebar:
    st.markdown("<h2>🍲 RePlate Panel</h2>", unsafe_allow_html=True)
    st.markdown("<p style='font-size:0.85rem; color:gray;'>Smarter preparation</p>", unsafe_allow_html=True)
    
    st.markdown("<br>", unsafe_allow_html=True)
    nav_selection = st.radio(
        "Navigation",
        ["Home / Predict", "Surplus Marketplace", "Analytics Dashboard", "Historical Data"],
        label_visibility="collapsed"
    )
    
    st.markdown("<hr>", unsafe_allow_html=True)
    st.markdown("### ⚙️ Settings")
    theme_btn_text = "🌙 Switch to Dark Mode" if st.session_state.theme == "light" else "☀️ Switch to Light Mode"
    if st.button(theme_btn_text, use_container_width=True):
        toggle_theme()
        st.rerun()

    st.markdown("<br><br><br>", unsafe_allow_html=True)
    st.caption("RePlate MVP 1.0")

if nav_selection == "Home / Predict":
    # ===== HERO BANNER =====
    st.markdown(f"""
    <div class="hero-banner">
      <div class="hero-inner">
        <div>
          <div class="hero-logo-row">
            <span class="hero-emoji">&#127858;</span>
            <div>
              <div class="hero-title">RePlate</div>
              <div class="hero-tagline">Predict better. Prepare smarter. Waste less.</div>
            </div>
          </div>
        </div>
        <div class="hero-right">
          <div class="hero-badge">&#10024; 24-Hour Hackathon MVP</div>
          <div class="hero-sdg-badge">&#127759; SDG 2 &bull; SDG 12 &bull; SDG 13</div>
        </div>
      </div>
    </div>
    """, unsafe_allow_html=True)

    # ===== IMPACT STRIP =====
    st.markdown(f"""
    <div class="impact-strip">
      <div class="impact-card card-bg" style="animation-delay:0.05s">
        <div class="impact-icon">&#127869;</div>
        <div class="impact-num text-main">{total_meals:,}</div>
        <div class="impact-label text-sub">Historical Meals</div>
      </div>
      <div class="impact-card card-bg" style="animation-delay:0.1s">
        <div class="impact-icon">&#9989;</div>
        <div class="impact-num text-main">{int(sim_saved):,}</div>
        <div class="impact-label text-sub">Portions Saved (Sim)</div>
      </div>
      <div class="impact-card card-bg" style="animation-delay:0.15s">
        <div class="impact-icon">&#128200;</div>
        <div class="impact-num text-main">{sim_redpct:.1f}%</div>
        <div class="impact-label text-sub">Surplus Reduction</div>
      </div>
      <div class="impact-card card-bg" style="animation-delay:0.2s">
        <div class="impact-icon">&#9196;</div>
        <div class="impact-num text-main">{int(sim_kg):,} kg</div>
        <div class="impact-label text-sub">Food Waste Averted</div>
      </div>
      <div class="impact-card card-bg" style="animation-delay:0.25s">
        <div class="impact-icon">&#127807;</div>
        <div class="impact-num text-main">{int(sim_co2):,} kg</div>
        <div class="impact-label text-sub">CO&#8322; Eq. Saved</div>
      </div>
    </div>
    """, unsafe_allow_html=True)

    # ===== WORKFLOW BAR =====
    def _wf_bar(active_step: int):
        steps = [("01", "Predict"), ("02", "Prepare"), ("03", "Measure")]
        html = '<div class="workflow-bar">'
        for i, (num, label) in enumerate(steps):
            cls = "wf-step active" if i < active_step else "wf-step"
            html += f'<div class="{cls}">{num} {label}</div>'
            if i < len(steps) - 1:
                html += '<span class="wf-arrow">&#8594;</span>'
        html += "</div>"
        return html

    current_step = 1
    if st.session_state.predicted_diners is not None:
        current_step = 3

    st.markdown(_wf_bar(current_step), unsafe_allow_html=True)

    # ===== PRESETS =====
    st.markdown('<div class="text-sub" style="font-size:0.78rem; font-weight:700; text-transform:uppercase; margin-bottom:10px;">&#9889; Quick Scenario Presets</div>', unsafe_allow_html=True)
    col_p1, col_p2, col_p3, col_p4 = st.columns(4)
    preset_clicked = False
    selected_preset = None

    PRESETS = {
        "Sunday Biryani": {"meal_type": "Lunch",   "menu_category": "Biryani / Special", "expected_students": 520, "holiday": False, "exam_day": False},
        "Weekday Lunch":  {"meal_type": "Lunch",   "menu_category": "Standard",          "expected_students": 500, "holiday": False, "exam_day": False},
        "Exam Dinner":    {"meal_type": "Dinner",  "menu_category": "Comfort Food",      "expected_students": 480, "holiday": False, "exam_day": True},
        "Holiday Feast":  {"meal_type": "Lunch",   "menu_category": "Continental",       "expected_students": 250, "holiday": True,  "exam_day": False},
    }
    preset_icons = ["&#127822;", "&#129379;", "&#128221;", "&#127881;"]

    for col, (name, data), icon in zip([col_p1, col_p2, col_p3, col_p4], PRESETS.items(), preset_icons):
        with col:
            if st.button(f"{icon} {name}", use_container_width=True, key=f"preset_{name}"):
                preset_clicked = True
                selected_preset = data
                st.session_state.last_preset = name

    st.markdown('<hr class="section-divider">', unsafe_allow_html=True)

    # ==========================================================
    #  01  PREDICT
    # ==========================================================
    st.markdown("""
    <div class="flow-header">
      <span class="flow-step-badge">01 PREDICT</span>
      <span class="flow-title">Upcoming Meal Context</span>
      <span class="flow-icon">&#128300;</span>
    </div>
    """, unsafe_allow_html=True)

    with st.container():
        col1, col2, col3 = st.columns(3)

        with col1:
            meal_date   = st.date_input("Meal Date", value=date.today(), key="meal_date")
            day_of_week = meal_date.strftime("%A")
            st.caption(f"&#128197; Derived Day of Week: **{day_of_week}**")

        with col2:
            default_meal = selected_preset["meal_type"]        if selected_preset else "Lunch"
            default_menu = selected_preset["menu_category"]    if selected_preset else "Biryani / Special"
            meal_options = ["Breakfast", "Lunch", "Dinner"]
            menu_options = ["Standard", "Biryani / Special", "South Indian", "Continental", "Comfort Food"]
            meal_type     = st.selectbox("Meal Type",     meal_options, index=meal_options.index(default_meal), key="meal_type")
            menu_category = st.selectbox("Menu Category", menu_options, index=menu_options.index(default_menu), key="menu_cat")

        with col3:
            default_exp = selected_preset["expected_students"] if selected_preset else 500
            default_hol = selected_preset["holiday"]           if selected_preset else False
            default_exm = selected_preset["exam_day"]          if selected_preset else False
            expected_students = st.number_input(
                "Registered / Expected Population",
                min_value=50, max_value=2000, value=default_exp, step=10, key="exp_students"
            )
            col_cb1, col_cb2 = st.columns(2)
            with col_cb1:
                is_holiday = st.checkbox("Holiday", value=default_hol, key="is_holiday")
            with col_cb2:
                is_exam    = st.checkbox("Exam Day", value=default_exm, key="is_exam")

        st.markdown("<br>", unsafe_allow_html=True)
        predict_btn = st.button("&#128302; Predict Demand Forecast", use_container_width=True, key="predict_btn")

    ph_predict = st.empty()

    if predict_btn or preset_clicked:
        is_valid, err_msg = validate_prediction_inputs(expected_students, meal_type, menu_category)
        if not is_valid:
            st.error(err_msg)
        else:
            # SKELETON LOADER ANIMATION
            with ph_predict.container():
                st.markdown("""
                <div class="skeleton-box sk-block"></div>
                <div class="skeleton-box" style="width:60%; height:20px;"></div>
                """, unsafe_allow_html=True)
                time.sleep(1.2) # Simulate heavy AI load for UX

            input_payload = {
                "day_of_week":       day_of_week,
                "meal_type":         meal_type,
                "menu_category":     menu_category,
                "expected_students": expected_students,
                "holiday":           is_holiday,
                "exam_day":          is_exam,
            }
            pred_val = predict_demand(pipeline, input_payload)
            st.session_state.predicted_diners  = pred_val
            st.session_state.predicted_inputs  = input_payload
            st.session_state.prediction_count += 1
            st.rerun()

    if st.session_state.predicted_diners is not None:
        pred_round = round(st.session_state.predicted_diners)
        inp        = st.session_state.predicted_inputs
        delta_vs   = pred_round - inp["expected_students"]
        delta_sign = "+" if delta_vs >= 0 else ""
        ph_predict.markdown(f"""
        <div class="predict-result">
          <div class="predict-result-num">{pred_round}</div>
          <div>
            <div class="predict-result-label">&#128200; Predicted Diners for {inp['meal_type']} &bull; {inp['menu_category']}</div>
            <div class="predict-result-sub">{delta_sign}{delta_vs} vs registered ({inp['expected_students']}) &bull; Prediction #{st.session_state.prediction_count}</div>
          </div>
        </div>
        """, unsafe_allow_html=True)
    else:
        ph_predict.markdown("""
        <div class="info-callout">
          &#128161; Use a preset above or fill in the form and click <strong>Predict Demand Forecast</strong> to begin.
        </div>
        """, unsafe_allow_html=True)

    st.markdown('<hr class="section-divider">', unsafe_allow_html=True)

    # ==========================================================
    #  02  PREPARE
    # ==========================================================
    st.markdown("""
    <div class="flow-header">
      <span class="flow-step-badge">02 PREPARE</span>
      <span class="flow-title">Preparation Recommendation</span>
      <span class="flow-icon">&#127858;</span>
    </div>
    """, unsafe_allow_html=True)

    col_buf, col_blank = st.columns([1, 1])
    with col_buf:
        buffer_rate_pct = st.slider(
            "Operational Safety Buffer (%)",
            min_value=1.0, max_value=10.0, value=3.0, step=0.5,
            help="Small percentage added to prediction to protect against unexpected diner influx.",
            key="buffer_slider"
        ) / 100.0

    if st.session_state.predicted_diners is not None:
        pred_diners  = st.session_state.predicted_diners
        exp_students = st.session_state.predicted_inputs["expected_students"]
        rec_portions, buffer_count = calculate_recommendation(pred_diners, buffer_rate=buffer_rate_pct)
        naive_saving = max(0, exp_students - rec_portions)

        c_rec, c_lot = st.columns([3, 1])
        with c_rec:
            st.markdown(f"""
            <div class="rec-highlight">
              <div class="rec-label">&#127868; Recommended Portions to Prepare</div>
              <div class="rec-big">{rec_portions}</div>
              <div class="rec-sub">= {round(pred_diners)} predicted + {buffer_count} safety buffer ({buffer_rate_pct*100:.1f}%)</div>
            </div>
            """, unsafe_allow_html=True)
        with c_lot:
            if lottie_chef:
                st_lottie(lottie_chef, height=120, key="chef")

        st.markdown("<br>", unsafe_allow_html=True)
        col_m1, col_m2, col_m3, col_m4 = st.columns(4)
        with col_m1:
            st.metric("Baseline (100% Expected)",  f"{exp_students} students")
        with col_m2:
            st.metric("Predicted Diners",          f"{round(pred_diners)} diners", delta=f"{round(pred_diners) - exp_students:+d} vs baseline")
        with col_m3:
            st.metric("Recommended Portions",      f"{rec_portions} portions", delta=f"+{buffer_count} buffer")
        with col_m4:
            pct_reduced = (naive_saving / exp_students * 100) if exp_students > 0 else 0
            st.metric("Preparation Reduction",     f"{naive_saving} portions", delta=f"{pct_reduced:.1f}% fewer prepared")
    else:
        st.markdown("""
        <div class="info-callout">
          &#9203; Run a prediction first to see preparation recommendations.
        </div>
        """, unsafe_allow_html=True)

    st.markdown('<hr class="section-divider">', unsafe_allow_html=True)

    # ==========================================================
    #  03  MEASURE
    # ==========================================================
    st.markdown("""
    <div class="flow-header">
      <span class="flow-step-badge">03 MEASURE</span>
      <span class="flow-title">Post-Meal Outcomes &amp; Surplus Metrics</span>
      <span class="flow-icon">&#128202;</span>
    </div>
    """, unsafe_allow_html=True)

    col_input1, col_input2 = st.columns(2)
    with col_input1:
        actual_diners = st.number_input(
            "Actual Diners (recorded after meal)",
            min_value=0, max_value=2500,
            value=round(st.session_state.predicted_diners) if st.session_state.predicted_diners is not None else 460,
            step=1, key="actual_diners"
        )
    with col_input2:
        leftover_portions = st.number_input(
            "Leftover Portions (recorded after meal)",
            min_value=0, max_value=1000, value=18, step=1, key="leftovers"
        )

    btn_measure = st.button("Calculate Impact", use_container_width=True)

    if st.session_state.predicted_diners is not None and btn_measure:
        pred_val     = st.session_state.predicted_diners
        exp_students = st.session_state.predicted_inputs["expected_students"]
        rec_portions, _ = calculate_recommendation(pred_val, buffer_rate=buffer_rate_pct)

        is_valid, err_msg, warn_msg = validate_measurement_inputs(
            actual_diners=actual_diners, leftovers=leftover_portions, prepared_portions=rec_portions
        )
        if not is_valid:
            st.error(err_msg)
        else:
            if warn_msg:
                st.warning(warn_msg)

            abs_err, pct_err = calculate_single_error(actual_diners, pred_val)
            surplus_res = calculate_surplus_comparison(
                expected_students=exp_students,
                actual_diners=actual_diners,
                recommended_portions=rec_portions,
            )
            portions_saved = surplus_res["portions_saved"]
            kg_saved       = round(portions_saved * 0.35, 1)
            co2_saved      = round(portions_saved * 0.6, 1)

            if portions_saved > 0:
                st.balloons() # BALLOON CELEBRATION!

            col_res1, col_res2, col_res3, col_res4 = st.columns(4)
            with col_res1:
                st.metric("Prediction Error",   f"{abs_err:.0f} diners")
            with col_res2:
                st.metric("MAPE",               f"{pct_err:.2f}%")
            with col_res3:
                st.metric("Baseline Surplus",   f"{surplus_res['baseline_surplus']} portions")
            with col_res4:
                st.metric("RePlate Surplus",    f"{surplus_res['current_surplus']} portions",
                          delta=f"-{portions_saved} saved", delta_color="inverse")

            if portions_saved > 0:
                st.markdown(f"""
                <div style="background: linear-gradient(135deg, #064E3B 0%, #065F46 100%); border-radius: 20px; padding: 32px; color: white; text-align: center; margin-top:16px;">
                  <div style="font-size:0.85rem;font-weight:700;opacity:0.7;text-transform:uppercase;letter-spacing:1px;margin-bottom:8px;">
                    &#127807; RePlate Impact This Meal
                  </div>
                  <div style="font-size: 3.5rem; font-weight: 800; line-height: 1; color: #6EE7B7; margin-bottom: 4px;">{portions_saved}</div>
                  <div style="font-size: 1rem; opacity: 0.85; font-weight: 500;">portions saved vs naive baseline</div>
                  <div style="display:flex;gap:32px;justify-content:center;margin-top:20px;flex-wrap:wrap;">
                    <div><div style="font-size:1.5rem;font-weight:800;color:#6EE7B7;">{kg_saved} kg</div><div style="font-size:0.75rem;opacity:0.7;">Food Waste Averted</div></div>
                    <div><div style="font-size:1.5rem;font-weight:800;color:#6EE7B7;">{co2_saved} kg CO&#8322;</div><div style="font-size:0.75rem;opacity:0.7;">Emissions Equivalent</div></div>
                  </div>
                </div>
                """, unsafe_allow_html=True)
    elif st.session_state.predicted_diners is None:
        st.markdown("""
        <div class="info-callout">
          &#128161; Complete the Predict step first to unlock post-meal measurement.
        </div>
        """, unsafe_allow_html=True)



elif nav_selection == "Surplus Marketplace":
    # ==========================================================
    #  MARKETPLACE
    # ==========================================================
    st.markdown("<h2>🛒 Surplus Food Marketplace</h2>", unsafe_allow_html=True)
    st.markdown("Add food → Find food → Take action → Reduce waste.")
    st.markdown('<hr class="section-divider">', unsafe_allow_html=True)
    
    col_market_add, col_market_view = st.columns([1, 2], gap="large")
    
    with col_market_add:
        st.markdown("#### ➕ Add Available Food")
        st.markdown("Provider: List extra food available for pickup.")
        with st.form("add_food_form", clear_on_submit=True):
            f_title = st.text_input("Food Item", placeholder="e.g., Leftover Lunch Biryani")
            f_qty = st.number_input("Quantity (portions)", min_value=1, value=5)
            f_loc = st.text_input("Location", placeholder="e.g., Cafeteria A")
            f_time = st.text_input("Available Until", placeholder="e.g., 4:00 PM")
            submit_add = st.form_submit_button("List Food", use_container_width=True)
            
            if submit_add:
                if f_title and f_loc and f_time:
                    new_item = {
                        "id": st.session_state.next_listing_id,
                        "title": f_title,
                        "quantity": f_qty,
                        "location": f_loc,
                        "time": f_time
                    }
                    st.session_state.surplus_listings.append(new_item)
                    st.session_state.my_added_items.append(new_item["id"])
                    st.session_state.next_listing_id += 1
                    st.success(f"Added {f_qty} portions of {f_title}!")
                    time.sleep(0.5)
                    st.rerun()
                else:
                    st.error("Please fill all fields.")
                    
    with col_market_view:
        st.markdown("#### 🍲 Available Food (Take Action)")
        if len(st.session_state.surplus_listings) == 0:
            st.info("No surplus food currently available. Great job on zero waste!")
        else:
            for item in st.session_state.surplus_listings:
                with st.container():
                    st.markdown(f'''
                    <div class="card-bg" style="border-radius:12px; padding:16px; margin-bottom:12px; display:flex; justify-content:space-between; align-items:center;">
                        <div>
                            <div style="font-size:1.1rem; font-weight:700;" class="text-main">{item["title"]}</div>
                            <div style="font-size:0.85rem;" class="text-sub">📍 {item["location"]} &nbsp;&bull;&nbsp; ⏰ Until {item["time"]}</div>
                        </div>
                        <div style="text-align:right;">
                            <div style="font-size:1.5rem; font-weight:800;" class="text-main">{item["quantity"]}</div>
                            <div style="font-size:0.75rem; text-transform:uppercase; font-weight:700;" class="text-sub">portions</div>
                        </div>
                    </div>
                    ''', unsafe_allow_html=True)
                    
                    if item["id"] in st.session_state.my_added_items:
                        st.button(f"Listed by You", key=f"claim_{item['id']}", disabled=True, use_container_width=True)
                    else:
                        if st.button(f"Claim Food (ID: {item['id']})", key=f"claim_{item['id']}", use_container_width=True):
                            # Remove item from state
                            st.session_state.surplus_listings = [x for x in st.session_state.surplus_listings if x["id"] != item["id"]]
                            st.balloons()
                            st.success(f"Successfully claimed {item['quantity']} portions of {item['title']}! Thank you for reducing waste.")
                            time.sleep(1.5)
                            st.rerun()

elif nav_selection == "Analytics Dashboard":

    # ==========================================================
    #  04  ANALYTICS DASHBOARD
    # ==========================================================
    st.markdown("<h2>📈 RePlate Analytics Dashboard</h2>", unsafe_allow_html=True)
    st.markdown("Monitor model performance and aggregate simulation impact.")
    st.markdown('<hr class="section-divider">', unsafe_allow_html=True)

    col_m_info1, col_m_info2 = st.columns(2)

    with col_m_info1:
        st.markdown(f"""
        <div class="card-bg" style="border-radius:14px;padding:20px;">
          <h4 style="margin-top:0;" class="text-main">&#128202; Model Evaluation (Held-out Test Set)</h4>
          <p style="margin:0 0 8px 0;font-size:0.85rem;" class="text-sub"><b>Architecture:</b> Linear Regression + One-Hot Categorical Pipeline</p>
          <ul style="line-height:2;font-size:0.88rem;">
            <li><b>MAE:</b> <code>{model_metrics['mae']:.2f} diners</code></li>
            <li><b>MAPE:</b> <code>{model_metrics['mape']:.2f}%</code></li>
            <li><b>Train / Test Split:</b> {model_metrics['train_size']} / {model_metrics['test_size']} meals</li>
          </ul>
        </div>
        """, unsafe_allow_html=True)

    with col_m_info2:
        st.markdown(f"""
        <div class="card-bg" style="border-radius:14px;padding:20px;">
          <h4 style="margin-top:0;" class="text-main">&#127807; Aggregate Simulated Impact</h4>
          <p style="margin:0 0 8px 0;font-size:0.85rem;" class="text-sub">Baseline vs RePlate Forecast + 3.0% Buffer:</p>
          <ul style="line-height:2;font-size:0.88rem;">
            <li><b>Total Baseline Surplus:</b> <code>{_agg_g['total_baseline_surplus']} portions</code></li>
            <li><b>Total RePlate Surplus:</b> <code>{_agg_g['total_replate_surplus']} portions</code></li>
            <li><b>Portions Saved:</b> <code class="text-main" style="font-weight:bold;">{_agg_g['total_portions_saved']} portions</code></li>
            <li><b>Surplus Reduction:</b> <code class="text-main" style="font-weight:bold;">{_agg_g['total_reduction_pct']:.1f}%</code></li>
          </ul>
        </div>
        """, unsafe_allow_html=True)

    st.markdown("<br><h4>&#128202; Historical Test Dataset Visualizations</h4>", unsafe_allow_html=True)

    try:
        import plotly.graph_objects as go
        tab1, tab2 = st.tabs(["&#128200; Predicted vs Actual Diners", "&#128201; Surplus Comparison"])
        y_test_arr = _y_test_g
        y_pred_arr = _y_pred_g

        with tab1:
            sample_idx = list(range(min(40, len(y_test_arr))))
            fig1 = go.Figure()
            fig1.add_trace(go.Scatter(
                x=sample_idx, y=y_test_arr.values[:40],
                mode='lines+markers', name='Actual Diners',
                line=dict(color='#3B82F6', width=3), marker=dict(size=7)
            ))
            fig1.add_trace(go.Scatter(
                x=sample_idx, y=np.round(y_pred_arr[:40]),
                mode='lines+markers', name='Predicted Diners',
                line=dict(color='#10B981', width=2, dash='dash'), marker=dict(size=6)
            ))
            rec_sample = np.ceil(y_pred_arr[:40] * (1.0 + 0.03))
            fig1.add_trace(go.Scatter(
                x=sample_idx, y=rec_sample,
                mode='lines', name='Recommended Portions (with Buffer)',
                line=dict(color='#F59E0B', width=2, dash='dot')
            ))
            fig1.update_layout(
                title="Actual vs Predicted Demand vs Recommended Preparation (40 Meals)",
                xaxis_title="Meal Index", yaxis_title="Diners / Portions",
                template="plotly_dark" if st.session_state.theme == "dark" else "plotly_white", height=420,
                margin=dict(l=20, r=20, t=50, b=20),
                legend=dict(orientation="h", yanchor="bottom", y=1.02, xanchor="right", x=1)
            )
            st.plotly_chart(fig1, use_container_width=True)

        with tab2:
            baseline_s = _agg_g["baseline_series"][:40]
            replate_s  = _agg_g["replate_series"][:40]
            fig2 = go.Figure()
            fig2.add_trace(go.Bar(x=sample_idx, y=baseline_s, name='Baseline Surplus', marker_color='#EF4444'))
            fig2.add_trace(go.Bar(x=sample_idx, y=replate_s,  name='RePlate Surplus',  marker_color='#10B981'))
            fig2.update_layout(
                barmode='group',
                title=f"Meal-by-Meal Surplus: Baseline vs RePlate ({_agg_g['total_reduction_pct']:.1f}% Overall Reduction)",
                xaxis_title="Meal Index", yaxis_title="Surplus Portions",
                template="plotly_dark" if st.session_state.theme == "dark" else "plotly_white", height=420,
                margin=dict(l=20, r=20, t=50, b=20),
                legend=dict(orientation="h", yanchor="bottom", y=1.02, xanchor="right", x=1)
            )
            st.plotly_chart(fig2, use_container_width=True)
    except ImportError:
        pass


elif nav_selection == "Historical Data":
    # ==========================================================
    #  HISTORICAL DATA GRID (AgGrid)
    # ==========================================================
    st.markdown("<h2>📋 Historical Meal Data</h2>", unsafe_allow_html=True)
    st.markdown("Explore, filter, and sort the raw historical logs that power the RePlate model.")
    
    st.markdown("<br>", unsafe_allow_html=True)
    
    # Configure AgGrid
    gb = GridOptionsBuilder.from_dataframe(df_historical)
    gb.configure_pagination(paginationAutoPageSize=False, paginationPageSize=15)
    gb.configure_default_column(editable=False, groupable=True, sortable=True, filter=True)
    grid_options = gb.build()

    theme_ag = "alpine" if st.session_state.theme == "light" else "balham-dark"
    AgGrid(
        df_historical,
        gridOptions=grid_options,
        theme=theme_ag,
        height=600,
        fit_columns_on_grid_load=True,
    )

# ===== FOOTER =====
st.markdown("""
<div style="text-align: center; padding: 24px 0 8px 0; font-size: 0.8rem; color: #9CA3AF; border-top: 1px solid #E5E7EB; margin-top: 32px;">
  <strong>RePlate</strong> Premium Dashboard &mdash; Built with Streamlit
</div>
""", unsafe_allow_html=True)
