import { Router } from 'express';
import { uploadProgress, getProgress, approveProgress } from '../controllers/progressController';
import { authenticate, authorize } from '../middleware/auth';
import { uploadPhotos, uploadVideos } from '../middleware/upload';

const router = Router();

router.post(
  '/upload',
  authenticate,
  authorize('skilled_worker'),
  uploadPhotos.array('photos', 10),
  uploadVideos.array('videos', 5),
  uploadProgress
);
router.get('/:jobId', authenticate, getProgress);
router.put('/:id/approve', authenticate, authorize('owner', 'contractor'), approveProgress);

export default router;
