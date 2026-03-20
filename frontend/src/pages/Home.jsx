import { useAuth } from '../hooks/useAuth.js';
import './Home.css';

// Placeholder — remplacé par le vrai layout au Sprint 3
export default function Home() {
  const { user, logout } = useAuth();

  return (
    <div className="home-placeholder">
      <h1>Bienvenue, {user?.username}</h1>
      <p>Sprint 3 — Layout &amp; Sidebar à venir</p>
      <button className="btn-logout" onClick={logout}>
        Se déconnecter
      </button>
    </div>
  );
}
