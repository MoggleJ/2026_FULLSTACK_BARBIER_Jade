import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../hooks/useTheme.js';
import { useMode } from '../../hooks/useMode.js';
import { useAuth } from '../../hooks/useAuth.js';
import { useLang } from '../../hooks/useLang.js';
import { useClockFormat } from '../../hooks/useClockFormat.js';
import { useClock } from '../../hooks/useClock.js';
import { useIconSize } from '../../hooks/useIconSize.js';
import { useSettings } from '../../hooks/useSettings.js';
import {
  IconClock,
  IconSun,
  IconMoon,
  IconTV,
  IconDesktop,
  IconLogout,
  IconGlobe,
} from '../../components/icons/icons.jsx';
import './Settings.css';

export default function Settings() {
  const { theme } = useTheme();
  const { mode } = useMode();
  const { logout } = useAuth();
  const { lang, setLang, t } = useLang();
  const { clockFormat, setClockFormat } = useClockFormat();
  const { iconSize } = useIconSize();
  const { applyTheme, applyMode, applyIconSize } = useSettings();
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
          <div className="settings-row">
            <div className="settings-row-info">
              <span className="settings-row-label">{t('settings.theme')}</span>
              <span className="settings-row-desc">
                {theme === 'dark' ? t('settings.darkEnabled') : t('settings.lightEnabled')}
              </span>
            </div>
            <button
              className="settings-toggle-btn"
              onClick={() => applyTheme(theme === 'dark' ? 'light' : 'dark')}
            >
              {theme === 'dark' ? <IconSun /> : <IconMoon />}
              <span>{theme === 'dark' ? t('settings.toLight') : t('settings.toDark')}</span>
            </button>
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
