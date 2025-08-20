import { useState, useEffect } from 'react'
import LandingPage from './LandingPage.jsx'
import Dashboard from './DashBoard.jsx'

function App() {
  const [currentSeason, setCurrentSeason] = useState(0)
  const [nextSeason, setNextSeason] = useState(1)
  const [particles, setParticles] = useState([])
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [transitionProgress, setTransitionProgress] = useState(0)

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
      particleCount: 1
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
      gradient: 'linear-gradient(135deg, #fdf5e6 0%, #f4e4bc 15%, #ccb255ff 30%, #be7c4cff 45%, #ab7c4dff 60%, #ad8b37ff 75%, #c1714bff 90%, #96592eff 100%)',
      particleColor: '#cd3700ff',
      particleType: 'leaves',
      particleCount: 100
    }
  ]

  // Enhanced particle generation with better randomization
  useEffect(() => {
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
  }, [currentSeason])

  // Smooth season transition with progress tracking
  useEffect(() => {
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
  }, [])

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
};


  const renderParticle = (particle, season) => {
    const baseStyle = {
      position: 'absolute',
      left: `${particle.x}%`,
      top: `${particle.y}%`,
      pointerEvents: 'none',
      animationDelay: `${particle.delay}s`,
      animationDuration: `${particle.duration}s`,
      animationIterationCount: 'infinite',
      opacity: particle.opacity
    }

    switch (season.particleType) {
      case 'snow':
        return (
          <div
            key={particle.id}
            style={{
              ...baseStyle,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              background: `radial-gradient(circle, ${season.particleColor} 30%, rgba(255,255,255,0.8) 70%, transparent 100%)`,
              borderRadius: '50%',
              boxShadow: '0 0 6px rgba(255,255,255,0.8)',
              animation: `snowfall-${particle.id} ${particle.duration}s linear infinite`,
              '--drift': `${particle.drift}px`
            }}
          />
        )
      
      case 'sun':
        return (
          <div
            key={particle.id}
            style={{
              ...baseStyle,
              width: `${particle.size * 6}px`,
              height: `${particle.size * 6}px`,
              background: `radial-gradient(circle, 
                #ffeb3b 0%, 
                rgba(255, 235, 59, 0.8) 30%, 
                rgba(255, 193, 7, 0.5) 60%, 
                rgba(255, 193, 7, 0.2) 80%,
                transparent 100%)`,
              borderRadius: '50%',
              filter: 'blur(1px)',
              animation: `sunray ${particle.duration}s ease-in-out infinite alternate`,
              zIndex: 5
            }}
          />
        )
      
      case 'rain':
        return (
          <div
            key={particle.id}
            style={{
              ...baseStyle,
              width: '2px',
              height: `${particle.size * 4}px`,
              background: `linear-gradient(to bottom, 
                transparent 0%, 
                ${season.particleColor} 20%, 
                ${season.particleColor} 80%, 
                transparent 100%)`,
              borderRadius: '1px',
              filter: 'blur(0.3px)',
              animation: `rainfall-${particle.id} ${particle.duration}s linear infinite`,
              '--drift': `${particle.drift * 0.3}px`
            }}
          />
        )
      
      case 'leaves':
        return (
          <div
            key={particle.id}
            style={{
              ...baseStyle,
              width: `${particle.size * 2}px`,
              height: `${particle.size * 2.5}px`,
              background: `linear-gradient(45deg, 
                #ff6b35 0%, 
                #f7931e 30%, 
                #ff8c42 60%, 
                #d2691e 100%)`,
              clipPath: 'polygon(50% 0%, 85% 25%, 100% 60%, 75% 100%, 25% 100%, 0% 60%, 15% 25%)',
              filter: 'drop-shadow(1px 1px 2px rgba(0,0,0,0.3))',
              animation: `leaffall-${particle.id} ${particle.duration}s ease-in-out infinite`,
              '--drift': `${particle.drift}px`
            }}
          />
        )
      
      default:
        return null
    }
  }

  const currentSeasonData = seasons[currentSeason]

  return (
    <>
      <style jsx global>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body, html {
          margin: 0;
          padding: 0;
          overflow-x: hidden;
        }
        
        ${particles.map(particle => {
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
                  transform: translateY(100vh) translateX(var(--drift)) rotate(360deg);
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
                  transform: translateY(100vh) translateX(var(--drift));
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
                  transform: translateY(75vh) translateX(var(--drift)) rotate(270deg);
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
        }).join('')}

        @keyframes sunray {
          0% {
            opacity: 0.6;
            transform: scale(1);
          }
          50% {
            opacity: 0.9;
            transform: scale(1.05);
          }
          100% {
            opacity: 0.8;
            transform: scale(1.1);
          }
        }
      `}</style>

      <div style={{
        minHeight: '100vh',
        width: '100vw',
        position: 'relative',
        top: 0,
        left: 0,
        fontFamily: 'system-ui, -apple-system, sans-serif',
        margin: 0,
        padding: 0
      }}>
        {/* Base background layer */}
        <div style={{
          position: 'fixed',
          zIndex: -1,
          inset: 0,
          ...getBackgroundStyle(),
          transition: 'opacity 3s cubic-bezier(0.4, 0, 0.2, 1)'
        }} />
        
        {/* Transition overlay */}
        {isTransitioning && (
          <div style={{
            position: 'absolute',
            inset: 0,
            background: seasons[nextSeason % seasons.length].gradient,
            opacity: transitionProgress,
            transition: 'opacity 0.1s ease-out'
          }} />
        )}

        {/* Particles */}
        {particles.map((particle) => renderParticle(particle, currentSeasonData))}
        
        <LandingPage />
      </div>
    </>
  )
}

export default App