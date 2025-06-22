import { Request, Response, NextFunction } from 'express';
import { createUnauthorizedError } from './error.middleware';
import { config } from '../config/env.config';

export const authMiddleware = (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	const authHeader = req.headers.authorization;
	const token = authHeader && authHeader.split(' ')[1];

	if (!token) {
		throw createUnauthorizedError('Access token is required');
	}

	if (token !== config.authToken) {
		throw createUnauthorizedError('Invalid access token');
	}

	next();
};
