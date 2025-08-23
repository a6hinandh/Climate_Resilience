import React, { useState, useRef, useEffect } from 'react';
import { Send, Trash2, MessageCircle, Zap, Sun, Cloud, Thermometer, MapPin, Settings, X, ChevronDown, Menu, ChevronLeft, ChevronRight } from 'lucide-react';
import './Chatbot.css';
const API_BASE = import.meta.env.VITE_API_BASE || "http://127.0.0.1:8000";



const Chatbot = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      content: "Welcome to Climate Intelligence! I'm your AI-powered climate consultant, ready to provide expert insights on weather patterns, agricultural guidance, and urban sustainability solutions. How can I help you today?",
      timestamp: new Date(),
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [chatMode, setChatMode] = useState('general');
  const [error, setError] = useState(null);
  const [isMinimized, setIsMinimized] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [theme, setTheme] = useState('light');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
      if (window.innerWidth <= 768) {
        setSidebarCollapsed(true);
      }
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!isMinimized) {
      inputRef.current?.focus();
    }
  }, [chatMode, isMinimized]);

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date(),
      mode: chatMode
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);
    setError(null);

    try {
      // Enhanced simulation with mode-specific responses
      try {
        const res = await fetch(`${API_BASE}/chat`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ message: inputMessage, mode: chatMode })
});

        const data = await res.json();

        const botMessage = {
          id: Date.now() + 1,
          type: 'bot',
          content: data.response,
          timestamp: new Date(),
          mode: chatMode
        };
        setMessages(prev => [...prev, botMessage]);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsTyping(false);
      }
    } catch (err) {
      setError(err.message);
      setIsTyping(false);
      
      const errorMessage = {
        id: Date.now() + 1,
        type: 'error',
        content: `I apologize, but I couldn't process your request. Our climate data servers are temporarily unavailable. Please try again in a moment.`,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: 1,
        type: 'bot',
        content: `Fresh start! I'm ready to provide ${getModeDescription(chatMode)} insights with the latest climate data. What would you like to explore?`,
        timestamp: new Date(),
      }
    ]);
    setError(null);
  };

  const getModeDescription = (mode) => {
    switch (mode) {
      case 'farmer':
        return 'precision agriculture and farming';
      case 'urban':
        return 'smart city and urban sustainability';
      default:
        return 'comprehensive climate intelligence';
    }
  };

  const getModeIcon = (mode) => {
    switch (mode) {
      case 'farmer':
        return <Sun className="w-5 h-5" />;
      case 'urban':
        return <MapPin className="w-5 h-5" />;
      default:
        return <Cloud className="w-5 h-5" />;
    }
  };

  const formatTime = (timestamp) => {
    return timestamp.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const quickActions = {
    general: [
      "Climate trends in Kerala, India",
      "Monsoon forecast accuracy", 
      "Temperature anomaly analysis",
      "Extreme weather predictions"
    ],
    farmer: [
      "Rice cultivation schedule",
      "Monsoon irrigation planning",
      "Coconut plantation management",
      "Pest control in humid climate"
    ],
    urban: [
      "Air quality monitoring",
      "Coastal city planning",
      "Sustainable transportation",
      "Green building solutions"
    ]
  };

  const handleQuickAction = (action) => {
    setInputMessage(action);
    if (isMobile) {
      setSidebarCollapsed(true);
    }
  };

  const handleModeChange = (mode) => {
    setChatMode(mode);
    if (isMobile) {
      setSidebarCollapsed(true);
    }
  };

  if (isMinimized) {
    return (
      <div className="minimized">
        <button
          className="minimized-button"
          onClick={() => setIsMinimized(false)}
        >
          <MessageCircle className="w-6 h-6" />
          <div className="minimized-text">
            <div className="minimized-title">Climate Assistant</div>
            <div className="minimized-subtitle">Click to expand</div>
          </div>
        </button>
      </div>
    );
  }

  return (
    <div className={`chatbot-container ${theme === 'dark' ? 'dark-theme' : ''}`}>
      {/* Sidebar */}
      <div className={`sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-title">
            <Zap className="w-5 h-5" />
            {!sidebarCollapsed && <span>Quick Access</span>}
          </div>
          <button 
            className="sidebar-toggle"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          >
            {sidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {!sidebarCollapsed && (
          <div className="sidebar-content">
            {/* Expertise Modes */}
            <div className="sidebar-section">
              <h3 className="section-title">Expertise Mode</h3>
              <div className="mode-buttons">
                {[
                  { key: 'general', label: 'General Climate', icon: <Cloud className="w-4 h-4" /> },
                  { key: 'farmer', label: 'Agriculture', icon: <Sun className="w-4 h-4" /> },
                  { key: 'urban', label: 'Urban Planning', icon: <MapPin className="w-4 h-4" /> }
                ].map((mode) => (
                  <button
                    key={mode.key}
                    className={`mode-btn ${chatMode === mode.key ? 'active' : ''}`}
                    onClick={() => handleModeChange(mode.key)}
                  >
                    {mode.icon}
                    <span>{mode.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Popular Queries */}
            <div className="sidebar-section">
              <h3 className="section-title">Popular Queries</h3>
              <div className="quick-buttons">
                {quickActions[chatMode].map((action, index) => (
                  <button
                    key={index}
                    className="quick-btn"
                    onClick={() => handleQuickAction(action)}
                  >
                    {action}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="main-content">
        {/* Header */}
        <div className="header">
          <div className="header-left">
            {isMobile && (
              <button 
                className="mobile-menu-btn"
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              >
                <Menu className="w-5 h-5" />
              </button>
            )}
            <div className="title-section">
              <div className="title-row">
                <Thermometer className="w-6 h-6 text-blue-600" />
                <h1 className="title">Climate Intelligence</h1>
              </div>
              <span className="subtitle">AI-Powered Climate Analytics & Advisory</span>
            </div>
            <div className="status-indicator">
              <div className="status-dot"></div>
              <span className="status-text">Live Data</span>
            </div>
          </div>
          <div className="header-actions">
            <button 
              className="action-btn" 
              onClick={() => setShowSettings(!showSettings)}
              title="Settings"
            >
              <Settings className="w-4 h-4" />
            </button>
            <button 
              className="action-btn" 
              onClick={clearChat} 
              title="New Conversation"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button 
              className="action-btn" 
              onClick={() => setIsMinimized(true)}
              title="Minimize"
            >
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Settings Panel */}
        {showSettings && (
          <div className="settings-panel">
            <div className="settings-header">
              <span className="settings-title">Settings</span>
              <button 
                className="settings-close"
                onClick={() => setShowSettings(false)}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="settings-content">
              <div className="setting-item">
                <span className="setting-label">Theme</span>
                <div className="theme-toggle">
                  <button
                    className={`theme-btn ${theme === 'light' ? 'active' : ''}`}
                    onClick={() => setTheme('light')}
                  >
                    Light
                  </button>
                  <button
                    className={`theme-btn ${theme === 'dark' ? 'active' : ''}`}
                    onClick={() => setTheme('dark')}
                  >
                    Dark
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Messages Area */}
        <div className="messages-container">
          <div className="messages-list">
            {messages.map((message) => (
              <div key={message.id} className="message-wrapper">
                <div className={`message ${message.type === 'user' ? 'user' : ''} ${message.type === 'error' ? 'error' : ''}`}>
                  <div className="message-content">
                    <div className={`avatar ${message.type === 'user' ? 'user' : ''} ${message.type === 'error' ? 'error' : ''}`}>
                      {message.type === 'bot' && <Thermometer className="w-5 h-5" />}
                      {message.type === 'user' && <div className="user-avatar">You</div>}
                      {message.type === 'error' && <X className="w-4 h-4" />}
                    </div>
                    <div className="message-body">
                      <div className="message-text">
                        {message.content}
                      </div>
                      <div className="message-meta">
                        <span className="message-time">
                          {formatTime(message.timestamp)}
                        </span>
                        {message.mode && (
                          <span className="message-mode">
                            {getModeIcon(message.mode)}
                            <span>{message.mode}</span>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {/* Typing Indicator */}
            {isTyping && (
              <div className="message-wrapper">
                <div className="message">
                  <div className="message-content">
                    <div className="avatar">
                      <Thermometer className="w-5 h-5" />
                    </div>
                    <div className="typing-body">
                      <div className="typing-indicator">
                        <div className="typing-dots">
                          <span className="dot"></span>
                          <span className="dot" style={{ animationDelay: '0.2s' }}></span>
                          <span className="dot" style={{ animationDelay: '0.4s' }}></span>
                        </div>
                        <span className="typing-text">Processing climate data...</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Error Banner */}
        {error && (
          <div className="error-banner">
            <X className="w-5 h-5" />
            <span className="error-text">Connection Issue: {error}</span>
            <button className="error-dismiss" onClick={() => setError(null)}>
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Input Area */}
        <div className="input-container">
          <div className="input-wrapper">
            <div className="input-group">
              <textarea
                ref={inputRef}
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={`Ask about ${getModeDescription(chatMode)}...`}
                className="message-input"
                rows="1"
                disabled={isTyping}
              />
              <button
                onClick={sendMessage}
                className={`send-btn ${(!inputMessage.trim() || isTyping) ? 'disabled' : ''}`}
                disabled={!inputMessage.trim() || isTyping}
              >
                {isTyping ? (
                  <div className="loading-spinner"></div>
                ) : (
                  <Send className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
          <div className="input-hint">
            <span>Press Enter to send • Shift+Enter for new line</span>
            <span className="message-count">{messages.length - 1} messages</span>
          </div>
        </div>

        {/* Footer */}
        <div className="footer">
          <div className="footer-content">
            <span className="footer-text">
              Powered by Advanced Climate AI
            </span>
            <div className="footer-badge">
              {getModeIcon(chatMode)}
              <span>{chatMode.charAt(0).toUpperCase() + chatMode.slice(1)} Mode</span>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isMobile && !sidebarCollapsed && (
        <div 
          className="sidebar-overlay"
          onClick={() => setSidebarCollapsed(true)}
        />
      )}
    </div>
  );
};

export default Chatbot;