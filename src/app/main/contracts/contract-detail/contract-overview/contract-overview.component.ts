import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AdjusterService } from 'src/app/services/adjuster.service';
import { Subscription } from 'rxjs';
import { DataChangeService } from 'src/app/services/data-change.service';
import { AssignmentModel, TerminateContractModel } from 'src/app/models/contracts.model';
import { ActionButtonModel } from 'src/app/shared/action-button/action-button.model';
import { CmsService } from 'src/app/services/cms.service';
import { ContractDetailMetaData } from 'src/app/models/contracts.metadata';
import { LookupModel } from './../../../../models/lookup.model';
import { DialogService } from 'src/app/services/dialog.service';
import { AlertDialogComponent } from 'src/app/shared/alert-dialog/alert-dialog.component';
import { DialogComponent } from 'src/app/shared/dialog/dialog.component';
import { ValidationMessage } from 'src/app/models/validation-message.metadata';
import { ValidatorService } from 'src/app/services/validator.service';
import { LookupService } from 'src/app/services/lookup.service';
import { RescheduleDialogComponent } from 'src/app/main/forms/reschedule-dialog/reschedule-dialog.component';

@Component({
  selector: 'inde-contract-overview',
  templateUrl: './contract-overview.component.html',
  styleUrls: ['./contract-overview.component.scss'],
})
export class ContractOverviewComponent implements OnInit {

  @ViewChild('cancelAlert', { static: true }) public cancelAlert: DialogComponent;
  // @ViewChild('rescheduleDialog', { static: false }) rescheduleDialog: DialogComponent;
  @ViewChild('indeRescheduleDialog', { static: true }) openIndeRescheduleDialog: RescheduleDialogComponent;


  @Input() public rescheduleReason: string = '';
  @Input() public rescheduleOther: string = '';
  @Input() public rescheduleDate: string = '';
  @Input() public rescheduleStartTime: string = '';
  public idChangeSubscription: Subscription;
  public assignmentDetail: AssignmentModel;
  public contractDetailMetaData: ContractDetailMetaData;
  public loader: boolean = false;
  public showList: boolean;
  public actionMenuVisible: boolean = true;
  public timeSheetError: boolean = false;
  public jobID: string;
  public actionMenu: ActionButtonModel[];
  schemJson: any;
  formJson: any;
  reportHeaderInfo: any;
  rescheduleReportHeader: any;
  public terminatePayload: TerminateContractModel;
  public terminateReasonLookup: LookupModel[] = [];
  public terminating: boolean = false;
  public terminateReason: string = '';
  public terminateOtherReason: string = '';
  public reasondefaultItem: { value: string, key: string };
  public reasonError: boolean = false;
  public validationMsg: ValidationMessage;
  public androidPath: string;
  public iosPath: string;
  public canTerminate: boolean;
  public header: string;
  public tempLoader: boolean = false;
  public timezone: string;
  public rescheduleJobID: number;
  public isCanUserterminate: boolean;

  public rescheduledefaultItem  : {value: string, key: string} = { value: 'Reason', key: ''};

  constructor(
    private cmsService: CmsService,
    private adjusterService: AdjusterService,
    private dataChangeService: DataChangeService,
    private dialogService: DialogService,
    private router: Router,
    private validatorService: ValidatorService,
    private lookupService: LookupService,
  ) {}

  public ngOnInit(): void {
    this.androidPath = this.cmsService.androidLink;
    this.iosPath = this.cmsService.iosLink;
    this.getMetaData();
    this.getLookupData();
    this.getAssignmentId();
  }

  private getMetaData(): void {
    this.cmsService.getMetadata<ContractDetailMetaData>('IH_Adjuster_Contract_Detail').subscribe (
      (metaData: ContractDetailMetaData) => {
        if (metaData) {
        this.contractDetailMetaData = metaData;
        this.actionMenu = [
          { actionID: 1, actionName: metaData.IH_Adj_Contract_Detail_Terminate },
          { actionID: 2, actionName: "Reschedule" },
        ];
        this.reasondefaultItem = { value: this.contractDetailMetaData.IH_Adj_Contract_Detail_SelectReason, key: ''};
        this.validationMsg = this.validatorService.validationMessage;
        }
      }
    );
  }

  private getLookupData(): void {
    this.lookupService.terminateReason().subscribe(
      (lookupData: LookupModel[]) => {
        if (lookupData) {
          this.terminateReasonLookup = lookupData.filter(
            (lookupObj: LookupModel) => lookupObj.userGroupTypeID === 'AD' || lookupObj.userGroupTypeID === '');
        }
      }
    );
  }
  private getAssignmentId(): void {
    this.idChangeSubscription = this.dataChangeService.contractChange$.subscribe(
      (jobId: string) => {
        this.jobID = jobId;
        this.rescheduleJobID = Number(jobId);
        this.getSchemaFormData(+jobId);
      }
    );
  }

  private getSchemaFormData(id: number): void {
    this.adjusterService.getJobDetailView(id).subscribe((response) => {
      if (response) {
        this.schemJson = response.Schema.data.schemaManyVersions[0];
        this.formJson = response.FormData;
        this.reportHeaderInfo = response.ReportHeaderData;

        for (const item of this.reportHeaderInfo) {
          if (item.StatusTypeID === "ASCH") {
            if (item.CanUserTerminate === 1 ) {
              this.actionMenu[0].isHidden = false;
              this.actionMenu[1].isHidden = false;
              this.isCanUserterminate = true;
            } else {
              this.isCanUserterminate = false;
            }
          } else if (
            item.StatusTypeID === "ACOM" || "ANIP" || ("ATER" && this.isCanUserterminate)) {
            this.actionMenu[0].isHidden = false;
            this.actionMenu[1].isHidden = true;
          }
        }
        // if (this.reportHeaderInfo[0].StatusTypeID === 'ASCH' && this.reportHeaderInfo[0].CanUserTerminate) {
        //   this.canTerminate = true;
        // }
      }
    });
  }

  public actionButtonClick(ID: string | number): void {
    switch (ID) {
      case 1:
      this.cancelAlert.showDialog();
      break;
    }
    if (ID === 2) {
      for (let item of this.reportHeaderInfo) {
        this.timezone = item.Timezone;
        this.header = "Reschedule" + " " + "(" + item.AssignmentReferenceNo + ")";
      }
      this.openIndeRescheduleDialog.showDialog();
    }
  }

  public rescheduleUser(): void {
    this.openIndeRescheduleDialog.hideDialog();
    this.getAssignmentId();
  }

  public closeRescheduleDialog(): void {
    this.openIndeRescheduleDialog.hideDialog();
  }

  public cancelAssignment(): void {
    if (this.terminateReason === 'ATOT' && this.terminateOtherReason === '') {
      this.reasonError = true;
      return;
    }
    this.reasonError = false;
    this.terminatePayload = {
      statusTypeID: 'ATER',
      jobID : this.jobID,
      statusReasonTypeID : this.terminateReason,
      statusReason: this.terminateReason === 'ATOT' ? this.terminateOtherReason : '',
    };
    this.terminating = true;
    this.adjusterService.cancelAssignment(this.terminatePayload).subscribe(
      (res: boolean) => {
        if (res) {
          this.dialogService.openSnackbar(this.contractDetailMetaData.IH_Adj_Contract_Detail_AsgmtTerminateSuccess, 'success');
          this.router.navigateByUrl('/contracts/posted-contracts/ATER');
          this.cancelAlert.hideDialog();
        }
        this.terminating = false;
      }
    );
  }

  public hideDialog(): void {
    this.terminateReason = '';
    this.terminateOtherReason = '';
    this.reasonError = false;
    this.terminating = false;
    this.cancelAlert.hideDialog();
  }

  public getValueByKey(key: string, arr: LookupModel[]): string {
    if (!key) {
      return '';
    }
    const filterArr = arr.filter((val: LookupModel) => val.key === key);
    if (filterArr.length > 0) { return filterArr[0].value; }
    return '';
  }

}
