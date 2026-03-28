import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth.js';
import { useLang } from '../../hooks/useLang.js';
import { apiFetch } from '../../api/client.js';
import './AdminApps.css';

export default function AdminLogs() {
  const { user } = useAuth();
  const { t } = useLang();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (user?.role !== 'admin') return;
    apiFetch('/logs?limit=200')
      .then((data) => setLogs(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [user]);

  if (user?.role !== 'admin') {
    return <div className="admin-unauthorized">{t('admin.unauthorized')}</div>;
  }

  const filtered = search
    ? logs.filter(
        (l) =>
          l.action?.toLowerCase().includes(search.toLowerCase()) ||
          l.username?.toLowerCase().includes(search.toLowerCase())
      )
    : logs;

  return (
    <div className="page-admin">
      <div className="page-header">
        <h1 className="page-title">{t('admin.logsTitle')}</h1>
        <p className="page-subtitle">{t('admin.logsSubtitle')}</p>
      </div>

      <div className="admin-toolbar">
        <input
          className="admin-search"
          type="search"
          placeholder={t('admin.logsSearch')}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <span className="admin-logs-count">
          {filtered.length} {t('admin.logsEntries')}
        </span>
      </div>

      {loading && <div className="loading-screen"><div className="loading-spinner" /></div>}
      {error && <p className="admin-form-error">{error}</p>}

      {!loading && !error && (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>{t('admin.logsColDate')}</th>
                <th>{t('admin.logsColUser')}</th>
                <th>{t('admin.logsColAction')}</th>
                <th>{t('admin.logsColMeta')}</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={4} className="admin-empty">{t('admin.logsEmpty')}</td></tr>
              ) : (
                filtered.map((log) => (
                  <tr key={log.id}>
                    <td className="admin-logs-date">
                      {new Date(log.created_at).toLocaleString()}
                    </td>
                    <td>{log.username ?? <span className="admin-logs-anon">—</span>}</td>
                    <td>
                      <span className={`admin-badge admin-badge--action admin-badge--${log.action}`}>
                        {log.action}
                      </span>
                    </td>
                    <td className="admin-logs-meta">
                      {log.metadata
                        ? <code>{JSON.stringify(log.metadata)}</code>
                        : '—'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
