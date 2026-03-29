import { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.js';
import { useLang } from '../../hooks/useLang.js';
import { fetchCategories } from '../../api/categories.js';
import { apiFetch } from '../../api/client.js';
import './AdminApps.css';

const EMPTY_FORM = { name: '', mode: 'TV' };

export default function AdminCategories() {
  const { user } = useAuth();
  const { t } = useLang();
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    const data = await fetchCategories();
    setCategories(data.categories ?? []);
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

  const openAdd = () => {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setError('');
    setShowForm(true);
  };

  const openEdit = (cat) => {
    setForm({ name: cat.name, mode: cat.mode });
    setEditingId(cat.id);
    setError('');
    setShowForm(true);
  };

  const cancelForm = () => { setShowForm(false); setEditingId(null); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      if (editingId) {
        await apiFetch(`/categories/${editingId}`, { method: 'PUT', body: JSON.stringify(form) });
      } else {
        await apiFetch('/categories', { method: 'POST', body: JSON.stringify(form) });
      }
      await load();
      cancelForm();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (cat) => {
    if (!window.confirm(t('admin.confirmDelete', { name: cat.name }))) return;
    try {
      await apiFetch(`/categories/${cat.id}`, { method: 'DELETE' });
      setCategories((prev) => prev.filter((c) => c.id !== cat.id));
    } catch (err) {
      setError(err.message);
    }
  };

  const tvCats      = categories.filter((c) => c.mode === 'TV');
  const desktopCats = categories.filter((c) => c.mode === 'Desktop');

  return (
    <div className="page-admin">
      <div className="page-header">
        <h1 className="page-title">{t('admin.categoriesTitle')}</h1>
        <p className="page-subtitle">{t('admin.categoriesSubtitle')}</p>
      </div>

      {/* ── Formulaire ── */}
      {showForm && (
        <form className="admin-form" onSubmit={handleSubmit}>
          <h2 className="admin-form-title">
            {editingId ? t('admin.editCategory') : t('admin.addCategory')}
          </h2>

          {error && <p className="admin-form-error">{error}</p>}

          <div className="admin-form-grid">
            <label className="admin-field">
              <span>{t('admin.fieldCategoryName')} *</span>
              <input
                required
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="Streaming"
              />
            </label>

            <label className="admin-field">
              <span>{t('admin.fieldCategoryMode')} *</span>
              <select
                value={form.mode}
                onChange={(e) => setForm((f) => ({ ...f, mode: e.target.value }))}
              >
                <option value="TV">MJ TV</option>
                <option value="Desktop">MJ Desktop</option>
              </select>
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

      {/* ── Toolbar ── */}
      <div className="admin-toolbar">
        <Link to="/admin" className="admin-btn admin-btn--ghost">
          ← {t('admin.boardBadge')}
        </Link>
        <button className="admin-btn admin-btn--primary" onClick={openAdd}>
          + {t('admin.addCategory')}
        </button>
      </div>

      {error && !showForm && <p className="admin-form-error">{error}</p>}

      {/* ── Table TV ── */}
      <div className="admin-cats-grid">
      {[{ label: 'MJ TV', list: tvCats }, { label: 'MJ Desktop', list: desktopCats }].map(({ label, list }) => (
        <div key={label} className="admin-cats-section">
          <h3 className="admin-cats-section-title">{label}</h3>
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>{t('admin.fieldCategoryName')}</th>
                  <th>{t('admin.colActions')}</th>
                </tr>
              </thead>
              <tbody>
                {list.map((cat) => (
                  <tr key={cat.id}>
                    <td><span className="admin-app-name">{cat.name}</span></td>
                    <td className="admin-col-actions">
                      <button className="admin-btn admin-btn--sm" onClick={() => openEdit(cat)}>
                        {t('admin.edit')}
                      </button>
                      <button className="admin-btn admin-btn--sm admin-btn--danger" onClick={() => handleDelete(cat)}>
                        {t('admin.delete')}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {list.length === 0 && <p className="admin-empty">{t('grid.empty')}</p>}
          </div>
        </div>
      ))}
      </div>
    </div>
  );
}
