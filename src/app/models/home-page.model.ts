export interface GridIndexModel {
  homePageMappingID: number;
  tilesTypeID: string;
  tilesTypeName: string;
  tilesViewOrder: number;
  status: boolean;
  }
  export interface DragEventModel {
    prevented: boolean;
     index: number;
     oldIndex: number;
  }
export interface AssignmentFinishDetail {
  assignmentFinishDate: string;
  assignmentID: string;
  clientName: string;
  jobTitle: string;
}
export interface AssignmentStartingDetail {
  assignmentStartDate: string;
  assignmentID: string;
  clientName: string;
  jobTitle: string;
}
export interface AlertNotification {
  datetime: string;
  notificationDetail: string;
  notificationID: string;
}


export interface ReceivedOffersModel {
  carrierName: string;
  contractorAssignmentID: number;
  effectiveStartDate: string;
  jobTitle: string;
  rateAmount: string;
  ratePercentage: string;
  stateID: string;
}

export interface PendingTimeSheetModel {
  carrierName: string;
  contractorAssignmentID: number;
  weekRange: string;
  location: string;
  jobTitle: string;
}
export interface MatchedJobsModel {
  carrierName: string;
  jobID: number;
  jobTitle: string;
  rateAmount: string;
  ratePercentage: string;
  startDate: string;
  stateID: string;
}
// latest update
export interface LatestUpdatesModel {
  message: string;
  notificationID: number;
  notificationLandingPageID: number;
  notificationMessageID: number;
  taskID: string;
  taskType: string;
  title: string;
}
// qa failures
export interface QaFailures {
  assignmentID: string;
  clientName: string;
  reviewDate: string;
  reason: string;
  assignmentReferenceNo: string;
}
// schedule appointment
export interface SechduleAppointment {
  assignmentID: string;
  clientName: string;
  address: string;
  assignmentReferenceNo: string;
  requirementTypeID: string;
  scheduleDate: string;
  startTime: string;
  endTime: string;
  timezone: string;
  dayLight: boolean;
}
// assignment cancel
export interface AssignmentCancelationDetail {
  reason: string;
  requirementType: string;
  requirementTypeID: string;
  assignmentID: string;
  assignedDate: string;
  jobTitle: string;
  actionB: string;
  startTime: string;
  endTime: string;
  timezone: string;
  dayLight: boolean;
  statusReasonTypeID: string;
  statusReasonTypeName: string;
}
// new jobs
export interface NewJobDetail {
  jobID: string;
  requirementType: string;
  address: string;
  jobDate: string;
  jobCode: string;
}
// recent messages
export interface RecentMessages {
  dateandtime: string;
  sender: string;
  Subject: string;
}
// Calender
export interface AssignmentDetail {
  assignmentID: string;
  clientName: string;
  assignmentActionDate: string;
  location: string;
  type: string;
  contact: string;
  assignmentReferenceNo: string;
  requirementTypeID: string;
  scheduleDate: string;
  startTime: string;
  endTime: string;
}

export interface HomePageResultModel {
  homePageTilesDetails: GridIndexModel[];
  latestUpdateDetails: LatestUpdatesModel;
  matchedJobDetails: MatchedJobsModel;
  pendingTimeSheetDetails: PendingTimeSheetModel;
  receivedOfferDetails: ReceivedOffersModel;
  qaFailureDetails: QaFailures[];
  appointmentDetails: SechduleAppointment[];
  assignmentFinishingDetails: AssignmentFinishDetail[];
  assignmentsCancelledDetails: AssignmentCancelationDetail[];
  assignmentsStartingDetails: AssignmentStartingDetail[];
  newJobDetails: NewJobDetail[];
  alertsNotificationsDetails: AlertNotification[];
  recentMessagesEmailsDetails: RecentMessages[];
  calenderDetails: AssignmentDetail[];
}
export interface PostHomePagePosition {
  homePageTilesDetails: GridIndexModel[];
}
