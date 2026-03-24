import { Router } from 'express';
import { getAll, add, remove } from '../controllers/favorites-controller.js';
import { requireAuth } from '../middlewares/auth-middleware.js';

const router = Router();

router.use(requireAuth);

router.get('/', getAll);
router.post('/:appId', add);
router.delete('/:appId', remove);

export default router;
