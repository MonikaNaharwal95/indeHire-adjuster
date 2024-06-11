import { Injectable } from '@angular/core';
import { ConfigService } from './config.service';
import { CrudService } from './crud.service';
import { UrlGroup } from '../models/config.model';
import { Router } from '@angular/router';
import { NotificationModel } from '../models/notification.model';

@Injectable({
  providedIn: 'root',
})
export class PushNotificationService {

  constructor(
    private config: ConfigService,
    private crudService: CrudService,
    private router: Router
  ) {}

  get notificationEndpoint(): UrlGroup {
    return this.config.getApiUrls('notification');
  }

  public getNotification(pageNo?: number): Promise<NotificationModel[]> {
    return new Promise((resolve: Function, reject: Function) => {
      const url =
        this.notificationEndpoint.command + 'api/notification/GetNotification';
      this.crudService
        .post<NotificationModel[]>(url, {
          userID: 0,
          userType: 'Contractor',
          pageNo: pageNo ? pageNo : 1,
          pageSize: 50,
        })
        .subscribe((res: NotificationModel []) => {
          if (res) {
            for (const x of res) {
              const crDate = new Date(x.createdDate).getTime();
              const timeOffSet = new Date(x.createdDate).getTimezoneOffset();
              x.createdDate = new Date(crDate - timeOffSet * 60000);
            }
            resolve(res);
          }
          reject();
        });
    });
  }

  public updateNotificationStatus(ID: number): void {
    const url = this.notificationEndpoint.command + 'api/notification/UpdateNotificationStatus';
    const payload = {
      notificationID: ID,
    };
    this.crudService.put(url, payload).subscribe((res: boolean) => {});
  }

  public readAllNotifications(): Promise<boolean> {
    return new Promise((resolve: Function, reject: Function) => {
      const url = this.notificationEndpoint.command + 'api/notification/UpdateNotificationStatus';
      const payload = {
        notificationID: 0,
        userType: 'Contractor'
      };
      this.crudService.put(url, payload).subscribe((res: boolean) => {
        if (res) {
          resolve(true);
        } else {
          reject(false);
        }
      });
    });
  }

  private getNotificationPath(item: NotificationModel): string {
    const sendParam = {
      taskID: item.taskID,
      landingPageCode: item.notificationLandingPageCode,
    };
    switch (item.notificationLandingPageCode) {
      case 'AJM':
      return `/jobs?${btoa(item.taskID.toString())}`;
      case 'SJA':
      return `/jobs?${btoa(item.taskID.toString())}`;
      case 'ASA':
      return `/contracts/posted-contracts/ASCH`;
      case 'CRA':
      return `/qa-report?2`;
      case 'CRF':
      return `/qa-report?3`; // Inactive job (Navigation not required)
      case 'ACE':
      return `/contracts/posted-contracts/ACOM`;
      case 'ACC':
      return `/contracts/posted-contracts/ATER`;
      default:
      return '/';
    }
  }

  public notificationAction(item: NotificationModel): void {
    const path = this.getNotificationPath(item);
    this.updateNotificationStatus(item.notificationID);
    if (path.split('?').length === 2) {
      this.router.navigate([path.split('?')[0]], { queryParams: { nav: path.split('?')[1] } });
    } else {
      this.router.navigate([path.split('?')[0]]);
    }
  }
}
