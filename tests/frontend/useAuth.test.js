import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { AuthContext } from '../../frontend/src/context/AuthContext.jsx';

// ── Mocks ───────────────────────────────────────────────────────────────────

vi.mock('../../frontend/src/api/auth.js', () => ({
  loginRequest:    vi.fn(),
  registerRequest: vi.fn(),
  logoutRequest:   vi.fn(),
  getMeRequest:    vi.fn(),
}));

import * as authApi from '../../frontend/src/api/auth.js';
import { useAuth } from '../../frontend/src/hooks/useAuth.js';

// ── Wrapper ─────────────────────────────────────────────────────────────────

function makeWrapper(contextValue) {
  return ({ children }) => (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
}

// ── Tests ───────────────────────────────────────────────────────────────────

describe('useAuth', () => {
  it('returns user from context', () => {
    const mockUser = { id: 'uuid1', username: 'alice', role: 'user' };
    const { result } = renderHook(() => useAuth(), {
      wrapper: makeWrapper({ user: mockUser, login: vi.fn(), logout: vi.fn() }),
    });
    expect(result.current.user).toEqual(mockUser);
  });

  it('returns null user when not authenticated', () => {
    const { result } = renderHook(() => useAuth(), {
      wrapper: makeWrapper({ user: null, login: vi.fn(), logout: vi.fn() }),
    });
    expect(result.current.user).toBeNull();
  });

  it('exposes login and logout functions', () => {
    const login  = vi.fn();
    const logout = vi.fn();
    const { result } = renderHook(() => useAuth(), {
      wrapper: makeWrapper({ user: null, login, logout }),
    });
    expect(typeof result.current.login).toBe('function');
    expect(typeof result.current.logout).toBe('function');
  });

  it('calls login function when invoked', async () => {
    const login = vi.fn().mockResolvedValueOnce();
    const { result } = renderHook(() => useAuth(), {
      wrapper: makeWrapper({ user: null, login, logout: vi.fn() }),
    });
    await act(async () => {
      await result.current.login('alice', 'pass123');
    });
    expect(login).toHaveBeenCalledWith('alice', 'pass123');
  });
});
