import pool from '../db.js';

export async function findByUsername(username) {
  const { rows } = await pool.query(
    'SELECT id, username, password_hash, role FROM users WHERE username = $1',
    [username]
  );
  return rows[0] ?? null;
}

export async function findById(id) {
  const { rows } = await pool.query(
    'SELECT id, username, role FROM users WHERE id = $1',
    [id]
  );
  return rows[0] ?? null;
}

export async function create(username, passwordHash) {
  const { rows } = await pool.query(
    'INSERT INTO users (username, password_hash) VALUES ($1, $2) RETURNING id, username, role',
    [username, passwordHash]
  );
  return rows[0];
}

export async function createDefaultSettings(userId) {
  await pool.query('INSERT INTO settings (user_id) VALUES ($1)', [userId]);
}
