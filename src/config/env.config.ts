import dotenv from 'dotenv';

dotenv.config();

export const config = {
	port: process.env.PORT || 3000,
	authToken: process.env.AUTH_TOKEN || 'Password123',
};
