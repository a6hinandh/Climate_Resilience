import numpy as np
from sklearn.linear_model import LinearRegression
from sklearn.preprocessing import PolynomialFeatures

# --- Historical Mock Data (replace with real DB/API later) ---
days = np.arange(1, 8).reshape(-1, 1)   # last 7 days
temps = np.array([28, 29, 30, 32, 31, 33, 34])  # daily avg temps
rainfall = np.array([5, 8, 12, 0, 2, 15, 25])   # daily rainfall in mm

# --- Polynomial Regression for Temperature ---
poly = PolynomialFeatures(degree=2)
X_poly = poly.fit_transform(days)
temp_model = LinearRegression().fit(X_poly, temps)

# --- Linear Regression for Rainfall (simpler model) ---
rain_model = LinearRegression().fit(days, rainfall)

def ai_predict_temp(day: int = 8) -> float:
    """Predict temperature using Polynomial Regression"""
    return float(temp_model.predict(poly.transform([[day]]))[0])

# def ai_predict_rain(day: int = 8) -> float:
#     """Predict rainfall using Linear Regression"""
#     return max(0.0, float(rain_model.predict([[day]])[0]))  # no negative rainfall

def drought_flood_risk(rainfall: float, temp: float) -> str:
    """Improved risk classification using both rainfall & temp"""
    if rainfall > 60:
        return "⚠️ High Flood Risk: Very heavy rain expected. Ensure drainage & flood safety."
    elif rainfall > 30:
        return "🌧️ Moderate Flood Risk: Significant rain, monitor waterlogging."
    elif rainfall < 5 and temp > 33:
        return "🔥 High Drought Risk: Hot & dry conditions, conserve water."
    elif 5 <= rainfall < 15 and temp > 30:
        return "🌡️ Moderate Drought Risk: Limited rainfall with high temp."
    else:
        return "✅ Low Risk: Stable climate conditions."

def crop_advisory(rainfall: float, temp: float) -> str:
    """Smarter crop advisory based on conditions"""
    if 20 < rainfall < 80 and 22 < temp < 30:
        return "🌾 Good conditions for Rice, Maize, or Groundnut."
    elif temp > 32 and rainfall < 10:
        return "🌱 Recommend drought-resistant crops (Millets, Pulses)."
    elif rainfall > 50:
        return "🌿 Excess rainfall → focus on Paddy or Sugarcane. Ensure drainage."
    elif 15 <= rainfall <= 30 and 25 <= temp <= 32:
        return "🥬 Ideal for Vegetables, Short-duration pulses."
    else:
        return "🌍 Mixed conditions → use balanced cropping strategy, consult local experts."
