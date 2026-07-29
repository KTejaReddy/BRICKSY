import { Router } from 'express';
import { createReview } from '../controllers/reviewController';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

router.post('/', authenticate, authorize('owner', 'contractor'), createReview);

export default router;
