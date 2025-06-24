// Test setup file
import dotenv from 'dotenv';

// Load test environment variables
dotenv.config({ path: '.env.test' });

// Set test environment
process.env.NODE_ENV = 'test';
process.env.PORT = '3001'; // Use different port for tests

// Global test configuration
jest.setTimeout(10000);

// Mock console.log in tests to reduce noise
global.console = {
	...console,
	log: jest.fn(),
	info: jest.fn(),
	warn: jest.fn(),
	error: jest.fn(),
};
