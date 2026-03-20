import { useAuth } from '../hooks/useAuth.js';

// Placeholder — remplacé par le vrai layout au Sprint 3
export default function Home() {
  const { user, logout } = useAuth();

  return (
    <div style={{ padding: '2rem', color: 'var(--color-text)' }}>
      <h1>Bienvenue, {user?.username} 👋</h1>
      <p style={{ color: 'var(--color-text-muted)', marginTop: '0.5rem' }}>
        Sprint 3 — Layout & Sidebar à venir
      </p>
      <button
        onClick={logout}
        style={{
          marginTop: '1.5rem',
          padding: '0.5rem 1.5rem',
          background: 'var(--color-surface-hover)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-lg)',
          color: 'var(--color-text)',
          cursor: 'pointer',
        }}
      >
        Se déconnecter
      </button>
    </div>
  );
}
