import { ValidatorService } from 'src/app/services/validator.service';
import { DialogComponent } from './../../../shared/dialog/dialog.component';
import { Component, OnInit, ViewChild, Output, EventEmitter, Input } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { AdjusterService } from 'src/app/services/adjuster.service';
import { CmsService } from 'src/app/services/cms.service';
import { PIIScreenMetaData } from '../../../models/pii-screen.metadata';
import { DialogService } from 'src/app/services/dialog.service';
import { ValidationMessage } from 'src/app/models/validation-message.metadata';
import { FormKeysModel } from 'src/app/models/form-keys.model';
@Component({
  selector: 'inde-ssn-dialog',
  templateUrl: './ssn-dialog.component.html',
  styleUrls: ['./ssn-dialog.component.scss']
})
export class SsnDialogComponent implements OnInit {

  @ViewChild('dialog', { static: true }) public dialogRef: DialogComponent;
  ssnForm: FormGroup;
  passwordMask: string = '000-00-0000';
  validationMessage: ValidationMessage;
  ssnMask: string;
  metadata: PIIScreenMetaData;
  isDecrypted: boolean;
  saveLoader: boolean;
  @Input() title: string;
  @Output() ssnEvent: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(
    private fb: FormBuilder,
    private adjusterService: AdjusterService,
    private cmsService: CmsService,
    private dialogService: DialogService,
    private validatorService: ValidatorService
  ) { }

  get keys(): FormKeysModel {
    return this.ssnForm.controls;
  }

  public ngOnInit(): void {
    this.ssnMask = this.validatorService.ssnMask;
    this.getMetaData();
  }

  private formInit(): void {
    this.ssnForm = this.fb.group({
      ss_number: new FormControl('', [Validators.required, Validators.minLength(9), Validators.maxLength(9)]),
      confirmSsn: new FormControl('', [Validators.required, Validators.minLength(9), Validators.maxLength(9)])
    },
    { validator: this.checkPasswords });
  }

  private getMetaData(): void {
    this.cmsService.getMetadata<PIIScreenMetaData>('IH_PIIScreenPage').subscribe(
    (meta: PIIScreenMetaData) => {
      if (meta) {
        this.metadata = meta;
        this.validationMessage = this.validatorService.validationMessage;
      }
    });
  }

  public showDialog(): void {
    if (this.metadata) {
      this.formInit();
      this.dialogRef.showDialog();
    }
  }

  public saveSsn(): void {
    if (this.ssnForm.invalid) {
      this.ssnForm.markAllAsTouched();
      return;
    }
    if (!this.saveLoader) {
      const formdata = {
        ssn: this.keys.ss_number.value
      };
      this.saveLoader = true;
      this.adjusterService.putSsnDetails(formdata).subscribe(
        (data: boolean) => {
          this.saveLoader = false;
          if (data) {
            this.ssnEvent.emit(true);
            this.dialogService.openSnackbar(
              `${this.metadata.IH_PII_Background_Check_SSN} ${this.validationMessage.IH_added_Success}`, 'success');
            this.closeDialog();
          }
      });
    }
  }

  public closeDialog(): void {
    this.ssnForm.reset();
    this.isDecrypted = false;
    this.saveLoader = false;
    this.ssnEvent.emit(false);
    this.dialogRef.hideDialog();
  }

  private checkPasswords(group: FormGroup): void {
    const pass = group.get('ss_number').value;
    const confirmPass = group.get('confirmSsn').value;
    if (pass !== confirmPass) {
      group.get('confirmSsn').setErrors({ NoPassswordMatch: true });
    }
  }

  // Handle Validations
  public ssnKeyPress(key: string): void {
    setTimeout(() => {
      const controlName = this.ssnForm.get(key);
      if (controlName.value.length >= 9) {
        const correctedValue = controlName.value.slice(0, 9);
        this.ssnForm.get(key).setValue(correctedValue);
      }
    }, 5);
  }

}

