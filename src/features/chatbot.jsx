import React, { useState, useRef, useEffect } from 'react';
import { Send, Trash2, MessageCircle, Zap, Sun, Cloud, Thermometer, MapPin, Settings, X, ChevronDown } from 'lucide-react';

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
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

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
  const res = await fetch("http://localhost:8000/chat", {
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
        return <Sun className="w-4 h-4" />;
      case 'urban':
        return <MapPin className="w-4 h-4" />;
      default:
        return <Cloud className="w-4 h-4" />;
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

  const currentStyles = theme === 'dark' ? darkStyles : lightStyles;

  if (isMinimized) {
    return (
      <div style={currentStyles.minimized}>
        <button
          style={currentStyles.minimizedButton}
          onClick={() => setIsMinimized(false)}
        >
          <MessageCircle className="w-6 h-6" />
          <div style={currentStyles.minimizedText}>
            <div style={currentStyles.minimizedTitle}>Climate Assistant</div>
            <div style={currentStyles.minimizedSubtitle}>Click to expand</div>
          </div>
        </button>
      </div>
    );
  }

  return (
    <div style={currentStyles.container} className="chatbot-container">
      {/* Enhanced Header */}
      <div style={currentStyles.header}>
        <div style={currentStyles.headerLeft}>
          <div style={currentStyles.titleSection}>
            <div style={currentStyles.titleRow}>
              <Thermometer className="w-6 h-6 text-blue-600" />
              <h1 style={currentStyles.title}>Climate Intelligence</h1>
            </div>
            <span style={currentStyles.subtitle}>AI-Powered Climate Analytics & Advisory</span>
          </div>
          <div style={currentStyles.statusIndicator}>
            <div style={currentStyles.statusDot}></div>
            <span style={currentStyles.statusText}>Live Data</span>
          </div>
        </div>
        <div style={currentStyles.headerActions}>
          <button 
            style={currentStyles.actionBtn} 
            onClick={() => setShowSettings(!showSettings)}
            title="Settings"
          >
            <Settings className="w-4 h-4" />
          </button>
          <button 
            style={currentStyles.actionBtn} 
            onClick={clearChat} 
            title="New Conversation"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          <button 
            style={currentStyles.actionBtn} 
            onClick={() => setIsMinimized(true)}
            title="Minimize"
          >
            <ChevronDown className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div style={currentStyles.settingsPanel}>
          <div style={currentStyles.settingsHeader}>
            <span style={currentStyles.settingsTitle}>Settings</span>
            <button 
              style={currentStyles.settingsClose}
              onClick={() => setShowSettings(false)}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div style={currentStyles.settingsContent}>
            <div style={currentStyles.settingItem}>
              <span style={currentStyles.settingLabel}>Theme</span>
              <div style={currentStyles.themeToggle}>
                <button
                  style={{
                    ...currentStyles.themeBtn,
                    ...(theme === 'light' ? currentStyles.themeBtnActive : {})
                  }}
                  onClick={() => setTheme('light')}
                >
                  Light
                </button>
                <button
                  style={{
                    ...currentStyles.themeBtn,
                    ...(theme === 'dark' ? currentStyles.themeBtnActive : {})
                  }}
                  onClick={() => setTheme('dark')}
                >
                  Dark
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Mode Selector */}
      <div style={currentStyles.modeSelector}>
        <div style={currentStyles.modeLabel}>
          <Zap className="w-4 h-4" />
          <span>Expertise Mode</span>
        </div>
        <div style={currentStyles.modeButtons}>
          {[
            { key: 'general', label: 'General Climate', icon: <Cloud className="w-4 h-4" /> },
            { key: 'farmer', label: 'Agriculture', icon: <Sun className="w-4 h-4" /> },
            { key: 'urban', label: 'Urban Planning', icon: <MapPin className="w-4 h-4" /> }
          ].map((mode) => (
            <button
              key={mode.key}
              style={{
                ...currentStyles.modeBtn,
                ...(chatMode === mode.key ? currentStyles.modeBtnActive : {})
              }}
              onClick={() => setChatMode(mode.key)}
            >
              {mode.icon}
              <span>{mode.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Enhanced Quick Actions */}
      <div style={currentStyles.quickActions}>
        <div style={currentStyles.quickLabel}>Popular Queries</div>
        <div style={currentStyles.quickButtons}>
          {quickActions[chatMode].map((action, index) => (
            <button
              key={index}
              style={currentStyles.quickBtn}
              onClick={() => setInputMessage(action)}
            >
              {action}
            </button>
          ))}
        </div>
      </div>

      {/* Enhanced Messages Area */}
      <div style={currentStyles.messagesContainer}>
        <div style={currentStyles.messagesList}>
          {messages.map((message) => (
            <div key={message.id} style={currentStyles.messageWrapper}>
              <div style={{
                ...currentStyles.message,
                ...(message.type === 'user' ? currentStyles.messageUser : {}),
                ...(message.type === 'error' ? currentStyles.messageError : {})
              }}>
                <div style={currentStyles.messageContent}>
                  <div style={{
                    ...currentStyles.avatar,
                    ...(message.type === 'user' ? currentStyles.avatarUser : {}),
                    ...(message.type === 'error' ? currentStyles.avatarError : {})
                  }}>
                    {message.type === 'bot' && <Thermometer className="w-5 h-5" />}
                    {message.type === 'user' && <div style={currentStyles.userAvatar}>You</div>}
                    {message.type === 'error' && <X className="w-4 h-4" />}
                  </div>
                  <div style={currentStyles.messageBody}>
                    <div style={currentStyles.messageText}>
                      {message.content}
                    </div>
                    <div style={currentStyles.messageMeta}>
                      <span style={currentStyles.messageTime}>
                        {formatTime(message.timestamp)}
                      </span>
                      {message.mode && (
                        <span style={currentStyles.messageMode}>
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
          
          {/* Enhanced Typing Indicator */}
          {isTyping && (
            <div style={currentStyles.messageWrapper}>
              <div style={currentStyles.message}>
                <div style={currentStyles.messageContent}>
                  <div style={currentStyles.avatar}>
                    <Thermometer className="w-5 h-5" />
                  </div>
                  <div style={currentStyles.typingBody}>
                    <div style={currentStyles.typingIndicator}>
                      <div style={currentStyles.typingDots}>
                        <span style={currentStyles.dot}></span>
                        <span style={{...currentStyles.dot, animationDelay: '0.2s'}}></span>
                        <span style={{...currentStyles.dot, animationDelay: '0.4s'}}></span>
                      </div>
                      <span style={currentStyles.typingText}>Processing climate data...</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Enhanced Error Banner */}
      {error && (
        <div style={currentStyles.errorBanner}>
          <X className="w-5 h-5" />
          <span style={currentStyles.errorText}>Connection Issue: {error}</span>
          <button style={currentStyles.errorDismiss} onClick={() => setError(null)}>
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Enhanced Input Area */}
      <div style={currentStyles.inputContainer}>
        <div style={currentStyles.inputWrapper}>
          <div style={currentStyles.inputGroup}>
            <textarea
              ref={inputRef}
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={`Ask about ${getModeDescription(chatMode)}...`}
              style={currentStyles.messageInput}
              rows="1"
              disabled={isTyping}
            />
            <button
              onClick={sendMessage}
              style={{
                ...currentStyles.sendBtn,
                ...((!inputMessage.trim() || isTyping) ? currentStyles.sendBtnDisabled : {})
              }}
              disabled={!inputMessage.trim() || isTyping}
            >
              {isTyping ? (
                <div style={currentStyles.loadingSpinner}></div>
              ) : (
                <Send className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
        <div style={currentStyles.inputHint}>
          <span>Press Enter to send • Shift+Enter for new line</span>
          <span style={currentStyles.messageCount}>{messages.length - 1} messages</span>
        </div>
      </div>

      {/* Enhanced Footer */}
      <div style={currentStyles.footer}>
        <div style={currentStyles.footerContent}>
          <span style={currentStyles.footerText}>
            Powered by Advanced Climate AI
          </span>
          <div style={currentStyles.footerBadge}>
            {getModeIcon(chatMode)}
            <span>{chatMode.charAt(0).toUpperCase() + chatMode.slice(1)} Mode</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Light theme styles
const lightStyles = {
  container: {
    maxWidth: '1200px',
    margin: '20px auto',
    height: 'calc(100vh - 40px)',
    display: 'flex',
    flexDirection: 'column',
    background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 50%, #e2e8f0 100%)',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    borderRadius: '24px',
    overflow: 'hidden',
    boxShadow: '0 25px 50px rgba(0,0,0,0.15), 0 0 0 1px rgba(255,255,255,0.05)',
    border: '1px solid rgba(226, 232, 240, 0.8)',
    position: 'relative'
  },

  minimized: {
    position: 'fixed',
    bottom: '30px',
    right: '30px',
    zIndex: 1000
  },

  minimizedButton: {
    background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
    border: 'none',
    borderRadius: '60px',
    padding: '16px 24px',
    color: 'white',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    boxShadow: '0 10px 25px rgba(59, 130, 246, 0.4)',
    transition: 'all 0.3s ease',
    fontSize: '0.9rem',
    fontWeight: '600'
  },

  minimizedText: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start'
  },

  minimizedTitle: {
    fontSize: '0.9rem',
    fontWeight: '600'
  },

  minimizedSubtitle: {
    fontSize: '0.75rem',
    opacity: 0.9
  },

  header: {
    background: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(20px)',
    borderBottom: '1px solid rgba(226, 232, 240, 0.6)',
    padding: '24px 32px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexShrink: 0,
    position: 'relative'
  },

  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '24px'
  },

  titleSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px'
  },

  titleRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  },

  title: {
    fontSize: '1.75rem',
    color: '#1e293b',
    margin: 0,
    fontWeight: '800',
    letterSpacing: '-0.025em',
    background: 'linear-gradient(135deg, #1e293b 0%, #3b82f6 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent'
  },

  subtitle: {
    fontSize: '0.9rem',
    color: '#64748b',
    fontWeight: '500',
    letterSpacing: '0.025em'
  },

  statusIndicator: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    background: 'rgba(34, 197, 94, 0.1)',
    padding: '8px 16px',
    borderRadius: '24px',
    border: '1px solid rgba(34, 197, 94, 0.2)'
  },

  statusDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    background: '#22c55e',
    animation: 'pulse 2s infinite'
  },

  statusText: {
    fontSize: '0.8rem',
    color: '#16a34a',
    fontWeight: '600'
  },

  headerActions: {
    display: 'flex',
    gap: '8px'
  },

  actionBtn: {
    background: 'rgba(71, 85, 105, 0.08)',
    border: '1px solid rgba(71, 85, 105, 0.15)',
    color: '#475569',
    padding: '10px',
    borderRadius: '12px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },

  settingsPanel: {
    background: 'rgba(255, 255, 255, 0.98)',
    backdropFilter: 'blur(20px)',
    borderBottom: '1px solid rgba(226, 232, 240, 0.6)',
    padding: '20px 32px',
    flexShrink: 0
  },

  settingsHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px'
  },

  settingsTitle: {
    fontSize: '1rem',
    fontWeight: '600',
    color: '#374151'
  },

  settingsClose: {
    background: 'none',
    border: 'none',
    color: '#6b7280',
    cursor: 'pointer',
    padding: '4px'
  },

  settingsContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  },

  settingItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },

  settingLabel: {
    fontSize: '0.9rem',
    color: '#374151',
    fontWeight: '500'
  },

  themeToggle: {
    display: 'flex',
    background: 'rgba(243, 244, 246, 0.8)',
    borderRadius: '12px',
    padding: '2px'
  },

  themeBtn: {
    background: 'transparent',
    border: 'none',
    padding: '6px 12px',
    borderRadius: '10px',
    cursor: 'pointer',
    fontSize: '0.8rem',
    fontWeight: '500',
    color: '#6b7280',
    transition: 'all 0.2s ease'
  },

  themeBtnActive: {
    background: 'white',
    color: '#374151',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  },

  modeSelector: {
    background: 'rgba(255, 255, 255, 0.8)',
    backdropFilter: 'blur(10px)',
    padding: '20px 32px',
    borderBottom: '1px solid rgba(226, 232, 240, 0.6)',
    flexShrink: 0
  },

  modeLabel: {
    color: '#374151',
    fontSize: '0.9rem',
    marginBottom: '16px',
    fontWeight: '600',
    letterSpacing: '0.025em',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },

  modeButtons: {
    display: 'flex',
    gap: '12px',
    flexWrap: 'wrap'
  },

  modeBtn: {
    background: 'rgba(255, 255, 255, 0.9)',
    border: '1px solid rgba(203, 213, 225, 0.6)',
    color: '#64748b',
    padding: '12px 20px',
    borderRadius: '16px',
    cursor: 'pointer',
    fontSize: '0.9rem',
    fontWeight: '600',
    transition: 'all 0.3s ease',
    backdropFilter: 'blur(10px)',
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },

  modeBtnActive: {
    background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
    color: 'white',
    borderColor: '#3b82f6',
    boxShadow: '0 8px 25px rgba(59, 130, 246, 0.3)',
    transform: 'translateY(-2px)'
  },

  quickActions: {
    background: 'rgba(255, 255, 255, 0.6)',
    backdropFilter: 'blur(10px)',
    padding: '18px 32px',
    borderBottom: '1px solid rgba(226, 232, 240, 0.6)',
    flexShrink: 0
  },

  quickLabel: {
    color: '#374151',
    fontSize: '0.85rem',
    marginBottom: '12px',
    fontWeight: '600'
  },

  quickButtons: {
    display: 'flex',
    gap: '10px',
    flexWrap: 'wrap'
  },

  quickBtn: {
    background: 'rgba(255, 255, 255, 0.95)',
    border: '1px solid rgba(203, 213, 225, 0.4)',
    color: '#4b5563',
    padding: '10px 16px',
    borderRadius: '20px',
    cursor: 'pointer',
    fontSize: '0.8rem',
    fontWeight: '500',
    transition: 'all 0.2s ease',
    boxShadow: '0 2px 6px rgba(0,0,0,0.04)'
  },

  messagesContainer: {
    flex: 1,
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    background: 'rgba(248, 250, 252, 0.4)',
    position: 'relative'
  },

  messagesList: {
    flex: 1,
    overflowY: 'auto',
    padding: '30px 32px',
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
    scrollBehavior: 'smooth'
  },

  messageWrapper: {
    display: 'flex',
    flexDirection: 'column',
    animation: 'messageAppear 0.3s ease-out'
  },

  message: {
    display: 'flex',
    maxWidth: '80%'
  },

  messageUser: {
    alignSelf: 'flex-end'
  },

  messageError: {
    alignSelf: 'flex-start'
  },

  messageContent: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '14px',
    width: '100%'
  },

  avatar: {
    width: '42px',
    height: '42px',
    borderRadius: '16px',
    background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.1rem',
    flexShrink: 0,
    boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
    color: 'white'
  },

  avatarUser: {
    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
  },

  avatarError: {
    background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
    boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)'
  },

  userAvatar: {
    fontSize: '0.7rem',
    fontWeight: '700',
    color: 'white'
  },

  messageBody: {
    background: 'rgba(255, 255, 255, 0.95)',
    borderRadius: '20px',
    padding: '18px 22px',
    boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
    backdropFilter: 'blur(12px)',
    border: '1px solid rgba(226, 232, 240, 0.4)',
    flex: 1
  },

  messageText: {
    lineHeight: 1.65,
    marginBottom: '12px',
    color: '#374151',
    fontSize: '0.95rem'
  },

  messageMeta: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '10px'
  },

  messageTime: {
    fontSize: '0.75rem',
    color: '#9ca3af',
    fontWeight: '500'
  },

  messageMode: {
    fontSize: '0.7rem',
    background: 'rgba(59, 130, 246, 0.1)',
    padding: '4px 10px',
    borderRadius: '12px',
    color: '#3b82f6',
    fontWeight: '600',
    display: 'flex',
    alignItems: 'center',
    gap: '4px'
  },

  typingBody: {
    background: 'rgba(255, 255, 255, 0.95)',
    borderRadius: '20px',
    padding: '18px 22px',
    boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
    backdropFilter: 'blur(12px)',
    border: '1px solid rgba(226, 232, 240, 0.4)'
  },

  typingIndicator: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  },

  typingDots: {
    display: 'flex',
    gap: '4px'
  },

  dot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    background: '#3b82f6',
    animation: 'typing 1.4s ease-in-out infinite both'
  },

  typingText: {
    fontSize: '0.9rem',
    color: '#6b7280',
    fontStyle: 'italic',
    fontWeight: '500'
  },

  errorBanner: {
    background: 'rgba(254, 242, 242, 0.95)',
    border: '1px solid rgba(252, 165, 165, 0.6)',
    color: '#dc2626',
    padding: '14px 24px',
    margin: '0 32px',
    borderRadius: '16px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '16px',
    flexShrink: 0,
    backdropFilter: 'blur(10px)'
  },

  errorText: {
    flex: 1,
    fontSize: '0.9rem',
    fontWeight: '500'
  },

  errorDismiss: {
    background: 'none',
    border: 'none',
    color: '#dc2626',
    cursor: 'pointer',
    padding: '4px',
    borderRadius: '6px',
    transition: 'background 0.2s ease',
    display: 'flex',
    alignItems: 'center'
  },

  inputContainer: {
    background: 'rgba(255, 255, 255, 0.98)',
    backdropFilter: 'blur(20px)',
    borderTop: '1px solid rgba(226, 232, 240, 0.6)',
    padding: '24px 32px',
    flexShrink: 0
  },

  inputWrapper: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },

  inputGroup: {
    display: 'flex',
    gap: '12px',
    alignItems: 'flex-end'
  },

  messageInput: {
    flex: 1,
    background: 'rgba(255, 255, 255, 0.95)',
    border: '2px solid rgba(226, 232, 240, 0.6)',
    borderRadius: '20px',
    padding: '16px 24px',
    fontSize: '0.95rem',
    resize: 'none',
    maxHeight: '120px',
    minHeight: '54px',
    outline: 'none',
    transition: 'all 0.3s ease',
    fontFamily: 'inherit',
    lineHeight: '1.5',
    color: '#374151',
    boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
  },

  sendBtn: {
    background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
    border: 'none',
    color: 'white',
    width: '54px',
    height: '54px',
    borderRadius: '18px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.3s ease',
    boxShadow: '0 8px 20px rgba(59, 130, 246, 0.3)'
  },

  sendBtnDisabled: {
    opacity: 0.5,
    cursor: 'not-allowed',
    transform: 'none',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
  },

  loadingSpinner: {
    width: '18px',
    height: '18px',
    border: '2px solid rgba(255,255,255,0.3)',
    borderTop: '2px solid white',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite'
  },

  inputHint: {
    fontSize: '0.75rem',
    color: '#9ca3af',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontWeight: '500'
  },

  messageCount: {
    background: 'rgba(59, 130, 246, 0.1)',
    color: '#3b82f6',
    padding: '4px 10px',
    borderRadius: '12px',
    fontSize: '0.7rem',
    fontWeight: '600'
  },

  footer: {
    background: 'rgba(255, 255, 255, 0.9)',
    backdropFilter: 'blur(10px)',
    borderTop: '1px solid rgba(226, 232, 240, 0.6)',
    padding: '16px 32px',
    flexShrink: 0
  },

  footerContent: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },

  footerText: {
    color: '#64748b',
    fontSize: '0.8rem',
    fontWeight: '500'
  },

  footerBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    background: 'rgba(59, 130, 246, 0.1)',
    color: '#3b82f6',
    padding: '6px 12px',
    borderRadius: '16px',
    fontSize: '0.75rem',
    fontWeight: '600'
  }
};

// Dark theme styles
const darkStyles = {
  ...lightStyles,
  container: {
    ...lightStyles.container,
    background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)',
    border: '1px solid rgba(71, 85, 105, 0.3)'
  },

  header: {
    ...lightStyles.header,
    background: 'rgba(15, 23, 42, 0.95)',
    borderBottom: '1px solid rgba(71, 85, 105, 0.3)'
  },

  title: {
    ...lightStyles.title,
    color: '#f1f5f9',
    background: 'linear-gradient(135deg, #f1f5f9 0%, #3b82f6 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent'
  },

  subtitle: {
    ...lightStyles.subtitle,
    color: '#94a3b8'
  },

  actionBtn: {
    ...lightStyles.actionBtn,
    background: 'rgba(71, 85, 105, 0.2)',
    border: '1px solid rgba(71, 85, 105, 0.3)',
    color: '#94a3b8'
  },

  modeSelector: {
    ...lightStyles.modeSelector,
    background: 'rgba(15, 23, 42, 0.8)',
    borderBottom: '1px solid rgba(71, 85, 105, 0.3)'
  },

  modeLabel: {
    ...lightStyles.modeLabel,
    color: '#e2e8f0'
  },

  modeBtn: {
    ...lightStyles.modeBtn,
    background: 'rgba(30, 41, 59, 0.9)',
    border: '1px solid rgba(71, 85, 105, 0.4)',
    color: '#94a3b8'
  },

  quickActions: {
    ...lightStyles.quickActions,
    background: 'rgba(15, 23, 42, 0.6)',
    borderBottom: '1px solid rgba(71, 85, 105, 0.3)'
  },

  quickLabel: {
    ...lightStyles.quickLabel,
    color: '#e2e8f0'
  },

  quickBtn: {
    ...lightStyles.quickBtn,
    background: 'rgba(30, 41, 59, 0.95)',
    border: '1px solid rgba(71, 85, 105, 0.3)',
    color: '#cbd5e1'
  },

  messagesContainer: {
    ...lightStyles.messagesContainer,
    background: 'rgba(15, 23, 42, 0.4)'
  },

  messageBody: {
    ...lightStyles.messageBody,
    background: 'rgba(30, 41, 59, 0.95)',
    border: '1px solid rgba(71, 85, 105, 0.3)'
  },

  messageText: {
    ...lightStyles.messageText,
    color: '#e2e8f0'
  },

  typingBody: {
    ...lightStyles.typingBody,
    background: 'rgba(30, 41, 59, 0.95)',
    border: '1px solid rgba(71, 85, 105, 0.3)'
  },

  inputContainer: {
    ...lightStyles.inputContainer,
    background: 'rgba(15, 23, 42, 0.98)',
    borderTop: '1px solid rgba(71, 85, 105, 0.3)'
  },

  messageInput: {
    ...lightStyles.messageInput,
    background: 'rgba(30, 41, 59, 0.95)',
    border: '2px solid rgba(71, 85, 105, 0.3)',
    color: '#e2e8f0'
  },

  footer: {
    ...lightStyles.footer,
    background: 'rgba(15, 23, 42, 0.9)',
    borderTop: '1px solid rgba(71, 85, 105, 0.3)'
  },

  footerText: {
    ...lightStyles.footerText,
    color: '#94a3b8'
  }
};

// Enhanced animations and styles
const styleSheet = document.createElement('style');
styleSheet.type = 'text/css';
styleSheet.innerText = `
@keyframes pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.7; transform: scale(1.05); }
}

@keyframes typing {
  0%, 60%, 100% {
    transform: scale(0.8);
    opacity: 0.5;
  }
  30% {
    transform: scale(1.2);
    opacity: 1;
  }
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@keyframes messageAppear {
  0% {
    opacity: 0;
    transform: translateY(20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

.chatbot-container *::-webkit-scrollbar {
  width: 8px;
}

.chatbot-container *::-webkit-scrollbar-track {
  background: rgba(226, 232, 240, 0.2);
  borderRadius: 10px;
}

.chatbot-container *::-webkit-scrollbar-thumb {
  background: rgba(148, 163, 184, 0.4);
  borderRadius: 10px;
  transition: background 0.2s ease;
}

.chatbot-container *::-webkit-scrollbar-thumb:hover {
  background: rgba(148, 163, 184, 0.6);
}

/* Hover effects */
.chatbot-container button:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 8px 25px rgba(0,0,0,0.15);
}

.chatbot-container textarea:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

/* Responsive design */
@media (max-width: 768px) {
  .chatbot-container {
    margin: 0;
    height: 100vh;
    border-radius: 0;
    max-width: 100%;
  }
}

@media (max-width: 640px) {
  .chatbot-container .header {
    padding: 16px 20px;
  }
  
  .chatbot-container .messages-list {
    padding: 20px 16px;
  }
  
  .chatbot-container .input-container {
    padding: 16px 20px;
  }
  
  .chatbot-container .mode-selector,
  .chatbot-container .quick-actions {
    padding: 16px 20px;
  }
}

/* Accessibility improvements */
.chatbot-container button:focus {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}

.chatbot-container textarea:focus {
  outline: none;
}

/* Enhanced animations */
.chatbot-container .mode-btn:hover:not(.active) {
  background: rgba(59, 130, 246, 0.05);
  border-color: rgba(59, 130, 246, 0.2);
}

.chatbot-container .quick-btn:hover {
  background: rgba(59, 130, 246, 0.05);
  border-color: rgba(59, 130, 246, 0.2);
  transform: translateY(-1px);
}
`;

// Remove existing stylesheet if it exists
const existingSheet = document.querySelector('style[data-chatbot-styles]');
if (existingSheet) {
  existingSheet.remove();
}

styleSheet.setAttribute('data-chatbot-styles', 'true');
document.head.appendChild(styleSheet);

export default Chatbot;