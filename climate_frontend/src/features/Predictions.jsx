import React, { useState, useEffect } from 'react';

const API_BASE = import.meta.env.VITE_REACT_APP_API_BASE;

const ClimatePredictor = () => {
  const [predictionData, setPredictionData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);


  // Simulate API call
  // Inside Predictions.jsx
const [city, setCity] = useState("Delhi"); // default city

const fetchPredictions = async () => {
  setLoading(true);
  setError(null);

  try {
    const response = await fetch(`${API_BASE}/predict/${city}`);
    if (!response.ok) throw new Error("API request failed");
    const data = await response.json();

    if (data.error) throw new Error(data.error);

    setPredictionData(data);
    setLastUpdated(new Date());
  } catch (err) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
};



  // Auto-fetch on component mount
  useEffect(() => {
    fetchPredictions();
  }, []);

  // Get risk level analysis
  const getRiskAnalysis = (risk) => {
    if (!risk) return { level: 'Unknown', colorClass: 'risk-unknown' };
    const riskLower = risk.toLowerCase();
    if (riskLower.includes('high') || riskLower.includes('severe')) {
      return { level: 'High Risk', colorClass: 'risk-high' };
    }
    if (riskLower.includes('moderate') || riskLower.includes('medium')) {
      return { level: 'Moderate Risk', colorClass: 'risk-moderate' };
    }
    if (riskLower.includes('low') || riskLower.includes('minimal')) {
      return { level: 'Low Risk', colorClass: 'risk-low' };
    }
    return { level: 'Assessment Available', colorClass: 'risk-available' };
  };

  // Get advisory priority analysis
  const getAdvisoryAnalysis = (advisory) => {
    if (!advisory) return { priority: 'Standard', colorClass: 'advisory-standard' };
    const advisoryLower = advisory.toLowerCase();
    if (advisoryLower.includes('urgent') || advisoryLower.includes('immediate')) {
      return { priority: 'Urgent Action', colorClass: 'advisory-urgent' };
    }
    if (advisoryLower.includes('consider') || advisoryLower.includes('recommended')) {
      return { priority: 'Recommended', colorClass: 'advisory-recommended' };
    }
    return { priority: 'Advisory Available', colorClass: 'advisory-available' };
  };

  // Format temperature difference
  const getTempDifference = () => {
    if (!predictionData) return null;
    const diff = predictionData.ai_predicted_temp - predictionData.openweather_temp;
    const sign = diff > 0 ? '+' : '';
    return {
      value: `${sign}${diff.toFixed(1)}°C`,
      isPositive: diff > 0,
      magnitude: Math.abs(diff)
    };
  };

  // Get rainfall assessment
  const getRainfallAssessment = (rainfall) => {
    if (rainfall === 0) return { status: 'No Precipitation', icon: '☀️', description: 'Clear conditions' };
    if (rainfall < 1) return { status: 'Light Drizzle', icon: '🌦️', description: 'Minimal rainfall' };
    if (rainfall < 5) return { status: 'Light Rain', icon: '🌧️', description: 'Moderate precipitation' };
    if (rainfall < 15) return { status: 'Moderate Rain', icon: '⛈️', description: 'Significant rainfall' };
    return { status: 'Heavy Rain', icon: '🌨️', description: 'Intense precipitation' };
  };

  const tempDiff = getTempDifference();
  const riskAnalysis = getRiskAnalysis(predictionData?.risk);
  const advisoryAnalysis = getAdvisoryAnalysis(predictionData?.advisory);
  const rainfallAssessment = getRainfallAssessment(predictionData?.rainfall_mm || 0);

  return (
    <div className="app-container">
      {/* Navigation Header */}
      <nav className="nav-header">
        <div className="nav-content">
          <div className="nav-left">
            <div className="logo">
              <span>CP</span>
            </div>
            <h1 className="app-title">Climate Predictor</h1>
          </div>
          <div className="nav-right">
            <input 
    type="text" 
    value={city} 
    onChange={(e) => setCity(e.target.value)} 
    placeholder="Enter city..."
    className="city-input"
  />
  <button 
    onClick={fetchPredictions}
    disabled={loading}
    className={`refresh-btn ${loading ? 'loading' : ''}`}
  >
    {loading ? "Analyzing..." : "Refresh Analysis"}
  </button>
            <div className="update-time">
              {lastUpdated ? `Updated ${lastUpdated.toLocaleTimeString()}` : 'Ready to analyze'}
            </div>
            <button 
              onClick={fetchPredictions}
              disabled={loading}
              className={`refresh-btn ${loading ? 'loading' : '🔄'}`}
            >
            </button>
          </div>
        </div>
      </nav>

      <div className="main-content">
        {/* Error State */}
        {error && (
          <div className="error-container">
            <div className="error-content">
              <div className="error-icon">⚠️</div>
              <div className="error-text">
                <h3>Connection Error</h3>
                <p className="error-message">Unable to fetch climate predictions: {error}</p>
                <p className="error-help">Please ensure the API service is running and try again.</p>
              </div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && !predictionData && (
          <div className="loading-container">
            <div className="loading-icon">🌍</div>
            <h3>Processing Climate Data</h3>
            <p>Analyzing weather patterns and generating predictions...</p>
            <div className="loading-bar">
              <div className="loading-progress"></div>
            </div>
          </div>
        )}

        {/* Main Content */}
        {predictionData && (
          <div className="content-sections">
            {/* Header Section */}
            <div className="header-section">
              <div className="header-icon">🏙️</div>
              <h2 className="city-name">{predictionData.city}</h2>
              <p className="header-subtitle">Advanced Climate Analysis & Predictive Intelligence</p>
              <div className="status-badge">
                <span className="status-dot"></span>
                Live Analysis Active
              </div>
            </div>

            {/* Temperature Analysis Grid */}
            <div className="temp-grid">
              {/* Current Temperature */}
              <div className="temp-card">
                <div className="card-header">
                  <div className="card-icon current-temp-icon">
                    <span>🌡️</span>
                  </div>
                  <div className="card-info">
                    <div className="card-label">Current</div>
                    <div className="card-value">{predictionData.openweather_temp?.toFixed(2)}°C</div>
                  </div>
                </div>
                <div className="card-footer">
                  <div className="card-description">Live Weather Data</div>
                  <div className="card-source">via OpenWeather API</div>
                </div>
              </div>

              {/* AI Prediction */}
              <div className="temp-card">
                <div className="card-header">
                  <div className="card-icon ai-temp-icon">
                    <span>🤖</span>
                  </div>
                  <div className="card-info">
                    <div className="card-label">AI Forecast</div>
                    <div className="card-value">{predictionData.ai_predicted_temp?.toFixed(2)}°C</div>
                  </div>
                </div>
                <div className="card-footer">
                  <div className="card-description">Machine Learning Model</div>
                  <div className="card-source">Advanced Climate Analytics</div>
                </div>
              </div>

              {/* Temperature Variance */}
              <div className="temp-card">
                <div className="card-header">
                  <div className="card-icon variance-icon">
                    <span>📊</span>
                  </div>
                  <div className="card-info">
                    <div className="card-label">Variance</div>
                    <div className={`card-value ${tempDiff?.isPositive ? 'positive' : 'negative'}`}>
                      {tempDiff?.value}
                    </div>
                  </div>
                </div>
                <div className="card-footer">
                  <div className="card-description">Prediction Accuracy</div>
                  <div className="card-source">
                    {tempDiff?.magnitude < 1 ? 'High Confidence' : tempDiff?.magnitude < 2 ? 'Good Confidence' : 'Moderate Confidence'}
                  </div>
                </div>
              </div>
            </div>

            {/* Precipitation Analysis */}
            <div className="precipitation-card">
              <div className="precipitation-header">
                <div className="precipitation-info">
                  <div className="precipitation-icon">
                    <span>{rainfallAssessment.icon}</span>
                  </div>
                  <div>
                    <h3>Precipitation Analysis</h3>
                    <p>{rainfallAssessment.status}</p>
                  </div>
                </div>
                <div className="precipitation-value">
                  <div className="rainfall-amount">{predictionData.rainfall_mm} mm</div>
                  <div className="rainfall-period">Last Hour</div>
                </div>
              </div>
              
              <div className="rainfall-bar">
                <div 
                  className="rainfall-progress"
                  style={{ width: `${Math.min(predictionData.rainfall_mm * 10, 100)}%` }}
                ></div>
              </div>
              
              <div className="rainfall-scale">
                <span>0 mm</span>
                <span className="scale-description">{rainfallAssessment.description}</span>
                <span>10+ mm</span>
              </div>
            </div>

            {/* Risk Assessment & Advisory Grid */}
            <div className="advisory-grid">
              {/* Risk Assessment */}
              <div className={`advisory-card ${riskAnalysis.colorClass}`}>
                <div className="advisory-header">
                  <div className="advisory-info">
                    <div className="advisory-icon">
                      <span>🎯</span>
                    </div>
                    <div>
                      <h3>Risk Assessment</h3>
                      <div className="advisory-badge">
                        {riskAnalysis.level}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="advisory-content">
                  {predictionData.risk}
                </div>
                <div className="advisory-footer">
                  <div className="footer-title">Recommendation</div>
                  <div className="footer-text">Monitor conditions and implement preventive measures as needed</div>
                </div>
              </div>

              {/* Agricultural Advisory */}
              <div className={`advisory-card ${advisoryAnalysis.colorClass}`}>
                <div className="advisory-header">
                  <div className="advisory-info">
                    <div className="advisory-icon">
                      <span>🌾</span>
                    </div>
                    <div>
                      <h3>Agricultural Advisory</h3>
                      <div className="advisory-badge">
                        {advisoryAnalysis.priority}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="advisory-content">
                  {predictionData.advisory}
                </div>
                <div className="advisory-footer">
                  <div className="footer-title">Implementation</div>
                  <div className="footer-text">Follow suggested practices for optimal agricultural outcomes</div>
                </div>
              </div>
            </div>

            {/* Data Sources Footer */}
            <div className="sources-section">
              <h4>Data Sources & Technologies</h4>
              <div className="sources-grid">
                <div className="source-card">
                  <div className="source-icon">🌍</div>
                  <div className="source-name">OpenWeather API</div>
                  <div className="source-description">Real-time weather data</div>
                </div>
                <div className="source-card">
                  <div className="source-icon">🤖</div>
                  <div className="source-name">Machine Learning</div>
                  <div className="source-description">Predictive analytics</div>
                </div>
                <div className="source-card">
                  <div className="source-icon">📈</div>
                  <div className="source-name">Climate Models</div>
                  <div className="source-description">Historical analysis</div>
                </div>
                <div className="source-card">
                  <div className="source-icon">🛰️</div>
                  <div className="source-name">Satellite Data</div>
                  <div className="source-description">Remote sensing</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="app-footer">
        <div className="footer-content">
          <p>Professional Climate Analysis Platform • Powered by Advanced AI & Machine Learning</p>
          <p>© 2024 Climate Predictor. All rights reserved.</p>
        </div>
      </footer>

      <style jsx>{`
        /* Base styles */
        .app-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #f8fafc 0%, #ffffff 50%, #eff6ff 100%);
        }

        /* Navigation */
        .nav-header {
          background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(12px);
          border-bottom: 1px solid #e5e7eb;
          position: sticky;
          top: 0;
          z-index: 10;
        }

        .nav-content {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 1rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 4rem;
        }

        .nav-left {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .logo {
          width: 2rem;
          height: 2rem;
          background: linear-gradient(135deg, #2563eb, #4f46e5);
          border-radius: 0.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: bold;
          font-size: 0.875rem;
        }

        .app-title {
          font-size: 1.25rem;
          font-weight: 600;
          color: #111827;
          margin: 0;
        }

        .nav-right {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .update-time {
          font-size: 0.875rem;
          color: #6b7280;
        }

        .refresh-btn {
          padding: 0.5rem 1rem;
          border-radius: 0.5rem;
          font-weight: 500;
          border: none;
          cursor: pointer;
          transition: all 0.2s;
          background: #2563eb;
          color: white;
        }

        .refresh-btn:hover:not(.loading) {
          background: #1d4ed8;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }

        .refresh-btn.loading {
          background: #f3f4f6;
          color: #9ca3af;
          cursor: not-allowed;
        }

        .btn-content {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .spinner {
          width: 1rem;
          height: 1rem;
          border: 2px solid #9ca3af;
          border-top: 2px solid transparent;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        /* Main content */
        .main-content {
          max-width: 1280px;
          margin: 0 auto;
          padding: 2rem 1rem;
        }

        /* Error state */
        .error-container {
          margin-bottom: 2rem;
          background: #fef2f2;
          border: 1px solid #fecaca;
          border-radius: 0.75rem;
          padding: 1.5rem;
        }

        .error-content {
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
        }

        .error-icon {
          font-size: 2rem;
        }

        .error-text h3 {
          font-size: 1.125rem;
          font-weight: 600;
          color: #991b1b;
          margin: 0 0 0.5rem 0;
        }

        .error-message {
          color: #b91c1c;
          margin: 0.25rem 0;
        }

        .error-help {
          color: #dc2626;
          font-size: 0.875rem;
          margin: 0;
        }

        /* Loading state */
        .loading-container {
          margin-bottom: 2rem;
          background: #eff6ff;
          border: 1px solid #bfdbfe;
          border-radius: 0.75rem;
          padding: 2rem;
          text-align: center;
        }

        .loading-icon {
          font-size: 4rem;
          margin-bottom: 1rem;
        }

        .loading-container h3 {
          font-size: 1.125rem;
          font-weight: 600;
          color: #1e40af;
          margin: 0 0 0.5rem 0;
        }

        .loading-container p {
          color: #1d4ed8;
          margin: 0 0 1rem 0;
        }

        .loading-bar {
          width: 8rem;
          height: 0.25rem;
          background: #bfdbfe;
          border-radius: 9999px;
          margin: 0 auto;
          overflow: hidden;
        }

        .loading-progress {
          height: 100%;
          background: #2563eb;
          border-radius: 9999px;
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        /* Content sections */
        .content-sections {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        /* Header section */
        .header-section {
          background: white;
          border-radius: 1rem;
          box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
          border: 1px solid #f3f4f6;
          padding: 2rem;
          text-align: center;
        }

        .header-icon {
          font-size: 3rem;
          margin-bottom: 0.75rem;
        }

        .city-name {
          font-size: 3rem;
          font-weight: bold;
          color: #111827;
          margin: 0 0 0.5rem 0;
        }

        .header-subtitle {
          color: #4b5563;
          font-size: 1.125rem;
          margin: 0 0 1rem 0;
        }

        .status-badge {
          display: inline-flex;
          align-items: center;
          padding: 0.5rem 0.75rem;
          border-radius: 9999px;
          font-size: 0.875rem;
          font-weight: 500;
          background: #dbeafe;
          color: #1e40af;
          gap: 0.5rem;
        }

        .status-dot {
          width: 0.5rem;
          height: 0.5rem;
          background: #3b82f6;
          border-radius: 50%;
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }

        /* Temperature grid */
        .temp-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 1.5rem;
        }

        .temp-card {
          background: white;
          border-radius: 0.75rem;
          box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
          border: 1px solid #f3f4f6;
          padding: 1.5rem;
          transition: box-shadow 0.2s;
        }

        .temp-card:hover {
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }

        .card-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 1rem;
        }

        .card-icon {
          width: 3rem;
          height: 3rem;
          border-radius: 0.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2rem;
        }

        .current-temp-icon {
          background: #dbeafe;
        }

        .ai-temp-icon {
          background: #f3e8ff;
        }

        .variance-icon {
          background: #fed7aa;
        }

        .card-info {
          text-align: right;
        }

        .card-label {
          font-size: 0.875rem;
          font-weight: 500;
          color: #6b7280;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .card-value {
          font-size: 2rem;
          font-weight: bold;
          color: #111827;
          margin: 0;
        }

        .card-value.positive {
          color: #ea580c;
        }

        .card-value.negative {
          color: #2563eb;
        }

        .card-footer {
          padding-top: 1rem;
          border-top: 1px solid #f3f4f6;
        }

        .card-description {
          font-size: 0.875rem;
          color: #4b5563;
        }

        .card-source {
          font-size: 0.75rem;
          color: #6b7280;
          margin-top: 0.25rem;
        }

        /* Precipitation card */
        .precipitation-card {
          background: white;
          border-radius: 0.75rem;
          box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
          border: 1px solid #f3f4f6;
          padding: 1.5rem;
        }

        .precipitation-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 1.5rem;
        }

        .precipitation-info {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .precipitation-icon {
          width: 3rem;
          height: 3rem;
          background: #dbeafe;
          border-radius: 0.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2rem;
        }

        .precipitation-info h3 {
          font-size: 1.125rem;
          font-weight: 600;
          color: #111827;
          margin: 0;
        }

        .precipitation-info p {
          color: #4b5563;
          margin: 0;
        }

        .precipitation-value {
          text-align: right;
        }

        .rainfall-amount {
          font-size: 3rem;
          font-weight: bold;
          color: #2563eb;
        }

        .rainfall-period {
          font-size: 0.875rem;
          color: #6b7280;
        }

        .rainfall-bar {
          background: #f3f4f6;
          border-radius: 9999px;
          height: 0.75rem;
          margin-bottom: 1rem;
        }

        .rainfall-progress {
          background: linear-gradient(90deg, #60a5fa, #2563eb);
          height: 0.75rem;
          border-radius: 9999px;
          transition: width 0.5s;
        }

        .rainfall-scale {
          display: flex;
          justify-content: space-between;
          font-size: 0.875rem;
          color: #4b5563;
        }

        .scale-description {
          font-weight: 500;
        }

        /* Advisory grid */
        .advisory-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
          gap: 1.5rem;
        }

        .advisory-card {
          border-radius: 0.75rem;
          border: 2px solid;
          padding: 1.5rem;
        }

        /* Risk analysis colors */
        .risk-high {
          background: #fef2f2;
          border-color: #fecaca;
        }

        .risk-moderate {
          background: #fffbeb;
          border-color: #fde68a;
        }

        .risk-low {
          background: #f0fdf4;
          border-color: #bbf7d0;
        }

        .risk-available {
          background: #eff6ff;
          border-color: #bfdbfe;
        }

        .risk-unknown {
          background: #f9fafb;
          border-color: #e5e7eb;
        }

        /* Advisory colors */
        .advisory-urgent {
          background: #fef2f2;
          border-color: #fecaca;
        }

        .advisory-recommended {
          background: #eff6ff;
          border-color: #bfdbfe;
        }

        .advisory-available {
          background: #f0f9ff;
          border-color: #c7d2fe;
        }

        .advisory-standard {
          background: #f9fafb;
          border-color: #e5e7eb;
        }

        .advisory-header {
          margin-bottom: 1rem;
        }

        .advisory-info {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .advisory-icon {
          width: 2.5rem;
          height: 2.5rem;
          background: rgba(255, 255, 255, 0.7);
          border-radius: 0.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.25rem;
        }

        .advisory-info h3 {
          font-size: 1.125rem;
          font-weight: 600;
          color: #111827;
          margin: 0;
        }

        .advisory-badge {
          display: inline-flex;
          align-items: center;
          padding: 0.25rem 0.5rem;
          border-radius: 0.25rem;
          font-size: 0.75rem;
          font-weight: 500;
          background: rgba(255, 255, 255, 0.7);
          color: #374151;
          margin-top: 0.25rem;
        }

        .advisory-content {
          color: #1f2937;
          line-height: 1.6;
          margin-bottom: 1rem;
        }

        .advisory-footer {
          padding-top: 1rem;
          border-top: 1px solid rgba(255, 255, 255, 0.3);
        }

        .footer-title {
          font-size: 0.875rem;
          font-weight: 500;
          color: #374151;
        }

        .footer-text {
          font-size: 0.75rem;
          color: #4b5563;
          margin-top: 0.25rem;
        }

        /* Sources section */
        .sources-section {
          background: #f9fafb;
          border-radius: 0.75rem;
          padding: 1.5rem;
        }

        .sources-section h4 {
          font-size: 1.125rem;
          font-weight: 600;
          color: #111827;
          margin: 0 0 1rem 0;
          text-align: center;
        }

        .sources-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
        }

        .source-card {
          text-align: center;
          padding: 1rem;
          background: white;
          border-radius: 0.5rem;
          border: 1px solid #e5e7eb;
        }

        .source-icon {
          font-size: 2rem;
          margin-bottom: 0.5rem;
        }

        .source-name {
          font-size: 0.875rem;
          font-weight: 500;
          color: #111827;
        }

        .source-description {
          font-size: 0.75rem;
          color: #4b5563;
          margin-top: 0.25rem;
        }

        /* Footer */
        .app-footer {
          background: white;
          border-top: 1px solid #e5e7eb;
          margin-top: 4rem;
        }

        .footer-content {
          max-width: 1280px;
          margin: 0 auto;
          padding: 1.5rem 1rem;
          text-align: center;
          color: #6b7280;
          font-size: 0.875rem;
          gap:100px;
        }

        .footer-content p {
          margin: 0;
        }

        .footer-content p:first-child {
          margin-bottom: 0.25rem;
        }

        /* Responsive design */
        @media (max-width: 768px) {
          .nav-content {
            flex-direction: column;
            height: auto;
            padding: 1rem;
            gap: 1rem;
          }

          .nav-right {
            width: 100%;
            justify-content: space-between;
          }

          .main-content {
            padding: 1rem;
          }

          .temp-grid {
            grid-template-columns: 1fr;
          }

          .advisory-grid {
            grid-template-columns: 1fr;
          }

          .sources-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .precipitation-header {
            flex-direction: column;
            gap: 1rem;
            text-align: center;
          }

          .city-name {
            font-size: 2rem;
          }

          .card-header {
            flex-direction: column;
            gap: 1rem;
            text-align: center;
          }

          .card-info {
            text-align: center;
          }
        }

        @media (max-width: 480px) {
          .sources-grid {
            grid-template-columns: 1fr;
          }

          .nav-left {
            flex-direction: column;
            gap: 0.5rem;
          }

          .app-title {
            font-size: 1rem;
          }

          .city-name {
            font-size: 1.5rem;
          }

          .card-value {
            font-size: 1.5rem;
          }

          .rainfall-amount {
            font-size: 2rem;
          }
        }
      `}</style>
    </div>
  );
};

export default ClimatePredictor;