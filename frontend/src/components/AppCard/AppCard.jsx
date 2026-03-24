import { useState } from 'react';
import './AppCard.css';

export default function AppCard({ app, onOpen }) {
  const [imgError, setImgError] = useState(false);
  const initial = app.name?.[0]?.toUpperCase() ?? '?';

  return (
    <button className="app-card" onClick={() => onOpen(app)} title={app.name}>
      <div className="app-card-icon">
        {app.icon && !imgError ? (
          <img
            src={app.icon}
            alt={app.name}
            onError={() => setImgError(true)}
          />
        ) : (
          <span className="app-card-initial">{initial}</span>
        )}
      </div>
      <span className="app-card-name">{app.name}</span>
    </button>
  );
}
