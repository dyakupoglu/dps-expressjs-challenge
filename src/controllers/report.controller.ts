import { Request, Response, NextFunction } from 'express';
import * as reportService from '../services/report.service';
import {
	CreateReportRequest,
	UpdateReportRequest,
} from '../models/report.model';

export const getAllReports = async (
	req: Request,
	res: Response,
	next: NextFunction,
): Promise<void> => {
	try {
		const reports = await reportService.getAllReports();
		res.status(200).json({
			success: true,
			data: reports,
			count: reports.length,
		});
	} catch (error) {
		next(error);
	}
};

export const getReportById = async (
	req: Request,
	res: Response,
	next: NextFunction,
): Promise<void> => {
	try {
		const { id } = req.params;
		const report = await reportService.getReportById(id);
		res.status(200).json({
			success: true,
			data: report,
		});
	} catch (error) {
		next(error);
	}
};

export const getReportsByProjectId = async (
	req: Request,
	res: Response,
	next: NextFunction,
): Promise<void> => {
	try {
		const { projectId } = req.params;
		const reports = await reportService.getReportsByProjectId(projectId);
		res.status(200).json({
			success: true,
			data: reports,
			count: reports.length,
		});
	} catch (error) {
		next(error);
	}
};

export const createReport = async (
	req: Request,
	res: Response,
	next: NextFunction,
): Promise<void> => {
	try {
		const reportData: CreateReportRequest = req.body;
		const report = await reportService.createReport(reportData);
		res.status(201).json({
			success: true,
			data: report,
			message: 'Report created successfully',
		});
	} catch (error) {
		next(error);
	}
};

export const updateReport = async (
	req: Request,
	res: Response,
	next: NextFunction,
): Promise<void> => {
	try {
		const { id } = req.params;
		const updateData: UpdateReportRequest = req.body;
		const report = await reportService.updateReport(id, updateData);
		res.status(200).json({
			success: true,
			data: report,
			message: 'Report updated successfully',
		});
	} catch (error) {
		next(error);
	}
};

export const deleteReport = async (
	req: Request,
	res: Response,
	next: NextFunction,
): Promise<void> => {
	try {
		const { id } = req.params;
		await reportService.deleteReport(id);
		res.status(200).json({
			success: true,
			message: 'Report deleted successfully',
		});
	} catch (error) {
		next(error);
	}
};

export const getReportsWithWordCount = async (
	req: Request,
	res: Response,
	next: NextFunction,
): Promise<void> => {
	try {
		const minCount = parseInt(req.query.minCount as string) || 3;
		const reports = await reportService.getReportsWithWordCount(minCount);
		res.status(200).json({
			success: true,
			data: reports,
			count: reports.length,
			message: `Reports where words appear at least ${minCount} times`,
		});
	} catch (error) {
		next(error);
	}
};
