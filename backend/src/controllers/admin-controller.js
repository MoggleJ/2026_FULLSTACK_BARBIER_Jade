import { handle } from '../utils/handle.js';
import * as adminService from '../services/admin-service.js';

export const listUsers = handle(async (req, res) => {
  const { search = '', page, limit, sort, order } = req.query;
  const result = await adminService.listUsers({ search, page, limit, sort, order });
  res.json(result);
});

export const updateRole = handle(async (req, res) => {
  const user = await adminService.updateRole(req.params.id, req.body.role);
  res.json({ user });
});

export const deleteUser = handle(async (req, res) => {
  await adminService.deleteUser(req.params.id, req.user.id);
  res.json({ message: 'Utilisateur supprimé' });
});
