import { Router } from 'express';
import { getTable } from '../controllers/dbController';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

router.get('/:table', authenticate, authorize('owner'), getTable);

export default router;
