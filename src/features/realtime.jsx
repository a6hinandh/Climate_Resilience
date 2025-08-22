import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { MapPin, Thermometer, Droplets, Wind, Sprout, AlertTriangle, Sun, CloudRain, Eye, Zap } from 'lucide-react';
import "./realtime.css";

const ClimateDataDashboard = () => {
  const [location, setLocation] = useState('');
  const [showLocationModal, setShowLocationModal] = useState(true);
  const [currentData, setCurrentData] = useState({
    temperature: 25,
    humidity: 50,
    rainfall: 0,
    airQuality: 50,
    soilMoisture: 40,
    windSpeed: 5,
    uvIndex: 5,
    visibility: 10
  });
  const [alerts, setAlerts] = useState([]);
  const [historicalData, setHistoricalData] = useState([]);
  const [timeOfDay, setTimeOfDay] = useState('day');
  const [loading, setLoading] = useState(false);
  const [usingMockData, setUsingMockData] = useState(false);

  // API Key - using direct assignment as fallback
  const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY || "";

  // Determine time of day for dynamic theming
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 6 && hour < 12) setTimeOfDay('morning');
    else if (hour >= 12 && hour < 18) setTimeOfDay('day');
    else if (hour >= 18 && hour < 21) setTimeOfDay('evening');
    else setTimeOfDay('night');
  }, []);

  useEffect(() => {
    if (location && !showLocationModal) {
      search(location);
      const interval = setInterval(() => search(location), 60000);
      return () => clearInterval(interval);
    }
  }, [location, showLocationModal]);

  const search = async (city) => {
    try {
      setLoading(true);
      
      // Try to use real API first
      try {
        const geoUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${API_KEY}`;
        const geoResponse = await fetch(geoUrl);
        
        if (!geoResponse.ok) {
          throw new Error(`Geocoding API error: ${geoResponse.status}`);
        }
        
        const geoData = await geoResponse.json();
        if (geoData.length === 0) {
          throw new Error("City not found");
        }
        
        const { lat, lon, name } = geoData[0];
        setLocation(name);

        const onecallUrl = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=minutely,daily,alerts&units=metric&appid=${API_KEY}`;
        const ocResponse = await fetch(onecallUrl);
        
        if (!ocResponse.ok) {
          throw new Error(`Weather API error: ${ocResponse.status}`);
        }
        
        const ocData = await ocResponse.json();
        const current = ocData.current;

        const airUrl = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`;
        const airResponse = await fetch(airUrl);
        
        if (!airResponse.ok) {
          throw new Error(`Air Quality API error: ${airResponse.status}`);
        }
        
        const airData = await airResponse.json();
        const aqi = airData.list[0].main.aqi;
        const airQuality = (aqi - 1) * 75;

        const newCurrent = {
          temperature: current.temp,
          humidity: current.humidity,
          rainfall: current.rain ? current.rain["1h"] || 0 : 0,
          airQuality,
          soilMoisture: Math.min(100, Math.max(0, current.humidity / 2 + Math.random() * 10)),
          windSpeed: current.wind_speed * 3.6,
          uvIndex: current.uvi,
          visibility: current.visibility / 1000
        };

        setCurrentData(newCurrent);
        setUsingMockData(false);
        
        // Generate historical data
        generateHistoricalData(newCurrent);
      } catch (apiError) {
        console.error("API Error, using mock data:", apiError);
        generateMockData(city);
      }
      
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      generateMockData(city);
      setLoading(false);
    }
  };

  // Generate mock data for demonstration
  const generateMockData = (city) => {
    const mockCurrentData = {
      temperature: 20 + Math.random() * 15,
      humidity: 40 + Math.random() * 40,
      rainfall: Math.random() * 5,
      airQuality: Math.random() * 150,
      soilMoisture: 30 + Math.random() * 40,
      windSpeed: 5 + Math.random() * 20,
      uvIndex: Math.random() * 10,
      visibility: 5 + Math.random() * 10
    };
    
    setCurrentData(mockCurrentData);
    setUsingMockData(true);
    generateHistoricalData(mockCurrentData);
  };

  const generateHistoricalData = (currentData) => {
    const data = [];
    let temp = currentData.temperature;
    let hum = currentData.humidity;
    let rain = currentData.rainfall;
    let aq = currentData.airQuality;
    let soil = currentData.soilMoisture;
    let wind = currentData.windSpeed;
    let uv = currentData.uvIndex;
    let vis = currentData.visibility;

    for (let i = 23; i >= 0; i--) {
      temp += (Math.random() - 0.5) * 1;
      hum += (Math.random() - 0.5) * 2;
      rain = Math.max(0, rain + (Math.random() - 0.5) * 0.5);
      aq += (Math.random() - 0.5) * 10;
      soil += (Math.random() - 0.5) * 3;
      wind += (Math.random() - 0.5) * 3;
      uv += (Math.random() - 0.5) * 1;
      vis += (Math.random() - 0.5) * 1;

      data.push({
        time: `${String((new Date().getHours() - i + 24) % 24).padStart(2, '0')}:00`,
        temperature: Math.max(-10, Math.min(45, temp)),
        humidity: Math.max(10, Math.min(100, hum)),
        rainfall: Math.max(0, rain),
        airQuality: Math.max(0, Math.min(300, aq)),
        soilMoisture: Math.max(5, Math.min(100, soil)),
        windSpeed: Math.max(0, Math.min(100, wind)),
        uvIndex: Math.max(0, Math.min(15, uv)),
        visibility: Math.max(0.5, Math.min(20, vis))
      });
    }
    
    setHistoricalData(data);
  };

  // Check for alerts
  useEffect(() => {
    const newAlerts = [];
    
    if (currentData.temperature > 35) {
      newAlerts.push({ type: 'danger', message: '🔥 Extreme heat warning! Temperature exceeds 35°C', icon: Thermometer, severity: 'critical' });
    }
    if (currentData.temperature < 5) {
      newAlerts.push({ type: 'warning', message: '❄️ Frost warning! Temperature below 5°C', icon: Thermometer, severity: 'moderate' });
    }
    if (currentData.humidity > 85) {
      newAlerts.push({ type: 'warning', message: '💧 High humidity levels detected', icon: Droplets, severity: 'moderate' });
    }
    if (currentData.rainfall > 4) {
      newAlerts.push({ type: 'danger', message: '🌊 Flood risk! Heavy rainfall detected', icon: CloudRain, severity: 'critical' });
    }
    if (currentData.airQuality > 150) {
      newAlerts.push({ type: 'danger', message: '😷 Unhealthy air quality levels', icon: Wind, severity: 'critical' });
    }
    if (currentData.soilMoisture < 20) {
      newAlerts.push({ type: 'warning', message: '🏜️ Low soil moisture - drought conditions', icon: Sprout, severity: 'moderate' });
    }
    if (currentData.windSpeed > 30) {
      newAlerts.push({ type: 'warning', message: '💨 Strong wind conditions detected', icon: Wind, severity: 'moderate' });
    }
    if (currentData.uvIndex > 8) {
      newAlerts.push({ type: 'warning', message: '☀️ Very high UV index - sun protection needed', icon: Sun, severity: 'moderate' });
    }

    setAlerts(newAlerts);
  }, [currentData]);

  const handleLocationSubmit = (e) => {
    e.preventDefault();
    if (location.trim()) {
      setShowLocationModal(false);
      search(location.trim());
    }
  };

  const getClimateTheme = () => {
    const temp = currentData.temperature;
    const humidity = currentData.humidity;
    const rainfall = currentData.rainfall;
    
    if (temp > 30 && humidity < 40) return 'desert';
    if (temp < 10) return 'cold';
    if (rainfall > 3) return 'rainy';
    if (humidity > 80) return 'tropical';
    return 'temperate';
  };

  const getBackgroundGradient = () => {
    const theme = getClimateTheme();
    const timeTheme = timeOfDay;
    
    const gradients = {
      desert: {
        morning: 'from-orange-200 via-yellow-100 to-red-100',
        day: 'from-orange-300 via-yellow-200 to-red-200',
        evening: 'from-red-300 via-orange-200 to-yellow-200',
        night: 'from-purple-900 via-red-900 to-orange-900'
      },
      cold: {
        morning: 'from-blue-100 via-cyan-50 to-white',
        day: 'from-blue-200 via-cyan-100 to-slate-100',
        evening: 'from-indigo-200 via-blue-100 to-cyan-100',
        night: 'from-slate-900 via-blue-900 to-indigo-900'
      },
      rainy: {
        morning: 'from-slate-200 via-blue-100 to-cyan-100',
        day: 'from-slate-300 via-blue-200 to-cyan-200',
        evening: 'from-slate-400 via-blue-300 to-cyan-200',
        night: 'from-slate-800 via-blue-800 to-cyan-800'
      },
      tropical: {
        morning: 'from-green-100 via-emerald-50 to-teal-100',
        day: 'from-green-200 via-emerald-100 to-teal-200',
        evening: 'from-emerald-200 via-green-100 to-teal-100',
        night: 'from-emerald-900 via-green-900 to-teal-900'
      },
      temperate: {
        morning: 'from-blue-50 via-green-50 to-yellow-50',
        day: 'from-blue-100 via-green-100 to-yellow-100',
        evening: 'from-purple-100 via-blue-100 to-green-100',
        night: 'from-indigo-900 via-purple-900 to-blue-900'
      }
    };
    
    return gradients[theme][timeTheme];
  };

  const getMetricColor = (value, type) => {
    switch(type) {
      case 'temperature':
        if (value > 30) return { bg: 'bg-gradient-to-r from-red-500 to-orange-500', text: 'text-red-100', ring: 'ring-red-300' };
        if (value < 15) return { bg: 'bg-gradient-to-r from-blue-500 to-cyan-500', text: 'text-blue-100', ring: 'ring-blue-300' };
        return { bg: 'bg-gradient-to-r from-green-500 to-emerald-500', text: 'text-green-100', ring: 'ring-green-300' };
      case 'humidity':
        if (value > 70) return { bg: 'bg-gradient-to-r from-blue-500 to-indigo-500', text: 'text-blue-100', ring: 'ring-blue-300' };
        return { bg: 'bg-gradient-to-r from-cyan-500 to-teal-500', text: 'text-cyan-100', ring: 'ring-cyan-300' };
      case 'rainfall':
        if (value > 3) return { bg: 'bg-gradient-to-r from-indigo-500 to-purple-500', text: 'text-indigo-100', ring: 'ring-indigo-300' };
        return { bg: 'bg-gradient-to-r from-slate-500 to-gray-500', text: 'text-slate-100', ring: 'ring-slate-300' };
      case 'airQuality':
        if (value > 100) return { bg: 'bg-gradient-to-r from-red-500 to-pink-500', text: 'text-red-100', ring: 'ring-red-300' };
        if (value > 50) return { bg: 'bg-gradient-to-r from-yellow-500 to-orange-500', text: 'text-yellow-100', ring: 'ring-yellow-300' };
        return { bg: 'bg-gradient-to-r from-green-500 to-emerald-500', text: 'text-green-100', ring: 'ring-green-300' };
      case 'soilMoisture':
        if (value < 30) return { bg: 'bg-gradient-to-r from-yellow-600 to-orange-600', text: 'text-yellow-100', ring: 'ring-yellow-300' };
        return { bg: 'bg-gradient-to-r from-emerald-500 to-green-500', text: 'text-emerald-100', ring: 'ring-emerald-300' };
      default:
        return { bg: 'bg-gradient-to-r from-purple-500 to-pink-500', text: 'text-purple-100', ring: 'ring-purple-300' };
    }
  };

  const AnimatedBackground = () => (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {/* Floating particles */}
      {[...Array(20)].map((_, i) => (
        <div
          key={i}
          className={`absolute w-2 h-2 rounded-full opacity-30 animate-pulse`}
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            backgroundColor: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'][Math.floor(Math.random() * 5)],
            animationDelay: `${Math.random() * 3}s`,
            animationDuration: `${3 + Math.random() * 4}s`
          }}
        />
      ))}
      
      {/* Weather-based animations */}
      {currentData.rainfall > 2 && (
        <div className="rain-animation">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute w-0.5 h-8 bg-blue-300 opacity-60 animate-bounce"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: '1s'
              }}
            />
          ))}
        </div>
      )}
      
      {currentData.temperature > 30 && (
        <div className="heat-shimmer absolute inset-0 bg-gradient-to-t from-transparent via-orange-100 to-transparent opacity-20 animate-pulse" />
      )}
      
      {currentData.windSpeed > 20 && (
        <div className="wind-lines absolute inset-0">
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              className="absolute h-0.5 bg-gray-300 opacity-40 animate-pulse"
              style={{
                top: `${Math.random() * 100}%`,
                left: '-10%',
                width: '120%',
                animationDelay: `${Math.random() * 2}s`,
                transform: 'skew(-45deg)'
              }}
            />
          ))}
        </div>
      )}
    </div>
  );

  const MetricCard = ({ title, value, unit, icon: Icon, type, description }) => {
    const colors = getMetricColor(value, type);
    const progress = type === 'temperature' ? Math.min(((value + 10) / 50) * 100, 100) :
                    type === 'humidity' ? value :
                    type === 'airQuality' ? Math.min((value / 300) * 100, 100) :
                    type === 'rainfall' ? Math.min((value / 10) * 100, 100) :
                    type === 'soilMoisture' ? value : 
                    Math.min((value / 100) * 100, 100);

    return (
      <div className={`group relative overflow-hidden rounded-3xl p-6 backdrop-blur-xl transition-all duration-500 hover:scale-105 hover:shadow-2xl ${colors.bg} shadow-lg ring-1 ${colors.ring} ring-opacity-25`}>
        {/* Animated background */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Floating icon */}
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div className={`p-3 rounded-2xl bg-white/20 backdrop-blur-sm ring-1 ring-white/30 group-hover:ring-white/50 transition-all duration-300`}>
              <Icon className={`w-6 h-6 ${colors.text} group-hover:scale-110 transition-transform duration-300`} />
            </div>
            <div className="text-right">
              <div className={`text-xs font-medium ${colors.text} opacity-80`}>Live</div>
              <div className={`w-2 h-2 rounded-full bg-green-400 animate-pulse`} />
            </div>
          </div>
          
          <div className="space-y-3">
            <div>
              <h3 className={`text-base font-semibold ${colors.text} mb-1`}>{title}</h3>
              <p className={`text-2xl font-bold ${colors.text} mb-1`}>
                {typeof value === 'number' ? value.toFixed(1) : value}
                <span className={`text-sm ml-1 opacity-80`}>{unit}</span>
              </p>
              <p className={`text-xs ${colors.text} opacity-70`}>{description}</p>
            </div>
            
            {/* Progress bar */}
            <div className="relative">
              <div className="w-full bg-white/20 rounded-full h-1.5 overflow-hidden">
                <div 
                  className="h-full bg-white/60 rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className={`text-xs ${colors.text} opacity-60 mt-1`}>
                {progress.toFixed(0)}% of scale
              </div>
            </div>
          </div>
        </div>
        
        {/* Animated corner decoration */}
        <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-white/10 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
    );
  };

  if (showLocationModal) {
    return (
      <div className={`min-h-screen bg-gradient-to-br ${getBackgroundGradient()} flex items-center justify-center p-6 relative overflow-hidden`}>
        <AnimatedBackground />
        
        {/* Backdrop blur overlay */}
        <div className="absolute inset-0 backdrop-blur-sm bg-white/10" />
        
        <div className="relative z-10 bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-8 md:p-12 max-w-md w-full border border-white/20 ring-1 ring-white/30">
          <div className="text-center mb-6">
            <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mb-4 shadow-lg ring-4 ring-white/30">
              <MapPin className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-2">
              Climate Dashboard
            </h2>
            <p className="text-gray-600">Enter your location for personalized climate insights</p>
          </div>
          
          <div className="space-y-4">
            <div className="relative">
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Enter city, state, or coordinates..."
                className="w-full px-4 py-3 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 outline-none transition-all duration-300 text-gray-800 placeholder-gray-500 shadow-inner"
                onKeyPress={(e) => e.key === 'Enter' && handleLocationSubmit(e)}
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
              </div>
            </div>
            
            <button
              onClick={handleLocationSubmit}
              disabled={!location.trim() || loading}
              className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 text-white py-3 px-6 rounded-xl hover:from-blue-700 hover:via-purple-700 hover:to-blue-800 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] ring-2 ring-blue-500/30 flex items-center justify-center"
            >
              {loading ? (
                <span>Loading...</span>
              ) : (
                <span className="flex items-center justify-center space-x-2">
                  <span>Get Climate Data</span>
                  <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce" />
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br ${getBackgroundGradient()} relative overflow-hidden transition-all duration-1000`}>
      <AnimatedBackground />
      
      {/* Header */}
      <div className="relative z-10 bg-white/80 backdrop-blur-xl border-b border-white/20 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1">
              <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-gray-800 via-blue-600 to-purple-600 bg-clip-text text-transparent">
                Climate Resilience Dashboard
              </h1>
              <div className="flex items-center space-x-3 text-gray-600 flex-wrap">
                <div className="flex items-center space-x-1">
                  <MapPin className="w-4 h-4 text-blue-500" />
                  <span className="text-sm font-medium">{location}</span>
                  <button
                    onClick={() => setShowLocationModal(true)}
                    className="text-blue-600 hover:text-blue-800 text-xs underline font-medium hover:bg-blue-50 px-1 py-0.5 rounded transition-colors"
                  >
                    Change
                  </button>
                </div>
                <div className="h-4 w-px bg-gray-300" />
                <div className="flex items-center space-x-1">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-xs">Live Data</span>
                  {usingMockData && (
                    <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full ml-2">
                      Demo Mode
                    </span>
                  )}
                </div>
              </div>
            </div>
            
            <div className="text-right space-y-1">
              <div className="text-xs text-gray-500 font-medium">Last Updated</div>
              <div className="text-lg font-bold text-gray-800">{new Date().toLocaleTimeString()}</div>
              <div className="text-xs text-gray-500 capitalize">{timeOfDay} • {getClimateTheme()} climate</div>
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        )}

        {/* Alerts Section */}
        {!loading && alerts.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-800 flex items-center space-x-2">
              <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center animate-pulse">
                <AlertTriangle className="w-4 h-4 text-white" />
              </div>
              <span>Active Climate Alerts</span>
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {alerts.map((alert, index) => (
                <div
                  key={index}
                  className={`relative overflow-hidden p-4 rounded-xl backdrop-blur-xl transition-all duration-300 hover:scale-[1.01] ${
                    alert.type === 'danger' 
                      ? 'bg-gradient-to-r from-red-500/20 to-orange-500/20 border border-red-300/30 ring-1 ring-red-400/30' 
                      : 'bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-300/30 ring-1 ring-yellow-400/30'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-full ${
                      alert.type === 'danger' ? 'bg-red-500/30' : 'bg-yellow-500/30'
                    }`}>
                      <AlertTriangle className={`w-5 h-5 ${
                        alert.type === 'danger' ? 'text-red-600' : 'text-yellow-600'
                      }`} />
                    </div>
                    <div className="flex-1">
                      <div className="text-base font-semibold text-gray-800 mb-1">{alert.message}</div>
                      <div className={`text-xs font-medium px-2 py-1 rounded-full inline-block ${
                        alert.severity === 'critical' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {alert.severity} priority
                      </div>
                    </div>
                  </div>
                  
                  {/* Animated background pulse */}
                  <div className={`absolute inset-0 ${
                    alert.type === 'danger' ? 'bg-red-500/5' : 'bg-yellow-500/5'
                  } animate-pulse rounded-xl`} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Enhanced Metrics Grid */}
        {!loading && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-800 flex items-center space-x-2">
              <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                <Thermometer className="w-4 h-4 text-white" />
              </div>
              <span>Live Environmental Conditions</span>
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              <MetricCard
                title="Temperature"
                value={currentData.temperature}
                unit="°C"
                icon={Thermometer}
                type="temperature"
                description="Current air temperature"
              />
              
              <MetricCard
                title="Humidity"
                value={currentData.humidity}
                unit="%"
                icon={Droplets}
                type="humidity"
                description="Relative air humidity"
              />
              
              <MetricCard
                title="Rainfall"
                value={currentData.rainfall}
                unit="mm/hr"
                icon={CloudRain}
                type="rainfall"
                description="Precipitation rate"
              />
              
              <MetricCard
                title="Air Quality"
                value={currentData.airQuality}
                unit="AQI"
                icon={Wind}
                type="airQuality"
                description="Air Quality Index"
              />
              
              <MetricCard
                title="Soil Moisture"
                value={currentData.soilMoisture}
                unit="%"
                icon={Sprout}
                type="soilMoisture"
                description="Ground water content"
              />
              
              <MetricCard
                title="Wind Speed"
                value={currentData.windSpeed}
                unit="km/h"
                icon={Wind}
                type="windSpeed"
                description="Current wind velocity"
              />
              
              <MetricCard
                title="UV Index"
                value={currentData.uvIndex}
                unit="UVI"
                icon={Sun}
                type="uvIndex"
                description="Ultraviolet radiation"
              />
              
              <MetricCard
                title="Visibility"
                value={currentData.visibility}
                unit="km"
                icon={Eye}
                type="visibility"
                description="Atmospheric clarity"
              />
            </div>
          </div>
        )}

        {/* Enhanced Charts Section */}
        {!loading && historicalData.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Temperature & Humidity Trends */}
            <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-lg p-4 border border-white/30 ring-1 ring-white/20">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-blue-500 rounded-xl flex items-center justify-center">
                  <Thermometer className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-800">Temperature & Humidity</h3>
              </div>
              
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={historicalData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" strokeOpacity={0.5} />
                  <XAxis 
                    dataKey="time" 
                    stroke="#6b7280" 
                    fontSize={12}
                    tick={{ fill: '#6b7280' }}
                  />
                  <YAxis stroke="#6b7280" fontSize={12} tick={{ fill: '#6b7280' }} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                      backdropFilter: 'blur(12px)',
                      border: 'none', 
                      borderRadius: '12px',
                      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                      padding: '12px'
                    }} 
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="temperature" 
                    stroke="#f59e0b" 
                    strokeWidth={2}
                    name="Temperature (°C)"
                    dot={{ fill: '#f59e0b', strokeWidth: 2, r: 3 }}
                    activeDot={{ r: 5 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="humidity" 
                    stroke="#3b82f6" 
                    strokeWidth={2}
                    name="Humidity (%)"
                    dot={{ fill: '#3b82f6', strokeWidth: 2, r: 3 }}
                    activeDot={{ r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Air Quality & Wind Speed */}
            <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-lg p-4 border border-white/30 ring-1 ring-white/20">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                  <Wind className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-800">Air Quality & Wind</h3>
              </div>
              
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={historicalData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" strokeOpacity={0.5} />
                  <XAxis dataKey="time" stroke="#6b7280" fontSize={12} tick={{ fill: '#6b7280' }} />
                  <YAxis stroke="#6b7280" fontSize={12} tick={{ fill: '#6b7280' }} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                      backdropFilter: 'blur(12px)',
                      border: 'none', 
                      borderRadius: '12px',
                      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                      padding: '12px'
                    }} 
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="airQuality" 
                    stroke="#8b5cf6" 
                    strokeWidth={2}
                    name="Air Quality Index"
                    dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 3 }}
                    activeDot={{ r: 5 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="windSpeed" 
                    stroke="#06b6d4" 
                    strokeWidth={2}
                    name="Wind Speed (km/h)"
                    dot={{ fill: '#06b6d4', strokeWidth: 2, r: 3 }}
                    activeDot={{ r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Precipitation & Soil Analysis */}
            <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-lg p-4 border border-white/30 ring-1 ring-white/20">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-green-500 rounded-xl flex items-center justify-center">
                  <CloudRain className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-800">Precipitation & Soil</h3>
              </div>
              
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={historicalData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" strokeOpacity={0.5} />
                  <XAxis dataKey="time" stroke="#6b7280" fontSize={12} tick={{ fill: '#6b7280' }} />
                  <YAxis stroke="#6b7280" fontSize={12} tick={{ fill: '#6b7280' }} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                      backdropFilter: 'blur(12px)',
                      border: 'none', 
                      borderRadius: '12px',
                      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                      padding: '12px'
                    }} 
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="rainfall" 
                    stroke="#6b7280" 
                    strokeWidth={2}
                    name="Rainfall (mm/hr)"
                    dot={{ fill: '#6b7280', strokeWidth: 2, r: 3 }}
                    activeDot={{ r: 5 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="soilMoisture" 
                    stroke="#10b981" 
                    strokeWidth={2}
                    name="Soil Moisture (%)"
                    dot={{ fill: '#10b981', strokeWidth: 2, r: 3 }}
                    activeDot={{ r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Climate Risk Radial Chart */}
            <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-lg p-4 border border-white/30 ring-1 ring-white/20">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-orange-500 rounded-xl flex items-center justify-center">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-800">Climate Risk Index</h3>
              </div>
              
              <div className="space-y-4">
                {[
                  { label: 'Heat Stress', value: currentData.temperature > 35 ? 85 : currentData.temperature > 30 ? 60 : 25, color: '#ef4444' },
                  { label: 'Drought Risk', value: currentData.soilMoisture < 20 ? 80 : currentData.soilMoisture < 35 ? 50 : 20, color: '#f59e0b' },
                  { label: 'Flood Risk', value: currentData.rainfall > 4 ? 90 : currentData.rainfall > 2 ? 45 : 15, color: '#3b82f6' },
                  { label: 'Air Quality', value: currentData.airQuality > 150 ? 85 : currentData.airQuality > 100 ? 60 : 30, color: '#8b5cf6' }
                ].map((risk, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-gray-700">{risk.label}</span>
                      <div className={`px-2 py-1 rounded-full text-xs font-bold ${
                        risk.value > 70 ? 'bg-red-100 text-red-800' : 
                        risk.value > 40 ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-green-100 text-green-800'
                      }`}>
                        {risk.value > 70 ? 'High' : risk.value > 40 ? 'Medium' : 'Low'}
                      </div>
                    </div>
                    
                    <div className="relative">
                      <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                        <div 
                          className="h-full rounded-full transition-all duration-1000 ease-out"
                          style={{ 
                            width: `${risk.value}%`,
                            background: `linear-gradient(90deg, ${risk.color}AA, ${risk.color})`
                          }}
                        />
                      </div>
                      <div className="text-xs text-gray-500 mt-1 text-right">
                        {risk.value}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Enhanced Footer */}
        {!loading && (
          <div className="bg-gradient-to-r from-white/80 to-white/60 backdrop-blur-xl rounded-2xl shadow-lg p-6 text-center border border-white/30 ring-1 ring-white/20">
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-4 mb-3">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-xs font-medium text-gray-600">Real-time updates every 60 seconds</span>
              </div>
              <div className="hidden sm:block h-4 w-px bg-gray-300" />
              <div className="flex items-center space-x-2">
                <Zap className="w-4 h-4 text-blue-500" />
                <span className="text-xs font-medium text-gray-600">Powered by OpenWeatherMap API</span>
              </div>
            </div>
            
            <p className="text-xs text-gray-500">
              Advanced climate resilience monitoring with predictive analytics and risk assessment
            </p>
            
            {usingMockData && (
              <div className="mt-3 bg-yellow-100 border border-yellow-300 text-yellow-700 px-4 py-2 rounded-xl text-xs">
                Currently using demo data. Add a valid API key to access real weather data.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ClimateDataDashboard;