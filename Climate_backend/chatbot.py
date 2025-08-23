import google.generativeai as genai
import os

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
def climate_chatbot(message: str, mode: str = "general"):
    # Add context depending on mode
    if mode == "farmer":
        system_prompt = (
            "You are a helpful assistant for farmers. "
            "Provide irrigation tips, crop advice, and weather-based guidance. "
            "Keep answers short and practical."
        )
    elif mode == "urban":
        system_prompt = (
            "You are a helpful assistant for urban users. "
            "Provide air quality info, health, and lifestyle guidance."
        )
    else:
        system_prompt = "You are a climate assistant. Answer general climate and weather questions."

    # Create model
    model = genai.GenerativeModel("gemini-1.5-flash")


    # Generate response
    response = model.generate_content(f"{system_prompt}\nUser: {message}\nAssistant:")
    return response.text
