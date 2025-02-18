import { useState } from 'react';
import './styles/flashcard.css';

function Flashcard({ flashcard, onResult }) {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleShowAnswer = () => {
    setIsFlipped(true);
  };

  const handleResult = (result) => {
    onResult(result);
    setIsFlipped(false);
  };

  return (
    <div className="flashcard-container">
      <div className={`flashcard ${isFlipped ? 'is-flipped' : ''}`}>
        <div className="flashcard-front">
          <div className="flashcard-text">{flashcard.question}</div>
          {!isFlipped && (
            <button className="action-button show-answer" onClick={handleShowAnswer}>
              Show Answer
            </button>
          )}
        </div>
        <div className="flashcard-back">
          <div className="flashcard-text">{flashcard.answer}</div>
          <div className="button-container">
            <button 
              className="action-button correct-button"
              onClick={() => handleResult('correct')}
            >
              Got it Right
            </button>
            <button 
              className="action-button wrong-button"
              onClick={() => handleResult('wrong')}
            >
              Got it Wrong
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Flashcard; 