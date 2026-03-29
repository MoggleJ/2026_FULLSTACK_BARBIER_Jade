import pool from '../db.js';

export async function findByUser(userId) {
  const { rows } = await pool.query(
    `SELECT f.app_id, a.name, a.icon, a.url, a.mode, a.is_external, a.category_id
     FROM favorites f
     JOIN apps a ON a.id = f.app_id
     WHERE f.user_id = $1
     ORDER BY f.id`,
    [userId]
  );
  return rows;
}

export async function add(userId, appId) {
  const { rows } = await pool.query(
    'INSERT INTO favorites (user_id, app_id) VALUES ($1, $2) ON CONFLICT DO NOTHING RETURNING *',
    [userId, appId]
  );
  return rows[0] ?? null;
}

export async function remove(userId, appId) {
  const { rowCount } = await pool.query(
    'DELETE FROM favorites WHERE user_id = $1 AND app_id = $2',
    [userId, appId]
  );
  return rowCount > 0;
}

export async function isFavorite(userId, appId) {
  const { rowCount } = await pool.query(
    'SELECT 1 FROM favorites WHERE user_id = $1 AND app_id = $2',
    [userId, appId]
  );
  return rowCount > 0;
}
