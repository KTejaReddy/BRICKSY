import { Router } from 'express';
import { uploadProgress, getProgress, approveProgress } from '../controllers/progressController';
import { authenticate, authorize } from '../middleware/auth';
import { upload } from '../middleware/upload';

const router = Router();

router.post(
  '/upload',
  authenticate,
  authorize('skilled_worker'),
  upload.fields([
    { name: 'photos', maxCount: 10 },
    { name: 'videos', maxCount: 5 },
  ]),
  uploadProgress,
);
router.get('/:jobId', authenticate, getProgress);
router.put('/:id/approve', authenticate, authorize('owner', 'contractor'), approveProgress);

export default router;
