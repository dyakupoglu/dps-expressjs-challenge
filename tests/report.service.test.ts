import * as reportService from '../src/services/report.service';
import * as projectService from '../src/services/project.service';

describe('Report Service', () => {
	let testProjectId: string;

	beforeAll(async () => {
		const project = await projectService.createProject({
			name: 'Test Project for Reports',
			description: 'Test Description for Reports',
		});
		testProjectId = project.id;
	});

	describe('getAllReports', () => {
		it('should return array of reports', async () => {
			const reports = await reportService.getAllReports();
			expect(Array.isArray(reports)).toBe(true);
		});
	});

	describe('createReport', () => {
		it('should create report with valid data', async () => {
			const reportData = {
				text: 'Test report content',
				projectid: testProjectId,
			};

			const result = await reportService.createReport(reportData);

			expect(result.id).toBeDefined();
			expect(result.text).toBe('Test report content');
			expect(result.projectid).toBe(testProjectId);
		});

		it('should throw validation error for empty text', async () => {
			const reportData = {
				text: '',
				projectid: testProjectId,
			};

			await expect(
				reportService.createReport(reportData),
			).rejects.toThrow(
				'Text and project ID are required and cannot be empty',
			);
		});

		it('should throw validation error for whitespace-only text', async () => {
			const reportData = {
				text: '   ',
				projectid: testProjectId,
			};

			await expect(
				reportService.createReport(reportData),
			).rejects.toThrow(
				'Text and project ID are required and cannot be empty',
			);
		});

		it('should throw validation error for empty project ID', async () => {
			const reportData = {
				text: 'Test report content',
				projectid: '',
			};

			await expect(
				reportService.createReport(reportData),
			).rejects.toThrow(
				'Text and project ID are required and cannot be empty',
			);
		});

		it('should throw validation error for missing text', async () => {
			const reportData = {
				text: undefined as unknown as string,
				projectid: testProjectId,
			};

			await expect(
				reportService.createReport(reportData),
			).rejects.toThrow(
				'Text and project ID are required and cannot be empty',
			);
		});

		it('should throw not found error for non-existent project', async () => {
			const reportData = {
				text: 'Test report content',
				projectid: 'non-existent-project-id',
			};

			await expect(
				reportService.createReport(reportData),
			).rejects.toThrow('not found');
		});
	});

	describe('getReportById', () => {
		let testReportId: string;

		beforeAll(async () => {
			const report = await reportService.createReport({
				text: 'Test Report for Get',
				projectid: testProjectId,
			});
			testReportId = report.id;
		});

		it('should return report by valid ID', async () => {
			const result = await reportService.getReportById(testReportId);

			expect(result.id).toBe(testReportId);
			expect(result.text).toBe('Test Report for Get');
			expect(result.projectid).toBe(testProjectId);
		});

		it('should throw validation error for empty ID', async () => {
			await expect(reportService.getReportById('')).rejects.toThrow(
				'Report ID is required',
			);
		});

		it('should throw validation error for whitespace-only ID', async () => {
			await expect(reportService.getReportById('   ')).rejects.toThrow(
				'Report ID is required',
			);
		});

		it('should throw not found error for non-existent ID', async () => {
			await expect(
				reportService.getReportById('non-existent-id'),
			).rejects.toThrow('Report with ID non-existent-id not found');
		});
	});

	describe('getReportsByProjectId', () => {
		let testReportsProjectId: string;

		beforeAll(async () => {
			const project = await projectService.createProject({
				name: 'Project for Multiple Reports',
				description: 'Test project for multiple reports',
			});
			testReportsProjectId = project.id;

			await reportService.createReport({
				text: 'First report',
				projectid: testReportsProjectId,
			});
			await reportService.createReport({
				text: 'Second report',
				projectid: testReportsProjectId,
			});
		});

		it('should return reports for valid project ID', async () => {
			const reports =
				await reportService.getReportsByProjectId(testReportsProjectId);

			expect(Array.isArray(reports)).toBe(true);
			expect(reports.length).toBeGreaterThanOrEqual(2);
			reports.forEach((report) => {
				expect(report.projectid).toBe(testReportsProjectId);
			});
		});

		it('should return empty array for project with no reports', async () => {
			const emptyProject = await projectService.createProject({
				name: 'Empty Project',
				description: 'Project with no reports',
			});

			const reports = await reportService.getReportsByProjectId(
				emptyProject.id,
			);

			expect(Array.isArray(reports)).toBe(true);
			expect(reports.length).toBe(0);
		});

		it('should throw validation error for empty project ID', async () => {
			await expect(
				reportService.getReportsByProjectId(''),
			).rejects.toThrow('Project ID is required');
		});
	});

	describe('updateReport', () => {
		let testReportId: string;
		let secondTestProjectId: string;

		beforeEach(async () => {
			const secondProject = await projectService.createProject({
				name: 'Second Test Project',
				description: 'Second test project for updates',
			});
			secondTestProjectId = secondProject.id;

			const report = await reportService.createReport({
				text: 'Original Report Text',
				projectid: testProjectId,
			});
			testReportId = report.id;
		});

		it('should update report text only', async () => {
			const result = await reportService.updateReport(testReportId, {
				text: 'Updated Report Text',
			});

			expect(result.text).toBe('Updated Report Text');
			expect(result.projectid).toBe(testProjectId);
		});

		it('should update project ID only', async () => {
			const result = await reportService.updateReport(testReportId, {
				projectid: secondTestProjectId,
			});

			expect(result.text).toBe('Original Report Text');
			expect(result.projectid).toBe(secondTestProjectId);
		});

		it('should update both text and project ID', async () => {
			const result = await reportService.updateReport(testReportId, {
				text: 'Updated Text',
				projectid: secondTestProjectId,
			});

			expect(result.text).toBe('Updated Text');
			expect(result.projectid).toBe(secondTestProjectId);
		});

		it('should throw validation error for empty update data', async () => {
			await expect(
				reportService.updateReport(testReportId, {}),
			).rejects.toThrow('At least one field');
		});

		it('should throw validation error for empty text', async () => {
			await expect(
				reportService.updateReport(testReportId, { text: '' }),
			).rejects.toThrow('Text cannot be empty');
		});

		it('should throw not found error for non-existent report', async () => {
			await expect(
				reportService.updateReport('non-existent-id', {
					text: 'Updated Text',
				}),
			).rejects.toThrow('not found');
		});

		it('should throw not found error for non-existent project', async () => {
			await expect(
				reportService.updateReport(testReportId, {
					projectid: 'non-existent-project',
				}),
			).rejects.toThrow('not found');
		});

		it('should throw validation error for empty report ID', async () => {
			await expect(
				reportService.updateReport('', { text: 'Updated Text' }),
			).rejects.toThrow('Report ID is required');
		});
	});

	describe('deleteReport', () => {
		it('should delete existing report', async () => {
			const report = await reportService.createReport({
				text: 'Report to Delete',
				projectid: testProjectId,
			});

			await expect(
				reportService.deleteReport(report.id),
			).resolves.not.toThrow();

			await expect(
				reportService.getReportById(report.id),
			).rejects.toThrow('not found');
		});

		it('should throw validation error for empty ID', async () => {
			await expect(reportService.deleteReport('')).rejects.toThrow(
				'Report ID is required',
			);
		});

		it('should throw not found error for non-existent report', async () => {
			await expect(
				reportService.deleteReport('non-existent-id'),
			).rejects.toThrow('not found');
		});
	});

	describe('getReportsWithWordCount', () => {
		let wordCountProjectId: string;

		beforeAll(async () => {
			const project = await projectService.createProject({
				name: 'Word Count Test Project',
				description: 'Project for testing word count functionality',
			});
			wordCountProjectId = project.id;

			await reportService.createReport({
				text: 'This is a test test test report with repeated words test',
				projectid: wordCountProjectId,
			});

			await reportService.createReport({
				text: 'Another report with the the the same word repeated the',
				projectid: wordCountProjectId,
			});

			await reportService.createReport({
				text: 'This report has no repeated words in it',
				projectid: wordCountProjectId,
			});

			await reportService.createReport({
				text: 'Quick quick quick brown fox jumps over lazy dog',
				projectid: wordCountProjectId,
			});
		});

		it('should return reports with words appearing 3+ times (default)', async () => {
			const reports = await reportService.getReportsWithWordCount();

			expect(Array.isArray(reports)).toBe(true);
			expect(reports.length).toBeGreaterThan(0);

			reports.forEach((report) => {
				const words = report.text.toLowerCase().match(/\b\w+\b/g) || [];
				const wordCount: { [key: string]: number } = {};

				words.forEach((word) => {
					wordCount[word] = (wordCount[word] || 0) + 1;
				});

				const hasRepeatedWord = Object.values(wordCount).some(
					(count) => count >= 3,
				);
				expect(hasRepeatedWord).toBe(true);
			});
		});

		it('should return reports with words appearing 4+ times when minCount=4', async () => {
			const reports = await reportService.getReportsWithWordCount(4);

			expect(Array.isArray(reports)).toBe(true);

			reports.forEach((report) => {
				const words = report.text.toLowerCase().match(/\b\w+\b/g) || [];
				const wordCount: { [key: string]: number } = {};

				words.forEach((word) => {
					wordCount[word] = (wordCount[word] || 0) + 1;
				});

				const hasRepeatedWord = Object.values(wordCount).some(
					(count) => count >= 4,
				);
				expect(hasRepeatedWord).toBe(true);
			});
		});

		it('should return empty array when minCount is very high', async () => {
			const reports = await reportService.getReportsWithWordCount(100);

			expect(Array.isArray(reports)).toBe(true);
			expect(reports.length).toBe(0);
		});
	});
});
