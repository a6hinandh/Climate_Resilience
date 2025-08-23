import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./DashBoard.css";
import ClimateDataDashboard from './features/realtime';

const Dashboard = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [featuresLoaded, setFeaturesLoaded] = useState(false);
  const navigate = useNavigate();

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    
    return () => clearInterval(timer);
  }, []);

  // Animation delay for features loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setFeaturesLoaded(true);
    }, 500);
    
    return () => clearTimeout(timer);
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

  // Enhanced features with better categorization and animations
  const features = [
    { 
      icon: "🤖", 
      label: "AI Climate Predictions", 
      description: "Advanced ML forecasts with real-time weather analysis and 95% accuracy",
      route: "/predictions",
      color: "#667eea",
      category: "AI & Analytics"
    },
    { 
      icon: "💬", 
      label: "Smart Climate Assistant", 
      description: "Intelligent climate chatbot with personalized insights and recommendations",
      route: "/chat",
      color: "#10b981",
      category: "AI & Analytics"
    },
    { 
      icon: "🗺️", 
      label: "Interactive Climate Map", 
      description: "Real-time global climate visualization with satellite data integration",
      route: "/map",
      color: "#8b5cf6",
      category: "Visualization"
    },
    { 
      icon: "🌾", 
      label: "Agriculture Community", 
      description: "Connect with farmers, share insights, and access precision farming tools",
      route: "/community",
      color: "#f59e0b",
      category: "Community"
    },
    { 
      icon: "🎮", 
      label: "Climate Challenge Game", 
      description: "Interactive climate education through gamification and challenges",
      route: "/game",
      color: "#ef4444",
      category: "Education"
    }
  ];

  // Handle feature card clicks with enhanced feedback
  const handleFeatureClick = (feature) => {
    if (feature.route && feature.route !== "#") {
      // Add visual feedback
      const card = event.currentTarget;
      
      
      setTimeout(() => {
        navigate(feature.route);
      }, 150);
    }
  };

  // Enhanced logout with better UX
  const handleLogout = () => {
    setDropdownOpen(false);
    
    const confirmed = window.confirm(
      "🚪 Are you sure you want to sign out?\n\nYour session data will be cleared."
    );
    
    if (confirmed) {
      // Add loading state for logout
      const logoutBtn = event.target;
      logoutBtn.textContent = "🔄 Signing out...";
      logoutBtn.style.opacity = "0.7";
      
      // Simulate logout delay for better UX
      setTimeout(() => {
        // Clear any stored tokens/data here
        localStorage.removeItem('authToken');
        sessionStorage.clear();
        
        navigate("/", { replace: true });
      }, 1000);
    }
  };

  // Enhanced dropdown actions
  const handleProfileAction = (action) => {
    setDropdownOpen(false);
    
    switch(action) {
      case 'profile':
        navigate('/profile');
        break;
      case 'preferences':
        navigate('/settings');
        break;
      case 'analytics':
        navigate('/analytics');
        break;
      case 'notifications':
        navigate('/notifications');
        break;
      default:
        console.log('Unknown action:', action);
    }
  };

  const formatTime = (date) => {
    return date.toLocaleString('en-US', { 
      weekday: 'long',
      month: 'long', 
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return "🌅 Good Morning";
    if (hour < 17) return "☀️ Good Afternoon";
    if (hour < 21) return "🌆 Good Evening";
    return "🌙 Good Night";
  };

  return (
    <div className="dashboard-container">
      {/* Enhanced Header with Dynamic Greeting */}
      <header className="dashboard-header">
        <div>
          <h1 className="dashboard-title">🌤️ Climate Intelligence Hub</h1>
          <p style={{ 
            margin: '8px 0 0 0', 
            color: '#374151', // Changed to dark color
            fontSize: '0.9rem',
            fontWeight: '500'
          }}>
            {getGreeting()} • {formatTime(currentTime)}
          </p>
        </div>

        {/* Enhanced Profile with Advanced Dropdown */}
        <div
          className="profile-icon"
          onClick={(e) => {
            e.stopPropagation();
            setDropdownOpen(!dropdownOpen);
          }}
          title="User Menu"
          role="button"
          aria-label="Open user menu"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              setDropdownOpen(!dropdownOpen);
            }
          }}
        >
          👤
         
        </div>
        
      </header>

      {/* Enhanced Quick Access Banner with Dynamic Content */}
      <section className="quick-access-banner">
        <div className="banner-content">
          <h2>🚀 Quick Access Dashboard</h2>
          <p>
            Jump into your most-used climate intelligence tools instantly. 
            Get predictions, chat with AI, and explore climate data.
          </p>
        </div>
        <div className="quick-actions">
          <button 
            className="quick-btn predictions"
            onClick={() => navigate("/predictions")}
            title="Access AI-powered climate predictions and forecasts"
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-2px) scale(1.02)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0) scale(1)';
            }}
          >
            🤖 AI Predictions
          </button>
          <button 
            className="quick-btn chat"
            onClick={() => navigate("/chat")}
            title="Start conversation with intelligent climate assistant"
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-2px) scale(1.02)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0) scale(1)';
            }}
          >
            💬 Climate Chat
          </button>
        </div>
      </section>

      {/* Enhanced Features Grid with Categories */}
      <section className="features-section">
        <h3 className="section-title">🔧 Professional Climate Tools & Services</h3>
        <div className="features-grid">
          {features.map((feature, index) => (
            <article 
              key={index} 
              className={`feature-card ${feature.route !== "#" ? "clickable" : "disabled"}`}
              onClick={() => handleFeatureClick(feature)}
              style={{ 
                "--feature-color": feature.color,
                animationDelay: featuresLoaded ? `${index * 0.1}s` : '0s'
              }}
              title={`${feature.label}: ${feature.description}`}
              role="button"
              tabIndex={feature.route !== "#" ? 0 : -1}
              onKeyDown={(e) => {
                if ((e.key === 'Enter' || e.key === ' ') && feature.route !== "#") {
                  e.preventDefault();
                  handleFeatureClick(feature);
                }
              }}
              aria-label={`Access ${feature.label} - ${feature.description}`}
            >
              <div className="feature-icon" aria-hidden="true">
                {feature.icon}
              </div>
              <div className="feature-content">
                <div className="feature-label">{feature.label}</div>
                <div className="feature-description">{feature.description}</div>
                <div style={{
                  fontSize: '0.75rem',
                  color: '#6b7280', // Changed to dark gray
                  marginTop: '4px',
                  fontWeight: '600',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>
                  {feature.category}
                </div>
              </div>
              {feature.route !== "#" ? (
                <div className="feature-arrow" aria-hidden="true">→</div>
              ) : (
                <div className="coming-soon">Coming Soon</div>
              )}
            </article>
          ))}
        </div>
      </section>

      {/* Enhanced Real-time Climate Data Section */}
      <section 
        className="climate-data-section"
        style={{
          background: 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(20px)',
          borderRadius: '24px',
          border: '1px solid rgba(0, 0, 0, 0.2)',
          padding: '32px',
          marginBottom: '40px',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(0, 0, 0, 0.05)'
        }}
      >
        <div style={{
          marginBottom: '24px',
          textAlign: 'center'
        }}>
          <h3 style={{
            color: '#1f2937', // Changed to dark color
            fontSize: '1.4rem',
            fontWeight: '800',
            margin: '0 0 8px 0',
            letterSpacing: '-0.03em',
            textShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
          }}>
            📊 Real-time Climate Intelligence
          </h3>
          <p style={{
            color: '#374151', // Changed to dark color
            fontSize: '0.9rem',
            margin: 0,
            fontWeight: '500'
          }}>
            Live environmental data and advanced analytics from global monitoring systems
          </p>
        </div>
        <ClimateDataDashboard />
      </section>

      {/* Enhanced Status Bar */}
      <footer style={{
        background: 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(20px)',
        borderRadius: '16px',
        border: '1px solid rgba(0, 0, 0, 0.2)',
        padding: '20px 28px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: '32px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(0, 0, 0, 0.05)'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          color: '#374151', // Changed to dark color
          fontSize: '0.85rem',
          fontWeight: '500'
        }}>
          <span style={{ color: '#10b981' }}>🟢</span>
          <span>All Systems Operational</span>
          <span style={{ opacity: 0.6 }}>•</span>
          <span>Last updated: {currentTime.toLocaleTimeString()}</span>
        </div>
        
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '20px',
          color: '#4b5563', // Changed to dark color
          fontSize: '0.8rem'
        }}>
          <button
            onClick={() => navigate('/help')}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'inherit',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.color = '#1f2937'; // Darker on hover
            }}
            onMouseLeave={(e) => {
              e.target.style.color = '#4b5563';
            }}
          >
            ❓ Help & Support
          </button>
          <span style={{ opacity: 0.5 }}>|</span>
          <button
            onClick={() => navigate('/feedback')}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'inherit',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.color = '#1f2937'; // Darker on hover
            }}
            onMouseLeave={(e) => {
              e.target.style.color = '#4b5563';
            }}
          >
            💬 Feedback
          </button>
          <span style={{ opacity: 0.5 }}>|</span>
          <span>v2.1.0</span>
        </div>
      </footer>
       {dropdownOpen && (
            <nav className="dropdown-menu" >
              <button 
                className="dropdown-item"
                onClick={() => handleProfileAction('profile')}
                role="menuitem"
              >
                👤 View Profile
              </button>
              <button 
                className="dropdown-item"
                onClick={() => handleProfileAction('preferences')}
                role="menuitem"
              >
                ⚙️ Settings & Preferences  
              </button>
              <button 
                className="dropdown-item"
                onClick={() => handleProfileAction('analytics')}
                role="menuitem"
              >
                📊 Usage Analytics
              </button>
              <button 
                className="dropdown-item"
                onClick={() => handleProfileAction('notifications')}
                role="menuitem"
              >
                🔔 Notifications
              </button>
              <button 
                className="dropdown-item logout"
                onClick={handleLogout}
                role="menuitem"
              >
                🚪 Sign Out
              </button>
            </nav>
          )}
    </div>
    
  );
};

export default Dashboard;