import { useState, useEffect, useCallback } from 'react';
import { fetchFavorites, addFavorite, removeFavorite } from '../api/favorites.js';

function normalize(data) {
  const apps = data.map((f) => ({ ...f, id: f.app_id }));
  const ids = new Set(data.map((f) => f.app_id));
  return { apps, ids };
}

export function useFavorites() {
  const [favoriteApps, setFavoriteApps] = useState([]);
  const [favoriteIds, setFavoriteIds] = useState(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFavorites()
      .then((data) => {
        const { apps, ids } = normalize(data);
        setFavoriteApps(apps);
        setFavoriteIds(ids);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const toggle = useCallback(async (appId) => {
    if (favoriteIds.has(appId)) {
      // Optimistic: retirer immédiatement, annuler si erreur
      setFavoriteApps((prev) => prev.filter((f) => f.id !== appId));
      setFavoriteIds((prev) => { const n = new Set(prev); n.delete(appId); return n; });
      try {
        await removeFavorite(appId);
      } catch {
        // Revert on error
        const data = await fetchFavorites();
        const { apps, ids } = normalize(data);
        setFavoriteApps(apps);
        setFavoriteIds(ids);
      }
    } else {
      await addFavorite(appId);
      const data = await fetchFavorites();
      const { apps, ids } = normalize(data);
      setFavoriteApps(apps);
      setFavoriteIds(ids);
    }
  }, [favoriteIds]);

  return { favoriteIds, favoriteApps, toggle, loading };
}
