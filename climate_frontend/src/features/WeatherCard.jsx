import React from "react"

const cardStyle = {
  position: "absolute",
  top: "20px",
  right: "20px",
  zIndex: 10000,
  background: "white",
  borderRadius: "12px",
  padding: "16px",
  boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
  minWidth: "180px",
}

const buttonStyle = {
  display: "block",
  width: "100%",
  padding: "8px",
  marginBottom: "6px",
  border: "none",
  borderRadius: "6px",
  background: "#f0f0f0",
  cursor: "pointer",
  fontWeight: "500",
}

function WeatherCard({ onToggle }) {
  return (
    <div style={cardStyle}>
      <h3 style={{ marginBottom: "12px" }}>Weather Layers</h3>
      <button style={buttonStyle} onClick={() => onToggle("temp")}>
        🌡️ Temperature
      </button>
      <button style={buttonStyle} onClick={() => onToggle("clouds")}>
        ☁️ Clouds
      </button>
      <button style={buttonStyle} onClick={() => onToggle("precipitation")}>
        🌧️ Precipitation
      </button>
      <button style={buttonStyle} onClick={() => onToggle("wind")}>
        💨 Wind
      </button>
    </div>
  )
}

export default WeatherCard