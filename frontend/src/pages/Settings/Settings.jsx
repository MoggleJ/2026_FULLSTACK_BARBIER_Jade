import { useNavigate, Link } from 'react-router-dom';
import { useTheme } from '../../hooks/useTheme.js';
import { useMode } from '../../hooks/useMode.js';
import { useAuth } from '../../hooks/useAuth.js';
import { useLang } from '../../hooks/useLang.js';
import { useClockFormat } from '../../hooks/useClockFormat.js';
import { useClock } from '../../hooks/useClock.js';
import { useIconSize } from '../../hooks/useIconSize.js';
import { useLayout } from '../../hooks/useLayout.js';
import { useSettings } from '../../hooks/useSettings.js';
import {
  IconClock,
  IconTV,
  IconDesktop,
  IconLogout,
  IconGlobe,
  IconGrid,
  IconList,
} from '../../components/icons/icons.jsx';

const THEMES = [
  { id: 'dark',         bg: '#18181b', accent: '#0ea5e9' },
  { id: 'dark-blue',    bg: '#0f172a', accent: '#60a5fa' },
  { id: 'dark-purple',  bg: '#1a1030', accent: '#a78bfa' },
  { id: 'amoled',       bg: '#000000', accent: '#22d3ee' },
  { id: 'dark-green',   bg: '#14532d', accent: '#34d399' },
  { id: 'light',        bg: '#f9fafb', accent: '#0284c7' },
  { id: 'light-warm',   bg: '#fffbeb', accent: '#d97706' },
  { id: 'light-blue',   bg: '#f0f9ff', accent: '#0284c7' },
  { id: 'light-purple', bg: '#faf5ff', accent: '#7c3aed' },
  { id: 'light-green',  bg: '#f0fdf4', accent: '#16a34a' },
];
import './Settings.css';

export default function Settings() {
  const { theme } = useTheme();
  const { mode } = useMode();
  const { logout, user } = useAuth();
  const { lang, setLang, t } = useLang();
  const { clockFormat, setClockFormat } = useClockFormat();
  const { iconSize } = useIconSize();
  const { layout } = useLayout();
  const { applyTheme, applyMode, applyIconSize, applyLayout } = useSettings();
  const previewTime = useClock(clockFormat);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="page-settings">
      <div className="page-header">
        <h1 className="page-title">{t('settings.title')}</h1>
        <p className="page-subtitle">{t('settings.subtitle')}</p>
      </div>

      <div className="settings-sections">

        {/* ── Apparence ── */}
        <section className="settings-section">
          <h2 className="settings-section-title">{t('settings.appearance')}</h2>
          <div className="settings-row-info" style={{ marginBottom: 'var(--space-4)' }}>
            <span className="settings-row-label">{t('settings.themeLabel')}</span>
          </div>
          <div className="settings-theme-grid">
            {THEMES.map(({ id, bg, accent }) => (
              <button
                key={id}
                className={`settings-theme-swatch${theme === id ? ' active' : ''}`}
                onClick={() => applyTheme(id)}
                title={t(`settings.themes.${id}`)}
                style={{ '--swatch-bg': bg, '--swatch-accent': accent }}
              >
                <span className="settings-theme-swatch-circle" />
                <span className="settings-theme-swatch-name">{t(`settings.themes.${id}`)}</span>
              </button>
            ))}
          </div>
        </section>

        {/* ── Mode d'affichage ── */}
        <section className="settings-section">
          <h2 className="settings-section-title">{t('settings.displayMode')}</h2>
          <div className="settings-mode-cards">
            <button
              className={`settings-mode-card${mode === 'TV' ? ' active' : ''}`}
              onClick={() => applyMode('TV')}
            >
              <IconTV />
              <span className="settings-mode-label">MJ TV</span>
              <span className="settings-mode-desc">{t('settings.tvDesc')}</span>
            </button>
            <button
              className={`settings-mode-card${mode === 'Desktop' ? ' active' : ''}`}
              onClick={() => applyMode('Desktop')}
            >
              <IconDesktop />
              <span className="settings-mode-label">MJ Desktop</span>
              <span className="settings-mode-desc">{t('settings.desktopDesc')}</span>
            </button>
          </div>
        </section>

        {/* ── Taille des icônes ── */}
        <section className="settings-section">
          <h2 className="settings-section-title">{t('settings.iconSize')}</h2>
          <div className="settings-row">
            <div className="settings-row-info">
              <span className="settings-row-label">{t('settings.iconSize')}</span>
              <span className="settings-row-desc">{t('settings.iconSizeDesc')}</span>
            </div>
            <div className="settings-lang-buttons">
              {['small', 'medium', 'large'].map((size) => (
                <button
                  key={size}
                  className={`settings-lang-btn${iconSize === size ? ' active' : ''}`}
                  onClick={() => applyIconSize(size)}
                >
                  {t(`settings.iconSize${size.charAt(0).toUpperCase() + size.slice(1)}`)}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* ── Disposition ── */}
        <section className="settings-section">
          <h2 className="settings-section-title">{t('settings.layout')}</h2>
          <div className="settings-row">
            <div className="settings-row-info">
              <span className="settings-row-label">{t('settings.layout')}</span>
              <span className="settings-row-desc">{t('settings.layoutDesc')}</span>
            </div>
            <div className="settings-lang-buttons">
              <button
                className={`settings-lang-btn${layout === 'grid' ? ' active' : ''}`}
                onClick={() => applyLayout('grid')}
              >
                <IconGrid /> {t('settings.layoutGrid')}
              </button>
              <button
                className={`settings-lang-btn${layout === 'list' ? ' active' : ''}`}
                onClick={() => applyLayout('list')}
              >
                <IconList /> {t('settings.layoutList')}
              </button>
            </div>
          </div>
        </section>

        {/* ── Langue ── */}
        <section className="settings-section">
          <h2 className="settings-section-title">{t('settings.language')}</h2>
          <div className="settings-row">
            <div className="settings-row-info">
              <span className="settings-row-label">
                <IconGlobe /> {t('settings.language')}
              </span>
              <span className="settings-row-desc">{t('settings.languageDesc')}</span>
            </div>
            <div className="settings-lang-buttons">
              <button
                className={`settings-lang-btn${lang === 'fr' ? ' active' : ''}`}
                onClick={() => setLang('fr')}
              >
                FR
              </button>
              <button
                className={`settings-lang-btn${lang === 'en' ? ' active' : ''}`}
                onClick={() => setLang('en')}
              >
                EN
              </button>
            </div>
          </div>
        </section>

        {/* ── Format de l'heure ── */}
        <section className="settings-section">
          <h2 className="settings-section-title">{t('settings.clockFormat')}</h2>
          <div className="settings-row">
            <div className="settings-row-info">
              <span className="settings-row-label">
                <IconClock /> <span className="settings-clock-preview">{previewTime}</span>
              </span>
              <span className="settings-row-desc">{t('settings.clockFormatDesc')}</span>
            </div>
            <div className="settings-lang-buttons">
              <button
                className={`settings-lang-btn${clockFormat === '24h' ? ' active' : ''}`}
                onClick={() => setClockFormat('24h')}
              >
                24h
              </button>
              <button
                className={`settings-lang-btn${clockFormat === '12h' ? ' active' : ''}`}
                onClick={() => setClockFormat('12h')}
              >
                12h
              </button>
            </div>
          </div>
        </section>

        {/* ── Admin ── */}
        {user?.role === 'admin' && (
          <section className="settings-section">
            <h2 className="settings-section-title">{t('admin.title')}</h2>
            <div className="settings-row">
              <div className="settings-row-info">
                <span className="settings-row-label">{t('admin.adminLink')}</span>
                <span className="settings-row-desc">{t('admin.adminLinkDesc')}</span>
              </div>
              <Link to="/admin" className="settings-toggle-btn">
                {t('admin.adminLink')}
              </Link>
            </div>
          </section>
        )}

        {/* ── Compte ── */}
        <section className="settings-section">
          <h2 className="settings-section-title">{t('settings.account')}</h2>
          <div className="settings-row">
            <div className="settings-row-info">
              <span className="settings-row-label">{t('settings.session')}</span>
              <span className="settings-row-desc">{t('settings.logoutDesc')}</span>
            </div>
            <button className="settings-logout-btn" onClick={handleLogout}>
              <IconLogout />
              <span>{t('settings.logout')}</span>
            </button>
          </div>
        </section>

      </div>
    </div>
  );
}
