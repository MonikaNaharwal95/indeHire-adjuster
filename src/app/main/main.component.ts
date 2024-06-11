import { DialogService } from './../services/dialog.service';
import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { NotificationService } from '@progress/kendo-angular-notification';
import { AdjusterService } from '../services/adjuster.service';
import { SignalRService } from '../services/signal-r.service';

@Component({
  selector: 'inde-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  constructor(
    public dialogService: DialogService,
    public signalRService: SignalRService
  ) { }

  public ngOnInit(): void {
    // this.signalRService.establishConnection();
  }

}
