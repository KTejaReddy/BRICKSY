import { Router } from 'express';
import { getWorkers, getWorker, updateWorker } from '../controllers/workerController';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

router.get('/', authenticate, getWorkers);
router.get('/:id', authenticate, getWorker);
router.put('/:id', authenticate, authorize('owner', 'skilled_worker'), updateWorker);

export default router;
