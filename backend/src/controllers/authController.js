import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pool from '../db.js';

const BCRYPT_ROUNDS = parseInt(process.env.BCRYPT_ROUNDS) || 10;
const JWT_EXPIRES = '7d';

function issueToken(user) {
  return jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: JWT_EXPIRES }
  );
}

export async function register(req, res) {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username et password requis' });
  }
  if (username.length < 3 || username.length > 100) {
    return res.status(400).json({ message: 'Username : 3 à 100 caractères' });
  }
  if (password.length < 6) {
    return res.status(400).json({ message: 'Password : minimum 6 caractères' });
  }

  try {
    const existing = await pool.query(
      'SELECT id FROM users WHERE username = $1',
      [username]
    );
    if (existing.rows.length > 0) {
      return res.status(409).json({ message: 'Ce nom d\'utilisateur est déjà pris' });
    }

    const passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS);

    const { rows } = await pool.query(
      'INSERT INTO users (username, password_hash) VALUES ($1, $2) RETURNING id, username, role',
      [username, passwordHash]
    );
    const user = rows[0];

    // Création des settings par défaut
    await pool.query('INSERT INTO settings (user_id) VALUES ($1)', [user.id]);

    const token = issueToken(user);
    res.status(201).json({ token, user });
  } catch (err) {
    console.error('register error:', err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
}

export async function login(req, res) {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username et password requis' });
  }

  try {
    const { rows } = await pool.query(
      'SELECT id, username, password_hash, role FROM users WHERE username = $1',
      [username]
    );

    // Message générique volontaire : ne pas révéler si le username existe
    if (rows.length === 0) {
      return res.status(401).json({ message: 'Identifiants invalides' });
    }

    const user = rows[0];
    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      return res.status(401).json({ message: 'Identifiants invalides' });
    }

    const token = issueToken(user);
    res.json({ token, user: { id: user.id, username: user.username, role: user.role } });
  } catch (err) {
    console.error('login error:', err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
}

export function logout(_req, res) {
  // Côté serveur, rien à faire : le client supprime son token
  res.json({ message: 'Déconnecté' });
}

export async function getMe(req, res) {
  try {
    const { rows } = await pool.query(
      'SELECT id, username, role FROM users WHERE id = $1',
      [req.user.id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Utilisateur introuvable' });
    }
    res.json({ user: rows[0] });
  } catch (err) {
    console.error('getMe error:', err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
}
