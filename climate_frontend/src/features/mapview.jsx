import React, { useEffect, useState } from "react"
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
} from "react-leaflet"
import "leaflet/dist/leaflet.css"
import { Sun, Cloud, CloudRain, Wind, ChevronDown, ChevronUp, MapPin, Thermometer, Droplets, Gauge } from "lucide-react"
import "./MapView.css"
import L from "leaflet";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});


const API_KEY = import.meta.env.VITE_REACT_APP_OPENWEATHER_KEY;
const API_BASE = import.meta.env.VITE_REACT_APP_API_BASE || "http://127.0.0.1:8000";

const ClickHandler = ({ setWeatherInfo }) => {
  useMapEvents({
    click: async (e) => {
      const { lat, lng } = e.latlng
      try {
        const res = await fetch(
  `${API_BASE}/weather/coords?lat=${lat}&lon=${lng}`
)

        const data = await res.json()
        setWeatherInfo({
          lat,
          lng,
          temp: data.main.temp,
          humidity: data.main.humidity,
          wind: data.wind.speed,
          desc: data.weather[0].description,
          location: data.name,
        })
      } catch (err) {
        console.error("Failed to fetch weather data:", err)
      }
    },
  })
  return null
}

const MapView = () => {
  const [userPosition, setUserPosition] = useState([20, 77])
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

  const getWeatherIcon = (temp) => {
    if (temp > 25) return "☀️"
    if (temp > 15) return "⛅"
    if (temp > 5) return "☁️"
    return "❄️"
  }

  return (
    <div className="map-wrapper">
      {/* MAP */}
      <MapContainer
        center={userPosition}
        zoom={5}
        className="map-container"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />

        {activeLayers.temp && (
          <TileLayer url={`${API_BASE}/tiles/temp_new/{z}/{x}/{y}.png`} />
        )}
        {activeLayers.clouds && (
          <TileLayer url={`${API_BASE}/tiles/clouds_new/{z}/{x}/{y}.png`} />
        )}
        {activeLayers.precipitation && (
          <TileLayer url={`${API_BASE}/tiles/precipitation_new/{z}/{x}/{y}.png`} />
        )}
        {activeLayers.wind && (
          <TileLayer url={`${API_BASE}/tiles/wind_new/{z}/{x}/{y}.png`} />
        )}

        <Marker position={userPosition}>
          <Popup className="custom-popup">
            <div className="popup-content">
              <MapPin size={16} />
              <span>You are here</span>
            </div>
          </Popup>
        </Marker>

        <ClickHandler setWeatherInfo={setWeatherInfo} />

        {weatherInfo && (
          <Marker position={[weatherInfo.lat, weatherInfo.lng]}>
            <Popup className="custom-popup weather-popup">
              <div className="weather-popup-content">
                <div className="weather-header">
                  <span className="weather-icon">{getWeatherIcon(weatherInfo.temp)}</span>
                  <div>
                    <h4>{weatherInfo.location}</h4>
                    <p>{weatherInfo.desc}</p>
                  </div>
                </div>
                <div className="weather-details">
                  <div className="weather-detail">
                    <Thermometer size={14} />
                    <span>{Math.round(weatherInfo.temp)}°C</span>
                  </div>
                  <div className="weather-detail">
                    <Droplets size={14} />
                    <span>{weatherInfo.humidity}%</span>
                  </div>
                  <div className="weather-detail">
                    <Wind size={14} />
                    <span>{Math.round(weatherInfo.wind * 3.6)} km/h</span>
                  </div>
                </div>
              </div>
            </Popup>
          </Marker>
        )}
      </MapContainer>

      {/* WEATHER LAYERS PANEL */}
      <div className={`weather-panel ${collapsed ? 'collapsed' : ''}`}>
        <div className="panel-header" onClick={() => setCollapsed(!collapsed)}>
          <h3>Weather Layers</h3>
          <div className="collapse-icon">
            {collapsed ? <ChevronDown size={20} /> : <ChevronUp size={20} />}
          </div>
        </div>

        <div className="panel-content">
          {[
            { key: "temp", label: "Temperature", icon: <Sun size={18} />, color: "#ff6b35" },
            { key: "clouds", label: "Clouds", icon: <Cloud size={18} />, color: "#74c0fc" },
            { key: "precipitation", label: "Precipitation", icon: <CloudRain size={18} />, color: "#339af0" },
            { key: "wind", label: "Wind", icon: <Wind size={18} />, color: "#69db7c" },
          ].map(({ key, label, icon, color }) => (
            <label key={key} className="layer-toggle">
              <div className="layer-info">
                <span className="layer-icon" style={{ color }}>
                  {icon}
                </span>
                <span className="layer-label">{label}</span>
              </div>
              <div className="toggle-switch">
                <input
                  type="checkbox"
                  checked={activeLayers[key]}
                  onChange={() => toggleLayer(key)}
                />
                <span className="slider"></span>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* TEMPERATURE LEGEND */}
      {activeLayers.temp && (
        <div className="temperature-legend">
          <div className="legend-header">
            <Thermometer size={16} />
            <span>Temperature (°C)</span>
          </div>
          <div className="legend-gradient"></div>
          <div className="legend-labels">
            <span>-30</span>
            <span>0</span>
            <span>30</span>
            <span>50+</span>
          </div>
        </div>
      )}

      {/* WEATHER INFO CARD */}
      {weatherInfo && (
        <div className="weather-info-card">
          <div className="weather-info-header">
            <span className="weather-info-icon">{getWeatherIcon(weatherInfo.temp)}</span>
            <div>
              <h4>{weatherInfo.location}</h4>
              <p>{weatherInfo.desc}</p>
            </div>
          </div>
          <div className="weather-info-grid">
            <div className="weather-info-item">
              <Thermometer size={16} />
              <span className="value">{Math.round(weatherInfo.temp)}°C</span>
              <span className="label">Temperature</span>
            </div>
            <div className="weather-info-item">
              <Droplets size={16} />
              <span className="value">{weatherInfo.humidity}%</span>
              <span className="label">Humidity</span>
            </div>
            <div className="weather-info-item">
              <Wind size={16} />
              <span className="value">{Math.round(weatherInfo.wind * 3.6)}</span>
              <span className="label">km/h</span>
            </div>
            <div className="weather-info-item">
              <Gauge size={16} />
              <span className="value">{Math.round(weatherInfo.lat * 100) / 100}</span>
              <span className="label">Latitude</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default MapView