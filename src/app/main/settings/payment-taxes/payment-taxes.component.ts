import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators, AbstractControl } from '@angular/forms';
import { CmsService } from 'src/app/services/cms.service';
import { ValidationMessage } from 'src/app/models/validation-message.metadata';
import { ValidatorService } from 'src/app/services/validator.service';
import { PaymentSettingMetadata } from 'src/app/models/profile-settings.metadata';
import { LookupModel } from 'src/app/models/lookup.model';
import { LookupService } from 'src/app/services/lookup.service';
import { CrudService } from 'src/app/services/crud.service';
import { DialogService } from 'src/app/services/dialog.service';
import { AdjusterService } from 'src/app/services/adjuster.service';
import { Subscription } from 'rxjs';
import { PaymentAndTaxModel } from 'src/app/models/payment-tax.model';
import { FormKeysModel } from 'src/app/models/form-keys.model';
import { Pipe, PipeTransform } from '@angular/core';


@Component({
  selector: 'inde-payment-taxes',
  templateUrl: './payment-taxes.component.html',
  styleUrls: ['./payment-taxes.component.scss']
})
export class PaymentTaxesComponent implements OnInit {

  constructor(
    private fb: FormBuilder,
    private contentService: CmsService,
    private lookupService: LookupService,
    public validatorService: ValidatorService,
    private adjusterService: AdjusterService,
    private dialogService: DialogService,
  ) {
    this.ssnMask = this.validatorService.ssnMask;
    this.einMask = this.validatorService.einMask;
    this.einRules = this.validatorService.einRules;
  }

  get keys(): FormKeysModel {
    return this.taxInfoForm.controls;
  }

  get formValue(): PaymentAndTaxModel {
    return this.taxInfoForm.value;
  }

  public metadata: PaymentSettingMetadata;
  public validationMsg: ValidationMessage;
  public accountTypeLookup: LookupModel[] = [];
  public taxPersonLookup: LookupModel[] = [];
  public isEditTaxInfo: boolean = false;
  public htmlLoader: boolean;
  public ssnMask: string;
  public einMask: string;
  public einRules: { [key: string]: RegExp };
  public taxInfoForm: FormGroup;
  public accountTypeDefault: { value: string, key: string };
  public saveLoad: boolean;
  public paymentMode: string = '';
  public paymentInfo: PaymentAndTaxModel;
  public formSubscription: Subscription;
  public accntMask: string;
  public routingMask: string;
  public isDecrypted_2: boolean = true;
  public isDecrypted: boolean = true;


  masking(number: string): string {
    const visibleDigits = 4;
    const maskedSection = number.slice(0, -visibleDigits);
    const visibleSection = number.slice(-visibleDigits);
    return maskedSection.replace(/./g, 'x') + visibleSection;
  }

  public ngOnInit(): void {
    this.getMetadata();
    this.getLookups();
    this.getPayments();
  }

  private getPayments(): void {
    this.htmlLoader = true;
    this.adjusterService.getPayments().subscribe(
      (pay: PaymentAndTaxModel) => {
        if (pay) {
          this.paymentInfo = pay;
          this.paymentInfo.isNewUser !== true ? this.paymentMode = 'view' : this.paymentMode = 'add';
          // if (this.paymentInfo !== null) {
          //   this.paymentMode = 'view';
          // }
          if (!this.paymentInfo.isNewUser) {
            this.accntMask = this.masking(this.paymentInfo.accountNumber);
            this.routingMask = this.masking(this.paymentInfo.routingNumber);
          }
        }
        this.htmlLoader = false;
      }
    );
  }

  private getLookups(): void {
    this.lookupService.getAccountType().subscribe(
      (lookup: LookupModel[]) => {
        if (lookup) {
          this.accountTypeLookup = lookup;
        }
      }
    );
    this.lookupService.geTaxPersonType().subscribe(
      (lookup: LookupModel[]) => {
        if (lookup) {
          this.taxPersonLookup = lookup;
        }
      }
    );
  }

  private getMetadata(): void {
    this.contentService.getMetadata<PaymentSettingMetadata>('IH_Contractor_Payment').subscribe(
      (res: PaymentSettingMetadata) => {
        if (res) {
          this.metadata = res;
          this.validationMsg = this.validatorService.validationMessage;
          this.accountTypeDefault = { value: this.metadata.IH_Adj_Payment_Select_Account, key: '' };
          this.taxInfoFb();
        }
      }
    );
  }

  private taxInfoFb(): void {
    this.taxInfoForm = this.fb.group({
      isUSCitizen: new FormControl(true, [Validators.required]),
      isUSResident: new FormControl(true, [Validators.required]),
      serviceTypeID: new FormControl('', Validators.required),
      ein: new FormControl(''),
      legalName: new FormControl('', [Validators.required]),
      accountTypeID: new FormControl('', [Validators.required]),
      routingNumber: new FormControl('', [Validators.required, Validators.minLength(9)]),
      confirmRoutingNumber: new FormControl('', [Validators.required, Validators.minLength(9)]),
      accountNumber: new FormControl('', [Validators.required, Validators.minLength(5)]),
      confirmAccountNumber: new FormControl('', [Validators.required, Validators.minLength(5)]),
      terms: new FormControl(false, [Validators.requiredTrue])
    });
    this.keys.confirmRoutingNumber.setValidators([
      Validators.required,
      this.validatorService.matchControl(this.taxInfoForm, 'routingNumber', 'confirmRoutingNumber')
    ]);
    this.keys.confirmAccountNumber.setValidators([
      Validators.required,
      this.validatorService.matchControl(this.taxInfoForm, 'accountNumber', 'confirmAccountNumber')
    ]);
    this.formSubscription = this.taxInfoForm.valueChanges.subscribe(
      (change: PaymentAndTaxModel) => {
        if (change.isUSCitizen || change.isUSResident) {
          this.keys.serviceTypeID.setValidators(Validators.required);
          this.keys.legalName.setValidators(Validators.required);
        }
        if (change.isUSCitizen === false && change.isUSResident === false) {
          this.keys.serviceTypeID.clearValidators();
          this.keys.ein.clearValidators();
          this.keys.legalName.clearValidators();
        }
        if (change.serviceTypeID === 'PTBS') {
          this.keys.ein.setValidators(Validators.required);
        }
      }
    );
  }

  public editTaxInfo(type: string): void {
    if (type !== 'edit') {
      this.taxInfoForm.enable();
      this.taxInfoForm.controls.isUSCitizen.setValue(true);
      this.taxInfoForm.controls.isUSResident.setValue(true);
      this.paymentMode = 'edit';
      this.isEditTaxInfo = true;
    } else {
      this.taxInfoForm.enable();
      this.paymentMode = 'edit';
      this.isEditTaxInfo = true;
      this.taxInfoForm.controls.isUSCitizen.setValue(this.paymentInfo.isUSCitizen);
      this.taxInfoForm.controls.isUSResident.setValue(this.paymentInfo.isUSResident);
      this.taxInfoForm.controls.serviceTypeID.setValue(this.paymentInfo.serviceTypeID);
      this.taxInfoForm.controls.ein.setValue(this.paymentInfo.ein);
      this.taxInfoForm.controls.legalName.setValue(this.paymentInfo.legalName);
      this.taxInfoForm.controls.accountTypeID.setValue(this.paymentInfo.accountTypeID);
      this.taxInfoForm.controls.routingNumber.setValue(this.paymentInfo.routingNumber);
      this.taxInfoForm.controls.confirmRoutingNumber.setValue(this.paymentInfo.routingNumber);
      this.taxInfoForm.controls.accountNumber.setValue(this.paymentInfo.accountNumber);
      this.taxInfoForm.controls.confirmAccountNumber.setValue(this.paymentInfo.accountNumber);
    }
  }

  public cancelEditTaxInfo(): void {
    if (this.paymentInfo.isNewUser !== true) {
      this.isEditTaxInfo = false;
      this.paymentMode = 'view';
    } else {
      this.isEditTaxInfo = false;
      this.paymentMode = 'add';
      this.taxInfoForm.reset();
    }
  }

  public savePaymentDetails(): void {
    if (this.taxInfoForm.invalid) {
      this.taxInfoForm.markAllAsTouched();
      return;
    }
    this.saveLoad = true;
    this.adjusterService.updatePaymentInfo(this.taxInfoForm.value).subscribe(
      (response: boolean) => {
        if (response) {
          this.dialogService.openSnackbar(this.metadata.IH_Adj_Payment_Setting_Payment_Save, 'success');
          this.taxInfoForm.disable();
          this.paymentMode = 'view';
          this.isEditTaxInfo = false;
          this.getPayments();
        }
        this.saveLoad = false;
      }
    );
  }

  public getValueByKey(key: string, arr: LookupModel[]): string {
    if (!key) {
      return '';
    }
    const filterArr = arr.filter((val: LookupModel) => val.key === key);
    if (filterArr.length > 0) { return filterArr[0].value; }
    return '';
  }
  public maskedEinNumber(einNumber: string): string {
    if (einNumber.length === 9) {
      const format1 = einNumber.slice(0, 2) + '-';
      const format2 = einNumber.slice(2, 9);
      const finalValue = format1 + format2;
      return finalValue;
    } else {
      return '';
    }
  }
  // public maskedSsnNumber(ssnNumber: string): string {
  //   if ( ssnNumber.length === 9) {
  //     const format1 = ssnNumber.slice(0, 3) + '-';
  //     const format2 = 'XX-XXXX' + ' ';
  //     const finalValue = format1 + format2;
  //     return finalValue;
  //   } else {
  //     return '';
  //   }
  // }

  public checkFormMismatch(type: 'accountNumber' | 'routingNumber'): void {
    if (type === 'accountNumber') {
      const currentVal = this.formValue.confirmAccountNumber;
      this.keys.confirmAccountNumber.setValue(currentVal);
    } else {
      const currentVal = this.formValue.confirmRoutingNumber;
      this.keys.confirmRoutingNumber.setValue(currentVal);
    }
  }
}
