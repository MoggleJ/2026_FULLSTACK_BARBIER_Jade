const API = import.meta.env.VITE_API_URL;
const TOKEN_KEY = 'mjqbe_token';

export async function apiFetch(path, options = {}) {
  const token = localStorage.getItem(TOKEN_KEY);

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const res = await fetch(`${API}${path}`, { ...options, headers });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw Object.assign(new Error(data.message || 'Erreur réseau'), { status: res.status });
  }

  return res.json();
}
