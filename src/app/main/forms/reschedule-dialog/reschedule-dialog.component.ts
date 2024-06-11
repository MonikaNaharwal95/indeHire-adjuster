import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { RescheduleModel } from 'src/app/models/contracts.model';
import { AdjusterService } from 'src/app/services/adjuster.service';
import { DialogService } from 'src/app/services/dialog.service';
import { ValidatorService } from 'src/app/services/validator.service';
import { DialogComponent } from 'src/app/shared/dialog/dialog.component';

@Component({
  selector: 'inde-reschedule-dialog',
  templateUrl: './reschedule-dialog.component.html',
  styleUrls: ['./reschedule-dialog.component.scss']
})
export class RescheduleDialogComponent implements OnInit {
  @ViewChild('rescheduleDialog', { static: true }) public dialogRef: DialogComponent;
  @Output() negativeButtonClickEvent: EventEmitter<Event> = new EventEmitter<Event>();
  @Output() positiveButtonClickEvent: EventEmitter<Event> = new EventEmitter<Event>();
  @Output() dataSavedEvent: EventEmitter<Event> = new EventEmitter<Event>();
  @Input() public header: string;
  @Input() public rescheduleJobID: number;
  @Input() public isSchedule: boolean = true;
  @Input() public dateSchedule: boolean = true;
  @Input() public timezone: string;
  public dateValue: Date;
  public minDate: Date;
  public maxDate: Date;
  public minStartTime: Date;
  public rescheduleReason: string = '';
  public rescheduleOther: string = '';
  public rescheduleDate: string = '';
  public rescheduleStartTime: string = '';
  public tempLoader: boolean = false;
  public startTime: Date = new Date();
  public rescheduledefaultItem: {value: string, key: string} = { value: 'Reason', key: ''};
  public rescheduledata: RescheduleModel;

  public ReasonLookup: Array<{key: string, value: string}> = [
    {key : '58b47b68d3dd3739add3ef1b', value : 'Onsite Contactschedule changed'},
    {key :  '58b47b68d3dd3739add3ef1f', value : 'Onsite Contact missed the scheduled appointment'},
    {key : '58b47b68d3dd3739add3ef1c', value : 'Onsite Contact is Unreachable'},
    {key : '58b47b68d3dd3739add3ef21', value : 'Asset/materials were not available to complete the Look'},
    {key : '58b47b68d3dd3739add3ef20', value : 'Denied access to Look location/asset'},
    {key : '58b47b68d3dd3739add3ef26', value : 'Inclement Weather'},
    {key : '58b47b68d3dd3739add3ef25', value : 'It was too dark to take good photos'},
    {key : '58b47b68d3dd3739add3ef1a', value : ' My schedule changed'},
    {key : '58b47b68d3dd3739add3ef1e', value : 'I missed the scheduled appointment'},
    {key :  '58b47b68d3dd3739add3ef23', value : 'Return trip: Onsite Contact was missing required information'},
    {key : '58b47b68d3dd3739add3ef22', value : 'Return trip: Capturing information I missed or that was insufficient'},
    {key : '58b47b68d3dd3739add3ef24', value : 'Return trip: Capturing information not originally requested by Client'},
    // { key: '592342274d2db1e13901c47d', value: 'Onsite Contact is Unreachable'},
    // {key : '58b47b68d3dd3739add3ef1c', value: 'Onsite Contact is Unreachable'},
    // {key : 'SOTH', value:'other'}
  ];

  constructor(
    public validatorService: ValidatorService,
    private dialogService: DialogService,
    private adjusterService: AdjusterService,

  ) { }

  public get nativeElement(): DialogComponent {
    return this.dialogRef;
  }

  public ngOnInit(): void {
    this.minDate = this.validatorService.setDate(1);
    this.maxDate = this.validatorService.setDate(30);
    this.startTime = new Date(this.minDate);
  }


  public saveClicked(): void {
    this.tempLoader = true;
    const postRescheduleData: RescheduleModel = {
      jobID: this.rescheduleJobID,
      scheduleDate: this.validatorService.handleTimezone(this.dateValue),
      startTime: this.startTime.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'}),
      reason: this.rescheduleReason,
      otherReason: this.rescheduleOther,
    };
    this.adjusterService.postReschedule(postRescheduleData).subscribe((data:boolean) => {
      if (data) {
        this.dialogService.openSnackbar('Assignment Reschedule Successfull', 'success');
        this.tempLoader = false;
        this.dataSavedEvent.emit();
        this.closeReschedule();
      }
      else {
        this.tempLoader = false;
      }
    })
  }

  public closeReschedule(): void {
    this.startTime = new Date(this.minDate);
    this.dateValue = null;
    this.rescheduleReason = '';
    this.rescheduleOther = '';
  }

  public isMeeting(date: Date): string {
    return 'meeting';
  }

  public showDialog(): void {
    this.dialogRef.showDialog();
  }

  public hideDialog(): void {
    this.dialogRef.hideDialog();
  }

}
