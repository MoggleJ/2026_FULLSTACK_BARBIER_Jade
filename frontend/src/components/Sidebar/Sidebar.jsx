import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.js';
import { useMode } from '../../hooks/useMode.js';
import { useTheme } from '../../hooks/useTheme.js';
import { useClock } from '../../hooks/useClock.js';
import {
  IconHome,
  IconGrid,
  IconSearch,
  IconTV,
  IconDesktop,
  IconSettings,
  IconLogout,
  IconSun,
  IconMoon,
  IconClock,
} from '../icons/icons.jsx';
import './Sidebar.css';

export default function Sidebar() {
  const { logout } = useAuth();
  const { mode, toggleMode } = useMode();
  const { theme, toggleTheme } = useTheme();
  const time = useClock();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navClass = ({ isActive }) =>
    `sidebar-item${isActive ? ' sidebar-item--active' : ''}`;

  return (
    <aside className="sidebar">
      {/* ── Titre dynamique ── */}
      <div className="sidebar-header">
        <span className="sidebar-logo">
          <span className="sidebar-logo-mj">MJ</span>
          <span className="sidebar-logo-mode sidebar-label">
            {mode === 'TV' ? 'TV' : 'Desktop'}
          </span>
        </span>
      </div>

      {/* ── Navigation principale ── */}
      <nav className="sidebar-nav">
        <NavLink to="/" end className={navClass}>
          <IconHome />
          <span className="sidebar-label">Home</span>
        </NavLink>

        <NavLink to="/apps" className={navClass}>
          <IconGrid />
          <span className="sidebar-label">All Apps</span>
        </NavLink>

        <NavLink to="/search" className={navClass}>
          <IconSearch />
          <span className="sidebar-label">Search</span>
        </NavLink>
      </nav>

      {/* ── Switch de mode ── */}
      <div className="sidebar-divider" />
      <button className="sidebar-item sidebar-mode-switch" onClick={toggleMode}>
        {mode === 'TV' ? <IconDesktop /> : <IconTV />}
        <span className="sidebar-label">
          {mode === 'TV' ? 'MJ Desktop' : 'MJ TV'}
        </span>
      </button>

      {/* ── Footer ── */}
      <div className="sidebar-spacer" />

      <div className="sidebar-footer">
        <NavLink to="/settings" className={navClass}>
          <IconSettings />
          <span className="sidebar-label">Settings</span>
        </NavLink>

        <button
          className="sidebar-item sidebar-theme-toggle"
          onClick={toggleTheme}
          title={theme === 'dark' ? 'Passer en mode clair' : 'Passer en mode sombre'}
        >
          {theme === 'dark' ? <IconSun /> : <IconMoon />}
          <span className="sidebar-label">
            {theme === 'dark' ? 'Thème clair' : 'Thème sombre'}
          </span>
        </button>

        <div className="sidebar-user">
          <span className="sidebar-clock">
            <IconClock />
            <span className="sidebar-label sidebar-clock-time">{time}</span>
          </span>
          <button
            className="sidebar-logout"
            onClick={handleLogout}
            title="Se déconnecter"
          >
            <IconLogout />
          </button>
        </div>
      </div>
    </aside>
  );
}
