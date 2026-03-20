import { useAuth } from '../hooks/useAuth.js';
import { useMode } from '../hooks/useMode.js';
import './Home.css';

export default function Home() {
  const { user } = useAuth();
  const { mode } = useMode();

  return (
    <div className="page-home">
      <div className="page-header">
        <h1 className="page-title">Bonjour, {user?.username}</h1>
        <p className="page-subtitle">
          Mode actif : <span className="mode-badge">{mode === 'TV' ? 'MJ TV' : 'MJ Desktop'}</span>
        </p>
      </div>

      {/* Placeholder — grille d'apps Sprint 4 */}
      <div className="page-placeholder">
        <p>Grille d'applications — Sprint 4</p>
      </div>
    </div>
  );
}
