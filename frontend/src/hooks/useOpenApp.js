import { useNavigate } from 'react-router-dom';

export function useOpenApp() {
  const navigate = useNavigate();

  return function openApp(app) {
    if (app.is_external) {
      window.open(app.url, '_blank', 'noopener,noreferrer');
    } else {
      navigate(`/viewer/${app.id}`);
    }
  };
}
