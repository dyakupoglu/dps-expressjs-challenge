import { v4 as uuidv4 } from 'uuid';
import dbService from './db.service';
import { getProjectById } from './project.service';
import {
	Report,
	CreateReportRequest,
	UpdateReportRequest,
} from '../models/report.model';
import {
	createNotFoundError,
	createValidationError,
} from '../middleware/error.middleware';

export const getAllReports = async (): Promise<Report[]> => {
	const reports = dbService.query('SELECT * FROM reports') as Report[];
	return reports;
};

export const getReportById = async (id: string): Promise<Report> => {
	if (!id?.trim()) {
		throw createValidationError('Report ID is required');
	}

	const reports = dbService.query('SELECT * FROM reports WHERE id = :id', {
		id: id.trim(),
	}) as Report[];

	if (reports.length === 0) {
		throw createNotFoundError(`Report with ID ${id} not found`);
	}

	return reports[0];
};

export const getReportsByProjectId = async (
	projectId: string,
): Promise<Report[]> => {
	if (!projectId?.trim()) {
		throw createValidationError('Project ID is required');
	}

	const reports = dbService.query(
		'SELECT * FROM reports WHERE projectid = :projectid',
		{ projectid: projectId.trim() },
	) as Report[];
	return reports;
};

export const createReport = async (
	reportData: CreateReportRequest,
): Promise<Report> => {
	const { text, projectid } = reportData;

	if (!text?.trim() || !projectid?.trim()) {
		throw createValidationError(
			'Text and project ID are required and cannot be empty',
		);
	}

	await getProjectById(projectid.trim());

	const newReport: Report = {
		id: uuidv4(),
		text: text.trim(),
		projectid: projectid.trim(),
	};

	dbService.run(
		'INSERT INTO reports (id, text, projectid) VALUES (:id, :text, :projectid)',
		{
			id: newReport.id,
			text: newReport.text,
			projectid: newReport.projectid,
		},
	);

	return newReport;
};

export const updateReport = async (
	id: string,
	updateData: UpdateReportRequest,
): Promise<Report> => {
	if (!id?.trim()) {
		throw createValidationError('Report ID is required');
	}

	await getReportById(id);

	const { text, projectid } = updateData;

	if (text === undefined && projectid === undefined) {
		throw createValidationError(
			'At least one field (text or project ID) must be provided for update',
		);
	}

	if (text !== undefined && !text.trim()) {
		throw createValidationError('Text cannot be empty');
	}

	if (projectid !== undefined && !projectid.trim()) {
		throw createValidationError('Project ID cannot be empty');
	}

	const updateFields: string[] = [];
	const params: Record<string, string> = { id: id.trim() };

	if (text !== undefined) {
		updateFields.push('text = :text');
		params.text = text.trim();
	}

	if (projectid !== undefined) {
		await getProjectById(projectid.trim());
		updateFields.push('projectid = :projectid');
		params.projectid = projectid.trim();
	}

	const query = `UPDATE reports SET ${updateFields.join(', ')} WHERE id = :id`;
	dbService.run(query, params);

	return await getReportById(id);
};

export const deleteReport = async (id: string): Promise<void> => {
	if (!id?.trim()) {
		throw createValidationError('Report ID is required');
	}

	await getReportById(id);

	dbService.run('DELETE FROM reports WHERE id = :id', { id: id.trim() });
};

export const getReportsWithWordCount = async (
	minCount: number = 3,
): Promise<Report[]> => {
	const reports = dbService.query('SELECT * FROM reports') as Report[];

	const filteredReports = reports.filter((report) => {
		const words = report.text.toLowerCase().match(/\b\w+\b/g) || [];

		const wordCount: { [key: string]: number } = {};

		words.forEach((word) => {
			wordCount[word] = (wordCount[word] || 0) + 1;
		});

		return Object.values(wordCount).some((count) => count >= minCount);
	});

	return filteredReports;
};
