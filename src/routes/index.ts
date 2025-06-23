import { Router } from 'express';
import projectRoutes from './project.routes';
import reportRoutes from './report.routes';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

router.use('/projects', authMiddleware, projectRoutes);
router.use('/reports', authMiddleware, reportRoutes);

export default router;
