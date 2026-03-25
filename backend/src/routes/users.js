import { Router } from 'express';
import { requireAuth } from '../middlewares/auth-middleware.js';
import { uploadAvatar as upload } from '../middlewares/upload-middleware.js';
import {
  getProfile,
  updateProfile,
  changePassword,
  uploadAvatar,
  deleteAvatar,
} from '../controllers/users-controller.js';

const router = Router();

router.use(requireAuth);

router.get('/profile',  getProfile);
router.put('/profile',  updateProfile);
router.put('/password', changePassword);
router.post('/avatar',  upload, uploadAvatar);
router.delete('/avatar', deleteAvatar);

export default router;
