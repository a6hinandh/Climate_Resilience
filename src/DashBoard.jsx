import React, { useState } from "react";
import "./Dashboard.css";

const Dashboard = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const features = [
    { icon: "📊", label: "Feature 1" },
    { icon: "📁", label: "Feature 2" },
    { icon: "⚙️", label: "Feature 3" },
    { icon: "💬", label: "Feature 4" },
    { icon: "📅", label: "Feature 5" },
    { icon: "🔔", label: "Feature 6" },
  ];

  const weatherData = [
    { icon: "☀️", label: "Sun", value: "70%" },
    { icon: "🌧️", label: "Rain", value: "30%" },
    { icon: "🌩️", label: "Storm", value: "10%" },
    { icon: "❄️", label: "Snow", value: "5%" },
    { icon: "🌫️", label: "Fog", value: "15%" },
    { icon: "💨", label: "Wind", value: "40%" },
  ];

  const weatherHistory = [
    { day: "Sun", temp: "27°C", condition: "☀️ Sunny" },
    { day: "Mon", temp: "28°C", condition: "☀️ Sunny" },
    { day: "Tue", temp: "24°C", condition: "🌧️ Rainy" },
    { day: "Wed", temp: "26°C", condition: "⛅ Cloudy" },
    { day: "Thu", temp: "29°C", condition: "☀️ Sunny" },
    { day: "Fri", temp: "25°C", condition: "🌫️ Foggy" },
  ];

  return (
    <div className="dashboard-container">
      {/* Header */}
      <div className="dashboard-header">
        <h1 className="dashboard-title">My Dashboard</h1>

        {/* Profile with Dropdown */}
        <div
          className="profile-icon"
          onClick={() => setDropdownOpen(!dropdownOpen)}
        >
          👤
          {dropdownOpen && (
            <div className="dropdown-menu">
              <button className="dropdown-item">Profile</button>
              <button className="dropdown-item">Settings</button>
              <button className="dropdown-item logout">Logout</button>
            </div>
          )}
        </div>
      </div>

      {/* Features Grid */}
      <div className="features-grid">
        {features.map((f, idx) => (
          <div key={idx} className="feature-card">
            <div className="feature-icon">{f.icon}</div>
            <div className="feature-label">{f.label}</div>
          </div>
        ))}
      </div>

      {/* Weather Section */}
      <div className="weather-section">
        {/* Weather Card */}
        <div className="weather-card">
          <h3 className="weather-title">Current Weather</h3>
          <div className="weather-items">
            {weatherData.map((w, idx) => (
              <div key={idx} className="weather-item">
                <div className="weather-icon">{w.icon}</div>
                <span>{w.label}</span>
                <p>{w.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Weather History Grid */}
        <div className="weather-history">
          <h3>Past Weather</h3>
          <div className="history-grid">
            {weatherHistory.map((day, idx) => (
              <div key={idx} className="history-card">
                <span className="day">{day.day}</span>
                <span className="temp">{day.temp}</span>
                <span className="condition">{day.condition}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
