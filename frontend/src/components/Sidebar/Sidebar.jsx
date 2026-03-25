import { NavLink } from 'react-router-dom';
import { useMode } from '../../hooks/useMode.js';
import { useClock } from '../../hooks/useClock.js';
import { useClockFormat } from '../../hooks/useClockFormat.js';
import { useLang } from '../../hooks/useLang.js';
import {
  IconHome,
  IconGrid,
  IconSearch,
  IconTV,
  IconDesktop,
  IconSettings,
  IconUser,
  IconClock,
} from '../icons/icons.jsx';
import './Sidebar.css';

export default function Sidebar() {
  const { mode, toggleMode } = useMode();
  const { t } = useLang();
  const { clockFormat, toggleClockFormat } = useClockFormat();
  const time = useClock(clockFormat);

  const navClass = ({ isActive }) =>
    `sidebar-item${isActive ? ' sidebar-item--active' : ''}`;

  return (
    <aside className="sidebar">
      {/* ── Titre dynamique ── */}
      <div className="sidebar-header">
        <span className="sidebar-logo">
          <span className="sidebar-logo-icon">
            {mode === 'TV' ? <IconTV /> : <IconDesktop />}
          </span>
          <div className="sidebar-logo-text">
            <span className="sidebar-logo-mj">MJ</span>
            <span className="sidebar-logo-mode sidebar-label">
              {mode === 'TV' ? 'TV' : 'Desktop'}
            </span>
          </div>
        </span>
      </div>

      {/* ── Navigation principale ── */}
      <nav className="sidebar-nav">
        <NavLink to="/" end className={navClass}>
          <IconHome />
          <span className="sidebar-label">{t('sidebar.home')}</span>
        </NavLink>

        <NavLink to="/apps" className={navClass}>
          <IconGrid />
          <span className="sidebar-label">{t('sidebar.allApps')}</span>
        </NavLink>

        <NavLink to="/search" className={navClass}>
          <IconSearch />
          <span className="sidebar-label">{t('sidebar.search')}</span>
        </NavLink>

        <NavLink to="/settings" className={navClass}>
          <IconSettings />
          <span className="sidebar-label">{t('sidebar.settings')}</span>
        </NavLink>

        <NavLink to="/profile" className={navClass}>
          <IconUser />
          <span className="sidebar-label">{t('sidebar.profile')}</span>
        </NavLink>
      </nav>

      {/* ── Switch de mode (desktop uniquement) ── */}
      <div className="sidebar-divider" />
      <button className="sidebar-item sidebar-mode-switch" onClick={toggleMode}>
        {mode === 'TV' ? <IconDesktop /> : <IconTV />}
        <span className="sidebar-label">
          {mode === 'TV' ? t('sidebar.switchToDesktop') : t('sidebar.switchToTV')}
        </span>
      </button>

      {/* ── Footer ── */}
      <div className="sidebar-spacer" />

      <div className="sidebar-footer">
        <button className="sidebar-item sidebar-clock" onClick={toggleClockFormat} title={clockFormat === '24h' ? '12h' : '24h'}>
          <IconClock />
          <span className="sidebar-label sidebar-clock-time">{time}</span>
        </button>
      </div>
    </aside>
  );
}
