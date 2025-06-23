import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import routes from './routes';
import homeRoutes from './routes/home.routes';
import { errorHandler } from './middleware/error.middleware';
import { config } from './config/env.config';

const app: Express = express();
const PORT = config.port;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/', homeRoutes);
app.use('/api', routes);

// 404 Error Handler
app.use('*', (req: Request, res: Response) => {
	res.status(404).json({
		success: false,
		error: {
			message: `Route ${req.originalUrl} not found`,
		},
	});
});

// Error Handler
app.use(errorHandler);

app.listen(PORT, () => {
	console.log(`[server]: 🚀 Server is running at http://localhost:${PORT}`);
});
