import React, { useState, useEffect } from 'react';
import "./ClimateQuiz.css";

const ClimateGamesApp = () => {
  const [currentGame, setCurrentGame] = useState('home');
  const [totalScore, setTotalScore] = useState(0);

  const games = [
    { id: 'quiz', title: 'Climate Knowledge Quiz', icon: '🧠' },
    { id: 'ecosystem-match', title: 'Ecosystem Matching', icon: '🌍' }
  ];

  const renderGame = () => {
    switch(currentGame) {
      case 'quiz':
        return <ClimateQuiz setTotalScore={setTotalScore} />;
      case 'ecosystem-match':
        return <EcosystemMatch setTotalScore={setTotalScore} />;
      default:
        return <HomePage />;
    }
  };

  const HomePage = () => (
    <div className="home-container">
      <h1 className="main-title">🌱 Climate Champions 🌱</h1>
      <p className="subtitle">Learn about climate change through fun interactive games!</p>
      
      <div className="games-grid">
        {games.map(game => (
          <div 
            key={game.id} 
            className="game-card"
            onClick={() => setCurrentGame(game.id)}
          >
            <div className="game-icon">{game.icon}</div>
            <h3>{game.title}</h3>
            <p>Click to play!</p>
          </div>
        ))}
      </div>
      
      <div className="score-display">
        <h3>Your Total Score: {totalScore} 🏆</h3>
      </div>
    </div>
  );

  const ClimateQuiz = ({ setTotalScore }) => {
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState('');
    const [quizScore, setQuizScore] = useState(0);
    const [showResult, setShowResult] = useState(false);
    const [answered, setAnswered] = useState(false);

    const questions = [
      {
        question: "What is the main cause of current climate change?",
        options: ["Solar flares", "Greenhouse gas emissions", "Ocean currents", "Volcanic activity"],
        correct: "Greenhouse gas emissions"
      },
      {
        question: "Which greenhouse gas is most abundant in the atmosphere?",
        options: ["Carbon dioxide", "Methane", "Water vapor", "Nitrous oxide"],
        correct: "Water vapor"
      },
      {
        question: "What percentage of climate scientists agree that human activities are the primary cause of recent climate change?",
        options: ["50%", "75%", "Over 97%", "85%"],
        correct: "Over 97%"
      },
      {
        question: "Which renewable energy source generates the most electricity globally?",
        options: ["Solar", "Wind", "Hydroelectric", "Geothermal"],
        correct: "Hydroelectric"
      },
      {
        question: "What is the Paris Agreement's main goal?",
        options: ["Eliminate all fossil fuels", "Limit global warming to 1.5°C", "Plant 1 billion trees", "Ban plastic bags"],
        correct: "Limit global warming to 1.5°C"
      }
    ];

    const handleAnswer = () => {
      if (!selectedAnswer || answered) return;
      
      let newScore = quizScore;
      if (selectedAnswer === questions[currentQuestion].correct) {
        newScore = quizScore + 10;
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
          // Auto return to home after showing results
          setTimeout(() => {
            setCurrentGame('home');
          }, );
        }
      }, 1500);
    };

    const resetQuiz = () => {
      setCurrentQuestion(0);
      setSelectedAnswer('');
      setQuizScore(0);
      setShowResult(false);
      setAnswered(false);
    };

    if (showResult) {
      const percentage = Math.round((quizScore / (questions.length * 10)) * 100);
      return (
        <div className="quiz-result">
          <h2>Quiz Complete! 🎉</h2>
          <div className="result-score">
            <div className="score-big">{quizScore}/{questions.length * 10}</div>
            <div className="percentage">{percentage}% Correct</div>
          </div>
          <div className="result-message">
            {percentage >= 80 ? "🌟 Excellent! You're a climate expert!" :
             percentage >= 60 ? "🌱 Great job! Good climate knowledge!" :
             percentage >= 40 ? "💡 Not bad! Keep learning!" :
             "🌍 Good try! Study more about climate change!"}
          </div>
          <div className="auto-return">
            <p>🏠 Returning to home page in 3 seconds...</p>
          </div>
          <div className="result-buttons">
            <button onClick={resetQuiz} className="btn-primary">Play Again</button>
            <button onClick={() => setCurrentGame('home')} className="btn-secondary">Back to Home</button>
          </div>
        </div>
      );
    }

    return (
      <div className="quiz-container">
        <div className="quiz-header">
          <button onClick={() => setCurrentGame('home')} className="back-btn">← Back</button>
          <h2>Climate Knowledge Quiz</h2>
          <div className="progress-bar">
            <div className="progress-fill" style={{width: `${((currentQuestion + 1) / questions.length) * 100}%`}}></div>
          </div>
        </div>
        
        <div className="question-card">
          <div className="question-number">Question {currentQuestion + 1} of {questions.length}</div>
          <h3>{questions[currentQuestion].question}</h3>
          <div className="options">
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
                >
                  {option}
                </button>
              );
            })}
          </div>
          <button 
            onClick={handleAnswer} 
            disabled={!selectedAnswer || answered}
            className="btn-primary answer-btn"
          >
            {answered ? 'Next Question...' : 'Submit Answer'}
          </button>
          <div className="quiz-score">Current Score: {quizScore}</div>
        </div>
      </div>
    );
  };

  const EcosystemMatch = ({ setTotalScore }) => {
    const [cards, setCards] = useState([]);
    const [flipped, setFlipped] = useState([]);
    const [matched, setMatched] = useState([]);
    const [gameScore, setGameScore] = useState(0);
    const [moves, setMoves] = useState(0);
    const [gameComplete, setGameComplete] = useState(false);

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
      { id: 12, content: 'Grassland', pair: '🌾', type: 'text' }
    ];

    useEffect(() => {
      initializeGame();
    }, []);

    useEffect(() => {
      if (matched.length === 12 && matched.length > 0) {
        setGameComplete(true);
        const bonusScore = Math.max(0, 100 - moves * 2); // Bonus for fewer moves
        const finalScore = gameScore + bonusScore;
        setGameScore(finalScore);
        setTotalScore(prev => prev + finalScore);
        // Auto return to home after showing results
        setTimeout(() => {
          setCurrentGame('home');
        }, );
      }
    }, [matched]);

    const initializeGame = () => {
      const shuffledCards = [...ecosystemPairs].sort(() => Math.random() - 0.5);
      setCards(shuffledCards);
      setFlipped([]);
      setMatched([]);
      setGameScore(0);
      setMoves(0);
      setGameComplete(false);
    };

    const handleCardClick = (index) => {
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
            setGameScore(prev => prev + 20);
          }
          setFlipped([]);
        }, 1000);
      }
    };

    const resetGame = () => {
      initializeGame();
    };

    return (
      <div className="ecosystem-match">
        <div className="game-header">
          <button onClick={() => setCurrentGame('home')} className="back-btn">← Back</button>
          <h2>Ecosystem Matching Game</h2>
          <div className="game-stats">
            <div className="stat">Score: {gameScore}</div>
            <div className="stat">Matches: {matched.length / 2}/6</div>
            <div className="stat">Moves: {moves}</div>
          </div>
        </div>

        <div className="memory-grid">
          {cards.map((card, index) => (
            <div
              key={`${card.id}-${index}`}
              className={`memory-card ${flipped.includes(index) ? 'flipped' : ''} ${matched.includes(card.id) ? 'matched' : ''}`}
              onClick={() => handleCardClick(index)}
            >
              <div className="card-front">?</div>
              <div className="card-back">
                {card.content}
              </div>
            </div>
          ))}
        </div>

        {gameComplete && (
          <div className="game-complete">
            <h3>🎉 Congratulations!</h3>
            <p>You've matched all ecosystems!</p>
            <div className="final-stats">
              <div>Final Score: {gameScore}</div>
              <div>Completed in {moves} moves</div>
              <div>
                {moves <= 8 ? "🌟 Perfect! Amazing memory!" :
                 moves <= 12 ? "🌱 Great job! Well done!" :
                 moves <= 16 ? "💚 Good work! Keep practicing!" :
                 "🌍 Nice try! You can do better!"}
              </div>
            </div>
            <div className="auto-return">
              <p>🏠 Returning to home page in 4 seconds...</p>
            </div>
            <button onClick={resetGame} className="btn-primary">Play Again</button>
          </div>
        )}
        
        <div className="game-instructions">
          <p>💡 Click cards to flip them and find matching ecosystem pairs!</p>
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