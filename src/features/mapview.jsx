import React, { useEffect, useState } from "react"
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
} from "react-leaflet"
import "leaflet/dist/leaflet.css"
import { Sun, Cloud, CloudRain, Wind, ChevronDown, ChevronUp } from "lucide-react"

const API_KEY = "d6671a51473de1e27fed731dbd9f5127"

const ClickHandler = ({ setWeatherInfo }) => {
  useMapEvents({
    click: async (e) => {
      const { lat, lng } = e.latlng
      try {
        const res = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${API_KEY}&units=metric`
        )
        const data = await res.json()
        setWeatherInfo({
          lat,
          lng,
          temp: data.main.temp,
          humidity: data.main.humidity,
          wind: data.wind.speed,
          desc: data.weather[0].description,
        })
      } catch (err) {
        console.error("Failed to fetch weather data:", err)
      }
    },
  })
  return null
}

const MapView = () => {
  const [userPosition, setUserPosition] = useState([20, 77]) // default India center
  const [activeLayers, setActiveLayers] = useState({
    temp: false,
    clouds: false,
    precipitation: false,
    wind: false,
  })
  const [collapsed, setCollapsed] = useState(false)
  const [weatherInfo, setWeatherInfo] = useState(null)

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserPosition([pos.coords.latitude, pos.coords.longitude])
      },
      () => console.warn("Could not get location")
    )
  }, [])

  const toggleLayer = (layer) => {
    setActiveLayers((prev) => ({ ...prev, [layer]: !prev[layer] }))
  }

  return (
    <div className="relative h-screen w-screen">
      {/* MAP */}
      <MapContainer
        center={userPosition}
        zoom={5}
        style={{ height: "100vh", width: "100vw", zIndex: 0 }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />

        {activeLayers.temp && (
          <TileLayer
            url={`https://tile.openweathermap.org/map/temp_new/{z}/{x}/{y}.png?appid=${API_KEY}`}
          />
        )}
        {activeLayers.clouds && (
          <TileLayer
            url={`https://tile.openweathermap.org/map/clouds_new/{z}/{x}/{y}.png?appid=${API_KEY}`}
          />
        )}
        {activeLayers.precipitation && (
          <TileLayer
            url={`https://tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png?appid=${API_KEY}`}
          />
        )}
        {activeLayers.wind && (
          <TileLayer
            url={`https://tile.openweathermap.org/map/wind_new/{z}/{x}/{y}.png?appid=${API_KEY}`}
          />
        )}

        <Marker position={userPosition}>
          <Popup>You are here</Popup>
        </Marker>

        <ClickHandler setWeatherInfo={setWeatherInfo} />

        {weatherInfo && (
          <Marker position={[weatherInfo.lat, weatherInfo.lng]}>
            <Popup>
              <div>
                <strong>{weatherInfo.desc}</strong>
                <br />
                🌡 Temp: {weatherInfo.temp}°C
                <br />
                💧 Humidity: {weatherInfo.humidity}%
                <br />
                🌬 Wind: {weatherInfo.wind} m/s
              </div>
            </Popup>
          </Marker>
        )}
      </MapContainer>

      {/* COLLAPSIBLE CARD */}
      <div
        style={{
          position: "absolute",
          top: "20px",
          right: "20px",
          zIndex: 9999,
          background: "white",
          padding: "16px",
          borderRadius: "12px",
          boxShadow: "0px 4px 12px rgba(0,0,0,0.2)",
          width: "220px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            cursor: "pointer",
          }}
          onClick={() => setCollapsed(!collapsed)}
        >
          <h3 style={{ fontWeight: "600" }}>Weather Layers</h3>
          {collapsed ? <ChevronDown /> : <ChevronUp />}
        </div>

        {!collapsed && (
          <div style={{ marginTop: "12px" }}>
            {[
              { key: "temp", label: "Temperature", icon: <Sun size={18} /> },
              { key: "clouds", label: "Clouds", icon: <Cloud size={18} /> },
              {
                key: "precipitation",
                label: "Precipitation",
                icon: <CloudRain size={18} />,
              },
              { key: "wind", label: "Wind", icon: <Wind size={18} /> },
            ].map(({ key, label, icon }) => (
              <label
                key={key}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: "8px",
                  cursor: "pointer",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  {icon} {label}
                </div>
                <input
                  type="checkbox"
                  checked={activeLayers[key]}
                  onChange={() => toggleLayer(key)}
                />
              </label>
            ))}
          </div>
        )}
      </div>

      {/* LEGEND (TEMP KEY) */}
      {activeLayers.temp && (
        <div
          style={{
            position: "absolute",
            bottom: "20px",
            right: "20px",
            zIndex: 9999,
            background: "white",
            padding: "10px",
            borderRadius: "8px",
            boxShadow: "0px 4px 12px rgba(0,0,0,0.2)",
          }}
        >
          <h4 style={{ fontSize: "14px", marginBottom: "6px" }}>Temp (°C)</h4>
          <div
            style={{
              width: "200px",
              height: "12px",
              background:
                "linear-gradient(to right, #0000ff, #00ffff, #00ff00, #ffff00, #ff0000)",
              borderRadius: "6px",
            }}
          />
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: "12px",
              marginTop: "4px",
            }}
          >
            <span>-30</span>
            <span>0</span>
            <span>30</span>
            <span>50+</span>
          </div>
        </div>
      )}
    </div>
  )
}

export default MapView