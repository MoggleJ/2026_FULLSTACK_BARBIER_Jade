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
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  router.get('/google',
    passport.authenticate('google', { scope: ['profile'], session: false })
  );

  router.get('/google/callback',
    passport.authenticate('google', { session: false, failureRedirect: `${FRONTEND_URL}/login?error=oauth` }),
    (req, res) => {
      if (req.user.role === 'admin') {
        return res.redirect(`${FRONTEND_URL}/login?error=oauth_admin`);
      }
      const token = jwt.sign(
        { id: req.user.id, role: req.user.role },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );
      res.redirect(`${FRONTEND_URL}/oauth/callback?token=${token}`);
    }
  );

  // ── Reauth Google (vérification identité profil) ──────────────────────────
  router.get('/google/reauth', (req, res, next) => {
    const userToken = req.query.token;
    try { jwt.verify(userToken, process.env.JWT_SECRET); } catch {
      return res.redirect(`${FRONTEND_URL}/profile?error=reauth_failed`);
    }
    const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:5000';
    passport.authenticate('google', {
      scope: ['profile'],
      session: false,
      callbackURL: `${BACKEND_URL}/api/auth/google/reauth-callback`,
    })(req, res, next);
  });

  router.get('/google/reauth-callback',
    (req, res, next) => {
      const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:5000';
      passport.authenticate('google', {
        session: false,
        failureRedirect: `${FRONTEND_URL}/profile?error=reauth_failed`,
        callbackURL: `${BACKEND_URL}/api/auth/google/reauth-callback`,
      })(req, res, next);
    },
    (req, res) => {
      const reauthToken = jwt.sign(
        { type: 'reauth', id: req.user.id },
        process.env.JWT_SECRET,
        { expiresIn: '5m' }
      );
      res.redirect(`${FRONTEND_URL}/profile?reauth=${reauthToken}`);
    }
  );
}

// ── OAuth GitHub ────────────────────────────────────────────────────────────
if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET) {
  router.get('/github',
    passport.authenticate('github', { scope: ['user:email'], session: false })
  );

  router.get('/github/callback',
    passport.authenticate('github', { session: false, failureRedirect: `${FRONTEND_URL}/login?error=oauth` }),
    (req, res) => {
      if (req.user.role === 'admin') {
        return res.redirect(`${FRONTEND_URL}/login?error=oauth_admin`);
      }
      const token = jwt.sign(
        { id: req.user.id, role: req.user.role },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );
      res.redirect(`${FRONTEND_URL}/oauth/callback?token=${token}`);
    }
  );

  // ── Reauth GitHub (vérification identité profil) ──────────────────────────
  router.get('/github/reauth', (req, res, next) => {
    const userToken = req.query.token;
    try { jwt.verify(userToken, process.env.JWT_SECRET); } catch {
      return res.redirect(`${FRONTEND_URL}/profile?error=reauth_failed`);
    }
    const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:5000';
    passport.authenticate('github', {
      scope: ['user:email'],
      session: false,
      callbackURL: `${BACKEND_URL}/api/auth/github/reauth-callback`,
    })(req, res, next);
  });

  router.get('/github/reauth-callback',
    (req, res, next) => {
      const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:5000';
      passport.authenticate('github', {
        session: false,
        failureRedirect: `${FRONTEND_URL}/profile?error=reauth_failed`,
        callbackURL: `${BACKEND_URL}/api/auth/github/reauth-callback`,
      })(req, res, next);
    },
    (req, res) => {
      const reauthToken = jwt.sign(
        { type: 'reauth', id: req.user.id },
        process.env.JWT_SECRET,
        { expiresIn: '5m' }
      );
      res.redirect(`${FRONTEND_URL}/profile?reauth=${reauthToken}`);
    }
  );
}

export default router;
