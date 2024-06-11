import { Router } from '@angular/router';
import { DialogService } from './../../../services/dialog.service';
import { SoftwareKnowledgeView,
         LanguageTypeView,
         PostProfessional2,
         EquipmentsView,
         PostPrelimModel } from './../../../models/prelim-get-data.model';
import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { PrelimMetaData } from 'src/app/models/prelim.metadata';
import { LookupModel } from 'src/app/models/lookup.model';
import { PrelimData } from 'src/app/models/prelim-get-data.model';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray, ValidatorFn } from '@angular/forms';
import { ValidatorService } from 'src/app/services/validator.service';
import { AdjusterService } from 'src/app/services/adjuster.service';
import { DataChangeService } from 'src/app/services/data-change.service';
import { Options } from 'ng5-slider';
import { ValidationMessage } from 'src/app/models/validation-message.metadata';
import { FormKeysModel } from 'src/app/models/form-keys.model';
import { Subscription } from 'rxjs';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'inde-professional-info2',
  templateUrl: './professional-info2.component.html',
  styleUrls: ['./professional-info2.component.scss']
})
export class ProfessionalInfo2Component implements OnInit, OnDestroy {

  @Input() insuranceLookup: LookupModel[];
  @Input() lossTypeLookup: LookupModel[];
  @Input() softwareLookup: LookupModel[];
  @Input() languageLookup: LookupModel[];
  @Input() equipmentLookup: LookupModel[];
  @Input() proficiencyLookup: LookupModel[];
  @Input() prelimMeta: PrelimMetaData;
  @Input() stateLookup: LookupModel[];
  @Input() prelimData: PrelimData;
  @Output() backToSecond: EventEmitter<Event> = new EventEmitter<Event>();
  public profForm: FormGroup;
  public validationMessage: ValidationMessage;
  public showForm: boolean;
  public softObj = {};
  public langObj = {};
  public softError: string;
  public langError: string;
  public softValid: boolean;
  public langValid: boolean;
  public loader: boolean = false;
  public index: number;
  public travelSlider: Options;
  public equipOther: FormControl = new FormControl('');
  public showEquipments: boolean;
  public showSoftware: boolean;
  public softOther: FormControl;
  public relocateSubscription: Subscription;
  public showStates: boolean;
  public ssnMask: string;
  public ssnRules: { [key: string]: RegExp };
  public isDecrypted: boolean;

  constructor(
    private fb: FormBuilder,
    private adjusterService: AdjusterService,
    private validatorService: ValidatorService,
    private dialogService: DialogService,
    private router: Router,
    private dataChangeService: DataChangeService
  ) {
    this.ssnMask = this.validatorService.ssnMask;
   }

  get contractorType(): string {
    return localStorage.getItem('indehire-ContractorType');
  }

  get insuranceArray(): FormArray {
    return this.profForm.get('insuranceArray') as FormArray;
  }

  get lossTypeArray(): FormArray {
    return this.profForm.get('lossTypeArray') as FormArray;
  }

  get equipmentArray(): FormArray {
    return this.profForm.get('equipmentArray') as FormArray;
  }

  public get keysFirst(): FormKeysModel {
    return this.profForm.controls;
  }

  public ngOnInit(): void {
    this.travelSlider = {
      floor: 10,
      ceil: 100,
      step: 5,
      showSelectionBar: true,
      translate: (value: number): string => {
        return value + ' ' + this.prelimMeta.IH_Prelim_Screen_3_Miles;
      },
    };
    for (const x of this.softwareLookup) {
      this.softObj[x.key] = null;
    }
    for (const y of this.languageLookup) {
      this.langObj[y.key] = null;
    }
    this.formInit();
    this.softOther = new FormControl();
    this.validationMessage = this.validatorService.validationMessage;
    // this.arrayMove(this.insuranceLookup, this.index, -1);
    this.checkValues();
    this.handleValidations();
  }

  private formInit(): void {
    this.profForm = this.fb.group({
      insuranceArray: new FormArray([], this.contractorType === 'CTAD' ? this.validatorService.minSelectedCheckboxes(1) : null),
      lossTypeArray: new FormArray([], this.validatorService.minSelectedCheckboxes(1)),
      equipmentArray: new FormArray([], this.contractorType === 'CTLA' ? this.validatorService.minSelectedCheckboxes(1) : null),
      softwareKnowledges: new FormArray([]),
      languages: new FormArray([]),
      travel: new FormControl(1),
      isWillingRelocate: new FormControl('', Validators.required),
      relocateState: new FormControl(),
      isCrawfordEmployee: new FormControl('', Validators.required),
      ssnNumber: new FormControl('', [Validators.required, Validators.minLength(9), Validators.maxLength(9)]),
    });
    this.addControls();
  }

  private addControls(): void {
    this.lossTypeLookup.forEach((item: LookupModel) => {
      const control = new FormControl(false);
      this.lossTypeArray.push(control);
    });

    this.insuranceLookup.forEach((item: LookupModel) => {
      const control = new FormControl(false);
      this.insuranceArray.push(control);
    });

    this.equipmentLookup.forEach((item: LookupModel) => {
      const control = new FormControl(false);
      this.equipmentArray.push(control);
      if (item.isMandatory) {
        this.equipmentArray.setValidators(this.isLadderChecked());
      }
    });
    this.showForm = true;
  }

  public isLadderChecked(): ValidatorFn {
    const validator: ValidatorFn = (formArray: FormArray) => {
        let mandatoryChecked: number = 0;
        formArray.controls.map((control: FormControl, index: number) => {
          if (control.value && this.equipmentLookup[index].isMandatory) {
            mandatoryChecked = mandatoryChecked + 1;
          }
        });
        // total up the number of checked checkboxes
      return mandatoryChecked === 0 ? { isLadderChecked: true } : null;
    };
    return validator;
  }

  public back(): void {
    this.handleLocalHost('2');
    this.backToSecond.emit();
  }

  public submitInformation(): void {
    if (this.profForm.invalid) {
      this.profForm.controls.insuranceArray.markAsDirty();
      this.profForm.controls.lossTypeArray.markAsDirty();
      this.profForm.controls.equipmentArray.markAsDirty();
      this.profForm.controls.isWillingRelocate.markAsTouched();
      this.profForm.controls.relocateState.markAllAsTouched();
      this.profForm.controls.isCrawfordEmployee.markAsTouched();
      this.profForm.controls.ssnNumber.markAllAsTouched();
      return;
    }
    if (this.equipOther.invalid) {
      this.equipOther.markAllAsTouched();
      return;
    }

    // Software and Language Validation
    this.checkValues();
    if (this.softValid === false) {
      this.softError = this.prelimMeta.IH_Prelim_Screen_3_SelectAllValues;
      return;
    }
    if (this.softOther.invalid) {
      this.softOther.markAllAsTouched();
      return;
    }
    if (this.langValid === false) {
      this.langError = this.prelimMeta.IH_Prelim_Screen_3_SelectLang;
      return;
    }
    this.softError = '';
    this.langError = '';
    // Software and Language Validation
    const selectedlossTypeIds = this.profForm.value.lossTypeArray.map((v: boolean, i: number) => v ? this.lossTypeLookup[i].key : null)
    .filter((v: boolean) => v !== null).join(',');
    const selectedInsuranceIds = this.profForm.getRawValue().insuranceArray.map(
      (v: boolean, i: number) => v ? this.insuranceLookup[i].key : null).filter((v: boolean) => v !== null).join(',');
    const selectedEquipment: EquipmentsView[] = [];
    this.profForm.value.equipmentArray.map((v: boolean, i: number) => {
      if (v) {
        selectedEquipment.push({
          equipmentTypeID: this.equipmentLookup[i].key,
          optionNotes: this.equipmentLookup[i].key === 'EOTH' ? this.equipOther.value : ''
        });
      }
    });
    const tempSoftwareKnowledges: SoftwareKnowledgeView[] = [];
    for (const x of this.softwareLookup) {
      tempSoftwareKnowledges.push({
        softwareKnowledgeTypeID: x.key,
        softwareKnowledgeExpTypeID: this.softObj[x.key],
        optionNotes: x.key === 'SKOT' ? this.softOther.value : ''
      });
    }
    const tempLanguage: LanguageTypeView[] = [];
    for (const x of this.languageLookup) {
      tempLanguage.push({
        languageTypeID: x.key,
        isSpeak: this.langObj[x.key]
      });
    }
    if (tempSoftwareKnowledges.length !== this.softwareLookup.length) {
      this.softValid = true;
      this.softError = this.prelimMeta.IH_Prelim_Screen_3_SelectAllValues;
    } else if (tempLanguage.length !== this.languageLookup.length) {
      this.langValid = true;
      this.langError = this.prelimMeta.IH_Prelim_Screen_3_SelectLang;
    } else {
      this.prelimData.lossTypeExpertiseID = selectedlossTypeIds;
      this.prelimData.insuranceDesignationTypeID = selectedInsuranceIds;
      this.prelimData.softwareKnowledgesView = tempSoftwareKnowledges;
      this.prelimData.languagesView = tempLanguage;
      this.prelimData.equipmentsView = selectedEquipment;
      this.prelimData.travelDistance = this.profForm.value.travel;
      this.prelimData.isWillingRelocate = this.profForm.value.isWillingRelocate;
      this.prelimData.relocateState = this.profForm.value.relocateState ? this.profForm.value.relocateState.toString() : '';
      this.prelimData.isCrawfordEmployee = this.profForm.value.isCrawfordEmployee;
      const postPrelim: PostPrelimModel  = {
        preliminaryStepID: 4,
        ssnNumber: this.profForm.value.ssnNumber,
        contractorType: this.prelimData.contractorTypeID,
        industryType: this.prelimData.industryTypeID,
        isFinalSubmit: true,
        jsonData: JSON.stringify(this.prelimData)
      };
      this.loader = true;
      this.adjusterService.postPrelimInfo(postPrelim).subscribe(
        (res: boolean) => {
          if (res) {
            this.dialogService.openSnackbar(
              `${this.prelimMeta.IH_Prelim_Screen_1_Header_2} ${this.validatorService.validationMessage.IH_saved_Success}`, 'success'
            );
            this.router.navigate(['/contractor-profile']);
            this.dataChangeService.setToolbarPerms();
            this.handleLocalHost('4');
          }
          this.loader = false;
        }
      );
    }

  }

  private handleLocalHost(pageId: string): void {
    localStorage.removeItem('indehire_Prelim');
    localStorage.setItem('indehire_Prelim', pageId);
  }

  public checkValues(): void {
    const softArray = Object.values(this.softObj);
    const softNullCheck = softArray.length > 0 ?
    softArray.some(val => val === null) : false;
    if (!softNullCheck) {
      this.softValid = true;
    } else {
      this.softValid = false;
    }
    const langArray = Object.values(this.langObj);
    const langNullCheck = langArray.length > 0 ?
    langArray.some(value => value === null) : false;
    if (!langNullCheck) {
      this.langValid = true;
    } else {
      this.langValid = false;
    }
    if ( this.softObj['SKOT'] !== 'SKEN') {
      this.softOther.setValidators(Validators.required);
      this.softOther.updateValueAndValidity();
      this.showSoftware = true;
    }
    if ( this.softObj['SKOT'] === 'SKEN') {
      this.softOther.clearValidators();
      this.softOther.updateValueAndValidity();
      this.softOther.reset();
      this.showSoftware = false;
    }
  }

  public validateInsurance(evt): void {
    if (evt.target.id === 'IDNO') {
      if (evt.target.checked) {
        Object.keys(this.insuranceArray.controls).forEach((item, index) => {
          if (index !== this.insuranceArray.length - 1) {
            this.insuranceArray.controls[item].setValue(false);
            this.insuranceArray.controls[item].disable();
          }
        });
      } else {
        Object.keys(this.insuranceArray.controls).forEach((item, index) => {
            this.insuranceArray.controls[item].enable();
        });
      }
    }
  }

  public handleEquipmentOther(event): void {
    if (event.target.id === 'EOTH' && !event.target.checked) {
      this.showEquipments = false;
      this.equipOther.clearValidators();
      this.equipOther.updateValueAndValidity();
      this.equipOther.reset();
      this.equipOther.setValue('');
    }
    if (event.target.id === 'EOTH' && event.target.checked) {
      this.showEquipments = true;
      this.equipOther.setValidators(Validators.required);
      this.equipOther.updateValueAndValidity();
    }
  }

  public handleValidations(): void {
    this.relocateSubscription = this.profForm.get('isWillingRelocate').valueChanges.subscribe(
      (value: boolean) => {
        if (value === true) {
          this.showStates = true;
          this.profForm.controls.relocateState.setValidators(Validators.required);
        } else {
          this.profForm.controls.relocateState.clearValidators();
          this.showStates = false;
          this.profForm.controls.relocateState.reset();
        }
        this.profForm.controls.relocateState.updateValueAndValidity();
      }
    );
  }

  public ngOnDestroy(): void {
    this.relocateSubscription.unsubscribe();
  }

}
