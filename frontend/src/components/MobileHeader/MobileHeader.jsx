import { useMode } from '../../hooks/useMode.js';
import { useLang } from '../../hooks/useLang.js';
import { IconTV, IconDesktop } from '../icons/icons.jsx';
import './MobileHeader.css';

export default function MobileHeader() {
  const { mode, toggleMode } = useMode();
  const { t } = useLang();

  return (
    <header className="mobile-header">
      <span className="mobile-header-mode">
        {mode === 'TV' ? <IconTV /> : <IconDesktop />}
        <span className="mobile-header-mode-name">
          {mode === 'TV' ? 'MJ TV' : 'MJ Desktop'}
        </span>
      </span>
      <button className="mobile-header-switch" onClick={toggleMode}>
        {mode === 'TV' ? <IconDesktop /> : <IconTV />}
        <span>{mode === 'TV' ? t('sidebar.switchToDesktop') : t('sidebar.switchToTV')}</span>
      </button>
    </header>
  );
}
