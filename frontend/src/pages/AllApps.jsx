import { useMode } from '../hooks/useMode.js';
import './AllApps.css';

export default function AllApps() {
  const { mode } = useMode();

  return (
    <div className="page-allapps">
      <div className="page-header">
        <h1 className="page-title">All Apps</h1>
        <p className="page-subtitle">
          Mode : <span className="mode-badge">{mode === 'TV' ? 'MJ TV' : 'MJ Desktop'}</span>
        </p>
      </div>

      {/* Placeholder — Sprint 4 */}
      <div className="page-placeholder">
        <p>Liste complète des applications — Sprint 4</p>
      </div>
    </div>
  );
}
