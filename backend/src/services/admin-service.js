import bcrypt from 'bcrypt';
import * as adminRepo from '../repositories/admin-repository.js';
import * as userRepo  from '../repositories/user-repository.js';

const BCRYPT_ROUNDS = parseInt(process.env.BCRYPT_ROUNDS) || 10;

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

export async function updateUser(userId, { username, email, role, password }) {
  if (role && !['user', 'admin'].includes(role)) throw fail(400, 'Rôle invalide');

  if (username) {
    const existing = await userRepo.findByUsername(username);
    if (existing && existing.id !== userId) throw Object.assign(new Error('USERNAME_TAKEN'), { status: 409, code: 'USERNAME_TAKEN' });
  }
  if (email) {
    const existing = await userRepo.findByEmail(email);
    if (existing && existing.id !== userId) throw Object.assign(new Error('EMAIL_TAKEN'), { status: 409, code: 'EMAIL_TAKEN' });
  }

  const fields = {
    ...(username !== undefined ? { username } : {}),
    ...(email    !== undefined ? { email: email || null } : {}),
    ...(role     !== undefined ? { role } : {}),
  };
  if (password) fields.passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS);

  const user = await adminRepo.updateUser(userId, fields);
  if (!user) throw fail(404, 'Utilisateur introuvable');
  return user;
}

export async function createUser(username, password, role = 'user', email) {
  if (!username || !password)   throw fail(400, 'Username et password requis');
  if (username.length < 3)      throw fail(400, 'Username : minimum 3 caractères');
  if (password.length < 6)      throw fail(400, 'Password : minimum 6 caractères');
  if (!['user', 'admin'].includes(role)) throw fail(400, 'Rôle invalide');

  const existing = await userRepo.findByUsername(username);
  if (existing) throw Object.assign(new Error('USERNAME_TAKEN'), { status: 409, code: 'USERNAME_TAKEN' });

  const passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS);
  return adminRepo.createUser(username, passwordHash, role, email || null);
}

export async function deleteUser(userId, requesterId) {
  if (userId === requesterId) throw fail(400, 'Impossible de supprimer son propre compte');
  const deleted = await adminRepo.remove(userId);
  if (!deleted) throw fail(404, 'Utilisateur introuvable');
}
