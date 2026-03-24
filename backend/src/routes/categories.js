import { Router } from 'express';
import { getAll, create } from '../controllers/categories-controller.js';
import { requireAuth } from '../middlewares/auth-middleware.js';
import { requireRole } from '../middlewares/role-middleware.js';

const router = Router();

router.use(requireAuth);

router.get('/', getAll);
router.post('/', requireRole('admin'), create);

export default router;
