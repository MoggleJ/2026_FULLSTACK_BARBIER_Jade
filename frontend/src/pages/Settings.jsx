import { useTheme } from '../hooks/useTheme.js';
import { useMode } from '../hooks/useMode.js';
import { IconSun, IconMoon, IconTV, IconDesktop } from '../components/icons.jsx';
import './Settings.css';

export default function Settings() {
  const { theme, toggleTheme } = useTheme();
  const { mode, changeMode } = useMode();

  return (
    <div className="page-settings">
      <div className="page-header">
        <h1 className="page-title">Paramètres</h1>
        <p className="page-subtitle">Personnalisez votre expérience MJQbe</p>
      </div>

      <div className="settings-sections">
        <section className="settings-section">
          <h2 className="settings-section-title">Apparence</h2>

          <div className="settings-row">
            <div className="settings-row-info">
              <span className="settings-row-label">Thème</span>
              <span className="settings-row-desc">
                {theme === 'dark' ? 'Mode sombre activé' : 'Mode clair activé'}
              </span>
            </div>
            <button className="settings-toggle-btn" onClick={toggleTheme}>
              {theme === 'dark' ? <IconSun /> : <IconMoon />}
              <span>{theme === 'dark' ? 'Clair' : 'Sombre'}</span>
            </button>
          </div>
        </section>

        <section className="settings-section">
          <h2 className="settings-section-title">Mode d&apos;affichage</h2>

          <div className="settings-mode-cards">
            <button
              className={`settings-mode-card${mode === 'TV' ? ' active' : ''}`}
              onClick={() => changeMode('TV')}
            >
              <IconTV />
              <span className="settings-mode-label">MJ TV</span>
              <span className="settings-mode-desc">Interface optimisée grand écran</span>
            </button>

            <button
              className={`settings-mode-card${mode === 'Desktop' ? ' active' : ''}`}
              onClick={() => changeMode('Desktop')}
            >
              <IconDesktop />
              <span className="settings-mode-label">MJ Desktop</span>
              <span className="settings-mode-desc">Interface compacte pour bureau</span>
            </button>
          </div>
        </section>

        {/* Placeholder — Sprint 5 */}
        <section className="settings-section">
          <h2 className="settings-section-title">Avancé</h2>
          <div className="page-placeholder">
            <p>Options avancées — Sprint 5</p>
          </div>
        </section>
      </div>
    </div>
  );
}
