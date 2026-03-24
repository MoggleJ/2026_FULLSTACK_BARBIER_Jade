import { useState } from 'react';
import './AppCard.css';

export default function AppCard({ app, onOpen, isFavorite = false, onToggleFavorite }) {
  const [imgError, setImgError] = useState(false);
  const initial = app.name?.[0]?.toUpperCase() ?? '?';

  const handleFavorite = (e) => {
    e.stopPropagation();
    onToggleFavorite?.(app.id);
  };

  return (
    <button className="app-card" onClick={() => onOpen(app)} title={app.name}>
      {onToggleFavorite && (
        <button
          className={`app-card-fav${isFavorite ? ' app-card-fav--active' : ''}`}
          onClick={handleFavorite}
          title={isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
          aria-label={isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
        >
          {isFavorite ? '♥' : '♡'}
        </button>
      )}
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
