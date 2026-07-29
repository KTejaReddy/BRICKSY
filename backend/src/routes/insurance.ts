import { Router } from 'express';
import { getInsurance } from '../controllers/insuranceController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.get('/', authenticate, getInsurance);

export default router;
