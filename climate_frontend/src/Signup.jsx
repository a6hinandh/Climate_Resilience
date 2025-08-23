import React, { useState } from 'react';
import { Shield, Eye, EyeOff, Mail, Lock, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';   // ✅ import
import './Signup.css';

const Signup = ({ onNavigate }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const navigate = useNavigate();  

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    
    // Handle signup logic here
    console.log('Signup attempt:', formData);
  };

  return (
    <div className="auth-page">
      {/* Navigation */}
      <nav className="nav nav-scrolled">
        <div className="nav-container">
          <div className="nav-content">
            <div className="nav-brand" onClick={() => navigate('/')}>
              <div className="nav-logo">
                <Shield className="icon-lg icon-blue" color='black' />
                <div className="nav-logo-pulse"></div>
              </div>
              <span className="nav-title">Climorae</span>
            </div>
            
            <div className="nav-links">
              <button onClick={() => navigate('/')} className="nav-link">Home</button>
              <button onClick={() => navigate('/login')} className="nav-signup-btn">Log In</button>
            </div>
          </div>
        </div>
      </nav>

      {/* Signup Form */}
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <div className="auth-icon">
              <Shield className="icon-xl icon-blue" />
            </div>
            <h1 className="auth-title">Join Climorae</h1>
            <p className="auth-subtitle">Create your account to start protecting your community</p>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <div className="input-wrapper">
                <User className="input-icon" />
                <input
                  type="text"
                  name="name"
                  className="form-input"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Email</label>
              <div className="input-wrapper">
                <Mail className="input-icon" />
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
                <Lock className="input-icon" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  className="form-input"
                  placeholder="Create a password"
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

            <div className="form-group">
              <label className="form-label">Confirm Password</label>
              <div className="input-wrapper">
                <Lock className="input-icon" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  className="form-input"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff className="icon" /> : <Eye className="icon" />}
                </button>
              </div>
            </div>

            <div className="form-options">
              <label className="checkbox-label">
                <input type="checkbox" className="checkbox" required />
                <span className="checkbox-text">
                  I agree to the <button type="button" className="link-btn">Terms of Service</button> and{' '}
                  <button type="button" className="link-btn">Privacy Policy</button>
                </span>
              </label>
            </div>

            <button type="submit" className="auth-submit-btn">
              Create Account
            </button>
          </form>

          <div className="auth-footer">
            <p className="auth-switch-text">
              Already have an account?{' '}
              <button 
                onClick={() => navigate('/login')}   // ✅ use navigate
                className="auth-switch-btn"
              >
                Sign in
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;