import pool from '../db.js';

const ALLOWED_SORT   = ['username', 'role', 'created_at', 'favorites_count', 'last_login'];
const ALLOWED_ORDER  = ['asc', 'desc'];

export async function findUsers({ search = '', page = 1, limit = 20, sort = 'created_at', order = 'desc' } = {}) {
  const safeSort  = ALLOWED_SORT.includes(sort)   ? sort  : 'created_at';
  const safeOrder = ALLOWED_ORDER.includes(order) ? order : 'desc';
  const offset    = (page - 1) * limit;

  const { rows } = await pool.query(
    `SELECT
       u.id, u.username, u.email, u.role, u.avatar, u.created_at,
       COUNT(DISTINCT f.app_id)::int                                     AS favorites_count,
       MAX(l.created_at) FILTER (WHERE l.action = 'login')               AS last_login
     FROM users u
     LEFT JOIN favorites f ON f.user_id = u.id
     LEFT JOIN logs     l ON l.user_id  = u.id
     WHERE $1 = '' OR u.username ILIKE '%' || $1 || '%'
     GROUP BY u.id
     ORDER BY ${safeSort} ${safeOrder} NULLS LAST
     LIMIT $2 OFFSET $3`,
    [search, limit, offset]
  );
  return rows;
}

export async function countUsers(search = '') {
  const { rows } = await pool.query(
    `SELECT COUNT(*)::int AS total
     FROM users
     WHERE $1 = '' OR username ILIKE '%' || $1 || '%'`,
    [search]
  );
  return rows[0].total;
}

export async function updateUser(userId, { username, email, role, passwordHash }) {
  const setClauses = [];
  const values     = [];
  let   idx        = 1;
  if (username     !== undefined) { setClauses.push(`username      = $${idx++}`); values.push(username);     }
  if (email        !== undefined) { setClauses.push(`email         = $${idx++}`); values.push(email);        }
  if (role         !== undefined) { setClauses.push(`role          = $${idx++}`); values.push(role);         }
  if (passwordHash !== undefined) { setClauses.push(`password_hash = $${idx++}`); values.push(passwordHash); }
  if (setClauses.length === 0) return null;
  values.push(userId);
  const { rows } = await pool.query(
    `UPDATE users SET ${setClauses.join(', ')} WHERE id = $${idx}
     RETURNING id, username, email, role, avatar`,
    values
  );
  return rows[0] ?? null;
}

export async function createUser(username, passwordHash, role, email) {
  const { rows } = await pool.query(
    `INSERT INTO users (username, password_hash, role, email)
     VALUES ($1, $2, $3, $4)
     RETURNING id, username, email, role, avatar`,
    [username, passwordHash, role, email ?? null]
  );
  const user = rows[0];
  await pool.query('INSERT INTO settings (user_id) VALUES ($1)', [user.id]);
  return user;
}

export async function setRole(userId, role) {
  const { rows } = await pool.query(
    `UPDATE users SET role = $1 WHERE id = $2 RETURNING id, username, role`,
    [role, userId]
  );
  return rows[0] ?? null;
}

export async function remove(userId) {
  const { rowCount } = await pool.query(
    'DELETE FROM users WHERE id = $1',
    [userId]
  );
  return rowCount > 0;
}
