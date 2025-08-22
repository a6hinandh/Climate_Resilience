import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./DashBoard.css";
import ClimateDataDashboard from './features/realtime';
const Dashboard = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const navigate = useNavigate();

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    
    return () => clearInterval(timer);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.profile-icon')) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  // Enhanced features with better icons and descriptions
  const features = [
    { 
      icon: "🤖", 
      label: "AI Climate Predictions", 
      description: "Advanced machine learning forecasts with 95% accuracy",
      route: "/predictions",
      color: "#3b82f6"
    },
    { 
      icon: "💬", 
      label: "Smart Climate Assistant", 
      description: "Real-time climate insights powered by AI technology",
      route: "/chat",
      color: "#10b981"
    },
    { 
      icon: "📊", 
      label: "MapView", 
      description: "Map",
      route: "/map",
      color: "#8b5cf6"
    },
    { 
      icon: "🌾", 
      label: "Community", 
      description: "Precision farming recommendations and crop optimization",
      route: "/community",
      color: "#f59e0b"
    },
    { 
      icon: "🏙️", 
      label: "game", 
      description: "City-wide environmental tracking and air quality metrics",
      route: "/game",
      color: "#ef4444"
    }
  ];

  // Enhanced weather data with more realistic values
  const weatherData = [
    { icon: "☀️", label: "Sunny", value: "68%" },
    { icon: "🌧️", label: "Rain", value: "25%" },
    { icon: "⛈️", label: "Storms", value: "8%" },
    { icon: "❄️", label: "Snow", value: "2%" },
    { icon: "🌫️", label: "Fog", value: "18%" },
    { icon: "💨", label: "Windy", value: "45%" },
  ];

  // Enhanced weather history with more detailed data
  const weatherHistory = [
    { day: "Sunday", temp: "27°C", condition: "☀️ Clear skies" },
    { day: "Monday", temp: "28°C", condition: "🌤️ Partly cloudy" },
    { day: "Tuesday", temp: "24°C", condition: "🌧️ Light rain" },
    { day: "Wednesday", temp: "26°C", condition: "☁️ Overcast" },
    { day: "Thursday", temp: "29°C", condition: "☀️ Bright sun" },
    { day: "Friday", temp: "25°C", condition: "🌫️ Morning fog" },
  ];

  // Handle feature card clicks with animation
  const handleFeatureClick = (feature) => {
    if (feature.route && feature.route !== "#") {
      navigate(feature.route);
    }
  };

  // Handle logout with confirmation
  const handleLogout = () => {
    const confirmed = window.confirm("Are you sure you want to logout?");
    if (confirmed) {
      // Add logout logic here (clear tokens, etc.)
      navigate("/");
    }
  };

  const formatTime = (date) => {
    return date.toLocaleString('en-US', { 
      weekday: 'short',
      month: 'short', 
      day: 'numeric',
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  return (
    <div className="dashboard-container">
      {/* Enhanced Header */}
      <div className="dashboard-header">
        <h1 className="dashboard-title">🌤️ Climate Intelligence</h1>

        {/* Profile with Enhanced Dropdown */}
        <div
          className="profile-icon"
          onClick={(e) => {
            e.stopPropagation();
            setDropdownOpen(!dropdownOpen);
          }}
        >
          👤
          {dropdownOpen && (
            <div className="dropdown-menu">
              <button className="dropdown-item">
                👤 View Profile
              </button>
              <button className="dropdown-item">
                ⚙️ Preferences  
              </button>
              <button className="dropdown-item">
                📊 Analytics
              </button>
              <button className="dropdown-item">
                🔔 Notifications
              </button>
              <button 
                className="dropdown-item logout"
                onClick={handleLogout}
              >
                🚪 Sign Out
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Enhanced Quick Access Banner */}
      <div className="quick-access-banner">
        <div className="banner-content">
          <h2>🚀 Quick Access Hub</h2>
          <p>Access your most-used climate intelligence tools instantly</p>
        </div>
        <div className="quick-actions">
          <button 
            className="quick-btn predictions"
            onClick={() => navigate("/predictions")}
            title="Get AI-powered climate predictions"
          >
            🤖 AI Predictions
          </button>
          <button 
            className="quick-btn chat"
            onClick={() => navigate("/chat")}
            title="Chat with climate AI assistant"
          >
            💬 Climate Assistant
          </button>
        </div>
      </div>

      {/* Enhanced Features Grid */}
      <div className="features-section">
        <h3 className="section-title">🔧 Professional Climate Tools</h3>
        <div className="features-grid">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className={`feature-card ${feature.route !== "#" ? "clickable" : "disabled"}`}
              onClick={() => handleFeatureClick(feature)}
              style={{ "--feature-color": feature.color }}
              title={feature.description}
            >
              <div className="feature-icon">{feature.icon}</div>
              <div className="feature-content">
                <div className="feature-label">{feature.label}</div>
                <div className="feature-description">{feature.description}</div>
              </div>
              {feature.route !== "#" ? (
                <div className="feature-arrow">→</div>
              ) : (
                <div className="coming-soon">Coming Soon</div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Enhanced Weather Section */}

      <div>
        <ClimateDataDashboard/>
      </div>
    </div>
  );
};

export default Dashboard;