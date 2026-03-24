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

export async function update(id, name, mode) {
  const { rows } = await pool.query(
    'UPDATE categories SET name = $1, mode = $2 WHERE id = $3 RETURNING *',
    [name, mode, id]
  );
  return rows[0] ?? null;
}

export async function remove(id) {
  const { rowCount } = await pool.query(
    'DELETE FROM categories WHERE id = $1',
    [id]
  );
  return rowCount > 0;
}
