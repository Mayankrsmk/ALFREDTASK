import { useAuth } from '../context/AuthContext';
import './styles/navbar.css';

function Navbar({ darkMode, toggleDarkMode }) {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        Flashcards App
      </div>
      <div className="navbar-right">
        <button 
          className="theme-toggle" 
          onClick={toggleDarkMode}
          aria-label="Toggle theme"
        >
          {darkMode ? '🌞' : '🌙'}
        </button>
        <div className="user-info">
          <span className="user-email">{user?.email}</span>
        </div>
        <button className="logout-button" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar; 