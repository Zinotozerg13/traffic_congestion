import joblib
import pandas as pd
from datetime import datetime

from rest_framework.decorators import api_view
from rest_framework.response import Response

from .models import TrafficPrediction   # ✅ import model

# Load models
cong_model = joblib.load(r"..\ml\congestion_prediction_model101.pkl")
time_model = joblib.load(r"..\ml\traffic_congestion_model101.pkl")


@api_view(["POST"])
def predict_traffic(request):

    # ---- raw inputs from frontend ----
    distance  = float(request.data.get("distance_km", 10))
    time_hr   = float(request.data.get("time_in_hours", 12))
    road_type = request.data.get("road_type", "congested")
    weather   = request.data.get("weather", "Clear")
    date_str  = request.data.get("date")

    # ---- extract day_of_week and month from date ----
    if date_str:
        date_obj     = datetime.strptime(date_str, "%Y-%m-%d")
        day_of_week  = date_obj.strftime("%A")
        month        = date_obj.month
        day_of_month = date_obj.day
    else:
        today        = datetime.now()
        day_of_week  = today.strftime("%A")
        month        = today.month
        day_of_month = today.day
        date_obj     = today

    # ---- build base input frames ----
    X_cong = pd.DataFrame([[0] * len(cong_model.feature_names_in_)],
                          columns=cong_model.feature_names_in_)

    X_time = pd.DataFrame([[0] * len(time_model.feature_names_in_)],
                          columns=time_model.feature_names_in_)

    # ---- fill congestion model ----
    X_cong["distance_km"]   = distance
    X_cong["time_in_hours"] = time_hr

    road_col = f"road_type_{road_type}"
    if road_col in X_cong.columns:
        X_cong[road_col] = 1

    day_col = f"day_of_week_{day_of_week}"
    if day_col in X_cong.columns:
        X_cong[day_col] = 1

    weather_col = f"weather_{weather}"
    if weather_col in X_cong.columns:
        X_cong[weather_col] = 1

    if "month" in X_cong.columns:
        X_cong["month"] = month

    if "day_of_month" in X_cong.columns:
        X_cong["day_of_month"] = day_of_month

    # ---- fill travel time model ----
    X_time["distance_km"]   = distance
    X_time["time_in_hours"] = time_hr

    road_col = f"road_type_{road_type}"
    if road_col in X_time.columns:
        X_time[road_col] = 1

    day_col = f"day_of_week_{day_of_week}"
    if day_col in X_time.columns:
        X_time[day_col] = 1

    weather_col = f"weather_{weather}"
    if weather_col in X_time.columns:
        X_time[weather_col] = 1

    if "month" in X_time.columns:
        X_time["month"] = month

    if "day_of_month" in X_time.columns:
        X_time["day_of_month"] = day_of_month

    # ---- step 1: predict congestion ----
    pred_cong = cong_model.predict(X_cong)[0]

    # ---- step 2: pass congestion to time model ----
    if "congestion_index" in X_time.columns:
        X_time["congestion_index"] = pred_cong

    # ---- step 3: predict travel time ----
    pred_time = time_model.predict(X_time)[0]

    # ---- save to database ----
    TrafficPrediction.objects.create(
        distance_km=distance,
        time_in_hours=time_hr,
        road_type=road_type,
        weather=weather,
        date=date_obj.date(),
        congestion_index=float(pred_cong),
        travel_time_minutes=float(pred_time),
    )

    # ---- return response ----
    return Response({
        "congestion_index": round(float(pred_cong), 3),
        "travel_time_minutes": round(float(pred_time), 1),
    })