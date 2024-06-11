export interface NotificationModel {
  createdDate: Date;
  deviceToken: string | null;
  email: string;
  isRead: boolean;
  isSent: boolean;
  isWebOnline: boolean;
  message: string;
  mobile?: string;
  notificationID: number;
  notificationLandingPageCode: string;
  notificationLandingPageID: number;
  notificationLandingPageName: string;
  notificationMessageID: number;
  taskID: number;
  taskType: string;
  title: string;
  totalCount: number;
  unReadCount: number;
  userID: number;
  userType: string;
}
