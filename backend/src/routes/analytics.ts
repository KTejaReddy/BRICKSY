import { Router } from 'express';
import { getAnalytics } from '../controllers/analyticsController';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

router.get('/', authenticate, authorize('owner'), getAnalytics);

export default router;
