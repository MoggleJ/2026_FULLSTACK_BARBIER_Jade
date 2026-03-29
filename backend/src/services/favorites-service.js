import * as favRepo from '../repositories/favorites-repository.js';
import pool from '../db.js';

function fail(status, message) {
  return Object.assign(new Error(message), { status });
}

export async function getFavorites(userId) {
  return favRepo.findByUser(userId);
}

export async function addFavorite(userId, appId) {
  const { rowCount } = await pool.query('SELECT 1 FROM apps WHERE id = $1', [appId]);
  if (!rowCount) throw fail(404, 'Application introuvable');
  return favRepo.add(userId, appId);
}

export async function removeFavorite(userId, appId) {
  const removed = await favRepo.remove(userId, appId);
  if (!removed) throw fail(404, 'Favori introuvable');
}
