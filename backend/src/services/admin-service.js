import * as adminRepo from '../repositories/admin-repository.js';

function fail(status, message) {
  return Object.assign(new Error(message), { status });
}

export async function listUsers({ search = '', page = 1, limit = 20, sort = 'created_at', order = 'desc' } = {}) {
  const safePage  = Math.max(1, parseInt(page)  || 1);
  const safeLimit = Math.min(100, Math.max(1, parseInt(limit) || 20));

  const [users, total] = await Promise.all([
    adminRepo.findUsers({ search, page: safePage, limit: safeLimit, sort, order }),
    adminRepo.countUsers(search),
  ]);

  return { users, total, page: safePage, limit: safeLimit };
}

export async function updateRole(userId, role) {
  if (!['user', 'admin'].includes(role)) throw fail(400, 'Rôle invalide');
  const user = await adminRepo.setRole(userId, role);
  if (!user) throw fail(404, 'Utilisateur introuvable');
  return user;
}

export async function deleteUser(userId, requesterId) {
  if (userId === requesterId) throw fail(400, 'Impossible de supprimer son propre compte');
  const deleted = await adminRepo.remove(userId);
  if (!deleted) throw fail(404, 'Utilisateur introuvable');
}
