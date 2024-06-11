import { Component, OnInit, Output, EventEmitter, Input, OnDestroy } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder
} from '@angular/forms';
import {
  PrelimData, PostPrelimModel
} from './../../../models/prelim-get-data.model';
import { AdjusterService } from 'src/app/services/adjuster.service';
import { PrelimMetaData } from 'src/app/models/prelim.metadata';
import { LookupModel, ContractorLookupModel } from './../../../models/lookup.model';
import { ValidatorService } from 'src/app/services/validator.service';
import { DialogService } from 'src/app/services/dialog.service';
import { ValidationMessage } from 'src/app/models/validation-message.metadata';
import { Subscription } from 'rxjs';
import { IdentityResponse } from 'src/app/models/command-api-res.model';
import { FormKeysModel } from 'src/app/models/form-keys.model';

@Component({
  selector: 'inde-personal-info',
  templateUrl: './personal-info.component.html',
  styleUrls: ['./personal-info.component.scss']
})
export class PersonalInfoComponent implements OnInit, OnDestroy {

  public profileForm: FormGroup;
  @Input() prelimData: PrelimData;
  @Input() prelimMeta: PrelimMetaData;
  @Input() refrenceData: LookupModel[];
  @Output() firstSectionDone: EventEmitter<Event> = new EventEmitter<Event>();
  @Input() jobPrefLookup: LookupModel[];
  @Input() stateLookup: LookupModel[];
  @Input() countryLookup: LookupModel[];
  @Input() industryLookup: LookupModel[];
  @Input() callingCodeLookup: LookupModel[];
  @Input() contractorLookup: ContractorLookupModel[];
  public jobTypeError: boolean = false;
  public rateEmptyError: boolean = false;
  public loader: boolean;
  public commentSelected: boolean = false;
  public phoneMask: string = '(xyy) yyy-yyyy';
  public rules: { [key: string]: RegExp } = { x: /[2-9]/, y: /[0-9]/ };
  public isValAssigned: boolean;
  public refrenceDefaultItem: { value: string; key: string };
  public formatPercent: string = '##.## \\%';
  public decimals: number = 2;
  public max: number = 999.99;
  public validationMessage: ValidationMessage;
  public stateDefaultItem: { value: string; key: string };
  public industryDefaultItem: { value: string; key: string };
  public contractorDefaultItem: { value: string; key: string };
  public countryDefaultItem: { value: string; key: string };
  public isContractorChanged: boolean;
  private formSubscription: Subscription;
  private refSubscription: Subscription;
  private phoneSubscription: Subscription;
  private phoneControlSubscription: Subscription;

  constructor(
    private fb: FormBuilder,
    private adjService: AdjusterService,
    public validatorService: ValidatorService,
    private dialogService: DialogService
  ) {}

  public get keysFirst(): FormKeysModel {
    return this.profileForm.controls;
  }

  public ngOnInit(): void {
    this.buildForm();
    this.setUserCategoryValidators();
    this.validationMessage = this.validatorService.validationMessage;
    this.refrenceDefaultItem = { value: this.prelimMeta.IH_Prelim_Screen_1_How_Did_you_Hear, key: ''};
    this.countryDefaultItem = { value: this.prelimMeta.IH_Prelim_Screen_1_Country_Label, key: ''};
    this.stateDefaultItem = { value: this.prelimMeta.IH_Prelim_Screen_1_State_Place_Holder, key: ''};
    this.contractorDefaultItem = { value: this.prelimMeta.IH_Prelim_Screen_1_ServiceType, key: ''};
  }

  private buildForm(): void {
    const stateID = this.prelimData.state ? this.prelimData.state : '';
    const countryID = this.prelimData.countryID ? this.prelimData.countryID : 'US';
    this.profileForm = this.fb.group({
      firstName: new FormControl(this.prelimData.firstName, [
        Validators.required, Validators.pattern(this.validatorService.regexString)
      ]),
      lastName: new FormControl(this.prelimData.lastName, [
        Validators.required, Validators.pattern(this.validatorService.regexString)
      ]),
      email: new FormControl(
        { value: this.prelimData.emailAddress, disabled: true },
        [Validators.required, Validators.email]
      ),
      callingCode: new FormControl({ value: '1', disabled: true }),
      phone: new FormControl(this.prelimData.phoneNumber, [
        Validators.required
      ]),
      adressFirst: new FormControl(this.prelimData.address1, [
        Validators.required, Validators.pattern(this.validatorService.regexAlphanumeric)
      ]),
      adressSecond: new FormControl(this.prelimData.address2, [Validators.pattern(this.validatorService.regexAlphanumeric)]),
      city: new FormControl(this.prelimData.city, [Validators.required, Validators.pattern(this.validatorService.regexNumber)]),
      state: new FormControl(stateID, [Validators.required]),
      country: new FormControl({value: countryID, disabled: true }, [
        Validators.required
      ]),
      zip: new FormControl(this.prelimData.postalCode, [
        Validators.required,
        Validators.minLength(5),
        Validators.pattern(this.validatorService.zipcodeRegEx)
      ]),
      industryTypeID: new FormControl('IINS', [Validators.required]),
      contractorTypeID: new FormControl(this.prelimData.contractorTypeID, [Validators.required]),
      reference: new FormControl(this.prelimData.signupReferenceTypeID, [
        Validators.required
      ]),
      comments: new FormControl(this.prelimData.signupReferenceInfo),
    });
    this.PhoneControlSubscribe();
    this.formSubscription = this.profileForm.valueChanges.subscribe(
      change => {
        if (change.firstName && change.firstName.trim().length === 0 && change.firstName.trim() !== change.firstName) {
          const trimVal = change.firstName.trim();
          this.keysFirst.firstName.setValue(trimVal);
        }
        if (change.lastName && change.lastName.trim().length === 0 && change.lastName.trim() !== change.lastName) {
          const trimVal = change.lastName.trim();
          this.keysFirst.lastName.setValue(trimVal);
        }
        if (change.adressFirst && change.adressFirst.trim().length === 0 && change.adressFirst.trim() !== change.adressFirst) {
          const trimVal = change.adressFirst.trim();
          this.keysFirst.adressFirst.setValue(trimVal);
        }
        if (change.adressSecond && change.adressSecond.trim().length === 0 && change.adressSecond.trim() !== change.adressSecond) {
          const trimVal = change.adressSecond.trim();
          this.keysFirst.adressSecond.setValue(trimVal);
        }
        if (change.city && change.city.trim().length === 0 && change.city.trim() !== change.city) {
          const trimVal = change.city.trim();
          this.keysFirst.city.setValue(trimVal);
        }
        if (change.reference === 'SROR' && change.comments !== null &&
          change.comments.trim().length === 0 && change.comments.trim() !== change.comments) {
          const trimVal = change.comments.trim();
          this.keysFirst.comments.setValue(trimVal);
        }
        if (change.contractorTypeID !== this.prelimData.contractorTypeID) {
          this.isContractorChanged = true;
        } else {
          this.isContractorChanged = false;
        }
      }
    );
  }

  public next(): void {
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }
    this.loader = true;
    const personalData = {
      preliminaryStepID: 1,
      emailAddress: this.prelimData.emailAddress,
      firstName: this.profileForm.value.firstName,
      lastName: this.profileForm.value.lastName,
      phoneNumber: this.profileForm.value.phone,
      address1: this.profileForm.value.adressFirst,
      address2: this.profileForm.value.adressSecond,
      city: this.profileForm.value.city,
      state: this.profileForm.value.state,
      countryID: this.profileForm.getRawValue().country,
      postalCode: this.profileForm.value.zip,
      signupReferenceTypeID: this.profileForm.value.reference,
      signupReferenceInfo: this.profileForm.value.comments,
      industryTypeID: this.profileForm.value.industryTypeID,
      contractorTypeID: this.profileForm.value.contractorTypeID,
      experiencesView: !this.isContractorChanged ? this.prelimData.experiencesView : [],
      specialitiesView: !this.isContractorChanged ? this.prelimData.specialitiesView : []
    };
    const postPrelim: PostPrelimModel  = {
      preliminaryStepID: 2,
      ssnNumber: '',
      contractorType: this.profileForm.value.contractorTypeID,
      industryType: this.profileForm.value.industryTypeID,
      isFinalSubmit: false,
      jsonData: JSON.stringify(personalData)
    };
    this.adjService.postPrelimInfo(postPrelim)
    .subscribe((data: boolean) => {
      if (data) {
        localStorage.removeItem('indehire_Prelim');
        localStorage.setItem('indehire_Prelim', '2');
        this.handleContractorType(postPrelim.contractorType);
        this.dialogService.openSnackbar(
          `${this.prelimMeta.IH_Prelim_Screen_1_Header_1} ${this.validationMessage.IH_saved_Success}`,
          'success'
        );
        this.firstSectionDone.emit();
      }
    });
  }

  public handleContractorType(ID: string): void {
    localStorage.removeItem('indehire-ContractorType');
    localStorage.setItem('indehire-ContractorType', ID);
  }

  // This function is to check differnt value change and enabling differnt field on basis of that.
  private setUserCategoryValidators(): void {
    const commentsControl = this.profileForm.get('comments');
    if (this.prelimData.signupReferenceTypeID === 'SROR') {
      this.commentSelected = true;
      commentsControl.setValue(this.prelimData.signupReferenceInfo);
      this.profileForm.get('comments').enable();
      commentsControl.setValidators([Validators.required]);
    }
    // This is the code to enable the comment section when refrence is other;
    this.refSubscription = this.profileForm.get('reference').valueChanges.subscribe((reference: string) => {
      if (reference === 'SROR') {
        commentsControl.setValidators([Validators.required]);
        this.commentSelected = true;
        commentsControl.enable();
      }
      if (reference !== 'SROR') {
        this.commentSelected = false;
        commentsControl.clearValidators();
        commentsControl.reset();
      }
      commentsControl.updateValueAndValidity();
    });
  }

  public itemDisabled(itemArgs: { dataItem: LookupModel, index: number }): boolean {
    return itemArgs.index === -1;
  }

  // Added by Abhishek For phone number uniqueness
  private PhoneControlSubscribe(): void {
    this.phoneControlSubscription = this.keysFirst.phone.valueChanges.subscribe(
      (phone: string) => {
        if (phone && phone.trim().length === 10) {
          this.isPhoneNumberUnique(phone);
        }
      }
    );
  }

  public isPhoneNumberUnique(phone: string): void {
    if (this.phoneSubscription) {
      this.phoneSubscription.unsubscribe();
    }
    this.loader = true;
    this.phoneSubscription = this.adjService.phoneExist(phone).subscribe(
      (response: IdentityResponse) => {
        if (response) {
          if (!response.isError) {
            if (response.result.status) {
              this.profileForm.controls.phone.setErrors({
                isDuplicate: true
              });
            }
          }
          this.loader = false;
        }
      }
    );
  }
  // Added by Abhishek For phone number uniqueness

  public ngOnDestroy(): void {
    this.formSubscription.unsubscribe();
    this.refSubscription.unsubscribe();
    this.phoneControlSubscription.unsubscribe();
  }

}
