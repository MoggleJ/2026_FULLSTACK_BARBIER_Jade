import pool from '../db.js';

const BASE_QUERY = `
  SELECT a.id, a.name, a.icon, a.url, a.mode, a.is_external,
         a.category_id, c.name AS category_name
  FROM apps a
  LEFT JOIN categories c ON a.category_id = c.id
`;

export async function findAll(mode = null) {
  const params = mode ? [mode] : [];
  const where  = mode ? 'WHERE a.mode = $1' : '';
  const { rows } = await pool.query(
    `${BASE_QUERY} ${where} ORDER BY c.name, a.name`,
    params
  );
  return rows;
}

export async function findById(id) {
  const { rows } = await pool.query(
    `${BASE_QUERY} WHERE a.id = $1`,
    [id]
  );
  return rows[0] ?? null;
}

export async function create({ name, icon, url, category_id, mode, is_external }) {
  const { rows } = await pool.query(
    `INSERT INTO apps (name, icon, url, category_id, mode, is_external)
     VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
    [name, icon ?? null, url, category_id ?? null, mode, is_external ?? false]
  );
  return rows[0];
}

export async function update(id, { name, icon, url, category_id, mode, is_external }) {
  const { rows } = await pool.query(
    `UPDATE apps SET
       name        = COALESCE($1, name),
       icon        = COALESCE($2, icon),
       url         = COALESCE($3, url),
       category_id = COALESCE($4, category_id),
       mode        = COALESCE($5, mode),
       is_external = COALESCE($6, is_external)
     WHERE id = $7
     RETURNING *`,
    [name, icon, url, category_id, mode, is_external, id]
  );
  return rows[0] ?? null;
}

export async function remove(id) {
  const { rowCount } = await pool.query(
    'DELETE FROM apps WHERE id = $1',
    [id]
  );
  return rowCount > 0;
}
