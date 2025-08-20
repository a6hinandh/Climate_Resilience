import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Sun, Droplets, Sprout, Bot, MapPin, Users, Zap, ArrowRight, Play, Star, Menu, X } from 'lucide-react';
import './LandingPage.css';

const LandingPage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Rotating testimonials
  const testimonials = [
    { text: "Climate Guardian saved our community from the last flood. The alerts were spot-on!", author: "Maria Santos, Community Leader" },
    { text: "The AI predictions helped us prepare our crops for the drought season.", author: "James Miller, Farmer" },
    { text: "Early heatwave warnings protect our elderly residents every summer.", author: "Dr. Sarah Chen, Public Health" }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const scrollToDemo = () => {
    document.getElementById('demo-section').scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="landing-page">
      {/* Navigation */}
{/* Navigation */}
<nav className={`nav ${scrollY > 50 ? 'nav-scrolled' : ''}`}>
  <div className="nav-container">
    <div className="nav-content">
      <div className="nav-brand">
        <div className="nav-logo">
          <Shield className="icon-lg icon-blue" />
          <div className="nav-logo-pulse"></div>
        </div>
        <span className="nav-title">
          Climate Guardian
        </span>
      </div>
      
      <div className="nav-links">
        <a href="#features" className="nav-link">Features</a>
        <a href="#demo" className="nav-link">Demo</a>
        <a href="#about" className="nav-link">About</a>
        
        {/* Auth buttons container */}
        <div className="nav-auth-buttons">
          <button className="nav-login-btn" onClick={() => navigate('/login')}>
                  Log In
                </button>
                <button className="nav-signup-btn" onClick={() => navigate('/signup')}>
                  Sign Up
                </button>
        </div>
      </div>

      <button 
        className="nav-mobile-toggle"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        {isMenuOpen ? <X className="icon" /> : <Menu className="icon" />}
      </button>
    </div>
  </div>

  {/* Mobile Menu */}
  {isMenuOpen && (
    <div className="nav-mobile-menu">
      <a href="#features">Features</a>
      <a href="#demo">Demo</a>
      <a href="#about">About</a>
      
      {/* Mobile auth buttons */}
      <div className="nav-mobile-auth-buttons">
        <button className="nav-mobile-login-btn" onClick={() => navigate('/login')}>
                Log In
              </button>
              <button className="nav-mobile-signup-btn" onClick={() => navigate('/signup')}>
                Sign Up
              </button>
      </div>
    </div>
  )}
</nav>

      {/* Hero Section */}
      <section className="hero-section">
      <div className="hero-container">
        <div className="hero-content-wrapper">
          {/* Right side - Image */}
          <div className="hero-image-container">
            <div className="hero-image-backdrop"></div>
            <img 
              src="/hero.png" 
              alt="Climate Guardian Dashboard" 
              className="hero-image"
            />
            <div className="hero-image-overlay">
              <div className="hero-stat-card">
                <div className="hero-stat-number">98%</div>
                <div className="hero-stat-label">Prediction Accuracy</div>
              </div>
            </div>
          </div>

          {/* Left side - Content */}
          <div className="hero-text-container">
            <div className="hero-badge">
              <Star className="hero-badge-icon" />
              <span className="hero-badge-text">AI-Powered Climate Intelligence</span>
            </div>
            
            <h1 className="hero-title">
              <span className="hero-title-main">Climate Resilience</span>
            </h1>
            
            <p className="hero-description">
              Advanced AI and IoT technology deliver real-time climate alerts and forecasts. 
              Protect your community from extreme weather events with intelligent early warning systems 
              trusted by over 1 million people worldwide.
            </p>

            <div className="hero-stats-inline">
              <div className="hero-stat-item">
                <span className="hero-stat-value">24/7</span>
                <span className="hero-stat-text">Monitoring</span>
              </div>
              <div className="hero-stat-item">
                <span className="hero-stat-value">1M+</span>
                <span className="hero-stat-text">Lives Protected</span>
              </div>
            </div>
            
            <div className="hero-actions">
              <button className="hero-primary-btn">
                Get Started Free
                <ArrowRight className="hero-btn-icon" />
              </button>
              <button 
                onClick={scrollToDemo}
                className="hero-secondary-btn"
              >
                <Play className="hero-btn-icon-left" />
                Watch Demo
              </button>
            </div>

            <div className="hero-trust-indicators">
              <div className="hero-trust-item">
                <Shield className="hero-trust-icon" />
                <span>Enterprise Security</span>
              </div>
              <div className="hero-trust-item">
                <div className="hero-trust-stars">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="hero-star" />
                  ))}
                </div>
                <span>Rated 4.9/5</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Background decorative elements */}
      <div className="hero-bg-decoration">
        <div className="hero-bg-circle hero-bg-circle-1"></div>
        <div className="hero-bg-circle hero-bg-circle-2"></div>
        <div className="hero-bg-circle hero-bg-circle-3"></div>
      </div>
    </section>

      {/* Features Section */}
      <section id="features" className="features">
        <div className="features-container">
          <div className="features-header">
            <h2 className="features-title">
              Powerful Features
            </h2>
            <p className="features-subtitle">
              Comprehensive climate monitoring and early warning systems powered by cutting-edge technology
            </p>
          </div>

          <div className="features-grid">
            <div className="feature-card orange">
              <div className="feature-icon orange">
                <Sun className="icon-lg" />
              </div>
              <h3 className="feature-title">Heatwave Prediction</h3>
              <p className="feature-description">Advanced AI models predict dangerous heat events 7 days in advance</p>
            </div>

            <div className="feature-card blue">
              <div className="feature-icon blue">
                <Droplets className="icon-lg" />
              </div>
              <h3 className="feature-title">Flood Alerts</h3>
              <p className="feature-description">Real-time monitoring of water levels and precipitation patterns</p>
            </div>

            <div className="feature-card green">
              <div className="feature-icon green">
                <Sprout className="icon-lg" />
              </div>
              <h3 className="feature-title">Drought Monitoring</h3>
              <p className="feature-description">Satellite data and soil sensors track moisture levels continuously</p>
            </div>

            <div className="feature-card purple">
              <div className="feature-icon purple">
                <Bot className="icon-lg" />
              </div>
              <h3 className="feature-title">AI Dashboard</h3>
              <p className="feature-description">Intelligent insights and automated recommendations for your area</p>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Demo Section */}
      <section id="demo-section" className="demo">
        <div className="demo-container">
          <div className="demo-header">
            <h2 className="demo-title">
              See It In Action
            </h2>
            <p className="demo-subtitle">
              Experience our real-time climate monitoring system with interactive demonstrations
            </p>
          </div>

          <div className="demo-content">
            <div className="demo-grid">
              <div className="demo-text">
                <h3>Live Climate Map</h3>
                <p>
                  Monitor real-time weather conditions, temperature zones, and alert areas. 
                  Our interactive map shows live data from thousands of sensors worldwide.
                </p>
                
                <div className="demo-buttons">
                  <button className="demo-button red">
                    <span className="demo-button-content">
                      <Sun className="icon mr-3" />
                      Trigger Heatwave Alert
                    </span>
                    <ArrowRight className="icon" />
                  </button>
                  <button className="demo-button blue">
                    <span className="demo-button-content">
                      <Droplets className="icon mr-3" />
                      Flood Risk Demo
                    </span>
                    <ArrowRight className="icon" />
                  </button>
                  <button className="demo-button green">
                    <span className="demo-button-content">
                      <Sprout className="icon mr-3" />
                      Drought Analysis
                    </span>
                    <ArrowRight className="icon" />
                  </button>
                </div>
              </div>
              
              <div className="demo-visual">
                <div className="demo-map">
                  <MapPin className="icon-xl icon-blue" style={{ animation: 'pulse 2s infinite' }} />
                  <div className="demo-live-indicator">
                    LIVE
                  </div>
                  <div className="demo-info">
                    <div className="demo-info-title">Global Coverage</div>
                    <div className="demo-info-subtitle">5,847 active sensors</div>
                  </div>
                  
                  {/* Animated dots */}
                  <div className="demo-dot red"></div>
                  <div className="demo-dot blue"></div>
                  <div className="demo-dot green"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="testimonial">
        <div className="testimonial-container">
          <h2 className="testimonial-title">Trusted by Communities Worldwide</h2>
          
          <div className="testimonial-content">
            <div className="testimonial-stars">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="icon icon-yellow" style={{ fill: 'currentColor' }} />
              ))}
            </div>
            <blockquote className="testimonial-quote">
              "{testimonials[currentTestimonial].text}"
            </blockquote>
            <cite className="testimonial-author">
              — {testimonials[currentTestimonial].author}
            </cite>
          </div>

          <div className="testimonial-dots">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentTestimonial(index)}
                className={`testimonial-dot ${index === currentTestimonial ? 'active' : 'inactive'}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="about">
        <div className="about-container">
          <div className="about-grid">
            <div className="about-text">
              <h2>
                The Climate Challenge
              </h2>
              <p className="large">
                Climate change is real. Communities worldwide face increasing threats from floods, 
                droughts, heatwaves, and extreme weather events. Traditional warning systems aren't enough.
              </p>
              <p>
                We bring cutting-edge technology to protect lives, combining AI, IoT sensors, and 
                satellite data to provide early warnings and actionable insights for climate resilience.
              </p>
              
              <div className="about-stats">
                <div className="about-stat blue">
                  <Users className="icon-lg icon-blue mx-auto mb-2" />
                  <div className="about-stat-title">Communities</div>
                  <div className="about-stat-subtitle">Protected</div>
                </div>
                <div className="about-stat green">
                  <Zap className="icon-lg icon-green mx-auto mb-2" />
                  <div className="about-stat-title">Real-time</div>
                  <div className="about-stat-subtitle">Intelligence</div>
                </div>
              </div>
            </div>
            
            <div className="about-visual">
              <div className="about-shield">
                <div className="about-shield-content">
                  <Shield className="icon-xl icon-blue mx-auto mb-4" />
                  <div className="about-shield-title">Protecting Families</div>
                  <div className="about-shield-subtitle">From climate extremes</div>
                </div>
                
                {/* Animated protection shield */}
                <div className="about-shield-ring outer"></div>
                <div className="about-shield-ring inner"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-container">
          <div className="footer-grid">
            <div className="footer-brand">
              <div className="footer-brand-header">
                <Shield className="icon-lg icon-blue-light" />
                <span className="footer-brand-title">Climate Guardian</span>
              </div>
              <p className="footer-brand-description">
                Empowering communities with AI-driven climate intelligence for a more resilient future.
              </p>
            </div>
            
            <div className="footer-section">
              <h3>Platform</h3>
              <div className="footer-links">
                <a href="#">Features</a>
                <a href="#">Pricing</a>
                <a href="#">Documentation</a>
                <a href="#">API</a>
              </div>
            </div>
            
            <div className="footer-section">
              <h3>Company</h3>
              <div className="footer-links">
                <a href="#">About</a>
                <a href="#">Team</a>
                <a href="#">Contact</a>
                <a href="#">Hackathon</a>
              </div>
            </div>
          </div>
          
          <div className="footer-bottom">
            <p className="footer-quote">
              "Seasons change. Our resilience remains."
            </p>
            <p className="footer-copyright">
              © 2025 Climate Guardian. Building a safer tomorrow through technology.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;