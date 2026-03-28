import { useAuth } from '../../hooks/useAuth.js';
import { useMode } from '../../hooks/useMode.js';
import { useApps } from '../../hooks/useApps.js';
import { useOpenApp } from '../../hooks/useOpenApp.js';
import { useLang } from '../../hooks/useLang.js';
import { useFavorites } from '../../hooks/useFavorites.js';
import { useRecentApps } from '../../hooks/useRecentApps.js';
import AppGrid from '../../components/AppGrid/AppGrid.jsx';
import './Home.css';

export default function Home() {
  const { user } = useAuth();
  const { mode } = useMode();
  const { t } = useLang();
  const openApp = useOpenApp();
  const { favoriteApps, favoriteIds, toggle, loading: favLoading } = useFavorites();
  const { recentApps } = useRecentApps();
  const { apps: allApps, loading: appsLoading } = useApps(mode);

  const favorites = favoriteApps.filter((a) => a.mode === mode);
  const recent    = recentApps.filter((a) => a.mode === mode && !favoriteIds.has(a.id));
  const loading = favLoading || appsLoading;

  return (
    <div className="page-home">
      <div className="page-header">
        <h1 className="page-title">{t('home.greeting', { username: user?.username })}</h1>
        <p className="page-subtitle">
          {t('home.activeMode')} <span className="mode-badge">{t(`modes.${mode}`)}</span>
        </p>
      </div>

      {loading && <div className="loading-screen"><div className="loading-spinner" /></div>}

      {!loading && (
        <>
          {favorites.length > 0 && (
            <section className="home-section">
              <h2 className="home-section-title">{t('home.favorites')}</h2>
              <AppGrid
                apps={favorites}
                onOpen={openApp}
                favoriteIds={favoriteIds}
                onToggleFavorite={toggle}
              />
            </section>
          )}

          {recent.length > 0 && (
            <section className="home-section">
              <h2 className="home-section-title">{t('home.recent')}</h2>
              <AppGrid
                apps={recent}
                onOpen={openApp}
                favoriteIds={favoriteIds}
                onToggleFavorite={toggle}
              />
            </section>
          )}

          <AppGrid
            apps={allApps}
            onOpen={openApp}
            favoriteIds={favoriteIds}
            onToggleFavorite={toggle}
            groupByCategory
          />
        </>
      )}
    </div>
  );
}
