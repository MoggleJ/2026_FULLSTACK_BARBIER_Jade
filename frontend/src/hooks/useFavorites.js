import { useState, useEffect, useCallback } from 'react';
import { fetchFavorites, addFavorite, removeFavorite } from '../api/favorites.js';

export function useFavorites() {
  const [favoriteIds, setFavoriteIds] = useState(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFavorites()
      .then((data) => setFavoriteIds(new Set(data.map((f) => f.app_id))))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const toggle = useCallback(async (appId) => {
    if (favoriteIds.has(appId)) {
      await removeFavorite(appId);
      setFavoriteIds((prev) => { const n = new Set(prev); n.delete(appId); return n; });
    } else {
      await addFavorite(appId);
      setFavoriteIds((prev) => new Set([...prev, appId]));
    }
  }, [favoriteIds]);

  return { favoriteIds, toggle, loading };
}
