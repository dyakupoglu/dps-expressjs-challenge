import { Request, Response, NextFunction } from 'express';

export interface ApiError extends Error {
	statusCode: number;
	message: string;
}

export const createValidationError = (
	message: string = 'Validation failed',
): ApiError => {
	const error = new Error(message) as ApiError;
	error.statusCode = 400;
	error.name = 'ValidationError';
	return error;
};

export const createUnauthorizedError = (
	message: string = 'Unauthorized',
): ApiError => {
	const error = new Error(message) as ApiError;
	error.statusCode = 401;
	error.name = 'UnauthorizedError';
	return error;
};

export const createNotFoundError = (
	message: string = 'Resource not found',
): ApiError => {
	const error = new Error(message) as ApiError;
	error.statusCode = 404;
	error.name = 'NotFoundError';
	return error;
};

export const errorHandler = (
	err: ApiError,
	req: Request,
	res: Response,
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	_next: NextFunction,
): void => {
	console.error(`Error: ${err.name} - ${err.message}`);
	console.error(err.stack);

	const statusCode = err.statusCode || 500;
	const message = err.message || 'Internal Server Error';

	res.status(statusCode).json({
		success: false,
		error: {
			message,
		},
	});
};
