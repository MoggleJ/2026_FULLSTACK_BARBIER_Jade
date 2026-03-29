import pool from '../db.js';

export async function insert(userId, action, metadata = null) {
  await pool.query(
    'INSERT INTO logs (user_id, action, metadata) VALUES ($1, $2, $3)',
    [userId ?? null, action, metadata ? JSON.stringify(metadata) : null]
  );
}

export async function findAll({ limit = 100, offset = 0 } = {}) {
  const { rows } = await pool.query(
    `SELECT l.id, l.action, l.metadata, l.created_at,
            u.username
     FROM logs l
     LEFT JOIN users u ON u.id = l.user_id
     ORDER BY l.created_at DESC
     LIMIT $1 OFFSET $2`,
    [limit, offset]
  );
  return rows;
}
