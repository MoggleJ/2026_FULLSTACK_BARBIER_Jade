import pool from '../db.js';

const DEFAULTS = { theme: 'dark', mode: 'TV', layout: 'grid', icon_size: { TV: 'medium', Desktop: 'medium' } };

export async function findByUserId(userId) {
  const { rows } = await pool.query(
    'SELECT theme, mode, layout, icon_size FROM settings WHERE user_id = $1',
    [userId]
  );
  return rows[0] ?? DEFAULTS;
}

export async function updateByUserId(userId, { theme, mode, layout, icon_size }) {
  const iconSizeParam = icon_size != null ? JSON.stringify(icon_size) : null;
  const { rows } = await pool.query(
    `UPDATE settings
     SET theme     = COALESCE($1, theme),
         mode      = COALESCE($2, mode),
         layout    = COALESCE($3, layout),
         icon_size = COALESCE($4::jsonb, icon_size)
     WHERE user_id = $5
     RETURNING theme, mode, layout, icon_size`,
    [theme ?? null, mode ?? null, layout ?? null, iconSizeParam, userId]
  );
  return rows[0] ?? null;
}
