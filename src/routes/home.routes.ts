import { Router } from 'express';
import { healthCheck, apiDocs } from '../controllers/home.controller';

const router = Router();

router.get('/', apiDocs);

router.get('/health', healthCheck);

export default router;
