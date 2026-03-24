import { useState, useRef } from 'react';
import { useMode } from '../../hooks/useMode.js';
import { useLang } from '../../hooks/useLang.js';
import { useIconSize } from '../../hooks/useIconSize.js';
import { useLayout } from '../../hooks/useLayout.js';
import AppCard from '../AppCard/AppCard.jsx';
import './AppGrid.css';

export default function AppGrid({ apps, onOpen, favoriteIds, onToggleFavorite }) {
  const { mode } = useMode();
  const { t } = useLang();
  const { iconSize } = useIconSize();
  const { layout } = useLayout();
  const [activeCategory, setActiveCategory] = useState('all');
  const gridRef = useRef(null);

  if (!apps || apps.length === 0) {
    return <p className="app-grid-empty">{t('grid.empty')}</p>;
  }

  const categories = [...new Set(apps.map((a) => a.category_name).filter(Boolean))];

  const filtered =
    activeCategory === 'all'
      ? apps
      : apps.filter((a) => a.category_name === activeCategory);

  const modeClass = mode === 'TV' ? 'tv' : 'desktop';
  const containerClass = `app-grid-container app-grid-container--${iconSize} app-grid-container--mode-${modeClass}`;
  const gridClass = `app-grid app-grid--${modeClass} app-grid--${layout}`;

  const handleKeyDown = (e) => {
    if (mode !== 'TV') return;
    const cards = Array.from(gridRef.current.querySelectorAll('.app-card'));
    if (!cards.length) return;

    const current = document.activeElement;
    const idx = cards.indexOf(current);

    if (idx === -1) {
      if (['ArrowRight', 'ArrowLeft', 'ArrowUp', 'ArrowDown'].includes(e.key)) {
        e.preventDefault();
        cards[0].focus();
      }
      return;
    }

    const cardWidth = cards[0].getBoundingClientRect().width || 1;
    const cols = Math.max(1, Math.round(gridRef.current.getBoundingClientRect().width / cardWidth));

    let next = idx;
    if (e.key === 'ArrowRight') next = Math.min(idx + 1, cards.length - 1);
    else if (e.key === 'ArrowLeft') next = Math.max(idx - 1, 0);
    else if (e.key === 'ArrowDown') next = Math.min(idx + cols, cards.length - 1);
    else if (e.key === 'ArrowUp') next = Math.max(idx - cols, 0);
    else return;

    e.preventDefault();
    cards[next].focus();
  };

  return (
    <div className={containerClass} onKeyDown={handleKeyDown}>
      {categories.length > 1 && (
        <div className="app-grid-filters">
          <button
            className={`app-grid-filter-btn${activeCategory === 'all' ? ' active' : ''}`}
            onClick={() => setActiveCategory('all')}
          >
            {t('grid.all')}
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              className={`app-grid-filter-btn${activeCategory === cat ? ' active' : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {t(`categories.${cat}`)}
            </button>
          ))}
        </div>
      )}

      <div className={gridClass} ref={gridRef}>
        {filtered.map((app) => (
          <AppCard
            key={app.id}
            app={app}
            onOpen={onOpen}
            isFavorite={favoriteIds?.has(app.id)}
            onToggleFavorite={onToggleFavorite}
          />
        ))}
      </div>
    </div>
  );
}
