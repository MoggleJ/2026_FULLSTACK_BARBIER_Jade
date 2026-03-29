import { Router } from 'express';
import { requireAuth } from '../middlewares/auth-middleware.js';
import { requireRole } from '../middlewares/role-middleware.js';
import { listUsers, updateRole, updateUser, createUser, deleteUser } from '../controllers/admin-controller.js';

const router = Router();

router.use(requireAuth, requireRole('admin'));

router.get('/users',          listUsers);
router.post('/users',         createUser);
router.put('/users/:id',      updateUser);
router.put('/users/:id/role', updateRole);
router.delete('/users/:id',   deleteUser);

export default router;
