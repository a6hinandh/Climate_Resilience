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
import L from "leaflet"

// Fix Leaflet default icons
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png"
import markerIcon from "leaflet/dist/images/marker-icon.png"
import markerShadow from "leaflet/dist/images/marker-shadow.png"

delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
})

// Environment variables with fallbacks
const API_KEY = import.meta.env.VITE_OPENWEATHER_KEY || process.env.VITE_OPENWEATHER_KEY
const API_BASE = import.meta.env.VITE_API_BASE || process.env.VITE_API_BASE || "https://your-render-app.onrender.com"

const ClickHandler = ({ setWeatherInfo }) => {
  useMapEvents({
    click: async (e) => {
      const { lat, lng } = e.latlng
      try {
        const res = await fetch(
          `${API_BASE}/weather/coords?lat=${lat}&lon=${lng}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          }
        )

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`)
        }

        const data = await res.json()
        
        if (data && data.main && data.weather && data.weather[0]) {
          setWeatherInfo({
            lat,
            lng,
            temp: data.main.temp,
            humidity: data.main.humidity,
            wind: data.wind?.speed || 0,
            desc: data.weather[0].description,
            location: data.name || 'Unknown Location',
          })
        }
      } catch (err) {
        console.error("Failed to fetch weather data:", err)
        // Optionally show user-friendly error
        setWeatherInfo({
          lat,
          lng,
          temp: 'N/A',
          humidity: 'N/A',
          wind: 'N/A',
          desc: 'Weather data unavailable',
          location: 'Unknown Location',
        })
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
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (navigator.geolocation) {
      setIsLoading(true)
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserPosition([pos.coords.latitude, pos.coords.longitude])
          setIsLoading(false)
        },
        (error) => {
          console.warn("Could not get location:", error)
          // Default to India coordinates
          setUserPosition([20.5937, 78.9629])
          setIsLoading(false)
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 600000
        }
      )
    }
  }, [])

  const toggleLayer = (layer) => {
    setActiveLayers((prev) => ({ ...prev, [layer]: !prev[layer] }))
  }

  const getWeatherIcon = (temp) => {
    if (typeof temp === 'string' || temp === 'N/A') return "❓"
    if (temp > 25) return "☀️"
    if (temp > 15) return "⛅"
    if (temp > 5) return "☁️"
    return "❄️"
  }

  const formatValue = (value, suffix = '') => {
    if (value === 'N/A' || value === null || value === undefined) return 'N/A'
    if (typeof value === 'number') return `${Math.round(value)}${suffix}`
    return value
  }

  return (
    <div className="map-wrapper">
      {/* MAP */}
      <MapContainer
        center={userPosition}
        zoom={5}
        className="map-container"
        style={{ height: '100vh', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          maxZoom={19}
        />

        {activeLayers.temp && (
          <TileLayer 
            url={`${API_BASE}/tiles/temp_new/{z}/{x}/{y}.png`}
            opacity={0.7}
          />
        )}
        {activeLayers.clouds && (
          <TileLayer 
            url={`${API_BASE}/tiles/clouds_new/{z}/{x}/{y}.png`}
            opacity={0.7}
          />
        )}
        {activeLayers.precipitation && (
          <TileLayer 
            url={`${API_BASE}/tiles/precipitation_new/{z}/{x}/{y}.png`}
            opacity={0.7}
          />
        )}
        {activeLayers.wind && (
          <TileLayer 
            url={`${API_BASE}/tiles/wind_new/{z}/{x}/{y}.png`}
            opacity={0.7}
          />
        )}

        <Marker position={userPosition}>
          <Popup className="custom-popup">
            <div className="popup-content">
              <MapPin size={16} />
              <span>{isLoading ? 'Locating...' : 'You are here'}</span>
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
                    <span>{formatValue(weatherInfo.temp, '°C')}</span>
                  </div>
                  <div className="weather-detail">
                    <Droplets size={14} />
                    <span>{formatValue(weatherInfo.humidity, '%')}</span>
                  </div>
                  <div className="weather-detail">
                    <Wind size={14} />
                    <span>{formatValue(weatherInfo.wind * 3.6, ' km/h')}</span>
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
              <span className="value">{formatValue(weatherInfo.temp, '°C')}</span>
              <span className="label">Temperature</span>
            </div>
            <div className="weather-info-item">
              <Droplets size={16} />
              <span className="value">{formatValue(weatherInfo.humidity, '%')}</span>
              <span className="label">Humidity</span>
            </div>
            <div className="weather-info-item">
              <Wind size={16} />
              <span className="value">{formatValue(weatherInfo.wind * 3.6)}</span>
              <span className="label">km/h</span>
            </div>
            <div className="weather-info-item">
              <Gauge size={16} />
              <span className="value">{formatValue(Math.round(weatherInfo.lat * 100) / 100)}</span>
              <span className="label">Latitude</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default MapView