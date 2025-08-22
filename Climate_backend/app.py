from fastapi.middleware.cors import CORSMiddleware

from chatbot import climate_chatbot

from fastapi import FastAPI
from pydantic import BaseModel
import requests
from ai_logic import ai_predict_temp, drought_flood_risk, crop_advisory
# from chatbot import climate_chatbot   # optional, for chatbot mode

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   # or ["http://localhost:3000"] if you want stricter
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- OpenWeather API (fill in later) ---
API_KEY = "b802fad1e811283bad7482f0456b943e"
@app.get("/")
def root():
    return {"message": "AI Climate Resilience API Running"}

@app.get("/predict/{city}")
def predict(city: str):
    """Fetch predictions for a given city"""
    url = f"http://api.openweathermap.org/data/2.5/weather?q={city}&appid={API_KEY}&units=metric"
    res = requests.get(url).json()

    if "main" not in res:  # invalid city handling
        return {"error": f"City '{city}' not found or API error."}

    temp = res["main"]["temp"]
    rainfall = res.get("rain", {}).get("1h", 0)   # last 1 hr rainfall (mm)

    # AI Predictions
    ai_temp = ai_predict_temp()
    # ai_rain = ai_predict_rain()

    # Risk & Advisory
    risk = drought_flood_risk(rainfall, temp)
    advisory = crop_advisory(rainfall, temp)

    return {
        "city": city.capitalize(),
        "openweather_temp": temp,
        "ai_predicted_temp": ai_temp,
        "rainfall_mm": rainfall,
        "risk": risk,
        "advisory": advisory
    }
# ----------- Chatbot Feature (Optional) -----------
class ChatRequest(BaseModel):
    message: str
    mode: str = "general"  # "general", "farmer", "urban"

@app.post("/chat")
def chat(req: ChatRequest):
    reply = climate_chatbot(req.message, req.mode)
    return {"response": reply}
