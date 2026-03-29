import { Router } from 'express';
import { getSettings, updateSettings } from '../controllers/settings-controller.js';
import { requireAuth } from '../middlewares/auth-middleware.js';

const router = Router();

router.use(requireAuth);

router.get('/', getSettings);
router.put('/', updateSettings);

export default router;
