import { apiFetch } from './client.js';

const API    = import.meta.env.VITE_API_URL;
const TOKEN_KEY = 'mjqbe_token';

export function getProfile() {
  return apiFetch('/users/profile');
}

export function updateProfile(data) {
  return apiFetch('/users/profile', {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export function updatePassword(data) {
  return apiFetch('/users/password', {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function uploadAvatar(file) {
  const token = localStorage.getItem(TOKEN_KEY);
  const formData = new FormData();
  formData.append('avatar', file);
  const res = await fetch(`${API}/users/avatar`, {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: formData,
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw Object.assign(new Error(data.message || 'Upload failed'), { status: res.status });
  }
  return res.json();
}

export function deleteAvatar() {
  return apiFetch('/users/avatar', { method: 'DELETE' });
}
