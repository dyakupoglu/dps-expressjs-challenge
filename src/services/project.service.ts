import { v4 as uuidv4 } from 'uuid';
import dbService from './db.service';
import {
	Project,
	CreateProjectRequest,
	UpdateProjectRequest,
} from '../models/project.model';
import {
	createNotFoundError,
	createValidationError,
} from '../middleware/error.middleware';

export const getAllProjects = async (): Promise<Project[]> => {
	const projects = dbService.query('SELECT * FROM projects') as Project[];
	return projects;
};

export const getProjectById = async (id: string): Promise<Project> => {
	if (!id?.trim()) {
		throw createValidationError('Project ID is required');
	}

	const projects = dbService.query('SELECT * FROM projects WHERE id = :id', {
		id: id.trim(),
	}) as Project[];

	if (projects.length === 0) {
		throw createNotFoundError(`Project with ID ${id} not found`);
	}

	return projects[0];
};

export const createProject = async (
	projectData: CreateProjectRequest,
): Promise<Project> => {
	const { name, description } = projectData;

	if (!name?.trim() || !description?.trim()) {
		throw createValidationError(
			'Name and description are required and cannot be empty',
		);
	}

	const newProject: Project = {
		id: uuidv4(),
		name: name.trim(),
		description: description.trim(),
	};

	dbService.run(
		'INSERT INTO projects (id, name, description) VALUES (:id, :name, :description)',
		{
			id: newProject.id,
			name: newProject.name,
			description: newProject.description,
		},
	);
	return newProject;
};

export const updateProject = async (
	id: string,
	updateData: UpdateProjectRequest,
): Promise<Project> => {
	if (!id?.trim()) {
		throw createValidationError('Project ID is required');
	}

	await getProjectById(id);

	const { name, description } = updateData;

	if (name === undefined && description === undefined) {
		throw createValidationError(
			'At least one field (name or description) must be provided for update',
		);
	}

	if (name !== undefined && !name.trim()) {
		throw createValidationError('Name cannot be empty');
	}

	if (description !== undefined && !description.trim()) {
		throw createValidationError('Description cannot be empty');
	}

	const updateFields: string[] = [];
	const params: Record<string, string> = { id: id.trim() };

	if (name !== undefined) {
		updateFields.push('name = :name');
		params.name = name.trim();
	}

	if (description !== undefined) {
		updateFields.push('description = :description');
		params.description = description.trim();
	}

	const query = `UPDATE projects SET ${updateFields.join(', ')} WHERE id = :id`;
	dbService.run(query, params);

	return await getProjectById(id);
};

export const deleteProject = async (id: string): Promise<void> => {
	if (!id?.trim()) {
		throw createValidationError('Project ID is required');
	}

	await getProjectById(id);

	dbService.run('DELETE FROM reports WHERE projectid = :projectid', {
		projectid: id.trim(),
	});

	dbService.run('DELETE FROM projects WHERE id = :id', { id: id.trim() });
};
