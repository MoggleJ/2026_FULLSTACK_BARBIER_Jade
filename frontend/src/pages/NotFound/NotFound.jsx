import { useNavigate } from 'react-router-dom';
import { useLang } from '../../hooks/useLang.js';
import './NotFound.css';

export default function NotFound() {
  const navigate = useNavigate();
  const { t } = useLang();

  return (
    <div className="not-found">
      <span className="not-found-code">404</span>
      <h1 className="not-found-title">{t('notFound.title')}</h1>
      <p className="not-found-desc">{t('notFound.desc')}</p>
      <button className="not-found-btn" onClick={() => navigate('/')}>
        {t('notFound.back')}
      </button>
    </div>
  );
}
