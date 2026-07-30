import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import db from './database/knexfile';
import { runMigrations } from './database/migrations';
import { seedData } from './database/seed';
import authRoutes from './routes/auth';
import workerRoutes from './routes/workers';
import jobRoutes from './routes/jobs';
import aiRoutes from './routes/ai';
import paymentRoutes from './routes/payments';
import progressRoutes from './routes/progress';
import reviewRoutes from './routes/reviews';
import analyticsRoutes from './routes/analytics';
import projectRoutes from './routes/projects';
import insuranceRoutes from './routes/insurance';
import dbRoutes from './routes/db';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '50mb' }));

app.use('/api/auth', authRoutes);
app.use('/api/workers', workerRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/review', reviewRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/insurance', insuranceRoutes);
app.use('/api/db', dbRoutes);

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', service: 'bricksy-backend' });
});

async function init() {
  try {
    await runMigrations(db);
    await seedData(db);
  } catch (err) {
    console.error('Database init failed:', err);
  }
}

init();

if (process.env.VERCEL !== '1') {
  app.listen(PORT, () => {
    console.log(`BRICKSY backend running on port ${PORT}`);
  });
}

export default app;
