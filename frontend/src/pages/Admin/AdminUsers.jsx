import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.js';
import { useLang } from '../../hooks/useLang.js';
import { fetchAdminUsers, updateUserRole, updateAdminUser, createAdminUser, deleteAdminUser } from '../../api/admin.js';
import './AdminApps.css';
import './AdminUsers.css';

const LIMIT = 20;
const EMPTY_FORM = { username: '', email: '', password: '', role: 'user' };

function formatDate(iso, never) {
  if (!iso) return never;
  return new Date(iso).toLocaleDateString(undefined, { day: '2-digit', month: '2-digit', year: 'numeric' });
}

export default function AdminUsers() {
  const { user } = useAuth();
  const { t }    = useLang();
  const navigate = useNavigate();

  const [users,   setUsers]   = useState([]);
  const [total,   setTotal]   = useState(0);
  const [page,    setPage]    = useState(1);
  const [search,  setSearch]  = useState('');
  const [sort,    setSort]    = useState('created_at');
  const [order,   setOrder]   = useState('desc');
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');

  // ── Formulaire ───────────────────────────────────────────────────────────
  const [showForm,   setShowForm]   = useState(false);
  const [editingId,  setEditingId]  = useState(null);
  const [form,       setForm]       = useState(EMPTY_FORM);
  const [saving,     setSaving]     = useState(false);
  const [formError,  setFormError]  = useState('');

  const totalPages = Math.max(1, Math.ceil(total / LIMIT));

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await fetchAdminUsers({ search, page, limit: LIMIT, sort, order });
      setUsers(data.users ?? []);
      setTotal(data.total ?? 0);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [search, page, sort, order]);

  useEffect(() => { load(); }, [load]);
  useEffect(() => { setPage(1); }, [search]);

  if (user?.role !== 'admin') {
    return (
      <div className="admin-unauthorized">
        <p>{t('admin.unauthorized')}</p>
        <button onClick={() => navigate('/')}>{t('notFound.back')}</button>
      </div>
    );
  }

  // ── Tri ──────────────────────────────────────────────────────────────────
  const handleSort = (col) => {
    if (sort === col) setOrder((o) => (o === 'asc' ? 'desc' : 'asc'));
    else { setSort(col); setOrder('asc'); }
    setPage(1);
  };

  // ── Formulaire ───────────────────────────────────────────────────────────
  const openAdd = () => {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setFormError('');
    setShowForm(true);
  };

  const openEdit = (u) => {
    setForm({ username: u.username, email: u.email ?? '', password: '', role: u.role });
    setEditingId(u.id);
    setFormError('');
    setShowForm(true);
  };

  const cancelForm = () => { setShowForm(false); setEditingId(null); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setFormError('');
    try {
      if (editingId) {
        const payload = {
          username: form.username || undefined,
          email:    form.email    || null,
          role:     form.role,
          ...(form.password ? { password: form.password } : {}),
        };
        const { user: updated } = await updateAdminUser(editingId, payload);
        setUsers((prev) => prev.map((x) => x.id === updated.id ? { ...x, ...updated } : x));
      } else {
        await createAdminUser({
          username: form.username,
          password: form.password,
          role:     form.role,
          email:    form.email || null,
        });
        await load();
      }
      cancelForm();
    } catch (err) {
      setFormError(err.message);
    } finally {
      setSaving(false);
    }
  };

  // ── Actions rapides ──────────────────────────────────────────────────────
  const handleRoleToggle = async (u) => {
    const newRole = u.role === 'admin' ? 'user' : 'admin';
    try {
      const { user: updated } = await updateUserRole(u.id, newRole);
      setUsers((prev) => prev.map((x) => (x.id === updated.id ? { ...x, role: updated.role } : x)));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (u) => {
    if (!window.confirm(t('adminUsers.confirmDelete', { username: u.username }))) return;
    try {
      await deleteAdminUser(u.id);
      setTotal((n) => n - 1);
      setUsers((prev) => prev.filter((x) => x.id !== u.id));
    } catch (err) {
      setError(err.message);
    }
  };

  const SortTh = ({ col, label, className = '' }) => (
    <th
      className={`admin-users-th--sortable${sort === col ? ' active' : ''}${className ? ` ${className}` : ''}`}
      onClick={() => handleSort(col)}
    >
      {label}
      {sort === col && <span className="sort-indicator">{order === 'asc' ? ' ↑' : ' ↓'}</span>}
    </th>
  );

  const isEdit = !!editingId;

  return (
    <div className="page-admin">
      <div className="page-header">
        <h1 className="page-title">{t('adminUsers.title')}</h1>
        <p className="page-subtitle">{t('adminUsers.subtitle')}</p>
      </div>

      {/* ── Formulaire ajout / édition ── */}
      {showForm && (
        <form className="admin-form" onSubmit={handleSubmit} autoComplete="off">
          <h2 className="admin-form-title">
            {isEdit ? t('adminUsers.editUser') : t('adminUsers.addUser')}
          </h2>

          {formError && <p className="admin-form-error">{formError}</p>}

          <div className="admin-form-grid">
            <label className="admin-field">
              <span>{t('adminUsers.fieldUsername')} *</span>
              <input
                required
                value={form.username}
                onChange={(e) => setForm((f) => ({ ...f, username: e.target.value }))}
                placeholder="username"
                autoComplete="off"
              />
            </label>

            <label className="admin-field">
              <span>{t('adminUsers.fieldEmail')}</span>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                placeholder="user@example.com"
              />
            </label>

            <label className="admin-field">
              <span>{isEdit ? t('adminUsers.fieldPasswordEdit') : `${t('adminUsers.fieldPassword')} *`}</span>
              <input
                type="password"
                required={!isEdit}
                value={form.password}
                onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                placeholder={isEdit ? '••••••' : 'minimum 6 caractères'}
                autoComplete="new-password"
              />
            </label>

            <label className="admin-field">
              <span>{t('adminUsers.fieldRole')}</span>
              <select
                value={form.role}
                onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
              >
                <option value="user">{t('adminUsers.roleUser')}</option>
                <option value="admin">{t('adminUsers.roleAdmin')}</option>
              </select>
            </label>
          </div>

          <div className="admin-form-actions">
            <button type="submit" className="admin-btn admin-btn--primary" disabled={saving}>
              {saving ? t('admin.saving') : (isEdit ? t('admin.save') : t('admin.add'))}
            </button>
            <button type="button" className="admin-btn admin-btn--ghost" onClick={cancelForm}>
              {t('admin.cancel')}
            </button>
          </div>
        </form>
      )}

      {/* ── Toolbar ── */}
      <div className="admin-toolbar">
        <input
          className="admin-search"
          type="search"
          placeholder={t('adminUsers.search')}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="admin-toolbar-actions">
          <Link to="/admin" className="admin-btn admin-btn--ghost">
            ← {t('admin.boardBadge')}
          </Link>
          <button className="admin-btn admin-btn--primary" onClick={openAdd}>
            + {t('adminUsers.addUser')}
          </button>
        </div>
      </div>

      {error && <p className="admin-form-error">{error}</p>}

      {/* ── Table ── */}
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>{t('adminUsers.colAvatar')}</th>
              <SortTh col="username"        label={t('adminUsers.colUsername')} />
              <th className="admin-col-secondary">{t('adminUsers.colEmail')}</th>
              <SortTh col="role"            label={t('adminUsers.colRole')} />
              <SortTh col="created_at"      label={t('adminUsers.colCreatedAt')} className="admin-col-secondary" />
              <SortTh col="last_login"      label={t('adminUsers.colLastLogin')} className="admin-col-secondary" />
              <SortTh col="favorites_count" label={t('adminUsers.colFavorites')} className="admin-col-tertiary" />
              <th>{t('adminUsers.colActions')}</th>
            </tr>
          </thead>
          <tbody>
            {!loading && users.map((u) => (
              <tr key={u.id}>
                <td className="admin-col-icon">
                  {u.avatar ? (
                    <img src={u.avatar} alt={u.username} onError={(e) => { e.target.style.display = 'none'; }} />
                  ) : (
                    <span className="admin-icon-fallback">{u.username[0].toUpperCase()}</span>
                  )}
                </td>
                <td><span className="admin-app-name">{u.username}</span></td>
                <td className="admin-col-secondary admin-cell-muted">{u.email ?? '—'}</td>
                <td>
                  <span className={`admin-badge admin-badge--${u.role}`}>
                    {u.role === 'admin' ? t('adminUsers.roleAdmin') : t('adminUsers.roleUser')}
                  </span>
                </td>
                <td className="admin-col-secondary admin-cell-muted">{formatDate(u.created_at, '—')}</td>
                <td className="admin-col-secondary admin-cell-muted">{formatDate(u.last_login, t('adminUsers.never'))}</td>
                <td className="admin-col-tertiary admin-cell-center">{u.favorites_count}</td>
                <td className="admin-col-actions">
                  <button
                    className="admin-btn admin-btn--sm"
                    onClick={() => openEdit(u)}
                  >
                    {t('admin.edit')}
                  </button>
                  {u.id !== user.id && (
                    <>
                      <button
                        className="admin-btn admin-btn--sm"
                        onClick={() => handleRoleToggle(u)}
                      >
                        {u.role === 'admin' ? t('adminUsers.makeUser') : t('adminUsers.makeAdmin')}
                      </button>
                      <button
                        className="admin-btn admin-btn--sm admin-btn--danger"
                        onClick={() => handleDelete(u)}
                      >
                        {t('adminUsers.delete')}
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {loading && <div className="admin-loading"><div className="loading-spinner" /></div>}
        {!loading && users.length === 0 && (
          <p className="admin-empty">{t('adminUsers.empty')}</p>
        )}
      </div>

      {/* ── Pagination ── */}
      {totalPages > 1 && (
        <div className="admin-pagination">
          <button
            className="admin-btn admin-btn--sm"
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
          >
            {t('adminUsers.prev')}
          </button>
          <span className="admin-pagination-info">
            {t('adminUsers.pageInfo', { page, total: totalPages })}
          </span>
          <button
            className="admin-btn admin-btn--sm"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            {t('adminUsers.next')}
          </button>
        </div>
      )}
    </div>
  );
}
