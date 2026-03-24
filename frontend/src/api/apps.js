import { apiFetch } from './client.js';

export const fetchApps = (mode = null) =>
  apiFetch(`/apps${mode ? `?mode=${encodeURIComponent(mode)}` : ''}`);

export const fetchAppById = (id) =>
  apiFetch(`/apps/${id}`);

export const createApp = (data) =>
  apiFetch('/apps', { method: 'POST', body: JSON.stringify(data) });

export const updateApp = (id, data) =>
  apiFetch(`/apps/${id}`, { method: 'PUT', body: JSON.stringify(data) });

export const deleteApp = (id) =>
  apiFetch(`/apps/${id}`, { method: 'DELETE' });
