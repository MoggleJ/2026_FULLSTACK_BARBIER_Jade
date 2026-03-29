import { Router } from 'express';
import { getAll, create, update, remove } from '../controllers/categories-controller.js';
import { requireAuth } from '../middlewares/auth-middleware.js';
import { requireRole } from '../middlewares/role-middleware.js';

const router = Router();

router.use(requireAuth);

router.get('/', getAll);
router.post('/', requireRole('admin'), create);
router.put('/:id', requireRole('admin'), update);
router.delete('/:id', requireRole('admin'), remove);

export default router;
