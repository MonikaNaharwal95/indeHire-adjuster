import { Subscription } from 'rxjs';
import { ValidationMessage } from '../../../models/validation-message.metadata';
import { FormGroup, FormBuilder, FormControl, Validators, ValidationErrors } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { ValidatorService } from 'src/app/services/validator.service';
import { AdjusterService } from 'src/app/services/adjuster.service';
import { AccountSetting, XactnetUpdate, PersonalInfoUpdate } from 'src/app/models/account-setting.model';
import { LookupService } from 'src/app/services/lookup.service';
import { LookupModel } from 'src/app/models/lookup.model';
import { DialogService } from 'src/app/services/dialog.service';
import { CmsService } from 'src/app/services/cms.service';
import { ProfileSettingMetadata } from 'src/app/models/profile-settings.metadata';
import { FormKeysModel } from 'src/app/models/form-keys.model';
import { InsuranceModel } from 'src/app/models/insurance-command.model';

@Component({
  selector: 'inde-account-setting',
  templateUrl: './account-setting.component.html',
  styleUrls: ['./account-setting.component.scss']
})
export class AccountSettingComponent implements OnInit {

  currency: string;
  isEditPersonal: boolean;
  isEditIns: boolean;
  isEditXact: boolean;

  // FormGroups
  personalInfo: FormGroup;
  insuranceForm: FormGroup;
  xactwareForm: FormGroup;
  private formSubscription: Subscription;

  accountDetails: AccountSetting;
  callingCodeLookup: LookupModel[];
  stateLookup: LookupModel[];
  countryLookup: LookupModel[];
  loader: boolean;
  phoneMask: string;
  phoneRules: { [key: string]: RegExp };
  datePlaceholder: { year: string, month: string, day: string };
  saveLoad: boolean;
  fileFormat: string[] = ['.jpg', '.png', '.pdf', '.jpeg'];
  metadata: ProfileSettingMetadata;
  validationMsg: ValidationMessage;
  isDocUploaded: boolean;
  today: Date = new Date();
  expiryMinDate: Date = new Date();

  constructor(
    public validatorService: ValidatorService,
    private fb: FormBuilder,
    private contentService: CmsService,
    private adjusterService: AdjusterService,
    private lookupService: LookupService,
    private dialogService: DialogService
  ) {
    this.currency = this.validatorService.formatCurrency;
    this.phoneMask = this.validatorService.phoneMask;
    this.phoneRules = this.validatorService.phoneRules;
    this.datePlaceholder = this.validatorService.datePlaceholder;
    this.expiryMinDate = this.validatorService.setDate(15);
  }

  get keysPF(): FormKeysModel {
    return this.personalInfo.controls;
  }

  get keysIF(): FormKeysModel {
    return this.insuranceForm.controls;
  }

  get keysXF(): FormKeysModel {
    return this.xactwareForm.controls;
  }

  get maskedPhoneNumber(): string {
    if (this.accountDetails.phoneNumber.length === 10) {
      const format1 = '(' + this.accountDetails.phoneNumber.slice(0, 3) + ') ';
      const format2 = this.accountDetails.phoneNumber.slice(3, 6) + ' ';
      const format3 = this.accountDetails.phoneNumber.slice(6, 10);
      const finalValue = format1 + format2 + format3;
      return finalValue;
    } else {
      return '';
    }
  }

  public ngOnInit(): void {
    this.loader = true;
    this.getMetadata();
    this.getAccountSettings();
  }

  private getMetadata(): void {
    this.contentService.getMetadata<ProfileSettingMetadata>('IH_AccountSettingsPage').subscribe(
      (res: ProfileSettingMetadata) => {
        if (res) {
          this.metadata = res;
          this.validationMsg = this.validatorService.validationMessage;
        }
      }
    );
  }

  private getLookups(): void {
    this.lookupService.getCallingCode().subscribe(
    (codes: LookupModel[]) => {
      if (codes) {
        this.callingCodeLookup = codes;
      }
    });
    this.lookupService.getStateLookUp().subscribe(
    (state: LookupModel[]) => {
      if (state) {
        // const filterState = state.filter((val: LookupModel) => val.key.trim() !== 'US_CA');
        this.stateLookup = state;
        this.accountDetails.provinceName =
          this.stateLookup.find((item: LookupModel) => item.key.trim() === this.accountDetails.provinceID.trim()).value;
      }
    });
    this.lookupService.getCountryLookUp().subscribe(
      (country: LookupModel[]) => {
        if (country) {
          this.countryLookup = country;
          this.accountDetails.countryName =
            this.countryLookup.find((item: LookupModel) => item.key.trim() === this.accountDetails.countryID.trim()).value;
          this.loader = false;
        }
      });
  }

  private getAccountSettings(): void {
    this.adjusterService.getAccountSettings().subscribe(
      (res: AccountSetting) => {
        if (res) {
          this.accountDetails = res;
          this.getLookups();
        }
      }
    );
  }

  public onDocumentUpload(evt: FormData): void {
    if (evt) {
      this.keysIF.files.setValue(evt);
      this.isDocUploaded = true;
    } else {
      this.keysIF.files.reset();
      this.isDocUploaded = false;
    }
  }

  // Form Builders
  public personalInfoFB(): void {
    this.personalInfo = this.fb.group({
      firstName: new FormControl({ value: this.accountDetails.firstName, disabled: true },
        [Validators.required]),
      lastName: new FormControl({ value: this.accountDetails.lastName, disabled: true },
        [Validators.required]),
      contractorPhoneID: new FormControl(this.accountDetails.contractorPhoneID),
      callingCode: new FormControl({ value: '1', disabled: true }),
      phoneNumber: new FormControl(this.accountDetails.phoneNumber, [Validators.required]),
      addressID: new FormControl(this.accountDetails.addressID),
      address1: new FormControl(this.accountDetails.address1,
        [Validators.required, Validators.pattern(this.validatorService.validation2)]),
      address2: new FormControl(this.accountDetails.address2 ? this.accountDetails.address2 : '',
      [Validators.pattern(this.validatorService.validation2)]),
      city: new FormControl(this.accountDetails.city,
        [Validators.required, Validators.pattern(this.validatorService.validation3)]),
      provinceID: new FormControl(this.accountDetails.provinceID, [Validators.required]),
      countryID: new FormControl({ value: this.accountDetails.countryID, disabled: true }, [Validators.required]),
      postalCode: new FormControl(this.accountDetails.postalCode,
        [
          Validators.required, Validators.minLength(5),
          Validators.pattern(this.validatorService.zipcodeRegEx)
        ])
    });
    this.isEditPersonal = true;
    this.isEditXact = false;
    this.isEditIns = false;
    this.formSubscription = this.personalInfo.valueChanges.subscribe(
      (change: PersonalInfoUpdate) => {
        if (change.address1.trim().length === 0 && change.address1.trim() !== change.address1) {
          const trimVal = change.address1.trim();
          this.keysPF.address1.setValue(trimVal);
        }
        if (change.address2.trim().length === 0 && change.address2.trim() !== change.address2) {
          const trimVal = change.address2.trim();
          this.keysPF.address2.setValue(trimVal);
        }
        if (change.city.trim().length === 0 && change.city.trim() !== change.city) {
          const trimVal = change.city.trim();
          this.keysPF.city.setValue(trimVal);
        }
      }
    );
  }

  public insuranceFB(): void {
    this.insuranceForm = this.fb.group({
      insuranceDetailID: new FormControl(this.accountDetails.insuranceDetailID),
      insurerName: new FormControl(this.accountDetails.insurerName,
        [Validators.required, Validators.pattern(this.validatorService.validation6)]
      ),
      coverageAmount: new FormControl(this.accountDetails.coverageAmount,
        [Validators.required, Validators.min(1), Validators.max(99999999)]),
      effectiveDate: new FormControl(new Date(this.accountDetails.effectiveDate), [Validators.required]),
      expirationDate: new FormControl(new Date(this.accountDetails.expirationDate), [Validators.required]),
      // documentID: new FormControl({ this.accountDetails.documentID, disabled: true}, [Validators.required]),
      files: new FormData()
    });
    this.isEditPersonal = false;
    this.isEditXact = false;
    this.isEditIns = true;
    this.formSubscription = this.insuranceForm.valueChanges.subscribe(
      (change: InsuranceModel) => {
        if (change.insurerName.trim().length === 0 && change.insurerName.trim() !== change.insurerName) {
          const trimVal = change.insurerName.trim();
          this.keysIF.insurerName.setValue(trimVal);
        }
        // if (change.expirationDate && change.effectiveDate > change.expirationDate) {
        //   this.keysIF.expirationDate.setValue(change.effectiveDate);
        // }
        if (change.coverageAmount && change.coverageAmount < 1 || change.coverageAmount === 0) {
          this.keysIF.coverageAmount.setValue(null);
        }
      }
    );
  }

  public xactFB(): void {
    this.xactwareForm = this.fb.group({
      xactanetID: new FormControl(this.accountDetails.xactanetID),
      xactanetAddress: new FormControl(this.accountDetails.xactanetAddress, [Validators.required]),
      xactanetCode: new FormControl(this.accountDetails.xactanetCode, [Validators.required])
    });
    this.isEditPersonal = false;
    this.isEditIns = false;
    this.isEditXact = true;
    this.formSubscription = this.xactwareForm.valueChanges.subscribe(
      (change: XactnetUpdate) => {
        if (change.xactanetAddress.trim().length === 0 && change.xactanetAddress.trim() !== change.xactanetAddress) {
          const trimVal = change.xactanetAddress.trim();
          this.keysXF.xactanetAddress.setValue(trimVal);
        }
        if (change.xactanetCode.trim().length === 0 && change.xactanetCode.trim() !== change.xactanetCode) {
          const trimVal = change.xactanetCode.trim();
          this.keysXF.xactanetCode.setValue(trimVal);
        }
      }
    );
  }

  // Form Builders
  public updateProfile(): void {
    if (this.personalInfo.invalid) {
      this.personalInfo.markAllAsTouched();
      return;
    }
    this.saveLoad = true;
    this.keysPF.address1.setValue(this.keysPF.address1.value.trim());
    this.keysPF.address2.setValue(this.keysPF.address2.value.trim());
    this.keysPF.city.setValue(this.keysPF.city.value.trim());
    this.adjusterService.updateProfile(this.personalInfo.getRawValue()).subscribe(
      (res: boolean) => {
        if (res) {
          this.getAccountSettings();
          this.dialogService.openSnackbar(
            `${this.metadata.IH_AccountSettings_Personal_Information} ${this.validationMsg.IH_updated_Success}`,
            'success'
          );
          this.resetForms();
          // this.personalInfo.reset();
        }
        this.saveLoad = false;
      }
    );
  }

  public updateInsurance(): void {
    if (this.insuranceForm.invalid) {
      this.insuranceForm.markAllAsTouched();
      return;
    }
    this.saveLoad = true;
    if (!this.isDocUploaded) {
      const formData: FormData = new FormData();
      formData.append('files', null);
      this.keysIF.files.setValue(formData);
    }
    this.keysIF.insurerName.setValue(this.keysIF.insurerName.value.trim());
    this.adjusterService.updateInsurance(this.insuranceForm.value).subscribe(
      (res: boolean) => {
        if (res) {
          this.getAccountSettings();
          this.dialogService.openSnackbar(
            `${this.metadata.IH_AccountSettings_Insurance_Information} ${this.validationMsg.IH_updated_Success}`,
            'success'
          );
          this.resetForms();
          // this.insuranceForm.reset();
        }
        this.saveLoad = false;
      }
    );
  }

  public addOrUpdateXact(): void {
    const isUpdate = this.keysXF.xactanetID.value ? true : false;
    if (this.xactwareForm.invalid) {
      this.xactwareForm.markAllAsTouched();
      return;
    }
    this.saveLoad = true;
    this.keysXF.xactanetCode.setValue(this.keysXF.xactanetCode.value.trim());
    this.keysXF.xactanetAddress.setValue(this.keysXF.xactanetAddress.value.trim());
    this.adjusterService.addOrUpdateXact(this.xactwareForm.value, isUpdate).subscribe(
      (res: boolean) => {
        if (res) {
          this.getAccountSettings();
          this.isEditXact = false;
          const snackbarMsg = isUpdate ? this.validationMsg.IH_updated_Success : this.validationMsg.IH_added_Success;
          this.dialogService.openSnackbar(
            `${this.metadata.IH_AccountSettings_Xactware} ${snackbarMsg}`,
            'success');
          this.resetForms();
          // this.xactwareForm.reset();
        }
        this.saveLoad = false;
      }
    );
  }

  private resetForms(): void {
    this.isEditPersonal = false;
    this.saveLoad = false;
    this.isEditXact = false;
    this.isEditIns = false;
    this.isDocUploaded = false;
    this.formSubscription.unsubscribe();
  }

  public getpdfDocument(type: string, documentID: string): void {
    this.adjusterService.getpdfArray(documentID, type, 'insuranceCertificate').subscribe((response: ArrayBuffer) => {});
  }

}
