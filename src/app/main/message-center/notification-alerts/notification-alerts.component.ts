import { Component, OnInit } from '@angular/core';
import { PushNotificationService } from 'src/app/services/push-notification.service';
import { NotificationModel } from 'src/app/models/notification.model';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Subscription } from 'rxjs';
import { MessageCenter } from 'src/app/models/message-center.metadata';
import { CmsService } from 'src/app/services/cms.service';

@Component({
  selector: 'inde-notification-alerts',
  templateUrl: './notification-alerts.component.html',
  styleUrls: ['./notification-alerts.component.scss']
})
export class NotificationAlertsComponent implements OnInit {

  public notificationList: NotificationModel[] = [];
  public meta: MessageCenter;
  public unReadCount: number;
  public showNotification: boolean;
  public loader: boolean = false;
  routerSubscription: Subscription;
  stopLoading: boolean;
  public pageNo: number = 1;

  constructor(
    private notificationService: PushNotificationService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private cmsService: CmsService
  ) { }

  ngOnInit(): void {
    this.router.navigate(['/message-center/notifications']);
    this.getMessageCenterMetadata();
    this.getNotification();
    this.handlePageNumber();
  }

  private getMessageCenterMetadata(): void {
    this.cmsService.getMetadata<MessageCenter>('IH_Adjuster_MessageCenter').subscribe(
    (metaData: MessageCenter) => {
        if (metaData) {
          this.meta = metaData;
        }
    });
  }

  public getNotification(): void {
    if (this.stopLoading) {
      this.routerSubscription.unsubscribe();
      return;
    }
    this.loader = true;
    this.notificationService.getNotification(this.pageNo)
      .then((list: NotificationModel[]) => {
        if (list.length % 50 !== 0) {
          this.stopLoading = true;
        }
        this.loader = false;
        this.notificationList = this.notificationList.concat(list);
        for (const x of this.notificationList) {
          this.unReadCount = x.unReadCount;
        }
      })
      .catch((err: Promise<void>) => { });
  }

  public markNotification(item: NotificationModel): void {
    if (item.isRead !== true) {
      this.unReadCount = this.unReadCount - 1;
    }
    this.showNotification = false;
    this.notificationService.notificationAction(item);
  }

  public handlePageNumber(): void {
    this.routerSubscription = this.activatedRoute.queryParams.subscribe((param: Params) => {
      if (param.page && !this.loader) {
        this.pageNo++;
        this.getNotification();
      }
    });
  }

}
