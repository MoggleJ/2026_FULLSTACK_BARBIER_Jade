import { apiFetch } from './client.js';

export const getMeRequest = () =>
  apiFetch('/auth/me');

export const loginRequest = (username, password) =>
  apiFetch('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  });

export const registerRequest = (username, password) =>
  apiFetch('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  });

export const logoutRequest = () =>
  apiFetch('/auth/logout', { method: 'POST' });
