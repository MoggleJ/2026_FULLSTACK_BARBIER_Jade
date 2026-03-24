import { useState } from 'react';
import { useApps } from '../../hooks/useApps.js';
import { useOpenApp } from '../../hooks/useOpenApp.js';
import { useLang } from '../../hooks/useLang.js';
import AppGrid from '../../components/AppGrid/AppGrid.jsx';
import { IconSearch } from '../../components/icons/icons.jsx';
import './Search.css';

export default function Search() {
  const [query, setQuery] = useState('');
  const { t } = useLang();
  const { apps, loading, error } = useApps();
  const openApp = useOpenApp();

  const filtered = query.trim()
    ? apps.filter((app) =>
        app.name.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  return (
    <div className="page-search">
      <div className="page-header">
        <h1 className="page-title">{t('search.title')}</h1>
      </div>

      <div className="search-input-wrapper">
        <span className="search-icon"><IconSearch /></span>
        <input
          className="search-input"
          type="search"
          placeholder={t('search.placeholder')}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoFocus
        />
      </div>

      {error && <p className="page-error">{t('error.loadApps')}</p>}

      {!loading && !error && query.trim() === '' && (
        <p className="search-hint">{t('search.hint')}</p>
      )}

      {!loading && !error && query.trim() !== '' && filtered.length === 0 && (
        <p className="search-hint">{t('search.noResults', { query })}</p>
      )}

      {!loading && !error && filtered.length > 0 && (
        <AppGrid apps={filtered} onOpen={openApp} />
      )}
    </div>
  );
}
