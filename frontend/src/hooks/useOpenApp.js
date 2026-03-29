import { useNavigate } from 'react-router-dom';
import { addToRecent } from './useRecentApps.js';

export function useOpenApp() {
  const navigate = useNavigate();

  return function openApp(app) {
    addToRecent(app);
    if (app.is_external) {
      window.open(app.url, '_blank', 'noopener,noreferrer');
    } else {
      navigate(`/viewer/${app.id}`);
    }
  };
}
