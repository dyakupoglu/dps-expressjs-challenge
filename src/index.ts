import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import { errorHandler } from './middleware/error.middleware';
import { config } from './config/env.config';

const app: Express = express();
const PORT = config.port;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Root Endpoint
app.get('/', (req: Request, res: Response) => {
	res.status(200).json({
		success: true,
		message: 'Welcome to the DPS Challange API',
		version: '1.0.0',
		timestamp: new Date().toISOString(),
		endpoints: {
			health: 'api/health',
			projects: 'api/projects',
			reports: 'api/reports',
			reportWithWordCount: 'api/reports/word-count',
		},
		authentication:
			'Bearer Token required for all endpoints except api/health',
	});
});

// Health Check Endpoint
app.get('/health', (req, res) => {
	res.status(200).json({
		success: true,
		message: 'API is running',
		timestamp: new Date().toISOString(),
	});
});

// 404 Error Handler
app.use('*', (req: Request, res: Response) => {
	res.status(404).json({
		success: false,
		error: {
			message: `Route ${req.originalUrl} not found`,
		},
	});
});

// Error Handler Middleware
app.use(errorHandler);

app.listen(PORT, () => {
	console.log(`[server]: 🚀 Server is running at http://localhost:${PORT}`);
});
