import { useMode } from '../../hooks/useMode.js';
import { useApps } from '../../hooks/useApps.js';
import { useOpenApp } from '../../hooks/useOpenApp.js';
import { useLang } from '../../hooks/useLang.js';
import { useFavorites } from '../../hooks/useFavorites.js';
import AppGrid from '../../components/AppGrid/AppGrid.jsx';
import './AllApps.css';

export default function AllApps() {
  const { mode } = useMode();
  const { t } = useLang();
  const { apps, loading, error } = useApps(mode);
  const openApp = useOpenApp();
  const { favoriteIds, toggle } = useFavorites();

  return (
    <div className="page-allapps">
      <div className="page-header">
        <h1 className="page-title">{t('allApps.title')}</h1>
        <p className="page-subtitle">
          {t('allApps.mode')} <span className="mode-badge">{t(`modes.${mode}`)}</span>
        </p>
      </div>

      {loading && <div className="loading-screen"><div className="loading-spinner" /></div>}
      {error && <p className="page-error">{t('error.loadApps')}</p>}
      {!loading && !error && (
        <AppGrid
          apps={apps}
          onOpen={openApp}
          favoriteIds={favoriteIds}
          onToggleFavorite={toggle}
        />
      )}
    </div>
  );
}
