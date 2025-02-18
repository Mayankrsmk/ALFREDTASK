import { useState } from 'react';
import { api } from '../services/api';
import './styles/flashcard.css';

function CreateFlashcard({ onClose, onCreated }) {
  const [formData, setFormData] = useState({
    question: '',
    answer: ''
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      await api.post('/flashcards', formData);
      onCreated();
    } catch (err) {
      setError(err.response?.data?.message || 'Error creating flashcard');
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h2 className="auth-title">Create New Flashcard</h2>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="question">Question</label>
            <textarea
              id="question"
              value={formData.question}
              onChange={(e) => setFormData({...formData, question: e.target.value})}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="answer">Answer</label>
            <textarea
              id="answer"
              value={formData.answer}
              onChange={(e) => setFormData({...formData, answer: e.target.value})}
              required
            />
          </div>
          <div className="button-container">
            <button type="submit" className="auth-button">Create</button>
            <button type="button" className="auth-button" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateFlashcard; 