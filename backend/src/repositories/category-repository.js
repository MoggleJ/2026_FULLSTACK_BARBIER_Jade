import pool from '../db.js';

export async function findAll() {
  const { rows } = await pool.query(
    'SELECT id, name, mode FROM categories ORDER BY name'
  );
  return rows;
}

export async function create(name, mode) {
  const { rows } = await pool.query(
    'INSERT INTO categories (name, mode) VALUES ($1, $2) RETURNING *',
    [name, mode]
  );
  return rows[0];
}
