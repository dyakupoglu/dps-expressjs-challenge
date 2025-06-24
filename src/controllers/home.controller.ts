import { Request, Response } from 'express';

export const healthCheck = (req: Request, res: Response): void => {
	res.json({
		status: 'healthy',
		message: 'API is running!',
		timestamp: new Date().toISOString(),
	});
};

export const apiDocs = (req: Request, res: Response): void => {
	const baseUrl = `${req.protocol}://${req.get('host')}`;

	res.json({
		title: 'DPS Express.js Challenge API',
		baseUrl,
		auth: 'Bearer Password123',
		version: `1.0.0`,
		endpoints: [
			'GET /health - Health check',
			'GET /api/projects - List projects',
			'POST /api/projects - Create project',
			'GET /api/projects/:id - Get project',
			'PUT /api/projects/:id - Update project',
			'DELETE /api/projects/:id - Delete project',
			'GET /api/reports - List reports',
			'POST /api/reports - Create report',
			'GET /api/reports/:id - Get report',
			'PUT /api/reports/:id - Update report',
			'DELETE /api/reports/:id - Delete report',
			'GET /api/reports/word-count - Word analysis',
		],
		example: `curl -H "Authorization: Bearer Password123" ${baseUrl}/api/projects`,
	});
};
