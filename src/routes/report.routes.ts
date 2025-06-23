import { Router } from 'express';
import {
	getAllReports,
	getReportById,
	getReportsByProjectId,
	createReport,
	updateReport,
	deleteReport,
	getReportsWithWordCount,
} from '../controllers/report.controller';

const router = Router();

router.get('/', getAllReports);

router.get('/word-count', getReportsWithWordCount);

router.get('/project/:projectId', getReportsByProjectId);

router.get('/:id', getReportById);

router.post('/', createReport);

router.put('/:id', updateReport);

router.delete('/:id', deleteReport);

export default router;
