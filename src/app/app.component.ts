import { CmsService } from './services/cms.service';
import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { NotificationService } from '@progress/kendo-angular-notification';
import { DialogService } from './services/dialog.service';
import { SignalRService } from './services/signal-r.service';

@Component({
  selector: 'inde-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'IndeHire-adjuster';
  @ViewChild('template', { read: TemplateRef, static: false })
  public notificationTemplate: TemplateRef<any>;
  public type: string;

  constructor(
    private snackBarService: NotificationService,
    private dialogService: DialogService,
    private content: CmsService
  ) {
    this.content.setUpCms();
  }

  ngOnInit() {
    this.showSnackbar();
    this.showCollapsibleSnackbar();
  }

  private showSnackbar(): void {
    this.dialogService.snackbar$.subscribe(
      config => {
        if (config) {
          this.snackBarService.show({
            content: config.message,
            hideAfter: config.duration,
            closable: false,
            position: { horizontal: 'center', vertical: 'top' },
            animation: { type: 'fade', duration: 400 },
            type: { style: config.theme, icon: true }
          });
        }
      }
    );
  }

  private showCollapsibleSnackbar(): void {
    this.dialogService.collapseSnackbar$.subscribe(
      config => {
        if (config) {
          this.snackBarService.show({
            content: config.message,
            closable: true,
            position: { horizontal: 'center', vertical: 'top' },
            animation: { type: 'fade', duration: 400 },
            type: { style: config.theme, icon: false }
          });
        }
      }
    );
  }
}
