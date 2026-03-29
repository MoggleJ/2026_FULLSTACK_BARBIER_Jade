import { Router } from 'express';
import { getAll, getById, create, update, destroy } from '../controllers/apps-controller.js';
import { requireAuth } from '../middlewares/auth-middleware.js';
import { requireRole } from '../middlewares/role-middleware.js';

const router = Router();

// Toutes les routes apps nécessitent une authentification
router.use(requireAuth);

router.get('/', getAll);
router.get('/:id', getById);
router.post('/', requireRole('admin'), create);
router.put('/:id', requireRole('admin'), update);
router.delete('/:id', requireRole('admin'), destroy);

export default router;
