import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.js';
import { useLang } from '../../hooks/useLang.js';
import { fetchAdminUsers, updateUserRole, deleteAdminUser } from '../../api/admin.js';
import './AdminUsers.css';

const LIMIT = 20;

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

  // Reset to page 1 when search changes
  useEffect(() => { setPage(1); }, [search]);

  if (user?.role !== 'admin') {
    return (
      <div className="admin-unauthorized">
        <p>{t('admin.unauthorized')}</p>
        <button onClick={() => navigate('/')}>{t('notFound.back')}</button>
      </div>
    );
  }

  const handleSort = (col) => {
    if (sort === col) {
      setOrder((o) => (o === 'asc' ? 'desc' : 'asc'));
    } else {
      setSort(col);
      setOrder('asc');
    }
    setPage(1);
  };

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

  const SortTh = ({ col, label }) => (
    <th
      className={`admin-users-th--sortable${sort === col ? ' active' : ''}`}
      onClick={() => handleSort(col)}
    >
      {label}
      {sort === col && <span className="sort-indicator">{order === 'asc' ? ' ↑' : ' ↓'}</span>}
    </th>
  );

  return (
    <div className="page-admin">
      <div className="page-header">
        <h1 className="page-title">{t('adminUsers.title')}</h1>
        <p className="page-subtitle">{t('adminUsers.subtitle')}</p>
      </div>

      {/* ── Toolbar ── */}
      <div className="admin-toolbar">
        <input
          className="admin-search"
          type="search"
          placeholder={t('adminUsers.search')}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Link to="/admin" className="admin-btn admin-btn--ghost">
          {t('adminUsers.appsLink')}
        </Link>
      </div>

      {error && <p className="admin-form-error">{error}</p>}

      {/* ── Table ── */}
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>{t('adminUsers.colAvatar')}</th>
              <SortTh col="username"        label={t('adminUsers.colUsername')} />
              <th>{t('adminUsers.colEmail')}</th>
              <SortTh col="role"            label={t('adminUsers.colRole')} />
              <SortTh col="created_at"      label={t('adminUsers.colCreatedAt')} />
              <SortTh col="last_login"      label={t('adminUsers.colLastLogin')} />
              <SortTh col="favorites_count" label={t('adminUsers.colFavorites')} />
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
                <td>
                  <span className="admin-app-name">{u.username}</span>
                </td>
                <td className="admin-cell-muted">{u.email ?? '—'}</td>
                <td>
                  <span className={`admin-badge admin-badge--${u.role}`}>
                    {u.role === 'admin' ? t('adminUsers.roleAdmin') : t('adminUsers.roleUser')}
                  </span>
                </td>
                <td className="admin-cell-muted">{formatDate(u.created_at, '—')}</td>
                <td className="admin-cell-muted">{formatDate(u.last_login, t('adminUsers.never'))}</td>
                <td className="admin-cell-center">{u.favorites_count}</td>
                <td className="admin-col-actions">
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
