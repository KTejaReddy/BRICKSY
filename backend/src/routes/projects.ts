import { Router } from 'express';
import { getProjects } from '../controllers/projectController';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

router.get('/', authenticate, authorize('owner'), getProjects);

export default router;
