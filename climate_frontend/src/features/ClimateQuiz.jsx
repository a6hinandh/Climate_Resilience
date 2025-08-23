import React, { useState, useEffect, useCallback } from 'react';
import "./ClimateQuiz.css";

const ClimateGamesApp = () => {
  const [currentGame, setCurrentGame] = useState('home');
  const [totalScore, setTotalScore] = useState(0);

  // Load total score from localStorage on component mount
  useEffect(() => {
    const savedScore = localStorage.getItem('climateQuizTotalScore');
    if (savedScore) {
      setTotalScore(parseInt(savedScore, 10));
    }
  }, []);

  useEffect(()=>{
    window.scrollTo({ top: 0, behavior: "smooth" });
  },[currentGame])

  // Save total score to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('climateQuizTotalScore', totalScore.toString());
  }, [totalScore]);

  const games = [
    { 
      id: 'quiz', 
      title: 'Climate Knowledge Quiz', 
      icon: '🧠',
      description: 'Test your knowledge about climate change and environmental science with challenging questions'
    },
    { 
      id: 'ecosystem-match', 
      title: 'Ecosystem Matching Game', 
      icon: '🌍',
      description: 'Match different ecosystems with their names in this fun memory challenge'
    }
  ];

  const renderGame = useCallback(() => {
    switch(currentGame) {
      case 'quiz':
        return <ClimateQuiz setTotalScore={setTotalScore} goHome={() => setCurrentGame('home')} />;
      case 'ecosystem-match':
        return <EcosystemMatch setTotalScore={setTotalScore} goHome={() => setCurrentGame('home')} />;
      default:
        return <HomePage />;
    }
  }, [currentGame]);

  const HomePage = () => (
    <div className="home-container">
      <div className="hero-section">
        <h1 className="main-title" style={{color:"black"}}>🌱 Climate Champions 🌱</h1>
        <p className="subtitle">
          Learn about climate change and environmental protection through engaging interactive games and challenges!
        </p>
      </div>
      
      <div className="games-grid">
        {games.map((game, index) => (
          <div 
            key={game.id} 
            className="game-card"
            onClick={() => setCurrentGame(game.id)}
            style={{ animationDelay: `${index * 0.15}s` }}
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                setCurrentGame(game.id);
              }
            }}
            role="button"
            aria-label={`Play ${game.title}`}
          >
            <div className="game-icon" aria-hidden="true">{game.icon}</div>
            <h3>{game.title}</h3>
            <p>{game.description}</p>
            <div className="play-button" aria-hidden="true">Play Now →</div>
          </div>
        ))}
      </div>
      
      <div className="score-display">
        <div className="score-icon" aria-hidden="true">🏆</div>
        <div className="score-content"style={{marginBottom:"15px"}}>
          <h3>Total Score</h3>
          <div className="score-number" aria-label={`Total score: ${totalScore} points`}>
            {totalScore.toLocaleString()}
          </div>
        </div>
      </div>
    </div>
  );

  const ClimateQuiz = ({ setTotalScore, goHome }) => {
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState('');
    const [quizScore, setQuizScore] = useState(0);
    const [showResult, setShowResult] = useState(false);
    const [answered, setAnswered] = useState(false);
    const [timeLeft, setTimeLeft] = useState(5);

    const questions = [
      {
        question: "What is the primary cause of current climate change?",
        options: ["Natural solar variations", "Human greenhouse gas emissions", "Ocean current changes", "Volcanic activity increases"],
        correct: "Human greenhouse gas emissions"
      },
      {
        question: "Which greenhouse gas is most abundant in Earth's atmosphere?",
        options: ["Carbon dioxide (CO₂)", "Methane (CH₄)", "Water vapor (H₂O)", "Nitrous oxide (N₂O)"],
        correct: "Water vapor (H₂O)"
      },
      {
        question: "What percentage of climate scientists agree that human activities are the primary cause of recent climate change?",
        options: ["Around 50%", "Approximately 75%", "Over 97%", "Exactly 85%"],
        correct: "Over 97%"
      },
      {
        question: "Which renewable energy source currently generates the most electricity globally?",
        options: ["Solar power", "Wind energy", "Hydroelectric power", "Geothermal energy"],
        correct: "Hydroelectric power"
      },
      {
        question: "What is the main goal of the Paris Climate Agreement?",
        options: ["Eliminate all fossil fuel use by 2030", "Limit global warming to well below 2°C", "Plant 1 trillion trees worldwide", "Ban all single-use plastics"],
        correct: "Limit global warming to well below 2°C"
      },
      {
        question: "Which region is warming fastest due to climate change?",
        options: ["The Amazon rainforest", "The Arctic region", "The Sahara desert", "The Pacific Ocean"],
        correct: "The Arctic region"
      },
      {
        question: "What is carbon sequestration?",
        options: ["Releasing carbon into the atmosphere", "Capturing and storing carbon dioxide", "Converting carbon to methane", "Burning carbon-based fuels"],
        correct: "Capturing and storing carbon dioxide"
      },
      {
        question: "Which activity produces the most greenhouse gas emissions globally?",
        options: ["Transportation", "Agriculture", "Energy production", "Manufacturing"],
        correct: "Energy production"
      }
    ];

    const handleAnswer = useCallback(() => {
      if (!selectedAnswer || answered) return;
      
      let newScore = quizScore;
      if (selectedAnswer === questions[currentQuestion].correct) {
        newScore = quizScore + 2;
        setQuizScore(newScore);
      }
      
      setAnswered(true);
      
      setTimeout(() => {
        if (currentQuestion + 1 < questions.length) {
          setCurrentQuestion(prev => prev + 1);
          setSelectedAnswer('');
          setAnswered(false);
        } else {
          setShowResult(true);
          setTotalScore(prev => prev + newScore);
        }
      }, 2000);
    }, [selectedAnswer, answered, quizScore, currentQuestion, questions, setTotalScore]);

    // Auto-return countdown
    useEffect(() => {
      if (showResult && timeLeft > 0) {
        const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
        return () => clearTimeout(timer);
      } else if (showResult && timeLeft === 0) {
        goHome();
      }
    }, [showResult, timeLeft, goHome]);

    const resetQuiz = useCallback(() => {
      setCurrentQuestion(0);
      setSelectedAnswer('');
      setQuizScore(0);
      setShowResult(false);
      setAnswered(false);
      setTimeLeft(5);
    }, []);

    const getPerformanceMessage = (percentage) => {
      if (percentage >= 90) return "🌟 Outstanding! You're a true climate expert!";
      if (percentage >= 80) return "🌱 Excellent! You have great climate knowledge!";
      if (percentage >= 70) return "💡 Well done! Good understanding of climate science!";
      if (percentage >= 60) return "🌍 Not bad! Keep learning about our planet!";
      if (percentage >= 50) return "📚 Good try! Study more about climate change!";
      return "🌱 Keep learning! Every bit of knowledge helps our planet!";
    };

    if (showResult) {
      const percentage = Math.round((quizScore / (questions.length * 2)) * 100);
      return (
        <div className="quiz-container">
          <div className="quiz-result">
            <div className="result-icon" aria-hidden="true">🎉</div>
            <h2>Quiz Complete!</h2>
            <div className="result-score">
              <div className="score-circle">
                <div className="score-big" aria-label={`You scored ${quizScore} points`}>
                  {quizScore}
                </div>
                <div className="score-total">/{questions.length * 2}</div>
              </div>
              <div className="percentage">{percentage}% Correct</div>
            </div>
            <div className="result-message">
              {getPerformanceMessage(percentage)}
            </div>
            <div className="auto-return">
              <div className="countdown-circle" aria-label={`Returning home in ${timeLeft} seconds`}>
                <span>{timeLeft}</span>
              </div>
              <p>Returning to home page in {timeLeft} seconds...</p>
            </div>
            <div className="result-buttons">
              <button onClick={resetQuiz} className="btn-primary" aria-label="Play quiz again">
                <span aria-hidden="true">🔄</span> Play Again
              </button>
              <button onClick={goHome} className="btn-secondary" aria-label="Return to home page">
                <span aria-hidden="true">🏠</span> Back to Home
              </button>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="quiz-container">
        <div className="quiz-header">
          <button 
            onClick={goHome} 
            className="back-btn"
            aria-label="Return to home page"
          >
            <span aria-hidden="true">←</span> Back
          </button>
          <div className="quiz-title">
            <h2>Climate Knowledge Quiz</h2>
            <span className="quiz-subtitle">Test your environmental knowledge</span>
          </div>
          <div className="progress-section">
            <div className="progress-bar" role="progressbar" aria-valuenow={currentQuestion + 1} aria-valuemax={questions.length}>
              <div 
                className="progress-fill" 
                style={{width: `${((currentQuestion + 1) / questions.length) * 100}%`}}
              ></div>
            </div>
            <span className="progress-text">{currentQuestion + 1}/{questions.length}</span>
          </div>
        </div>
        
        <div className="question-card">
          <div className="question-header">
            <div className="question-number">Question {currentQuestion + 1}</div>
            <div className="score-display-mini" aria-label={`Current score: ${quizScore} points`}>
              Score: {quizScore}
            </div>
          </div>
          <h3 className="question-text">{questions[currentQuestion].question}</h3>
          <div className="options" role="radiogroup" aria-labelledby="question-text">
            {questions[currentQuestion].options.map((option, index) => {
              let className = 'option';
              if (selectedAnswer === option) className += ' selected';
              if (answered) {
                if (option === questions[currentQuestion].correct) {
                  className += ' correct';
                } else if (selectedAnswer === option && option !== questions[currentQuestion].correct) {
                  className += ' incorrect';
                }
              }
              
              return (
                <button
                  key={index}
                  className={className}
                  onClick={() => !answered && setSelectedAnswer(option)}
                  disabled={answered}
                  role="radio"
                  aria-checked={selectedAnswer === option}
                  aria-label={`Option ${String.fromCharCode(65 + index)}: ${option}`}
                >
                  <span className="option-letter" aria-hidden="true">
                    {String.fromCharCode(65 + index)}
                  </span>
                  <span className="option-text">{option}</span>
                  {answered && option === questions[currentQuestion].correct && (
                    <span className="check-icon" aria-hidden="true">✓</span>
                  )}
                  {answered && selectedAnswer === option && option !== questions[currentQuestion].correct && (
                    <span className="cross-icon" aria-hidden="true">✗</span>
                  )}
                </button>
              );
            })}
          </div>
          <button 
            onClick={handleAnswer} 
            disabled={!selectedAnswer || answered}
            className="btn-primary answer-btn"
            aria-label={answered ? "Moving to next question" : "Submit your answer"}
          >
            {answered ? 'Next Question...' : 'Submit Answer'}
          </button>
        </div>
      </div>
    );
  };

  const EcosystemMatch = ({ setTotalScore, goHome }) => {
    const [cards, setCards] = useState([]);
    const [flipped, setFlipped] = useState([]);
    const [matched, setMatched] = useState([]);
    const [gameScore, setGameScore] = useState(0);
    const [moves, setMoves] = useState(0);
    const [gameComplete, setGameComplete] = useState(false);
    const [timeLeft, setTimeLeft] = useState(6);

    const ecosystemPairs = [
      { id: 1, content: '🌳', pair: 'Forest', type: 'emoji' },
      { id: 2, content: 'Forest', pair: '🌳', type: 'text' },
      { id: 3, content: '🌊', pair: 'Ocean', type: 'emoji' },
      { id: 4, content: 'Ocean', pair: '🌊', type: 'text' },
      { id: 5, content: '🏔️', pair: 'Mountain', type: 'emoji' },
      { id: 6, content: 'Mountain', pair: '🏔️', type: 'text' },
      { id: 7, content: '🌵', pair: 'Desert', type: 'emoji' },
      { id: 8, content: 'Desert', pair: '🌵', type: 'text' },
      { id: 9, content: '❄️', pair: 'Arctic', type: 'emoji' },
      { id: 10, content: 'Arctic', pair: '❄️', type: 'text' },
      { id: 11, content: '🌾', pair: 'Grassland', type: 'emoji' },
      { id: 12, content: 'Grassland', pair: '🌾', type: 'text' },
      { id: 13, content: '🐠', pair: 'Coral Reef', type: 'emoji' },
      { id: 14, content: 'Coral Reef', pair: '🐠', type: 'text' },
      { id: 15, content: '🌴', pair: 'Tropical', type: 'emoji' },
      { id: 16, content: 'Tropical', pair: '🌴', type: 'text' }
    ];

    const initializeGame = useCallback(() => {
      const shuffledCards = [...ecosystemPairs].sort(() => Math.random() - 0.5);
      setCards(shuffledCards);
      setFlipped([]);
      setMatched([]);
      setGameScore(0);
      setMoves(0);
      setGameComplete(false);
      setTimeLeft(6);
    }, []);

    useEffect(() => {
      initializeGame();
    }, [initializeGame]);

    useEffect(() => {
      if (matched.length === 16 && matched.length > 0) {
        setGameComplete(true);
        const finalScore = gameScore;
        setGameScore(finalScore);
        setTotalScore(prev => prev + finalScore);
      }
    }, [matched, gameScore, moves, setTotalScore]);

    // Auto-return countdown
    useEffect(() => {
      if (gameComplete && timeLeft > 0) {
        const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
        return () => clearTimeout(timer);
      } else if (gameComplete && timeLeft === 0) {
        goHome();
      }
    }, [gameComplete, timeLeft, goHome]);

    const handleCardClick = useCallback((index) => {
      if (flipped.includes(index) || matched.includes(cards[index].id) || flipped.length >= 2) {
        return;
      }

      const newFlipped = [...flipped, index];
      setFlipped(newFlipped);

      if (newFlipped.length === 2) {
        setMoves(prev => prev + 1);
        const [first, second] = newFlipped;
        
        setTimeout(() => {
          if (cards[first].pair === cards[second].content || cards[first].content === cards[second].pair) {
            setMatched(prev => [...prev, cards[first].id, cards[second].id]);
            setGameScore(prev => prev + 2);
          }
          setFlipped([]);
        }, 1200);
      }
    }, [flipped, matched, cards]);

    const getPerformanceMessage = (moves) => {
      if (moves <= 10) return "🌟 Perfect! Incredible memory skills!";
      if (moves <= 15) return "🌱 Excellent! Outstanding performance!";
      if (moves <= 20) return "💚 Great job! Well done matching!";
      if (moves <= 25) return "🌍 Good work! Keep practicing!";
      return "🌱 Nice try! You're getting better!";
    };

    return (
      <div className="ecosystem-match">
        <div className="game-header">
          <button 
            onClick={goHome} 
            className="back-btn"
            aria-label="Return to home page"
          >
            <span aria-hidden="true">←</span> Back
          </button>
          <div className="game-title">
            <h2>Ecosystem Matching</h2>
            <span className="game-subtitle">Match ecosystems with their names</span>
          </div>
          <div className="game-stats">
            <div className="stat" aria-label={`Current score: ${gameScore} points`}>
              <span className="stat-icon" aria-hidden="true">🎯</span>
              <span>Score: {gameScore}</span>
            </div>
            <div className="stat" aria-label={`Matches found: ${matched.length / 2} out of 8`}>
              <span className="stat-icon" aria-hidden="true">✅</span>
              <span>Matches: {matched.length / 2}/8</span>
            </div>
            <div className="stat" aria-label={`Moves made: ${moves}`}>
              <span className="stat-icon" aria-hidden="true">🔄</span>
              <span>Moves: {moves}</span>
            </div>
          </div>
        </div>

        <div className="memory-grid" role="grid" aria-label="Ecosystem matching game board">
          {cards.map((card, index) => (
            <div
              key={`${card.id}-${index}`}
              className={`memory-card ${flipped.includes(index) ? 'flipped' : ''} ${matched.includes(card.id) ? 'matched' : ''}`}
              onClick={() => handleCardClick(index)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleCardClick(index);
                }
              }}
              tabIndex={0}
              role="gridcell"
              aria-label={
                matched.includes(card.id) 
                  ? `Matched card: ${card.content}` 
                  : flipped.includes(index)
                  ? `Revealed card: ${card.content}`
                  : 'Hidden card'
              }
              aria-pressed={flipped.includes(index)}
            >
              <div className="card-front">
                <span className="card-question" aria-hidden="true">?</span>
              </div>
              <div className="card-back">
                <span className="card-content">{card.content}</span>
              </div>
            </div>
          ))}
        </div>

        {gameComplete && (
          <div className="game-complete">
            <div className="completion-icon" aria-hidden="true">🎉</div>
            <h3>Congratulations!</h3>
            <p>You've successfully matched all ecosystems!</p>
            <div className="final-stats">
              <div className="final-stat">
                <span className="final-stat-icon" aria-hidden="true">🏆</span>
                <span>Final Score: {gameScore}</span>
              </div>
              <div className="final-stat">
                <span className="final-stat-icon" aria-hidden="true">🎯</span>
                <span>Completed in {moves} moves</span>
              </div>
              <div className="performance-message">
                {getPerformanceMessage(moves)}
              </div>
            </div>
            <div className="auto-return">
              <div className="countdown-circle" aria-label={`Returning home in ${timeLeft} seconds`}>
                <span>{timeLeft}</span>
              </div>
              <p>Returning to home page in {timeLeft} seconds...</p>
            </div>
            <button 
              onClick={initializeGame} 
              className="btn-primary"
              aria-label="Start a new game"
            >
              <span aria-hidden="true">🔄</span> Play Again
            </button>
          </div>
        )}
        
        <div className="game-instructions">
          <div className="instruction-icon" aria-hidden="true">💡</div>
          <p>Click cards to flip them and find matching ecosystem pairs!</p>
        </div>
      </div>
    );
  };

  return (
    <div className="app">
      {renderGame()}
    </div>
  );
};

export default ClimateGamesApp;