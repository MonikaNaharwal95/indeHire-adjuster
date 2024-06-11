import { Subscription } from 'rxjs';
import { Country } from './../../models/culture-country.model';
import { AuthService } from './../../auth/auth.service';
import { Component, OnInit, Input, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { CmsService } from 'src/app/services/cms.service';
import { MenuItem } from 'src/app/models/menu-items.model';
import { DataChangeService } from 'src/app/services/data-change.service';
import { AdjusterService } from 'src/app/services/adjuster.service';
import { ToolbarMetadata } from './toolbar.metadata';
import { DomSanitizer, SafeHtml, SafeUrl } from '@angular/platform-browser';
import { PushNotificationService } from 'src/app/services/push-notification.service';
import { SignalRService } from 'src/app/services/signal-r.service';
import { NotificationModel } from 'src/app/models/notification.model';
import * as _ from 'lodash';
@Component({
  selector: 'inde-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
})
export class ToolbarComponent implements OnInit, OnDestroy {
  @ViewChild('bell', { static: false }) bell: ElementRef;
  private countries: Country[];
  public profileImageApi: ArrayBuffer;
  public showNotification: boolean;
  public notificationList: NotificationModel[] = [];
  private signalRConnection: signalR.HubConnection;
  public menuItems: MenuItem[] = [];

  public pageId: number;
  public profileImage: string = './../../../assets/default.png';
  public profileApiImage: SafeUrl;
  public metadata: ToolbarMetadata;
  public profileFlag: boolean = true;
  public unReadCount: number;

  private toolbarSubscription: Subscription;
  private profileImageSubscription: Subscription;

  constructor(
    private authService: AuthService,
    private cmsService: CmsService,
    private dataChangeService: DataChangeService,
    private adjusterService: AdjusterService,
    private sanitizer: DomSanitizer,
    private notificationService: PushNotificationService,
    private signalR: SignalRService
  ) {
    document.addEventListener('click', this.handleOutsideClick.bind(this));
    this.pageId = +localStorage.getItem('indehire_Prelim');
    if (this.pageId !== 4) {
      this.toolbarSettings();
    }
  }

  public ngOnInit(): void {
    this.getMetadata();
    this.setupProfileImage();
    this.getProfileImage();
    this.getNotification();
    this.realTimeNotification();
  }

  public readAllUpdateNotification(): void {
    this.notificationService.readAllNotifications().then(
      (success: boolean) => {
        this.getNotification();
      }
    );
  }

  private getMetadata(): void {
    this.cmsService.getMetadata<ToolbarMetadata>('IH_ToolbarPage')
      .subscribe((metadata: ToolbarMetadata) => {
        if (metadata) {
          this.metadata = metadata;
          this.menuItems = [
            {
              link: ['/home-page'],
              title: this.metadata.IH_Toolbar_Home,
            },
            {
              link: ['/jobs'],
              title: this.metadata.IH_Toolbar_Jobs,
            },
            {
              link: ['/contracts'],
              title: this.metadata.IH_Toolbar_Contracts,
            },
            {
              link: ['/qa-report'],
              title: this.metadata.IH_Toolbar_Reports
            }
          ];
        }
      });
  }

  private getProfileImage(): void {
    this.adjusterService.getProfileImage()
      .subscribe((res: ProfileImageResponse) => {
        if (res && res.documentID !== '') {
          this.getImage('preview', res.documentID);
        }
      });
  }

  // Change Image Format Starts
  private getImage(type: string, documentID: string): void {
    this.adjusterService
      .getpdfArray(documentID, type, 'profile')
      .subscribe((response: ArrayBuffer) => {
        if (type === 'preview') {
          this.profileImageApi = response;
          this.sanitize('data:image/jpg;base64,' + this._arrayBufferToBase64(response));
        }
      });
  }

  public _arrayBufferToBase64(buffer: ArrayBuffer): string {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  }

  public sanitize(url: string): void {
    this.profileApiImage = this.sanitizer.bypassSecurityTrustUrl(url);
    this.profileFlag = false;
  }

  // Change Image Format Ends
  private toolbarSettings(): void {
    this.toolbarSubscription = this.dataChangeService.toolbarPerms$.subscribe(
      (toolbar: boolean) => {
        if (toolbar) {
          this.pageId = 4;
        }
      }
    );
  }

  private setupProfileImage(): void {
    this.profileImageSubscription = this.dataChangeService.profileUpdate$.subscribe(
      (image: string) => {
        if (image) {
          this.getImage('preview', image);
        }
      }
    );
  }

  public logoutUser(): void {
    this.authService.logout();
  }

  public getNotification(): void {
    this.notificationService.getNotification()
      .then((list: NotificationModel[]) => {
        this.notificationList = list;
        for (const x of this.notificationList) {
          this.unReadCount = x.unReadCount;
        }
      })
      .catch((err: Promise<void>) => err);
  }

  public markNotification(item: NotificationModel): void {
    if (item.isRead !== true) {
       this.unReadCount = this.unReadCount - 1;
    }
    item.isRead = true;
    this.showNotification = false;
    this.notificationService.notificationAction(item);
  }

  private realTimeNotification(): void {
    this.signalR.establishConnection().then((connection: signalR.HubConnection) => {
      this.signalRConnection = connection;
      this.signalRConnection.on('ReceiveMessage', (item: NotificationModel) => {
        this.notificationList.unshift(item);
        this.unReadCount = this.unReadCount + 1;
        this.notificationList = _.cloneDeep(this.notificationList);
      });
    });
  }

  private handleOutsideClick(event: Event): void {
    if (this.bell && !this.bell.nativeElement.contains(event.target)) {
      this.showNotification = false;
    }
  }

  ngOnDestroy(): void {
    this.profileImageSubscription.unsubscribe();
    this.toolbarSubscription.unsubscribe();
  }

}

export interface ProfileImageResponse {
  id: number;
  documentID: string;
  documentPath?: string;
}
