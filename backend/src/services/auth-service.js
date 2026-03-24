import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import * as userRepo from '../repositories/user-repository.js';

const BCRYPT_ROUNDS = parseInt(process.env.BCRYPT_ROUNDS) || 10;
const JWT_EXPIRES = '7d';

function issueToken(user) {
  return jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: JWT_EXPIRES }
  );
}

function fail(status, message) {
  return Object.assign(new Error(message), { status });
}

export async function register(username, password) {
  if (!username || !password)        throw fail(400, 'Username et password requis');
  if (username.length < 3 || username.length > 100)
                                     throw fail(400, 'Username : 3 à 100 caractères');
  if (password.length < 6)           throw fail(400, 'Password : minimum 6 caractères');

  const existing = await userRepo.findByUsername(username);
  if (existing)                      throw fail(409, "Ce nom d'utilisateur est déjà pris");

  const passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS);
  const user = await userRepo.create(username, passwordHash);
  await userRepo.createDefaultSettings(user.id);

  return { token: issueToken(user), user };
}

export async function login(username, password) {
  if (!username || !password) throw fail(400, 'Username et password requis');

  const user  = await userRepo.findByUsername(username);
  const valid = user && await bcrypt.compare(password, user.password_hash);
  if (!valid) throw fail(401, 'Identifiants invalides');

  return {
    token: issueToken(user),
    user: { id: user.id, username: user.username, role: user.role },
  };
}

export async function getMe(userId) {
  const user = await userRepo.findById(userId);
  if (!user) throw fail(404, 'Utilisateur introuvable');
  return user;
}
