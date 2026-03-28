import { apiFetch } from './client.js';

export function fetchAdminUsers({ search = '', page = 1, limit = 20, sort = 'created_at', order = 'desc' } = {}) {
  const params = new URLSearchParams({ search, page, limit, sort, order });
  return apiFetch(`/admin/users?${params}`);
}

export function updateUserRole(id, role) {
  return apiFetch(`/admin/users/${id}/role`, {
    method: 'PUT',
    body: JSON.stringify({ role }),
  });
}

export function updateAdminUser(id, fields) {
  return apiFetch(`/admin/users/${id}`, {
    method: 'PUT',
    body: JSON.stringify(fields),
  });
}

export function createAdminUser(fields) {
  return apiFetch('/admin/users', {
    method: 'POST',
    body: JSON.stringify(fields),
  });
}

export function deleteAdminUser(id) {
  return apiFetch(`/admin/users/${id}`, { method: 'DELETE' });
}
