import { Component, OnInit, Input, ViewChild, AfterViewInit } from '@angular/core';
import { AdjusterService } from 'src/app/services/adjuster.service';
import { Router } from '@angular/router';
import { ActionButtonModel } from 'src/app/shared/action-button/action-button.model';
import { ContractListMetaData } from 'src/app/models/contracts.metadata';
import { AssignmentModel, RescheduleModel } from 'src/app/models/contracts.model';
import { LookupModel } from 'src/app/models/lookup.model';
import { DialogComponent } from 'src/app/shared/dialog/dialog.component';
import { ValidatorService } from 'src/app/services/validator.service';
import { DialogService } from 'src/app/services/dialog.service';
import { RescheduleDialogComponent } from '../../forms/reschedule-dialog/reschedule-dialog.component';

@Component({
  selector: 'inde-contract-list',
  templateUrl: './contracts.list.component.html',
  styleUrls: ['./contracts.list.component.scss']
})
export class ContractListComponent implements OnInit {
  @ViewChild('indeRescheduleDialog', { static: false }) openIndeRescheduleDialog: RescheduleDialogComponent;

  @Input()
  set type(type: string) {
    this.routerType = type;
  }
  @Input()
  set status(status: string) {
    this.getContractList(status);
    this.routerStatus = status;
  }
  @Input() contractMetaData: ContractListMetaData;
  @Input() terminateReasonLookup: LookupModel[];
  @Input() public rescheduleReason: string = '';
  @Input() public rescheduleOther: string = '';
  @Input() public rescheduleDate: string = '';
  @Input() public rescheduleStartTime: string = '';
  public assignmentListArray: AssignmentModel[];
  public routerType: string;
  public routerStatus: string;
  public agreementID: number;
  public htmlLoader: boolean;
  public header: string;
  public timezone: string;
  actionMenu: ActionButtonModel[];
  actionMenu1: ActionButtonModel[];

  public reasondefaultItem: {value: string, key: string} = { value: 'Reason', key: ''};
  public tempLoader: boolean = false;
  public rescheduleJobID: number;
  public isRescheduleAndNotRead: boolean;


  constructor(
    public validatorService: ValidatorService,
    private adjusterService: AdjusterService,
    private router: Router,
    private dialogService: DialogService,
    // private timezoneService: TimeZoneService
  ) { }

  public ngOnInit(): void {
  }

  public getContractList(param: string): void {
    this.assignmentListArray = [];
    this.htmlLoader = true;
    const status: 'ASCH' | 'AINP' | 'ACOM' | 'ATER' = this.getStatusCode(param);
    this.adjusterService.getContracts(status).subscribe(
      (res: AssignmentModel[]) => {
        if (res) {
          this.assignmentListArray = res;
        }
        if (this.routerStatus === 'ASCH') {
          this.actionMenu = [
            { actionID: 1, isHidden: false, actionName: this.contractMetaData.IH_Adj_Contract_List_View_Detail },
            { actionID: 2, isHidden: false, actionName: 'Schedule' },
          ];
          this.actionMenu1 = [
            { actionID: 1, isHidden: false, actionName: this.contractMetaData.IH_Adj_Contract_List_View_Detail },
            { actionID: 2, isHidden: false, actionName: 'Reschedule' },
          ];
        } else  if (this.routerStatus === 'AINP' || 'ACOM' || 'ATER' ) {
          this.actionMenu = [
            { actionID: 1, isHidden: false, actionName: this.contractMetaData.IH_Adj_Contract_List_View_Detail },
            { actionID: 2, isHidden: true, actionName: 'Schedule' },
          ];
          this.actionMenu1 = [
            { actionID: 1, isHidden: false, actionName: this.contractMetaData.IH_Adj_Contract_List_View_Detail },
            { actionID: 2, isHidden: true, actionName: 'Reschedule' },
          ];
        }
        this.htmlLoader = false;
      }
    );
  }

  private getStatusCode(route: string): 'ASCH' | 'AINP' | 'ACOM' | 'ATER' {
    const uppercaseRoute = route.toUpperCase();
    if (uppercaseRoute === 'ASCH' || uppercaseRoute === 'AINP' || uppercaseRoute === 'ACOM' || uppercaseRoute === 'ATER') {
      return uppercaseRoute;
    } else {
      this.router.navigate([`contracts/${this.routerType}/ASCH`]);
      return;
    }
  }

  private openJobDetail(id: string, subRoute: string): void {
    this.router.navigate([`contracts/${this.routerType}/${this.routerStatus}/${btoa(id)}/${subRoute}`]);
  }

  public actionButtonClick(ID: number, jobID: string): void {
    switch (ID) {
      case 1:
        this.openJobDetail(jobID, 'overview');
        break;
      case 2:
        for (const item of this.assignmentListArray) {
          if (item.jobID === parseInt(jobID, 10) && item.scheduleDate) {
            this.rescheduleJobID = item.jobID;
            this.timezone = item.timezone;
            this.header = 'Reschedule' + ' ' + '(' + item.assignmentReferenceNo + ')';
            this.openIndeRescheduleDialog.dateSchedule = true;
            this.openIndeRescheduleDialog.isSchedule = false;
             this.openIndeRescheduleDialog.showDialog();
            break;
          } else if (item.jobID === parseInt(jobID, 10) && !item.scheduleDate) {
            this.rescheduleJobID = item.jobID;
            this.timezone = item.timezone;
            this.header = 'Schedule' + ' ' + '(' + item.assignmentReferenceNo + ')';
            this.openIndeRescheduleDialog.dateSchedule = false;
            this.openIndeRescheduleDialog.isSchedule = true;
            this.openIndeRescheduleDialog.showDialog();
            break;
          }
        }
        break;
      case 3:
        this.openJobDetail(jobID, 'work-logs');
        break;
    }

  }


  public rescheduleClick(jobID: string): void {
    if (jobID) {
      for (const item of this.assignmentListArray) {
        if (item.jobID === Number(jobID)) {
          this.rescheduleJobID = item.jobID;
          this.timezone = item.timezone;
          this.header = 'Schedule' + ' ' + '(' + item.assignmentReferenceNo + ')';
        }
      }
      this.openIndeRescheduleDialog.dateSchedule = false;
      this.openIndeRescheduleDialog.isSchedule = true;
    this.openIndeRescheduleDialog.showDialog();
    }
  }

  public postDismissClick(jobID: number): void {
    if (this.isRescheduleAndNotRead === true) {
     return;
    }
    this.isRescheduleAndNotRead = true;
    this.adjusterService.postDismissClick(jobID).subscribe((res: boolean) => {
      this.getContractList('ASCH');
        if (res) {
          this.dialogService.openSnackbar('Response captured successful', 'success');
          this.isRescheduleAndNotRead = false;
        } else {
          this.isRescheduleAndNotRead = false;
        }
      });
  }

  public rescheduleUser(): void {
    this.openIndeRescheduleDialog.hideDialog();
    this.getContractList('ASCH');
  }

  public closeRescheduleDialog(): void {
    this.openIndeRescheduleDialog.hideDialog();
  }

  // for getting values by key
  public getValueByKey(key: string, arr: LookupModel[]): string {
    if (!key) {
      return '';
    }
    const filterArr = arr.filter((val: LookupModel) => val.key === key);
    if (filterArr.length > 0) { return filterArr[0].value; }
    return '';
  }

}
