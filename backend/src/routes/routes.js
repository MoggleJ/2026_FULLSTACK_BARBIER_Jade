import { Router } from 'express';
import authRouter from './auth.js';
import appsRouter from './apps.js';
import categoriesRouter from './categories.js';
import settingsRouter from './settings.js';
import favoritesRouter from './favorites.js';
import logsRouter from './logs.js';
import usersRouter from './users.js';

const router = Router();

router.use('/auth',       authRouter);
router.use('/apps',       appsRouter);
router.use('/categories', categoriesRouter);
router.use('/settings',   settingsRouter);
router.use('/favorites',  favoritesRouter);
router.use('/logs',       logsRouter);
router.use('/users',      usersRouter);

export default router;
