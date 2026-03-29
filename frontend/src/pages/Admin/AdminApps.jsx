import { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.js';
import { useLang } from '../../hooks/useLang.js';
import { fetchApps, createApp, updateApp, deleteApp } from '../../api/apps.js';
import { fetchCategories } from '../../api/categories.js';
import './AdminApps.css';

const EMPTY_FORM = {
  name: '', url: '', icon: '', mode: 'TV', category_id: '', is_external: false,
};

export default function AdminApps() {
  const { user } = useAuth();
  const { t } = useLang();
  const navigate = useNavigate();

  const [apps, setApps] = useState([]);
  const [categories, setCategories] = useState([]);
  const [modeFilter, setModeFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    const [appsData, catsData] = await Promise.all([
      fetchApps(),
      fetchCategories(),
    ]);
    setApps(appsData.apps ?? []);
    setCategories(catsData.categories ?? []);
  }, []);

  useEffect(() => { load(); }, [load]);

  if (user?.role !== 'admin') {
    return (
      <div className="admin-unauthorized">
        <p>{t('admin.unauthorized')}</p>
        <button onClick={() => navigate('/')}>{t('notFound.back')}</button>
      </div>
    );
  }

  const filteredApps = apps.filter((a) => {
    const matchMode = modeFilter === 'all' || a.mode === modeFilter;
    const q = search.trim().toLowerCase();
    const matchSearch = !q || a.name.toLowerCase().includes(q) || a.url.toLowerCase().includes(q);
    return matchMode && matchSearch;
  });

  const filteredCategories = form.mode
    ? categories.filter((c) => c.mode === form.mode)
    : categories;

  const openAdd = () => {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setError('');
    setShowForm(true);
  };

  const openEdit = (app) => {
    setForm({
      name: app.name,
      url: app.url,
      icon: app.icon ?? '',
      mode: app.mode,
      category_id: app.category_id ?? '',
      is_external: app.is_external ?? false,
    });
    setEditingId(app.id);
    setError('');
    setShowForm(true);
  };

  const cancelForm = () => { setShowForm(false); setEditingId(null); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const payload = {
        ...form,
        category_id: form.category_id ? Number(form.category_id) : null,
      };
      if (editingId) {
        await updateApp(editingId, payload);
      } else {
        await createApp(payload);
      }
      await load();
      cancelForm();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(t('admin.confirmDelete', { name }))) return;
    try {
      await deleteApp(id);
      setApps((prev) => prev.filter((a) => a.id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="page-admin">
      <div className="page-header">
        <h1 className="page-title">{t('admin.title')}</h1>
        <p className="page-subtitle">{t('admin.subtitle')}</p>
      </div>

      {/* ── Formulaire ── */}
      {showForm && (
        <form className="admin-form" onSubmit={handleSubmit}>
          <h2 className="admin-form-title">
            {editingId ? t('admin.editApp') : t('admin.addApp')}
          </h2>

          {error && <p className="admin-form-error">{error}</p>}

          <div className="admin-form-grid">
            <label className="admin-field">
              <span>{t('admin.fieldName')} *</span>
              <input
                required
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="Netflix"
              />
            </label>

            <label className="admin-field">
              <span>{t('admin.fieldUrl')} *</span>
              <input
                required
                value={form.url}
                onChange={(e) => setForm((f) => ({ ...f, url: e.target.value }))}
                placeholder="https://www.netflix.com"
              />
            </label>

            <label className="admin-field">
              <span>{t('admin.fieldIcon')}</span>
              <input
                value={form.icon}
                onChange={(e) => setForm((f) => ({ ...f, icon: e.target.value }))}
                placeholder="https://... ou emoji 🎬"
              />
            </label>

            <label className="admin-field">
              <span>{t('admin.fieldMode')} *</span>
              <select
                value={form.mode}
                onChange={(e) => setForm((f) => ({ ...f, mode: e.target.value, category_id: '' }))}
              >
                <option value="TV">MJ TV</option>
                <option value="Desktop">MJ Desktop</option>
              </select>
            </label>

            <label className="admin-field">
              <span>{t('admin.fieldCategory')}</span>
              <select
                value={form.category_id}
                onChange={(e) => setForm((f) => ({ ...f, category_id: e.target.value }))}
              >
                <option value="">{t('admin.noCategory')}</option>
                {filteredCategories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </label>

            <label className="admin-field admin-field--checkbox">
              <input
                type="checkbox"
                checked={form.is_external}
                onChange={(e) => setForm((f) => ({ ...f, is_external: e.target.checked }))}
              />
              <span>{t('admin.fieldExternal')}</span>
            </label>
          </div>

          <div className="admin-form-actions">
            <button type="submit" className="admin-btn admin-btn--primary" disabled={saving}>
              {saving ? t('admin.saving') : (editingId ? t('admin.save') : t('admin.add'))}
            </button>
            <button type="button" className="admin-btn admin-btn--ghost" onClick={cancelForm}>
              {t('admin.cancel')}
            </button>
          </div>
        </form>
      )}

      {/* ── Filtres + recherche + bouton ajout ── */}
      <div className="admin-toolbar">
        <input
          className="admin-search"
          type="search"
          placeholder={t('admin.searchApp')}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="admin-filters">
          {['all', 'TV', 'Desktop'].map((m) => (
            <button
              key={m}
              className={`admin-filter-btn${modeFilter === m ? ' active' : ''}`}
              onClick={() => setModeFilter(m)}
            >
              {m === 'all' ? t('grid.all') : `MJ ${m}`}
            </button>
          ))}
        </div>
        
        <div className="admin-toolbar-actions">
          <Link to="/admin" className="admin-btn admin-btn--ghost">
            ← {t('admin.boardBadge')}
          </Link>
          <button className="admin-btn admin-btn--primary" onClick={openAdd}>
            + {t('admin.addApp')}
          </button>
        </div>
      </div>

      {/* ── Table des apps ── */}
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>{t('admin.colIcon')}</th>
              <th>{t('admin.colName')}</th>
              <th>{t('admin.colMode')}</th>
              <th className="admin-col-secondary">{t('admin.colCategory')}</th>
              <th className="admin-col-secondary">{t('admin.colExternal')}</th>
              <th>{t('admin.colActions')}</th>
            </tr>
          </thead>
          <tbody>
            {filteredApps.map((app) => (
              <tr key={app.id}>
                <td className="admin-col-icon">
                  {app.icon ? (
                    <img src={app.icon} alt={app.name} onError={(e) => { e.target.style.display = 'none'; }} />
                  ) : (
                    <span className="admin-icon-fallback">{app.name[0]}</span>
                  )}
                </td>
                <td>
                  <span className="admin-app-name">{app.name}</span>
                  <span className="admin-app-url">{app.url}</span>
                </td>
                <td><span className={`admin-badge admin-badge--${app.mode.toLowerCase()}`}>{app.mode}</span></td>
                <td className="admin-col-secondary">{app.category_name ?? '—'}</td>
                <td className="admin-col-secondary">{app.is_external ? '↗' : '▣'}</td>
                <td className="admin-col-actions">
                  <button className="admin-btn admin-btn--sm" onClick={() => openEdit(app)}>
                    {t('admin.edit')}
                  </button>
                  <button className="admin-btn admin-btn--sm admin-btn--danger" onClick={() => handleDelete(app.id, app.name)}>
                    {t('admin.delete')}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredApps.length === 0 && (
          <p className="admin-empty">{t('grid.empty')}</p>
        )}
      </div>
    </div>
  );
}
