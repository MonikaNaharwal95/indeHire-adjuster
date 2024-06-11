export interface AssignmentModel {
    assignmentID: number;
    assignmentReferenceNo: string;
    assignmentStatus: string;
    canUserTerminate: boolean;
    contractorAssignmentReportStatusID: string;
    scheduleDate: string;
    startTime: string;
    endTime: string;
    location: string;
    contractorTypeID: string;
    requirementTypeID: string;
    propertyTypeID: string;
    postedBy: string;
    jobID: number;
    hoverJobID: number;
    hoverJobState: string;
    timezone: string;
    dayLight: boolean;
    modifiedBy: string;
    offset: number;
    rating: number;
    statusReason: string;
    statusReasonTypeID: string;
    jobCode: string;
    isHoverRequired: string;
    inspectionScheduleChoice: string;
    isRescheduleAndNotRead: boolean;
}
export interface RescheduleModel {
    jobID: number;
    scheduleDate: string;
    startTime: string;
    reason: string;
    otherReason: string;
  }
export interface TerminateContractModel {
    jobID: number | string;
    statusTypeID: string;
    statusReasonTypeID: string;
    statusReason: string;
}