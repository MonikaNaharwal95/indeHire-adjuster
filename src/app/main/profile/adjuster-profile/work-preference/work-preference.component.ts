import { Component, OnInit, EventEmitter, Input, Output, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { DialogService } from '.././../../../services/dialog.service';
import { Lookups } from '.././../../../services/lookups';
import { LookupService } from '.././../../../services/lookup.service';
import { CmsService } from 'src/app/services/cms.service';
import { ValidatorService } from 'src/app/services/validator.service';
import { AdjusterService } from '.././../../../services/adjuster.service';
import { FormGroup, FormControl, Validators, FormBuilder, FormArray } from '@angular/forms';
import { LookupModel } from 'src/app/models/lookup.model';
import * as _ from 'lodash';
import { SsnDialogComponent } from '../../../forms/ssn-dialog/ssn-dialog.component';
import { InsuranceDetailComponent } from '../../../forms/insurance-detail/insurance-detail.component';
import { LabelSettings } from '@progress/kendo-angular-progressbar';
import { DialogComponent } from '../../../../shared/dialog/dialog.component';
import { ValidationMessage } from '../../../../models/validation-message.metadata';
import { DataChangeService } from 'src/app/services/data-change.service';
import { CarrierViewMetaData } from 'src/app/models/carrier-view.metadata';
import { CarrierViewData } from 'src/app/models/carrier-view.model';
import { FormKeysModel } from 'src/app/models/form-keys.model';
import { DocumentResponse } from '../../../../shared/document-upload/document-reponse.model';
import { Subscription } from 'rxjs';
export interface AdjusterAgreement {
  check: boolean;
  initial: string;
}

export interface StatusArray {
  condition: string;
  msg: string;
  src: string;
  insMsg: string;
}
@Component({
  selector: 'inde-work-preference',
  templateUrl: './work-preference.component.html',
  styleUrls: ['./work-preference.component.scss']
})
export class WorkPreferenceComponent implements OnInit, OnDestroy {
  @ViewChild('pref', { static: false }) private componentWrap: ElementRef;
  @ViewChild('backgroundCheck', { static: true }) public backgroundCheckRef: SsnDialogComponent;
  @ViewChild('npnCheck', { static: true }) public npnCheckRef: SsnDialogComponent;
  @ViewChild('insurance', { static: true }) public insuranceRef: InsuranceDetailComponent;
  // @ViewChild('xactware', { static: true }) public xactwareRef: XactwareDetailsComponent;
  @ViewChild('dialog', { static: true }) public dialogRef: DialogComponent;
  @Input() public metaData: CarrierViewMetaData;
  @Input() public publicView: CarrierViewData;
  @Output() preferenceEvent: EventEmitter<boolean> = new EventEmitter<boolean>();
  public loader: boolean = false;
  public addWorkPreference: FormGroup;
  public agreementSubsciption: Subscription;

  public addPreference: boolean = false;
  public isValAssigned: boolean;
  public autoCorrect: boolean = true;
  public isProfilePic: boolean;
  public validationMsg: ValidationMessage;
  public jobPreferenceLookup: LookupModel[] = [];
  public availabilityLookup: LookupModel[] = [];
  public rateTypeLookup: LookupModel[] = [];
  public imageLoader: boolean;
  public labelprogress: LabelSettings = {
    visible: true,
    format: 'percent',

  };
  public decimals: number = 2;
  public minAvailabilityDate: Date = new Date();
  public profileVisibility: boolean;

  public adjusterAgreementInitial: AdjusterAgreement = {
    check: false,
    initial: ''
  };
  public fileURL: string;

  public statusArray: StatusArray[] = [
    {
      condition: 'VER',
      msg: '',
      src: './../../../../assets/Verified.svg',
      insMsg: ''
    },
    {
      condition: 'PND',
      msg: '',
      src: './../../../../assets/Pending.svg',
      insMsg: ''
    },
    {
      condition: 'AWT',
      msg: '',
      src: './../../../../assets/In_progress.svg',
      insMsg: ''
    },
    {
      condition: 'REJ',
      msg: '',
      src: './../../../../assets/rejected.svg',
      insMsg: ''
    },
    {
      condition: 'CAP',
      msg: '',
      src: './../../../../assets/conditional_verification.svg',
      insMsg: ''
    }
  ];

  constructor(
    private adjService: AdjusterService,
    private dialog: DialogService,
    private ac: FormBuilder,
    private validatorService: ValidatorService,
    private lookupService: LookupService,
    private dataChangeService: DataChangeService
  ) { }

  ngOnInit(): void {
    this.lookupService.getJobTypeLookUp().subscribe((data: LookupModel[]) => {
      this.jobPreferenceLookup = data;
    });

    this.lookupService.getRateTypeLookup().subscribe((data: LookupModel[]) => {
      this.rateTypeLookup = data;
    });

    this.lookupService.getAvailabilityTypeLookUp().subscribe((data: LookupModel[]) => {
      this.availabilityLookup = data;
      // this.availabilityLookup.splice(1, 1);
    });
    // this.profileVisibility = this.publicView.isProfilePublic;
    this.minAvailabilityDate = this.validatorService.setDate(1);
    this.validationMsg = this.validatorService.validationMessage;
    this.statusArrayInitilize();
    this.handleAgreementCheck();
  }

  private handleAgreementCheck(): void {
    this.agreementSubsciption = this.dataChangeService.agreementCheck$.subscribe(
      (status: boolean) => {
        if (status) {
          this.editAcceptAgreement();
        }
      }
    );
  }

  private statusArrayInitilize(): void {
    this.statusArray[0].msg = this.metaData.IH_AdjusterPage_Verified_Msg;
    this.statusArray[1].msg = this.metaData.IH_AdjusterPage_Pending_Msg;
    this.statusArray[2].msg =
      this.publicView.isCrawfordEmployee ? this.metaData.IH_AdjusterPage_BgChkProcess : this.metaData.IH_AdjusterPage_Progress_Msg;
    this.statusArray[3].msg = 'Rejected';
    this.statusArray[4].msg = 'Your information is conditionally approved';

    // Handle insurance msgs
    this.statusArray[0].insMsg = this.metaData.IH_AdjusterPage_InsInfoUpdateSettings;
    this.statusArray[1].insMsg = this.metaData.IH_AdjusterPage_Pending_Msg;
    this.statusArray[2].insMsg = this.metaData.IH_AdjusterPage_Progress_Msg;
    this.statusArray[3].insMsg = this.metaData.IH_AdjusterPage_InsInfoUpdateSettings;
    this.statusArray[4].insMsg = 'Your information is conditionally approved';
  }

  public getpdfDocument(type: string): void {
    this.adjService.getpdfArray(this.publicView.acceptAgreementDocumentID, type, 'agreement.pdf')
      .subscribe((response: ArrayBuffer) => {
        if (type === 'preview') {
          const file = new Blob([response], { type: 'application/pdf' });
          this.fileURL = URL.createObjectURL(file);
          this.dialogRef.showDialog();
        }
      });
  }


  public onAddWorkPreference(): void {
    this.buildAddWorkPreferenceForm();
    // this.availabilityStatusList = Lookups.Availability;
    // this.jobPreferenceList = Lookups.Job_Preference;

    for (const rate of this.publicView.preferredJobTypeView) {
      if (rate.workEnvironmentTypeID === 'WKDK') {
        this.addWorkPreference.controls.hourlyRate.enable();
        this.addWorkPreference.controls.hourlyRate.setValue(+rate.preferredRateTypeView.rateAmount);
        this.addWorkPreference.controls.hourlyRateTypeID.setValue('PPHR');
      }
      if (rate.workEnvironmentTypeID === 'WKFD') {
        this.addWorkPreference.controls.perClaimRate.enable();
        this.addWorkPreference.controls.perClaimRate.enable();
        this.addWorkPreference.controls.perClaimRate.setValue(+rate.preferredRateTypeView.rateAmount);
        this.addWorkPreference.controls.perClaimCommission.setValue(+rate.preferredRateTypeView.ratePercentage);
        this.addWorkPreference.controls.perClaimBasisRateTypeID.setValue('PPCL');
      }
    }

    this.addPreference = true;
    this.initialJobCheck();
    this.jobCheckValidator();
    this.statusValidator();
  }

  private initialJobCheck(): void {
    const ratePerHour = this.addWorkPreference.get('hourlyRate');
    const rateTypeHour = this.addWorkPreference.get('hourlyRateTypeID');
    const ratePerClaimFigure = this.addWorkPreference.get('perClaimRate');
    const ratePerClaimPercent = this.addWorkPreference.get('perClaimCommission');
    const rateTypeClaim = this.addWorkPreference.get('perClaimBasisRateTypeID');
    // This code will check hourly field and enable the rate per hour when desk will get checked.

    if (this.jobPreference.controls[0].value === true) {
      ratePerHour.setValidators([Validators.required]);
      ratePerHour.enable();
      rateTypeHour.setValue('PPHR');
    }
    if (this.jobPreference.controls[0].value === false) {
      ratePerHour.clearValidators();
      rateTypeHour.setValue('');
      ratePerHour.setValue('');
      ratePerHour.disable();
      ratePerHour.setValue(0);
      // rateTypeHour.setValue('0');
    }


    if (this.jobPreference.controls[1].value === true) {
      ratePerClaimFigure.setValidators([Validators.required]);
      ratePerClaimPercent.setValidators([Validators.required]);
      ratePerClaimFigure.enable();
      ratePerClaimPercent.enable();
      rateTypeClaim.setValue('PPCL');
    }
    if (this.jobPreference.controls[1].value === false) {
      ratePerClaimFigure.clearValidators();
      ratePerClaimPercent.clearValidators();
      ratePerClaimFigure.setValue('');
      ratePerClaimPercent.setValue('');
      ratePerClaimFigure.disable();
      ratePerClaimPercent.disable();
      rateTypeClaim.setValue('');
      ratePerClaimFigure.setValue(0);
      ratePerClaimPercent.setValue(0);
    }

  }

  public jobCheckValidator(): void {
    const ratePerHour = this.addWorkPreference.get('hourlyRate');
    const rateTypeHour = this.addWorkPreference.get('hourlyRateTypeID');
    const ratePerClaimFigure = this.addWorkPreference.get('perClaimRate');
    const ratePerClaimPercent = this.addWorkPreference.get('perClaimCommission');
    const rateTypeClaim = this.addWorkPreference.get('perClaimBasisRateTypeID');
    // This code will check hourly field and enable the rate per hour when desk will get checked.
    this.jobPreference.controls[0].valueChanges
      .subscribe((value: boolean) => {
        if (value === true) {
          ratePerHour.setValidators([Validators.required, Validators.max(999.99), Validators.min(1)]);
          ratePerHour.enable();
          rateTypeHour.setValue('PPHR');
        }
        if (value === false) {
          ratePerHour.clearValidators();
          rateTypeHour.setValue('');
          ratePerHour.setValue('');
          ratePerHour.disable();
          ratePerHour.setValue(0);
          ratePerHour.markAsUntouched();
          // rateTypeHour.setValue('0');
        }
      });
    this.jobPreference.controls[1].valueChanges
      .subscribe((value: boolean) => {
        if (value === true) {
          ratePerClaimFigure.setValidators([Validators.required, Validators.max(9999.99), Validators.min(1)]);
          ratePerClaimPercent.setValidators([Validators.required, Validators.max(99), Validators.min(1)]);
          ratePerClaimFigure.enable();
          ratePerClaimPercent.enable();
          rateTypeClaim.setValue('PPCL');
        }
        if (value === false) {
          ratePerClaimFigure.clearValidators();
          ratePerClaimPercent.clearValidators();
          //  ratePerClaimFigure.setValue('');
          //  ratePerClaimPercent.setValue('');
          ratePerClaimFigure.disable();
          ratePerClaimPercent.disable();
          rateTypeClaim.setValue('');
          ratePerClaimFigure.setValue(0);
          ratePerClaimPercent.setValue(0);
          ratePerClaimFigure.markAsUntouched();
          ratePerClaimPercent.markAsUntouched();
        }
      });
  }

  private statusValidator(): void {
    const availabilityTypeID = this.addWorkPreference.get('availabilityTypeID');
    const availablityDate = this.addWorkPreference.get('availablityDate');
    // This code will check per claim field and enable voth the perclaim rate field.
    this.addWorkPreference.controls.availabilityTypeID.valueChanges
      .subscribe((value: string) => {
        if (value === 'ASAV') {
          this.minAvailabilityDate = this.validatorService.setDate(1);
          availablityDate.setValue(null);
          availablityDate.setValidators(null);
          availablityDate.clearValidators();
          availablityDate.updateValueAndValidity();
          //  this.addWorkPreference.markAsUntouched();
        } else {
          availablityDate.setValue('');
          availablityDate.setValidators([Validators.required]);
          this.addWorkPreference.markAsUntouched();
        }
      });
    if (this.addWorkPreference.status === 'INVALID') {
      this.addWorkPreference.markAllAsTouched();
    }
  }

  get jobPreference(): FormArray {
    return this.addWorkPreference.get('jobPreference') as FormArray;
  }

  private buildAddWorkPreferenceForm(): void {
    this.addWorkPreference = this.ac.group({
      jobPreference: new FormArray([]),
      hourlyRateTypeID: new FormControl(''),
      hourlyRate: new FormControl('', [Validators.max(999.99)]),
      perClaimBasisRateTypeID: new FormControl(''),
      perClaimRate: new FormControl(''),
      perClaimCommission: new FormControl(''),
      availabilityTypeID: new FormControl(this.publicView.contractorAvailablityTypeID, [Validators.required]),
      availablityDate: new FormControl(
        (this.publicView.availablityDate == null) ? null : new Date(this.publicView.availablityDate),
      ),
    });
    const workControl = this.addWorkPreference.controls;
    if (this.publicView.contractorTypeMappingViews[0].contractorTypeID === 'CTAD') {
      workControl.jobPreference.setValidators(this.validatorService.minSelectedCheckboxes(1));
    }

    this.addControls();
  }

  private addControls(): void {
    const isDataLength = this.publicView.preferredJobTypeView.length;
    this.jobPreferenceLookup.forEach((o, i) => {
      // let isBool: boolean;
      const isChecked = this.publicView.preferredJobTypeView.length > 0 ?
        this.publicView.preferredJobTypeView.some(val => val.workEnvironmentTypeID === o.key) : false;
      if (isChecked) {
        const control = new FormControl(true);
        this.jobPreference.push(control);
      } else {
        const control = new FormControl(false);
        this.jobPreference.push(control);
      }
    });
    this.isValAssigned = true;
    // this.showForm = true;
    this.addWorkPreference.controls.availablityDate.markAsTouched();
  }

  get keysPreference(): FormKeysModel {
    return this.addWorkPreference.controls;
  }



  public addWorkPreference_func(): void {
    this.dialog.isLoading(true);
    this.addWorkPreference.value.jobPreference =
      this.addWorkPreference.value.jobPreference.map((v, i) => v ? this.jobPreferenceLookup[i].key : null)
        .filter(v => v !== null).join(',');
    this.loader = true;
    this.adjService.postPreference({
      jobPreference: this.addWorkPreference.value.jobPreference,
      hourlyRateTypeID: this.addWorkPreference.value.hourlyRateTypeID,
      hourlyRate: this.addWorkPreference.value.hourlyRate,
      perClaimBasisRateTypeID: this.addWorkPreference.value.perClaimBasisRateTypeID,
      perClaimRate: this.addWorkPreference.value.perClaimRate,
      perClaimCommission: this.addWorkPreference.value.perClaimCommission,
      availabilityTypeID: this.addWorkPreference.value.availabilityTypeID,
      availablityDate: this.validatorService.handleTimezone(this.addWorkPreference.value.availablityDate),
    }).subscribe(
      (data: boolean) => {
        if (data) {
          this.preferenceEvent.emit();
          this.addPreference = false;
          this.isValAssigned = false;
          this.loader = false;
          this.dialog.isLoading(false);
          this.dialog.openSnackbar(`${this.metaData.IH_AdjusterPage_Work_Preferences} ${this.validationMsg.IH_added_Success}`, 'success');
        } else {
          this.loader = false;
          this.dialog.isLoading(false);
        }
      }
    );
  }




  public profileVisibility_func(): void {
    this.dialog.isLoading(true);
    this.adjService.putProfileVisibility({
      isProfilePublic: this.publicView.isProfilePublic,
      isAdminAction: this.publicView.isAdminAction,
      adminID: 0,
    }

    ).subscribe(
      (data: boolean) => {
        if (data) {
          this.preferenceEvent.emit();
          this.loader = false;
          this.dialog.openSnackbar(`${this.metaData.IH_AdjusterPage_Visibilty} ${this.validationMsg.IH_added_Success}`, 'success');
          this.dialog.isLoading(false);
        } else {
          this.loader = false;
          this.dialog.isLoading(false);
        }

      }
    );

  }

  public popupsClicked(event: boolean): void {
    if (event) {
      this.preferenceEvent.emit();
    }
    this.componentWrap.nativeElement.offsetParent.style.zIndex = 0;
  }

  public backgroundCheckClick(): void {
    this.componentWrap.nativeElement.offsetParent.style.zIndex = 2;
    this.backgroundCheckRef.showDialog();
  }


  public npnCheckClick(): void {
    this.componentWrap.nativeElement.offsetParent.style.zIndex = 2;
    this.npnCheckRef.showDialog();
  }

  public insuranceVerificationClick(): void {
    this.componentWrap.nativeElement.offsetParent.style.zIndex = 2;
    this.insuranceRef.showDialog();
  }
  // xactwareClick() {
  //   this.componentWrap.nativeElement.offsetParent.style.zIndex = 2;
  //   this.xactwareRef.showDialog();
  // }


  public editAcceptAgreement(): void {
    this.getpdfDocument('preview');
    this.componentWrap.nativeElement.offsetParent.style.zIndex = 2;
  }

  public saveAdjusterAgreement(): void {
    this.dialog.isLoading(true);
    this.adjService.adjusterAgreement(this.adjusterAgreementInitial.initial).subscribe(
      (data: boolean) => {
        if (data) {
          this.preferenceEvent.emit();
          this.loader = false;
          this.dialogRef.hideDialog();
          this.dialog.openSnackbar(`${this.metaData.IH_AdjusterPage_Accept_Agreement} ${this.validationMsg.IH_added_Success}`, 'success');
          this.dialog.isLoading(false);
        } else {
          this.loader = false;
          this.dialog.isLoading(false);
        }
      }
    );

  }




  public closeDialog(): void {
    this.adjusterAgreementInitial = {
      check: false,
      initial: ''
    };
    this.componentWrap.nativeElement.offsetParent.style.zIndex = 0;
    this.dialogRef.hideDialog();

  }



  public validateImage(event: Event): void {
    if ((<HTMLInputElement>event.target).files.length !== 0) {
      const fileExt = (<HTMLInputElement>event.target).files[0].name.toLowerCase().split('.').pop();
      const fileSize = (<HTMLInputElement>event.target).files[0].size;
      const maxSize = 5 * 1024 * 1024;
      if (fileSize > maxSize) {
        this.dialog.openSnackbar('File size exceed 5MB', 'error');
        (<HTMLInputElement>event.target).value = '';
        return;
      }
      if (fileExt === 'png' || fileExt === 'jpg' || fileExt === 'jpeg') {
        this.uploadImage(event);
      } else {
        this.dialog.openSnackbar('File format not allowed', 'error');
        (<HTMLInputElement>event.target).value = '';
        return;
      }
    }

  }

  public uploadImage(event: Event): void {
    if ((<HTMLInputElement>event.target).files.length !== 0) {
      this.imageLoader = true;
      this.adjService.uploadProfileImage((<HTMLInputElement>event.target).files)
        .subscribe((data: DocumentResponse) => {
          this.imageLoader = false;
          if (data) {
            // this.profileImg = data.documentPath;
            // this.publicView.profileImageID = data.documentID;
            // this.publicView.documentPath = data.documentPath;
            this.dialog.openSnackbar(`
            ${this.metaData.IH_AdjusterPage_Profile_Picture}
            ${this.validationMsg.IH_updated_Success}`, 'success', 1000);
            this.dataChangeService.setProfileImage(data.documentID);
            this.preferenceEvent.emit();
            this.isProfilePic = true;
          }
          this.imageLoader = false;
        });


    }
  }


  public getValueByKey(key: string, arr: LookupModel[]): string {
    if (!key) {
      return '';
    }
    const filterArr = arr.filter((val: LookupModel) => val.key === key);
    if (filterArr.length > 0) { return filterArr[0].value; }
    return '';
  }

  public ngOnDestroy(): void {
    if (this.agreementSubsciption) {
      this.dataChangeService.setAgreementCheck(false);
      this.agreementSubsciption.unsubscribe();
    }
  }

}
