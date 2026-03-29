import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.js';

const TOKEN_KEY = 'mjqbe_token';

// Page intermédiaire vers laquelle le backend redirige après OAuth.
// Elle extrait le token de l'URL, le stocke et redirige vers l'accueil.
export default function OAuthCallback() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { refreshUser } = useAuth();

  useEffect(() => {
    const token = params.get('token');
    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
      refreshUser?.().finally(() => navigate('/', { replace: true }));
    } else {
      navigate('/login?error=oauth', { replace: true });
    }
  }, [params, navigate, refreshUser]);

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
      <div className="loading-spinner" />
    </div>
  );
}
