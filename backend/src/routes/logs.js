import { Router } from 'express';
import { getAll } from '../controllers/logs-controller.js';
import { requireAuth } from '../middlewares/auth-middleware.js';
import { requireRole } from '../middlewares/role-middleware.js';

const router = Router();

router.use(requireAuth);
router.get('/', requireRole('admin'), getAll);

export default router;
