import { apiFetch } from './client.js';

export const fetchApps = (mode = null) =>
  apiFetch(`/apps${mode ? `?mode=${encodeURIComponent(mode)}` : ''}`);

export const fetchAppById = (id) =>
  apiFetch(`/apps/${id}`);
