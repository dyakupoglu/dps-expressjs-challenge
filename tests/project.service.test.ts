import * as projectService from '../src/services/project.service';
import {
	createValidationError,
	createNotFoundError,
} from '../src/middleware/error.middleware';

describe('Project Service', () => {
	describe('getAllProjects', () => {
		it('should return array of projects', async () => {
			const projects = await projectService.getAllProjects();
			expect(Array.isArray(projects)).toBe(true);
		});
	});

	describe('createProject', () => {
		it('should create project with valid data', async () => {
			const projectData = {
				name: 'Test Project',
				description: 'Test Description',
			};

			const result = await projectService.createProject(projectData);

			expect(result.id).toBeDefined();
			expect(result.name).toBe('Test Project');
			expect(result.description).toBe('Test Description');
		});

		it('should throw validation error for empty name', async () => {
			const projectData = {
				name: '',
				description: 'Test Description',
			};

			await expect(
				projectService.createProject(projectData),
			).rejects.toThrow(
				'Name and description are required and cannot be empty',
			);
		});

		it('should throw validation error for whitespace-only name', async () => {
			const projectData = {
				name: '   ',
				description: 'Test Description',
			};

			await expect(
				projectService.createProject(projectData),
			).rejects.toThrow(
				'Name and description are required and cannot be empty',
			);
		});

		it('should throw validation error for missing description', async () => {
			const projectData = {
				name: 'Test Project',
				description: '',
			};

			await expect(
				projectService.createProject(projectData),
			).rejects.toThrow(
				'Name and description are required and cannot be empty',
			);
		});
	});

	describe('getProjectById', () => {
		let testProjectId: string;

		beforeAll(async () => {
			const project = await projectService.createProject({
				name: 'Test Project for Get',
				description: 'Test Description for Get',
			});
			testProjectId = project.id;
		});

		it('should return project by valid ID', async () => {
			const result = await projectService.getProjectById(testProjectId);

			expect(result.id).toBe(testProjectId);
			expect(result.name).toBe('Test Project for Get');
			expect(result.description).toBe('Test Description for Get');
		});

		it('should throw validation error for empty ID', async () => {
			await expect(projectService.getProjectById('')).rejects.toThrow(
				'Project ID is required',
			);
		});

		it('should throw validation error for whitespace-only ID', async () => {
			await expect(projectService.getProjectById('   ')).rejects.toThrow(
				'Project ID is required',
			);
		});

		it('should throw not found error for non-existent ID', async () => {
			await expect(
				projectService.getProjectById('non-existent-id'),
			).rejects.toThrow('Project with ID non-existent-id not found');
		});
	});

	describe('updateProject', () => {
		let testProjectId: string;

		beforeEach(async () => {
			const project = await projectService.createProject({
				name: 'Original Name',
				description: 'Original Description',
			});
			testProjectId = project.id;
		});

		it('should update project name only', async () => {
			const result = await projectService.updateProject(testProjectId, {
				name: 'Updated Name',
			});

			expect(result.name).toBe('Updated Name');
			expect(result.description).toBe('Original Description');
		});

		it('should update project description only', async () => {
			const result = await projectService.updateProject(testProjectId, {
				description: 'Updated Description',
			});

			expect(result.name).toBe('Original Name');
			expect(result.description).toBe('Updated Description');
		});

		it('should update both name and description', async () => {
			const result = await projectService.updateProject(testProjectId, {
				name: 'Updated Name',
				description: 'Updated Description',
			});

			expect(result.name).toBe('Updated Name');
			expect(result.description).toBe('Updated Description');
		});

		it('should throw validation error for empty update data', async () => {
			await expect(
				projectService.updateProject(testProjectId, {}),
			).rejects.toThrow('At least one field');
		});

		it('should throw validation error for empty name', async () => {
			await expect(
				projectService.updateProject(testProjectId, { name: '' }),
			).rejects.toThrow('Name cannot be empty');
		});

		it('should throw not found error for non-existent project', async () => {
			await expect(
				projectService.updateProject('non-existent-id', {
					name: 'Updated Name',
				}),
			).rejects.toThrow('not found');
		});
	});

	describe('deleteProject', () => {
		it('should delete existing project', async () => {
			const project = await projectService.createProject({
				name: 'Project to Delete',
				description: 'Description to Delete',
			});

			await expect(
				projectService.deleteProject(project.id),
			).resolves.not.toThrow();

			await expect(
				projectService.getProjectById(project.id),
			).rejects.toThrow('not found');
		});

		it('should throw validation error for empty ID', async () => {
			await expect(projectService.deleteProject('')).rejects.toThrow(
				'Project ID is required',
			);
		});

		it('should throw not found error for non-existent project', async () => {
			await expect(
				projectService.deleteProject('non-existent-id'),
			).rejects.toThrow('not found');
		});
	});
});
