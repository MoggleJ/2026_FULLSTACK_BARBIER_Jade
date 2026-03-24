import { useParams, useNavigate } from 'react-router-dom';
import { useLang } from '../../hooks/useLang.js';
import { useApp } from '../../hooks/useApp.js';
import './AppViewer.css';

export default function AppViewer() {
  const { id } = useParams();
  const { t } = useLang();
  const navigate = useNavigate();
  const { app, loading, error } = useApp(id);

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner" />
      </div>
    );
  }

  if (error || !app) {
    return (
      <div className="app-viewer-error">
        <p>{t('viewer.notFound')}</p>
        <button onClick={() => navigate(-1)}>{t('viewer.back')}</button>
      </div>
    );
  }

  return (
    <div className="app-viewer">
      <div className="app-viewer-bar">
        <button className="app-viewer-back" onClick={() => navigate(-1)}>
          {t('viewer.back')}
        </button>
        <span className="app-viewer-title">{app.name}</span>
        <a
          className="app-viewer-open"
          href={app.url}
          target="_blank"
          rel="noopener noreferrer"
        >
          {t('viewer.openInTab')}
        </a>
      </div>
      <iframe
        className="app-viewer-frame"
        src={app.url}
        title={app.name}
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox"
      />
    </div>
  );
}
