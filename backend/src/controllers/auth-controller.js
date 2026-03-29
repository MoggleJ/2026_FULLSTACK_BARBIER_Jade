import { handle } from '../utils/handle.js';
import * as authService from '../services/auth-service.js';

export const register = handle(async (req, res) => {
  const { token, user } = await authService.register(req.body.username, req.body.password);
  res.status(201).json({ token, user });
});

export const login = handle(async (req, res) => {
  const result = await authService.login(req.body.username, req.body.password);
  res.json(result);
});

export function logout(_req, res) {
  res.json({ message: 'Déconnecté' });
}

export const getMe = handle(async (req, res) => {
  const user = await authService.getMe(req.user.id);
  res.json({ user });
});
