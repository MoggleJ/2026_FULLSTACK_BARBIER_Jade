import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.js';
import { useLang } from '../../hooks/useLang.js';
import { fetchApps } from '../../api/apps.js';
import { fetchCategories } from '../../api/categories.js';
import { fetchAdminUsers } from '../../api/admin.js';
import { IconGrid, IconUser, IconList, IconShield } from '../../components/icons/icons.jsx';
import './AdminBoard.css';

export default function AdminBoard() {
  const { user } = useAuth();
  const { t } = useLang();
  const navigate = useNavigate();

  const [stats, setStats] = useState({ apps: '…', users: '…', categories: '…' });

  useEffect(() => {
    Promise.all([
      fetchApps(),
      fetchAdminUsers({ page: 1, limit: 1 }),
      fetchCategories(),
    ]).then(([appsData, usersData, catsData]) => {
      setStats({
        apps:       (appsData.apps       ?? []).length,
        users:      usersData.total      ?? 0,
        categories: (catsData.categories ?? []).length,
      });
    }).catch(() => {});
  }, []);

  if (user?.role !== 'admin') {
    return (
      <div className="admin-board-unauthorized">
        <p>{t('admin.unauthorized')}</p>
        <button onClick={() => navigate('/')}>{t('notFound.back')}</button>
      </div>
    );
  }

  const cards = [
    {
      to: '/admin/apps',
      icon: <IconGrid />,
      title: t('admin.boardAppsTitle'),
      desc:  t('admin.boardAppsDesc'),
      count: stats.apps,
      accent: 'tv',
    },
    {
      to: '/admin/users',
      icon: <IconUser />,
      title: t('admin.boardUsersTitle'),
      desc:  t('admin.boardUsersDesc'),
      count: stats.users,
      accent: 'user',
    },
    {
      to: '/admin/categories',
      icon: <IconList />,
      title: t('admin.boardCatsTitle'),
      desc:  t('admin.boardCatsDesc'),
      count: stats.categories,
      accent: 'cat',
    },
  ];

  return (
    <div className="page-admin-board">
      {/* ── En-tête ── */}
      <div className="admin-board-header">
        <span className="admin-board-badge">
          <IconShield />
          {t('admin.boardBadge')}
        </span>
        <h1 className="admin-board-title">{t('admin.boardTitle')}</h1>
        <p className="admin-board-subtitle">{t('admin.boardSubtitle')}</p>
      </div>

      {/* ── Stats rapides ── */}
      <div className="admin-board-stats">
        <div className="admin-stat admin-stat--apps">
          <span className="admin-stat-value">{stats.apps}</span>
          <span className="admin-stat-label">{t('admin.boardAppsTitle')}</span>
        </div>
        <div className="admin-stat admin-stat--users">
          <span className="admin-stat-value">{stats.users}</span>
          <span className="admin-stat-label">{t('admin.boardUsersTitle')}</span>
        </div>
        <div className="admin-stat admin-stat--cats">
          <span className="admin-stat-value">{stats.categories}</span>
          <span className="admin-stat-label">{t('admin.boardCatsTitle')}</span>
        </div>
      </div>

      {/* ── Cartes de gestion ── */}
      <div className="admin-board-cards">
        {cards.map((card) => (
          <Link key={card.to} to={card.to} className={`admin-board-card admin-board-card--${card.accent}`}>
            <div className="admin-board-card-icon">{card.icon}</div>
            <div className="admin-board-card-body">
              <span className="admin-board-card-title">{card.title}</span>
              <span className="admin-board-card-desc">{card.desc}</span>
            </div>
            <div className="admin-board-card-footer">
              <span className="admin-board-card-count">{card.count}</span>
              <span className="admin-board-card-arrow">→</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
