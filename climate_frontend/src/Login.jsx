import React, { useState } from 'react';
import { Shield, Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = ({ onNavigate }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle login logic here
    console.log('Login attempt:', formData);

    navigate('/dashboard');
  };

  return (
    <div className="auth-page">
      {/* Navigation */}
      <nav className="nav nav-scrolled">
        <div className="nav-container">
          <div className="nav-content">
            <div className="nav-brand" onClick={() => onNavigate('landing')}>
              <div className="nav-logo">
                <Shield className="icon-lg icon-blue" color='black' />
                <div className="nav-logo-pulse"></div>
              </div>
              <span className="nav-title">Climorae</span>
            </div>
            
            <div className="nav-links">
              <button onClick={() => navigate('/')} className="nav-link">Home</button>
              <button onClick={() => navigate('/signup')} className="nav-signup-btn">Sign Up</button>
            </div>
          </div>
        </div>
      </nav>

      {/* Login Form */}
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <div className="auth-icon">
              <Shield className="icon-xl icon-blue" />
            </div>
            <h1 className="auth-title">Welcome Back</h1>
            <p className="auth-subtitle">Sign in to your Climorae account</p>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Email</label>
             
              <div className="input-wrapper">
                 <Mail size={20} className="input-icon"/>
                <input
                  type="email"
                  name="email"
                  className="form-input"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <div className="input-wrapper">
                <Lock className="input-icon"/>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  className="form-input"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="icon" /> : <Eye className="icon" />}
                </button>
              </div>
            </div>

            <div className="form-options">
              <label className="checkbox-label">
                <input type="checkbox" className="checkbox" />
                <span className="checkbox-text">Remember me</span>
              </label>
              <button type="button" className="forgot-password">
                Forgot password?
              </button>
            </div>

            <button type="submit" className="auth-submit-btn">
              Sign In
            </button>
          </form>

          <div className="auth-footer">
            <p className="auth-switch-text">
              Don't have an account?{' '}
              <button 
                onClick={() => onNavigate('signup')} 
                className="auth-switch-btn"
              >
                Sign up
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;