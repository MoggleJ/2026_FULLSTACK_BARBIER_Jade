import { apiFetch } from './client.js';

export const fetchFavorites = () => apiFetch('/favorites');
export const addFavorite    = (appId) => apiFetch(`/favorites/${appId}`, { method: 'POST' });
export const removeFavorite = (appId) => apiFetch(`/favorites/${appId}`, { method: 'DELETE' });
