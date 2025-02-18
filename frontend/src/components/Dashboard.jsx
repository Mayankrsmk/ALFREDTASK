import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import './styles/flashcard.css';
import Flashcard from './Flashcard';
import CreateFlashcard from './CreateFlashcard';

function Dashboard() {
  const [flashcards, setFlashcards] = useState([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    due: 0,
    mastered: 0,
    completedToday: 0,
    upcoming: []
  });
  const { user } = useAuth();

  useEffect(() => {
    fetchDueFlashcards();
    fetchStats();
  }, []);

  const fetchDueFlashcards = async () => {
    try {
      const response = await api.get('/flashcards/due');
      setFlashcards(response.data);
    } catch (error) {
      console.error('Error fetching flashcards:', error);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await api.get('/flashcards/stats');
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleCardResult = async (result) => {
    try {
      await api.post(`/flashcards/${flashcards[currentCardIndex]._id}/review`, {
        result
      });
      
      if (currentCardIndex < flashcards.length - 1) {
        setCurrentCardIndex(prev => prev + 1);
      } else {
        // Refresh data
        fetchDueFlashcards();
        fetchStats();
        setCurrentCardIndex(0);
      }
    } catch (error) {
      console.error('Error updating flashcard:', error);
    }
  };

  return (
    <div className="dashboard-container">
      <div className="header">
        <div className="stats-container">
          <div className="progress-info">
            {stats.due === 0 ? (
              "🎉 You're all caught up!"
            ) : (
              `📚 You have ${stats.due} flashcards to review today`
            )}
          </div>
          <div className="stats-details">
            <div className="stat-item">
              <div className="stat-value">{stats.total}</div>
              <div className="stat-label">Total Cards</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">{stats.mastered}</div>
              <div className="stat-label">Mastered</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">{stats.completedToday}</div>
              <div className="stat-label">Completed Today</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">{((stats.mastered / stats.total) * 100 || 0).toFixed(0)}%</div>
              <div className="stat-label">Mastery Rate</div>
            </div>
          </div>
          <div className="upcoming-reviews">
            <h3>Upcoming Reviews</h3>
            <div className="upcoming-bars">
              {stats.upcoming.map((count, index) => (
                <div key={index} className="upcoming-bar-container">
                  <div 
                    className="upcoming-bar"
                    style={{ 
                      height: `${Math.min((count / Math.max(...stats.upcoming)) * 100, 100)}%`,
                      backgroundColor: count > 0 ? '#4a90e2' : '#eee'
                    }}
                  />
                  <span className="upcoming-count">{count}</span>
                  <span className="upcoming-day">{index === 0 ? 'Tom' : `+${index + 1}`}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <button 
          className="create-button"
          onClick={() => setShowCreateModal(true)}
        >
          Create New Flashcard
        </button>
      </div>

      {flashcards.length > 0 ? (
        <>
          <div className="progress-bar">
            <div 
              className="progress-fill"
              style={{ 
                width: `${((currentCardIndex) / flashcards.length) * 100}%`
              }}
            />
          </div>
          <Flashcard
            flashcard={flashcards[currentCardIndex]}
            onResult={handleCardResult}
          />
          <div className="card-counter">
            Card {currentCardIndex + 1} of {flashcards.length}
          </div>
        </>
      ) : (
        <div className="no-cards-message">
          {stats.total === 0 ? 
            "You haven't created any flashcards yet. Create your first one!" :
            "No cards due for review. Come back later!"}
        </div>
      )}

      {showCreateModal && (
        <CreateFlashcard
          onClose={() => setShowCreateModal(false)}
          onCreated={() => {
            setShowCreateModal(false);
            fetchDueFlashcards();
            fetchStats();
          }}
        />
      )}
    </div>
  );
}

export default Dashboard; 