import { Router } from 'express';
import { createJob, getJobs, getAvailableJobs, acceptJob, updateJob } from '../controllers/jobController';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

router.post('/', authenticate, authorize('owner', 'contractor'), createJob);
router.get('/', authenticate, getJobs);
router.get('/available', authenticate, authorize('skilled_worker'), getAvailableJobs);
router.post('/:id/accept', authenticate, authorize('skilled_worker'), acceptJob);
router.put('/:id', authenticate, authorize('owner', 'contractor'), updateJob);

export default router;
