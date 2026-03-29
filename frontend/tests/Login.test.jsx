import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

// ── Mocks ───────────────────────────────────────────────────────────────────

const mockLogin = vi.fn();
vi.mock('../src/hooks/useAuth.js', () => ({
  useAuth: () => ({ login: mockLogin }),
}));

vi.mock('../src/hooks/useLang.js', () => ({
  useLang: () => ({ t: (key) => key }),
}));

// ── Composant ───────────────────────────────────────────────────────────────

import Login from '../src/pages/Auth/Login.jsx';

function renderLogin(search = '') {
  return render(
    <MemoryRouter initialEntries={[`/login${search}`]}>
      <Login />
    </MemoryRouter>
  );
}

// ── Tests ───────────────────────────────────────────────────────────────────

describe('Login', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset env vars
    import.meta.env.VITE_OAUTH_GOOGLE_ENABLED = 'false';
    import.meta.env.VITE_OAUTH_GITHUB_ENABLED = 'false';
  });

  it('renders the login form', () => {
    renderLogin();
    expect(screen.getByLabelText('auth.username')).toBeInTheDocument();
    expect(screen.getByLabelText('auth.password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'auth.login.submit' })).toBeInTheDocument();
  });

  it('does not show OAuth section when providers are disabled', () => {
    renderLogin();
    expect(screen.queryByText('auth.continueWithGoogle')).toBeNull();
    expect(screen.queryByText('auth.continueWithGitHub')).toBeNull();
  });

  it('calls login with username and password on submit', async () => {
    mockLogin.mockResolvedValueOnce();
    renderLogin();

    fireEvent.change(screen.getByLabelText('auth.username'), { target: { value: 'alice' } });
    fireEvent.change(screen.getByLabelText('auth.password'), { target: { value: 'pass123' } });
    fireEvent.click(screen.getByRole('button', { name: 'auth.login.submit' }));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('alice', 'pass123');
    });
  });

  it('shows error message on login failure', async () => {
    mockLogin.mockRejectedValueOnce(new Error('Identifiants invalides'));
    renderLogin();

    fireEvent.change(screen.getByLabelText('auth.username'), { target: { value: 'alice' } });
    fireEvent.change(screen.getByLabelText('auth.password'), { target: { value: 'wrong' } });
    fireEvent.click(screen.getByRole('button', { name: 'auth.login.submit' }));

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent('Identifiants invalides');
    });
  });

  it('shows oauth_admin error from URL param', () => {
    renderLogin('?error=oauth_admin');
    expect(screen.getByRole('alert')).toHaveTextContent('auth.oauthAdminError');
  });
});
