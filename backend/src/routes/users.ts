import { Router } from 'express';
import { getAllUsers } from '../controllers/usersController';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

router.get('/', authenticate, authorize('owner'), getAllUsers);

export default router;
