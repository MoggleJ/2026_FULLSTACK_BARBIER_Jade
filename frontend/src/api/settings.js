import { apiFetch } from './client.js';

export const fetchSettings = () =>
  apiFetch('/settings');

export const putSettings = (patch) =>
  apiFetch('/settings', {
    method: 'PUT',
    body: JSON.stringify(patch),
  });
