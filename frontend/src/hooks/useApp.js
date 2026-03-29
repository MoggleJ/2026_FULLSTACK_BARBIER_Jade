import { useState, useEffect } from 'react';
import { fetchAppById } from '../api/apps.js';

export function useApp(id) {
  const [app, setApp] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError(false);
    fetchAppById(id)
      .then((data) => setApp(data.app))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [id]);

  return { app, loading, error };
}
