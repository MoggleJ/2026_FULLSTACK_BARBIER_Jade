import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.js';
import { useLang } from '../../hooks/useLang.js';
import './Auth.css';

export default function Register() {
  const { register } = useAuth();
  const { t } = useLang();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', password: '', confirm: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (form.password !== form.confirm) {
      return setError(t('auth.register.passwordMismatch'));
    }

    setLoading(true);
    try {
      await register(form.username, form.password);
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          <span className="auth-logo-mj">MJ</span>
          <span className="auth-logo-qbe">Qbe</span>
        </div>
        <h1 className="auth-title">{t('auth.register.title')}</h1>
        <p className="auth-subtitle">{t('auth.register.subtitle')}</p>

        <form onSubmit={handleSubmit} className="auth-form" noValidate>
          <div className="form-field">
            <label htmlFor="username">{t('auth.username')}</label>
            <input
              id="username"
              name="username"
              type="text"
              autoComplete="username"
              placeholder={t('auth.usernamePlaceholder')}
              value={form.username}
              onChange={handleChange}
              required
              minLength={3}
              maxLength={100}
            />
          </div>

          <div className="form-field">
            <label htmlFor="password">{t('auth.password')}</label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              placeholder={t('auth.register.passwordPlaceholder')}
              value={form.password}
              onChange={handleChange}
              required
              minLength={6}
            />
          </div>

          <div className="form-field">
            <label htmlFor="confirm">{t('auth.register.confirmLabel')}</label>
            <input
              id="confirm"
              name="confirm"
              type="password"
              autoComplete="new-password"
              placeholder="••••••••"
              value={form.confirm}
              onChange={handleChange}
              required
            />
          </div>

          {error && <p className="form-error" role="alert">{error}</p>}

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? t('auth.register.submitting') : t('auth.register.submit')}
          </button>
        </form>

        <p className="auth-link">
          {t('auth.register.hasAccount')}{' '}
          <Link to="/login">{t('auth.register.loginLink')}</Link>
        </p>
      </div>
    </div>
  );
}
