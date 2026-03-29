import { useState, useEffect } from 'react';
import { fetchApps } from '../api/apps.js';

export function useApps(mode = null) {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetchApps(mode)
      .then((data) => setApps(data.apps))
      .catch((err) => setError(err))
      .finally(() => setLoading(false));
  }, [mode]);

  return { apps, loading, error };
}
