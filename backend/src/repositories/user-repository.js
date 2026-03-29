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
    'SELECT id, username, role, email, avatar FROM users WHERE id = $1',
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

export async function findByOAuth(provider, providerId) {
  const { rows } = await pool.query(
    `SELECT u.id, u.username, u.role
     FROM oauth_accounts oa
     JOIN users u ON u.id = oa.user_id
     WHERE oa.provider = $1 AND oa.provider_id = $2`,
    [provider, providerId]
  );
  return rows[0] ?? null;
}

export async function findProfileById(id) {
  const { rows } = await pool.query(
    `SELECT u.id, u.username, u.email, u.avatar, u.role,
            (u.password_hash <> '') AS has_password,
            oa.provider             AS oauth_provider
     FROM users u
     LEFT JOIN oauth_accounts oa ON oa.user_id = u.id
     WHERE u.id = $1`,
    [id]
  );
  return rows[0] ?? null;
}

export async function findByEmail(email) {
  const { rows } = await pool.query(
    'SELECT id FROM users WHERE email = $1',
    [email]
  );
  return rows[0] ?? null;
}

export async function getPasswordHash(id) {
  const { rows } = await pool.query(
    'SELECT password_hash FROM users WHERE id = $1',
    [id]
  );
  return rows[0]?.password_hash ?? null;
}

export async function updateProfileFields(id, fields) {
  const setClauses = [];
  const values     = [];
  let   idx        = 1;
  if (fields.username !== undefined) { setClauses.push(`username = $${idx++}`); values.push(fields.username); }
  if (fields.email    !== undefined) { setClauses.push(`email    = $${idx++}`); values.push(fields.email);    }
  values.push(id);
  const { rows } = await pool.query(
    `UPDATE users SET ${setClauses.join(', ')} WHERE id = $${idx}
     RETURNING id, username, email, avatar, role`,
    values
  );
  return rows[0];
}

export async function updatePasswordHash(id, hash) {
  await pool.query('UPDATE users SET password_hash = $1 WHERE id = $2', [hash, id]);
}

export async function updateAvatar(id, avatarPath) {
  const { rows } = await pool.query(
    'UPDATE users SET avatar = $1 WHERE id = $2 RETURNING avatar',
    [avatarPath, id]
  );
  return rows[0];
}

export async function createOAuthUser(username, provider, providerId) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const { rows } = await client.query(
      `INSERT INTO users (username, password_hash) VALUES ($1, '') RETURNING id, username, role`,
      [username]
    );
    const user = rows[0];
    await client.query(
      'INSERT INTO settings (user_id) VALUES ($1)',
      [user.id]
    );
    await client.query(
      'INSERT INTO oauth_accounts (user_id, provider, provider_id) VALUES ($1, $2, $3)',
      [user.id, provider, providerId]
    );
    await client.query('COMMIT');
    return user;
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}
