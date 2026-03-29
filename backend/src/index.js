import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import passport from './config/passport.js';
import pool from './db.js';
import apiRouter from './routes/routes.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
}));
app.use(express.json());
app.use(passport.initialize());

// Health check — avant le router pour éviter auth
app.get('/api/health', async (_req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ status: 'ok', db: 'connected', message: 'MJQbe API is running' });
  } catch (err) {
    res.status(500).json({ status: 'error', db: 'disconnected', message: err.message });
  }
});

// Static uploads (avatars)
app.use('/uploads/avatars', express.static('/app/uploads/avatars'));

// Mini-apps standalone
app.use('/apps', express.static('/apps-static'));

app.use('/api', apiRouter);

app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
