export interface ReportApiParams {
    searchKey: string;
    postalCode: number;
    requirementTypeID: string[];
    statusTypeID: string;
    carrierID: string[];
}

export interface AssignmentReportModel {
    documentID: string;
    statusTypeID: string;
    statusReason: string;
    assignmentReferenceNo: string;
    assignmentID: number;
    requirementTypeID: string;
    requirementTypeName?: string;
    scheduleDate: string;
    contractorName: string;
    modifiedBy: string;
    modifiedDate: string;
    documentFileName: string;
    jobID: number;
}
