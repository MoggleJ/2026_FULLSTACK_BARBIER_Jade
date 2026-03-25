import bcrypt from 'bcrypt';
import * as userRepo from '../repositories/user-repository.js';

export async function getProfile(userId) {
  return userRepo.findProfileById(userId);
}

export async function updateProfile(userId, { username, email, currentPassword, reauthVerified }) {
  const profile = await userRepo.findProfileById(userId);

  // Identity verification
  if (profile.has_password) {
    if (!currentPassword) {
      throw Object.assign(new Error('Current password required'), { code: 'IDENTITY_REQUIRED' });
    }
    const hash  = await userRepo.getPasswordHash(userId);
    const valid = await bcrypt.compare(currentPassword, hash);
    if (!valid) {
      throw Object.assign(new Error('Wrong password'), { code: 'WRONG_PASSWORD' });
    }
  } else {
    if (!reauthVerified) {
      throw Object.assign(new Error('Identity verification required'), { code: 'IDENTITY_REQUIRED' });
    }
  }

  // Uniqueness checks
  if (username && username !== profile.username) {
    const existing = await userRepo.findByUsername(username);
    if (existing) throw Object.assign(new Error('Username taken'), { code: 'USERNAME_TAKEN' });
  }
  if (email !== undefined && email !== profile.email) {
    if (email) {
      const existing = await userRepo.findByEmail(email);
      if (existing) throw Object.assign(new Error('Email taken'), { code: 'EMAIL_TAKEN' });
    }
  }

  const fields = {};
  if (username !== undefined) fields.username = username;
  if (email    !== undefined) fields.email    = email;

  return userRepo.updateProfileFields(userId, fields);
}

export async function changePassword(userId, currentPassword, newPassword) {
  const hash = await userRepo.getPasswordHash(userId);
  if (!hash) throw Object.assign(new Error('No password set'), { code: 'NO_PASSWORD' });
  const valid = await bcrypt.compare(currentPassword, hash);
  if (!valid) throw Object.assign(new Error('Wrong password'), { code: 'WRONG_PASSWORD' });
  const newHash = await bcrypt.hash(newPassword, parseInt(process.env.BCRYPT_ROUNDS) || 10);
  await userRepo.updatePasswordHash(userId, newHash);
}

export async function saveAvatar(userId, avatarPath) {
  return userRepo.updateAvatar(userId, avatarPath);
}

export async function removeAvatar(userId) {
  return userRepo.updateAvatar(userId, null);
}
