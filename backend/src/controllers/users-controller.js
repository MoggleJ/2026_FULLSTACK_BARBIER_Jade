import jwt from 'jsonwebtoken';
import * as userService from '../services/user-service.js';

export async function getProfile(req, res) {
  try {
    const profile = await userService.getProfile(req.user.id);
    res.json({ user: profile });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

export async function updateProfile(req, res) {
  const { username, email, currentPassword, reauthToken } = req.body;

  // Validate reauth token for OAuth users
  let reauthVerified = false;
  if (reauthToken) {
    try {
      const payload = jwt.verify(reauthToken, process.env.JWT_SECRET);
      reauthVerified = payload.type === 'reauth' && payload.id === req.user.id;
    } catch {
      return res.status(401).json({ message: 'Invalid reauth token' });
    }
  }

  try {
    const user = await userService.updateProfile(req.user.id, {
      username, email, currentPassword, reauthVerified,
    });
    res.json({ user });
  } catch (err) {
    const statusMap = {
      WRONG_PASSWORD:   401,
      USERNAME_TAKEN:   409,
      EMAIL_TAKEN:      409,
      IDENTITY_REQUIRED: 403,
    };
    res.status(statusMap[err.code] || 400).json({ message: err.message, code: err.code });
  }
}

export async function changePassword(req, res) {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) {
    return res.status(400).json({ message: 'Missing fields' });
  }
  try {
    await userService.changePassword(req.user.id, currentPassword, newPassword);
    res.json({ message: 'Password changed' });
  } catch (err) {
    const statusMap = { WRONG_PASSWORD: 401, NO_PASSWORD: 400 };
    res.status(statusMap[err.code] || 400).json({ message: err.message, code: err.code });
  }
}

export async function uploadAvatar(req, res) {
  if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
  try {
    const avatarPath = `/uploads/${req.file.filename}`;
    const result     = await userService.saveAvatar(req.user.id, avatarPath);
    res.json({ avatar: result.avatar });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

export async function deleteAvatar(req, res) {
  try {
    await userService.removeAvatar(req.user.id);
    res.json({ message: 'Avatar removed' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}
