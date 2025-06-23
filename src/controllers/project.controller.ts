import { Request, Response, NextFunction } from 'express';
import * as projectService from '../services/project.service';
import {
	CreateProjectRequest,
	UpdateProjectRequest,
} from '../models/project.model';

export const getAllProjects = async (
	req: Request,
	res: Response,
	next: NextFunction,
): Promise<void> => {
	try {
		const projects = await projectService.getAllProjects();
		res.status(200).json({
			success: true,
			data: projects,
			count: projects.length,
		});
	} catch (error) {
		next(error);
	}
};

export const getProjectById = async (
	req: Request,
	res: Response,
	next: NextFunction,
): Promise<void> => {
	try {
		const { id } = req.params;
		const project = await projectService.getProjectById(id);
		res.status(200).json({
			success: true,
			data: project,
		});
	} catch (error) {
		next(error);
	}
};

export const createProject = async (
	req: Request,
	res: Response,
	next: NextFunction,
): Promise<void> => {
	try {
		const projectData: CreateProjectRequest = req.body;
		const newProject = await projectService.createProject(projectData);
		res.status(201).json({
			success: true,
			data: newProject,
			message: 'Project created successfully',
		});
	} catch (error) {
		next(error);
	}
};

export const updateProject = async (
	req: Request,
	res: Response,
	next: NextFunction,
): Promise<void> => {
	try {
		const { id } = req.params;
		const updateData: UpdateProjectRequest = req.body;
		const updatedProject = await projectService.updateProject(
			id,
			updateData,
		);
		res.status(200).json({
			success: true,
			data: updatedProject,
			message: 'Project updated successfully',
		});
	} catch (error) {
		next(error);
	}
};

export const deleteProject = async (
	req: Request,
	res: Response,
	next: NextFunction,
): Promise<void> => {
	try {
		const { id } = req.params;
		await projectService.deleteProject(id);
		res.status(200).json({
			success: true,
			message: 'Project deleted successfully',
		});
	} catch (error) {
		next(error);
	}
};
