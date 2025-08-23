import React, { useState, useEffect } from 'react';
import './realtime.css';

const ClimateDataDashboard = () => {
  const [location, setLocation] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [airQualityData, setAirQualityData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [alerts, setAlerts] = useState([]);
  const [historicalData, setHistoricalData] = useState([]);

  const API_KEY = import.meta.env.VITE_REACT_APP_OPENWEATHER_KEY;

  const fetchWeatherData = async (city) => {
    try {
      setLoading(true);
      setError('');
      
      // Current weather data
      const weatherResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
      );
      
      if (!weatherResponse.ok) {
        throw new Error('City not found');
      }
      
      const weatherResult = await weatherResponse.json();
      
      // Air quality data
      const airQualityResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/air_pollution?lat=${weatherResult.coord.lat}&lon=${weatherResult.coord.lon}&appid=${API_KEY}`
      );
      
      const airQualityResult = await airQualityResponse.json();
      
      setWeatherData(weatherResult);
      setAirQualityData(airQualityResult);
      
      // Generate some historical data for trends (simulated)
      generateHistoricalData(weatherResult);
      
      // Check for alerts
      checkAlerts(weatherResult, airQualityResult);
      
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const generateHistoricalData = (currentWeather) => {
    const data = [];
    const currentTemp = currentWeather.main.temp;
    const currentHumidity = currentWeather.main.humidity;
    
    for (let i = 23; i >= 0; i--) {
      data.push({
        time: new Date(Date.now() - i * 60 * 60 * 1000).getHours(),
        temperature: currentTemp + (Math.random() - 0.5) * 10,
        humidity: currentHumidity + (Math.random() - 0.5) * 20,
        rainfall: Math.random() * 5
      });
    }
    setHistoricalData(data);
  };

  const checkAlerts = (weather, airQuality) => {
    const newAlerts = [];
    
    // Temperature alerts
    if (weather.main.temp > 35) {
      newAlerts.push({
        type: 'danger',
        message: `Extreme Heat Alert: ${weather.main.temp.toFixed(1)}°C`
      });
    } else if (weather.main.temp < 0) {
      newAlerts.push({
        type: 'warning',
        message: `Freezing Temperature Alert: ${weather.main.temp.toFixed(1)}°C`
      });
    }
    
    // Humidity alerts
    if (weather.main.humidity > 80) {
      newAlerts.push({
        type: 'warning',
        message: `High Humidity Alert: ${weather.main.humidity}%`
      });
    }
    
    // Wind alerts
    if (weather.wind.speed > 15) {
      newAlerts.push({
        type: 'warning',
        message: `High Wind Alert: ${weather.wind.speed} m/s`
      });
    }
    
    // Air quality alerts
    if (airQuality.list[0].main.aqi > 3) {
      newAlerts.push({
        type: 'danger',
        message: 'Poor Air Quality Alert'
      });
    }
    
    setAlerts(newAlerts);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (location.trim()) {
      fetchWeatherData(location.trim());
    }
  };

  const getAirQualityDescription = (aqi) => {
    const descriptions = {
      1: 'Good',
      2: 'Fair',
      3: 'Moderate',
      4: 'Poor',
      5: 'Very Poor'
    };
    return descriptions[aqi] || 'Unknown';
  };

  const SimpleChart = ({ data, dataKey, color, label }) => {
    const maxValue = Math.max(...data.map(d => d[dataKey]));
    const minValue = Math.min(...data.map(d => d[dataKey]));
    const range = maxValue - minValue || 1;
    
    return (
      <div className="chart-container">
        <h4>{label}</h4>
        <div className="chart">
          {data.map((point, index) => (
            <div key={index} className="chart-bar">
              <div 
                className="bar" 
                style={{
                  height: `${((point[dataKey] - minValue) / range) * 100}%`,
                  backgroundColor: color
                }}
              ></div>
              <span className="bar-label">{point.time}h</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Climate Resilience Dashboard</h1>
        <p>Real-time environmental monitoring and alerts</p>
      </header>

      <form className="location-form" onSubmit={handleSubmit}>
        <div className="input-group">
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Enter city name (e.g., London, New York)"
            className="location-input"
          />
          <button type="submit" className="search-btn" disabled={loading}>
            {loading ? 'Loading...' : 'Get Data'}
          </button>
        </div>
      </form>

      {error && (
        <div className="error-message">
          <span>⚠️ {error}</span>
        </div>
      )}

      {alerts.length > 0 && (
        <div className="alerts-section">
          <h3>🚨 Climate Alerts</h3>
          {alerts.map((alert, index) => (
            <div key={index} className={`alert alert-${alert.type}`}>
              {alert.message}
            </div>
          ))}
        </div>
      )}

      {weatherData && (
        <div className="data-section">
          <div className="current-conditions">
            <h2>Current Conditions - {weatherData.name}, {weatherData.sys.country}</h2>
            
            <div className="metrics-grid">
              <div className="metric-card">
                <div className="metric-icon">🌡️</div>
                <div className="metric-info">
                  <h3>Temperature</h3>
                  <p className="metric-value">{weatherData.main.temp.toFixed(1)}°C</p>
                  <p className="metric-detail">Feels like {weatherData.main.feels_like.toFixed(1)}°C</p>
                </div>
              </div>
              
              <div className="metric-card">
                <div className="metric-icon">💧</div>
                <div className="metric-info">
                  <h3>Humidity</h3>
                  <p className="metric-value">{weatherData.main.humidity}%</p>
                  <p className="metric-detail">Relative humidity</p>
                </div>
              </div>
              
              <div className="metric-card">
                <div className="metric-icon">🌧️</div>
                <div className="metric-info">
                  <h3>Rainfall</h3>
                  <p className="metric-value">{weatherData.rain?.['1h'] || 0} mm</p>
                  <p className="metric-detail">Last hour</p>
                </div>
              </div>
              
              <div className="metric-card">
                <div className="metric-icon">🌪️</div>
                <div className="metric-info">
                  <h3>Wind Speed</h3>
                  <p className="metric-value">{weatherData.wind.speed} m/s</p>
                  <p className="metric-detail">Direction: {weatherData.wind.deg}°</p>
                </div>
              </div>
              
              <div className="metric-card">
                <div className="metric-icon">🌫️</div>
                <div className="metric-info">
                  <h3>Visibility</h3>
                  <p className="metric-value">{(weatherData.visibility / 1000).toFixed(1)} km</p>
                  <p className="metric-detail">Current visibility</p>
                </div>
              </div>
              
              {airQualityData && (
                <div className="metric-card">
                  <div className="metric-icon">🏭</div>
                  <div className="metric-info">
                    <h3>Air Quality</h3>
                    <p className="metric-value">{getAirQualityDescription(airQualityData.list[0].main.aqi)}</p>
                    <p className="metric-detail">AQI: {airQualityData.list[0].main.aqi}/5</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {historicalData.length > 0 && (
            <div className="trends-section">
              <h3>24-Hour Trends</h3>
              <div className="charts-grid">
                <SimpleChart 
                  data={historicalData} 
                  dataKey="temperature" 
                  color="#ff6b6b" 
                  label="Temperature (°C)"
                />
                <SimpleChart 
                  data={historicalData} 
                  dataKey="humidity" 
                  color="#4ecdc4" 
                  label="Humidity (%)"
                />
                <SimpleChart 
                  data={historicalData} 
                  dataKey="rainfall" 
                  color="#45b7d1" 
                  label="Rainfall (mm)"
                />
              </div>
            </div>
          )}

          {airQualityData && (
            <div className="air-quality-details">
              <h3>Air Quality Components</h3>
              <div className="air-quality-grid">
                <div className="air-component">
                  <span>CO</span>
                  <span>{airQualityData.list[0].components.co} μg/m³</span>
                </div>
                <div className="air-component">
                  <span>NO₂</span>
                  <span>{airQualityData.list[0].components.no2} μg/m³</span>
                </div>
                <div className="air-component">
                  <span>O₃</span>
                  <span>{airQualityData.list[0].components.o3} μg/m³</span>
                </div>
                <div className="air-component">
                  <span>PM2.5</span>
                  <span>{airQualityData.list[0].components.pm2_5} μg/m³</span>
                </div>
                <div className="air-component">
                  <span>PM10</span>
                  <span>{airQualityData.list[0].components.pm10} μg/m³</span>
                </div>
                <div className="air-component">
                  <span>SO₂</span>
                  <span>{airQualityData.list[0].components.so2} μg/m³</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      <footer className="dashboard-footer">
        <p>Data provided by OpenWeatherMap API | Updates every request</p>
      </footer>
    </div>
  );
};

export default ClimateDataDashboard;