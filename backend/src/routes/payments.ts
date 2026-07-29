import { Router } from 'express';
import { createPayment } from '../controllers/paymentController';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

router.post('/', authenticate, authorize('owner', 'contractor'), createPayment);

export default router;
