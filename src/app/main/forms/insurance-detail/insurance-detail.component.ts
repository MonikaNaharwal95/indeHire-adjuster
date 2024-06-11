import { Subscription } from 'rxjs';
import { ValidationMessage } from '../../../models/validation-message.metadata';
import { DialogComponent } from './../../../shared/dialog/dialog.component';
import { Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { AdjusterService } from 'src/app/services/adjuster.service';
import { PIIScreenMetaData } from '../../../models/pii-screen.metadata';
import { CmsService } from 'src/app/services/cms.service';
import { DialogService } from 'src/app/services/dialog.service';
import { DocumentUploadComponent } from 'src/app/shared/document-upload/document-upload.component';
import { ValidatorService } from 'src/app/services/validator.service';
import { FormKeysModel } from 'src/app/models/form-keys.model';
import { PostInsurance } from 'src/app/models/adjuster-profile.model';
@Component({
  selector: 'inde-insurance-detail',
  templateUrl: './insurance-detail.component.html',
  styleUrls: ['./insurance-detail.component.scss']
})
export class InsuranceDetailComponent implements OnInit {

  @ViewChild('dialog', { static: true }) public dialogRef: DialogComponent;
  @ViewChild('document', { static: true }) public documentRef: DocumentUploadComponent;
  @Output() insuranceEvent: EventEmitter<boolean> = new EventEmitter<boolean>();
  insuranceDetailsForm: FormGroup;
  formSubscription: Subscription;
  fileName: string;
  uploadDocumentError: string;
  metadata: PIIScreenMetaData;
  validationMessage: ValidationMessage;
  documentPath: string = 'api/FileManager/upload-coi-certificate';
  fileFormat: string[] = ['.jpg', '.png', '.pdf', '.jpeg'];
  saveLoader: boolean;
  today: Date = new Date();
  expiryMinDate: Date = new Date();

  constructor(
    private fb: FormBuilder,
    private cmsService: CmsService,
    private adjusterService: AdjusterService,
    private dialogService: DialogService,
    public validatorService: ValidatorService
  ) { }

  get keys(): FormKeysModel {
    return this.insuranceDetailsForm.controls;
  }

  ngOnInit(): void {
    const date = this.validatorService.setDate(15).setHours(23, 59, 59, 99);
    this.expiryMinDate = this.validatorService.setDate(15);
    this.formInit();
    this.getMetaData();
  }

  private formInit(): void {
    this.insuranceDetailsForm = this.fb.group({
      insurerName: new FormControl('', [Validators.required, Validators.pattern(this.validatorService.validation6)]),
      coverageAmount: new FormControl('', [Validators.required, Validators.min(1), Validators.max(99999999)]),
      startDate: new FormControl('', Validators.required),
      endDate: new FormControl('', Validators.required),
      documentID: new FormControl('', Validators.required),
      files: new FormData()
    });
    this.onFormValueChange();
  }

  private onFormValueChange(): void {
    this.formSubscription = this.insuranceDetailsForm.valueChanges.subscribe(
      (changes: PostInsurance) => {
        if (changes.coverageAmount && changes.coverageAmount < 1 || changes.coverageAmount === 0) {
          this.keys.coverageAmount.setValue(null);
        }
      }
    );
  }

  private getMetaData(): void {
    this.cmsService.getMetadata<PIIScreenMetaData>('IH_PIIScreenPage').subscribe(
    (meta: PIIScreenMetaData) => {
      this.metadata = meta;
      this.validationMessage = this.validatorService.validationMessage;
    });
  }

  public showDialog(): void {
    if (this.metadata) {
      this.formInit();
      this.dialogRef.showDialog();
    }
  }

  public saveDetails(): void {
    if (this.insuranceDetailsForm.invalid) {
      this.insuranceDetailsForm.markAllAsTouched();
      return;
    }
    if (!this.saveLoader) {
      this.saveLoader = true;
      this.keys.insurerName.setValue(this.keys.insurerName.value.trim());
      this.adjusterService.postInsuranceData(this.insuranceDetailsForm.value).subscribe(
        (data: boolean) => {
          this.saveLoader = false;
          if (data) {
            this.insuranceEvent.emit(true);
            this.dialogService.openSnackbar(`${this.metadata.IH_PII_Insurance_Header} ${this.validationMessage.IH_added_Success}`,
             'success');
            this.closeDialog();
            this.formSubscription.unsubscribe();
            this.insuranceDetailsForm.reset();
          }
        });
    }

  }

  public closeDialog(): void {
    this.uploadDocumentError = '';
    this.saveLoader = false;
    this.insuranceDetailsForm.reset();
    this.dialogRef.hideDialog();
    this.insuranceEvent.emit(false);
    this.documentRef.reset();
  }

  public documentResponse(evt: FormData): void {
    if (evt) {
      this.keys.files.setValue(evt);
      this.keys.documentID.setValue(1);
    } else {
      this.keys.files.reset();
      this.keys.documentID.reset();
    }
  }

}
