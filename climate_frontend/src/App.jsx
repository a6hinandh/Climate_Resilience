import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import LandingPage from './LandingPage.jsx'
import Login from './Login.jsx'
import Signup from './Signup.jsx'
import './App.css'
import Dashboard from './DashBoard.jsx'
import Predictions from './features/Predictions.jsx'
import Chatbot from './features/chatbot.jsx'
import MapView from './features/mapview.jsx'
import CommunityKnowledgeHub from './features/CommunityPage.jsx'
import ClimateGamesApp from './features/ClimateQuiz.jsx'
import ScrollToTop from './components/scrollToTop.jsx'

// Component to handle seasonal background based on route
const SeasonalBackground = () => {
  const location = useLocation()
  const [currentSeason, setCurrentSeason] = useState(0)
  const [nextSeason, setNextSeason] = useState(1)
  const [particles, setParticles] = useState([])
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [transitionProgress, setTransitionProgress] = useState(0)

  // Only show seasonal background on landing page
  const shouldShowSeasonalBackground = location.pathname === '/'

  // Seasons configuration with improved gradients
  const seasons = [
    {
      name: 'Winter',
      gradient: 'linear-gradient(135deg, #f0f8ff 0%, #e6f3ff 20%, #b3d9ff 40%, #87ceeb 60%, #b0e0e6 80%, #ffffff 100%)',
      particleColor: '#ffffff',
      particleType: 'snow',
      particleCount: 100
    },
    {
      name: 'Summer',
      gradient: 'linear-gradient(135deg, #fff9e6 0%, #fff3cc 15%, #ffe066 30%, #ffd700 45%, #ffb347 60%, #ff8c42 75%, #ff6b42 90%, #ff4500 100%)',
      particleColor: '#ffeb3b',
      particleType: 'sun',
      particleCount: 0
    },
    {
      name: 'Monsoon',
      gradient: 'linear-gradient(135deg, #2c3e50 0%, #34495e 15%, #4a5568 30%, #5a6c7d 45%, #6b7c93 60%, #7c8da1 75%, #8d9db6 90%, #9eaecb 100%)',
      particleColor: '#64b5f6',
      particleType: 'rain',
      particleCount: 100
    },
    {
      name: 'Autumn',
      gradient: 'linear-gradient(135deg, #fdf5e6 0%, #f4e4bc 15%, #ccb255ff 30%, #be7c4cff 45%, #ee9841ff 60%, #ad8b37ff 75%, #ff5608ff 90%, #ff6c03ff 100%)',
      particleColor: '#cd3700ff',
      particleType: 'leaves',
      particleCount: 100
    }
  ]

  // Enhanced particle generation with better randomization
  useEffect(() => {
    if (!shouldShowSeasonalBackground) return

    const generateParticles = () => {
      const season = seasons[currentSeason]
      const newParticles = []
      
      if (season.particleType === 'sun') {
        // Single sun positioned in top left
        newParticles.push({
          id: 0,
          x: 10, // Fixed position - top left
          y: 10,
          size: 25, // Larger size for visibility
          delay: 0,
          duration: 6,
          drift: 0,
          opacity: 0.8
        })
      } else {
        for (let i = 0; i < season.particleCount; i++) {
          newParticles.push({
            id: i,
            x: Math.random() * 100,
            y: Math.random() * -50, // Start above viewport
            size: season.particleType === 'sun' ? Math.random() * 8 + 4 : Math.random() * 4 + 2,
            delay: Math.random() * 8,
            duration: season.particleType === 'rain' ? Math.random() * 1.5 + 1 : Math.random() * 4 + 3,
            drift: (Math.random() - 0.5) * 40, // Horizontal drift for more natural movement
            opacity: Math.random() * 0.4 + 0.6
          })
        }
      }
      setParticles(newParticles)
    }

    generateParticles()
  }, [currentSeason, shouldShowSeasonalBackground])

  // Smooth season transition with progress tracking
  useEffect(() => {
    if (!shouldShowSeasonalBackground) return

    const interval = setInterval(() => {
      setIsTransitioning(true)
      setTransitionProgress(0)
      
      // Animate transition progress
      const transitionDuration = 3000 // 3 seconds
      const startTime = Date.now()
      
      const animateTransition = () => {
        const elapsed = Date.now() - startTime
        const progress = Math.min(elapsed / transitionDuration, 1)
        setTransitionProgress(progress)
        
        if (progress < 1) {
          requestAnimationFrame(animateTransition)
        } else {
          setCurrentSeason((prev) => (prev + 1) % seasons.length)
          setNextSeason((prev) => (prev + 1) % seasons.length)
          setIsTransitioning(false)
          setTransitionProgress(0)
        }
      }
      
      requestAnimationFrame(animateTransition)
    }, 7000) // Longer intervals for better viewing

    return () => clearInterval(interval)
  }, [shouldShowSeasonalBackground])

  // Create blended background during transitions
  const getBackgroundStyle = () => {
    if (isTransitioning) {
      return {
        background: `linear-gradient(
          to right,
          ${seasons[currentSeason].gradient} ${(1 - transitionProgress) * 100}%,
          ${seasons[nextSeason].gradient} ${transitionProgress * 100}%
        )`
      };
    }
    return { background: seasons[currentSeason].gradient };
  }

  // Generate dynamic CSS for particles
  useEffect(() => {
    if (!shouldShowSeasonalBackground) return

    const styleElement = document.getElementById('dynamic-particle-styles')
    if (styleElement) {
      styleElement.remove()
    }

    const newStyleElement = document.createElement('style')
    newStyleElement.id = 'dynamic-particle-styles'
    
    const particleStyles = particles.map(particle => {
      const season = seasons[currentSeason]
      
      if (season.particleType === 'snow') {
        return `
          @keyframes snowfall-${particle.id} {
            0% {
              transform: translateY(-10px) translateX(0px) rotate(0deg);
              opacity: 0;
            }
            10% {
              opacity: ${particle.opacity};
            }
            90% {
              opacity: ${particle.opacity};
            }
            100% {
              transform: translateY(100vh) translateX(${particle.drift}px) rotate(360deg);
              opacity: 0;
            }
          }
        `
      } else if (season.particleType === 'rain') {
        return `
          @keyframes rainfall-${particle.id} {
            0% {
              transform: translateY(-10px) translateX(0px);
              opacity: 0;
            }
            5% {
              opacity: ${particle.opacity};
            }
            95% {
              opacity: ${particle.opacity};
            }
            100% {
              transform: translateY(100vh) translateX(${particle.drift * 0.3}px);
              opacity: 0;
            }
          }
        `
      } else if (season.particleType === 'leaves') {
        return `
          @keyframes leaffall-${particle.id} {
            0% {
              transform: translateY(-10px) translateX(0px) rotate(0deg);
              opacity: 0;
            }
            10% {
              opacity: ${particle.opacity};
            }
            25% {
              transform: translateY(25vh) translateX(${particle.drift * 0.3}px) rotate(90deg);
            }
            50% {
              transform: translateY(50vh) translateX(${particle.drift * 0.6}px) rotate(180deg);
            }
            75% {
              transform: translateY(75vh) translateX(${particle.drift}px) rotate(270deg);
            }
            90% {
              opacity: ${particle.opacity * 0.7};
            }
            100% {
              transform: translateY(100vh) translateX(${particle.drift * 1.2}px) rotate(360deg);
              opacity: 0;
            }
          }
        `
      }
      return ''
    }).join('')

    newStyleElement.textContent = particleStyles
    document.head.appendChild(newStyleElement)
  }, [particles, currentSeason, shouldShowSeasonalBackground])

  const renderParticle = (particle, season) => {
    const baseClass = 'particle'
    const seasonClass = `particle--${season.particleType}`
    
    const style = {
      left: `${particle.x}%`,
      top: `${particle.y}%`,
      animationDelay: `${particle.delay}s`,
      animationDuration: `${particle.duration}s`,
      opacity: particle.opacity,
      animationName: `${season.particleType}fall-${particle.id}`
    }

    switch (season.particleType) {
      case 'snow':
        return (
          <div
            key={particle.id}
            className={`${baseClass} ${seasonClass}`}
            style={{
              ...style,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              background: `radial-gradient(circle, ${season.particleColor} 30%, rgba(255,255,255,0.8) 70%, transparent 100%)`
            }}
          />
        )
      
      case 'sun':
        return (
          <div
            key={particle.id}
            className={`${baseClass} ${seasonClass}`}
            style={{
              ...style,
              width: `${particle.size * 6}px`,
              height: `${particle.size * 6}px`,
              animationName: 'sunray'
            }}
          />
        )
      
      case 'rain':
        return (
          <div
            key={particle.id}
            className={`${baseClass} ${seasonClass}`}
            style={{
              ...style,
              width: '2px',
              height: `${particle.size * 4}px`,
              background: `linear-gradient(to bottom, 
                transparent 0%, 
                ${season.particleColor} 20%, 
                ${season.particleColor} 80%, 
                transparent 100%)`
            }}
          />
        )
      
      case 'leaves':
        return (
          <div
            key={particle.id}
            className={`${baseClass} ${seasonClass}`}
            style={{
              ...style,
              width: `${particle.size * 2}px`,
              height: `${particle.size * 2.5}px`
            }}
          />
        )
      
      default:
        return null
    }
  }

  const currentSeasonData = seasons[currentSeason]

  // Don't render anything if not on landing page
  if (!shouldShowSeasonalBackground) {
    return null
  }

  return (
    <>
      {/* Base background layer */}
      <div 
        className="background-layer"
        style={getBackgroundStyle()}
      />
      
      {/* Transition overlay */}
      {isTransitioning && (
        <div 
          className="transition-overlay"
          style={{
            background: seasons[nextSeason % seasons.length].gradient,
            opacity: transitionProgress
          }}
        />
      )}

      {/* Particles */}
      {particles.map((particle) => renderParticle(particle, currentSeasonData))}
    </>
  )
}

function App() {
  return (
    <Router>
      <div className="app">
        {/* Conditional seasonal background */}
        <SeasonalBackground />
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/predictions" element={<Predictions />}/>
          <Route path="/chat" element={<Chatbot />}/>
          <Route path="/map" element={<MapView />}/>
          <Route path="/community" element={<CommunityKnowledgeHub/>}/>
          <Route path="/game" element={<ClimateGamesApp />}/>
        </Routes>
      </div>
    </Router>
  )
}

export default App