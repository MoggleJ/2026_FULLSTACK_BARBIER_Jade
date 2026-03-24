import { useAuth } from '../../hooks/useAuth.js';
import { useMode } from '../../hooks/useMode.js';
import { useApps } from '../../hooks/useApps.js';
import { useOpenApp } from '../../hooks/useOpenApp.js';
import { useLang } from '../../hooks/useLang.js';
import AppGrid from '../../components/AppGrid/AppGrid.jsx';
import './Home.css';

export default function Home() {
  const { user } = useAuth();
  const { mode } = useMode();
  const { t } = useLang();
  // Placeholder Sprint 7 : affichera les favoris/récents — pour l'instant toutes les apps du mode
  const { apps, loading, error } = useApps(mode);
  const openApp = useOpenApp();

  return (
    <div className="page-home">
      <div className="page-header">
        <h1 className="page-title">{t('home.greeting', { username: user?.username })}</h1>
        <p className="page-subtitle">
          {t('home.activeMode')} <span className="mode-badge">{t(`modes.${mode}`)}</span>
        </p>
      </div>

      {loading && <div className="loading-screen"><div className="loading-spinner" /></div>}
      {error && <p className="page-error">{t('error.loadApps')}</p>}
      {!loading && !error && <AppGrid apps={apps} onOpen={openApp} />}
    </div>
  );
}
