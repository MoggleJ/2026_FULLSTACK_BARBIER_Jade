import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import pool from './db.js';
import apiRouter from './routes/routes.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
}));
app.use(express.json());

// Health check — avant le router pour éviter auth
app.get('/api/health', async (_req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ status: 'ok', db: 'connected', message: 'MJQbe API is running' });
  } catch (err) {
    res.status(500).json({ status: 'error', db: 'disconnected', message: err.message });
  }
});

app.use('/api', apiRouter);

app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
