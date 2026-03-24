import { Router } from 'express';
import jwt from 'jsonwebtoken';
import { register, login, logout, getMe } from '../controllers/auth-controller.js';
import { requireAuth } from '../middlewares/auth-middleware.js';
import passport from '../config/passport.js';

const router = Router();
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.get('/me', requireAuth, getMe);

// ── OAuth Google ────────────────────────────────────────────────────────────
router.get('/google',
  passport.authenticate('google', { scope: ['profile'], session: false })
);

router.get('/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: `${FRONTEND_URL}/login?error=oauth` }),
  (req, res) => {
    const token = jwt.sign(
      { id: req.user.id, role: req.user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    res.redirect(`${FRONTEND_URL}/oauth/callback?token=${token}`);
  }
);

// ── OAuth GitHub ────────────────────────────────────────────────────────────
router.get('/github',
  passport.authenticate('github', { scope: ['user:email'], session: false })
);

router.get('/github/callback',
  passport.authenticate('github', { session: false, failureRedirect: `${FRONTEND_URL}/login?error=oauth` }),
  (req, res) => {
    const token = jwt.sign(
      { id: req.user.id, role: req.user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    res.redirect(`${FRONTEND_URL}/oauth/callback?token=${token}`);
  }
);

export default router;
