import { Router } from 'express';
import { recommend } from '../controllers/aiController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.post('/recommend', authenticate, recommend);

export default router;
