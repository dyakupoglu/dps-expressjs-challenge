export interface Report {
	id: string;
	text: string;
	projectid: string;
}

export interface CreateReportRequest {
	text: string;
	projectid: string;
}

export interface UpdateReportRequest {
	text?: string;
	projectid?: string;
}
