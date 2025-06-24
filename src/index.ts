import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import routes from './routes';
import homeRoutes from './routes/home.routes';
import { errorHandler } from './middleware/error.middleware';
import { config } from './config/env.config';

const app: Express = express();
const PORT = config.port;

// Middleware setup
app.use(cors());
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// API Version Header
app.use((req: Request, res: Response, next) => {
	res.setHeader('X-API-Version', 'v1');
	next();
});

// Routes
app.use('/', homeRoutes);
app.use('/api', routes);

// 404 handler for unmatched routes
app.use('*', (req: Request, res: Response) => {
	res.status(404).json({
		success: false,
		error: {
			message: `Route ${req.originalUrl} not found`,
			availableEndpoints: 'GET /',
		},
	});
});

// Global error handler
app.use(errorHandler);

export { app };

if (process.env.NODE_ENV !== 'test') {
	app.listen(PORT, () => {
		console.log(
			`[server]: 🚀 Server is running at http://localhost:${PORT}`,
		);
	});
}
