import { useState } from 'react';
import { useMode } from '../../hooks/useMode.js';
import { useLang } from '../../hooks/useLang.js';
import { useIconSize } from '../../hooks/useIconSize.js';
import AppCard from '../AppCard/AppCard.jsx';
import './AppGrid.css';

export default function AppGrid({ apps, onOpen }) {
  const { mode } = useMode();
  const { t } = useLang();
  const { iconSize } = useIconSize();
  const [activeCategory, setActiveCategory] = useState('all');

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
  const gridClass = `app-grid app-grid--${modeClass}`;

  return (
    <div className={containerClass}>
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

      <div className={gridClass}>
        {filtered.map((app) => (
          <AppCard key={app.id} app={app} onOpen={onOpen} />
        ))}
      </div>
    </div>
  );
}
