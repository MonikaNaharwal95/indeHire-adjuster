import { Router } from '@angular/router';
import { Component, OnInit, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { DialogComponent } from 'src/app/shared/dialog/dialog.component';
import { AdjusterService } from 'src/app/services/adjuster.service';
import { DialogService } from 'src/app/services/dialog.service';
import { JobsMetadata } from 'src/app/models/jobs.metadata';
import { CmsService } from 'src/app/services/cms.service';
import { CustomFieldsModel } from 'src/app/models/view-job.model';
import { LookupService } from 'src/app/services/lookup.service';
import { LookupModel } from 'src/app/models/lookup.model';
import { JobTypeModel } from 'src/app/models/jobs.model';
import { DataChangeService } from 'src/app/services/data-change.service';

@Component({
  selector: 'inde-job-detail',
  templateUrl: './job-detail.component.html',
  styleUrls: ['./job-detail.component.scss'],
})
export class JobDetailComponent implements OnInit {
  @ViewChild('dialog', { static: true }) public dialogRef: DialogComponent;
  @Input() public jobID: number;
  @Input() public jobTitle: number;
  @Input() public location: string;
  @Output() jobDialogEvent: EventEmitter<boolean> = new EventEmitter<boolean>();
  @ViewChild('acceptAlert', { static: true }) public acceptAlert: DialogComponent;
  @ViewChild('complenessCheck', { static: true }) public complenessCheck: DialogComponent;
  hideEle: boolean = true;
  public jobLoader: boolean;
  public jobDetails: JobTypeModel;
  public schemJson: any;
  public formJson: any;
  public jobConfrmationValue: string;
  public customFields: CustomFieldsModel = {
    requirementTypeID: '',
    propertyTypeID: '',
    propertyTypeValue: '',
    requirementTypeValue: ''
  };
  public jobsMetadata: JobsMetadata;
  public completenessHeader: string;
  public completenessMsg: string;
  public jobStatus: 'JBMT' | 'JBSV' | 'JBSG';

  constructor(
    private adjusterService: AdjusterService,
    private dialogService: DialogService,
    private router: Router,
    private cmsService: CmsService,
    private lookupService: LookupService,
    private dataChangeService: DataChangeService
  ) {
  }

  ngOnInit(): void {
    this.getJobsMetadata();
    this.getPropertyType();
    this.getRequirementType();
  }

  private getJobsMetadata(): void {
    this.cmsService.getMetadata<JobsMetadata>('IH_Adjuster_Jobs').subscribe((metadata: JobsMetadata) => {
      if (metadata) {
        this.jobsMetadata = metadata;
      }
    });
  }
  public openDialog(): void {
    this.jobConfrmationValue = `You are about to accept this assignment. You will need to contact the 
    ${this.jobDetails.inspectionScheduleChoice} to determine an appointment date and time. Click Confirm to accept this Job`;
    this.adjusterService.getJobDetailView(this.jobID).subscribe(
      (res) => {
        if (res) {
          this.schemJson = res.Schema.data.schemaManyVersions[0];
          this.formJson = res.FormData;
          this.customFields.requirementTypeID = res.CustomData.find(item => item.id === 'requirementTypeID').value;
          this.customFields.propertyTypeID = res.CustomData.find(item => item.id === 'lb_property_type').value;
          this.getPropertyType().then(
            (lookupRes: LookupModel[]) => {
              this.customFields.propertyTypeValue = this.getValueByKey(this.customFields.propertyTypeID, lookupRes);
            }
          );
          this.getRequirementType().then(
            (lookupRes: LookupModel[]) => {
              const reqVal = this.getValueByKey(this.customFields.requirementTypeID, lookupRes);
              this.customFields.requirementTypeValue = reqVal ? reqVal : this.customFields.requirementTypeID;
            }
          );
        }
      }
    );
    this.dialogRef.showDialog();
  }

  private getValueByKey(key: string, arr: LookupModel[]): string {
    if (!key) {
      return '';
    }
    const filterArr = arr.filter((val: LookupModel) => val.key === key);
    if (filterArr.length > 0) {
      return filterArr[0].value;
    }
    return '';
  }

  public getPropertyType(): Promise<LookupModel[]> {
    return new Promise((resolve: Function, reject: Function): void => {
      this.lookupService.getPropertyType().subscribe((propertyType: LookupModel[]) => {
        if (propertyType) {
          resolve(propertyType);
        }
        reject(null);
      });
    });
  }

  public getRequirementType(): Promise<LookupModel[]> {
    return new Promise((resolve: Function, reject: Function): void => {
      this.lookupService.getRequirementType().subscribe((reqType: LookupModel[]) => {
        if (reqType) {
          resolve(reqType);
        }
        reject(null);
      });
    });
  }

  public close(): void {
    this.dialogRef.hideDialog();
    this.acceptAlert.hideDialog();
    this.schemJson = null;
    this.formJson = null;
    this.router.navigate(['/jobs']);
  }

  public openAlert(): void {
    const profileID = localStorage.getItem('indehire_profileID');
    this.dialogRef.hideDialog();
    if (this.jobDetails.isAccountPreValid && this.jobDetails.isAgreementAccepted && profileID) {
      this.acceptAlert.showDialog();
      return;
    } else {
      if (!profileID) {
        this.completenessMsg = 'In order to accept this job you must upload your profile image.';
        this.completenessHeader = 'Profile Image Pending';
      } else {
        this.completenessHeader = this.jobDetails.isAgreementAccepted ?
        this.jobsMetadata.IH_AdjusterJobs_PaymtVerfyPending : this.jobsMetadata.IH_AdjusterJobs_AgmtStatusPending;
        this.completenessMsg = this.jobDetails.isAgreementAccepted ?
          this.jobsMetadata.IH_AdjusterJobs_UpdatePaymentTax : this.jobsMetadata.IH_AdjusterJobs_SignCtrctAgmt;
      }
      this.complenessCheck.showDialog();
    }
  }

  public closeAlert(): void {
    this.dialogRef.showDialog();
    this.acceptAlert.hideDialog();
    this.complenessCheck.hideDialog();
  }


  public acceptJob(): void {
    this.jobLoader = true;
    this.adjusterService
      .acceptJob(this.jobID).subscribe((res: boolean) => {
        if (res) {
          this.dialogService.openSnackbar(
            this.jobsMetadata.IH_AdjusterJobs_JobAccepted,
            'success', 1000
          );
          this.close();
          this.jobDialogEvent.emit(true);
        }
        this.jobLoader = false;
      });
  }

  public routeToPayment(): void {
    const profileID = localStorage.getItem('indehire_profileID');
    this.jobLoader = true;
    if (!profileID) {
      this.router.navigate(['/contractor-profile']);
      return;
    }
    if (this.jobDetails.isAgreementAccepted) {
      this.router.navigate(['/settings/payments-taxes']);
    } else {
      this.dataChangeService.setAgreementCheck(true);
      this.router.navigate(['/contractor-profile']);
    }
  }
}
