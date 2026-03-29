import { apiFetch } from './client.js';

export const fetchCategories = (mode = null) =>
  apiFetch(`/categories${mode ? `?mode=${encodeURIComponent(mode)}` : ''}`);
