import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { useLang } from '../../hooks/useLang.js';
import { useApp } from '../../hooks/useApp.js';
import './AppViewer.css';

const BLOCKED_TIMEOUT_MS = 8000;

export default function AppViewer() {
  const { id } = useParams();
  const { t } = useLang();
  const navigate = useNavigate();
  const { app, loading, error } = useApp(id);
  const [iframeState, setIframeState] = useState('loading'); // loading | loaded | blocked
  const timerRef = useRef(null);

  useEffect(() => {
    if (!app) return;
    setIframeState('loading');
    timerRef.current = setTimeout(() => setIframeState('blocked'), BLOCKED_TIMEOUT_MS);
    return () => clearTimeout(timerRef.current);
  }, [app]);

  const handleIframeLoad = () => {
    clearTimeout(timerRef.current);
    setIframeState('loaded');
  };

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

      {iframeState === 'blocked' && (
        <div className="app-viewer-blocked">
          <p>{t('viewer.blocked')}</p>
          <a href={app.url} target="_blank" rel="noopener noreferrer">
            {t('viewer.openInTab')}
          </a>
        </div>
      )}

      <iframe
        className={`app-viewer-frame${iframeState === 'blocked' ? ' app-viewer-frame--hidden' : ''}`}
        src={app.url}
        title={app.name}
        onLoad={handleIframeLoad}
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox"
      />
    </div>
  );
}
