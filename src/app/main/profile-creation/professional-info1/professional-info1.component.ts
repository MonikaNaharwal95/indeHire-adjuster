import { ValidatorService } from 'src/app/services/validator.service';
import { FormGroup, FormArray, FormBuilder, ValidationErrors, FormControl, MinLengthValidator } from '@angular/forms';
import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges, OnChanges } from '@angular/core';
import { PrelimMetaData } from 'src/app/models/prelim.metadata';
import { ExperiencesView, PostProfessional1, PrelimData, PostPrelimModel } from 'src/app/models/prelim-get-data.model';
import { SpecialitiesView } from './../../../models/prelim-get-data.model';
import { LookupModel } from 'src/app/models/lookup.model';
import { AdjusterService } from 'src/app/services/adjuster.service';
import { DialogService } from 'src/app/services/dialog.service';

@Component({
  selector: 'inde-professional-info1',
  templateUrl: './professional-info1.component.html',
  styleUrls: ['./professional-info1.component.scss']
})
export class ProfessionalInfo1Component implements OnInit, OnChanges {

  @Input() experience: ExperiencesView[];
  @Input() speciality: SpecialitiesView[];
  @Input() prelimData: PrelimData;
  @Input() experienceType: LookupModel[];
  @Input() specialityData: LookupModel[];
  @Input() specialitySubType: LookupModel[];
  @Input() yearLookup: LookupModel[];
  @Input() prelimMeta: PrelimMetaData;
  @Output() backToFirst: EventEmitter<Event> = new EventEmitter<Event>();
  @Output() secondSectionDone: EventEmitter<Event> = new EventEmitter();
  public disableAuto: boolean;
  public disableProperty: boolean;
  public loader: boolean = false;
  public autoData: LookupModel[] = [];
  public propertyData: LookupModel[] = [];
  public expVal = {};
  public isSpecialityChecked = {};
  public formProf1: FormGroup;
  public isReady: boolean;
  public expValid: boolean = false;
  public experienceError: boolean = false;

  constructor(
    private fb: FormBuilder,
    private validatorService: ValidatorService,
    private adjusterService: AdjusterService,
    private dialogService: DialogService,
  ) { }

  get contractorType(): string {
    return localStorage.getItem('indehire-ContractorType');
  }

  get autoArray(): FormArray {
    return this.formProf1.get('autoArray') as FormArray;
  }

  get propertyArray(): FormArray {
    return this.formProf1.get('propertyArray') as FormArray;
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.autoData = [];
    this.propertyData = [];
    // This loop will seprate the speciality array into auto & property arrays.
    for (const i of this.specialityData) {
      const modKey = i.key.slice(0, 2);
      if (modKey === 'SA') {
        this.autoData.push(i);
      } else {
        this.propertyData.push(i);
      }
    }
    // This loop will check or uncheck the auto & property checkboxes on the basis of get API.
    for (const x of this.experienceType) {
      if (this.experience) {
        for (const y of this.experience) {
          if (x.key === y.experienceTypeID) {
            this.expVal[x.key] = y.experienceYearTypeID;
            break;
          }
        }
      }
      if (!this.experience || (this.experience && this.experience.length === 0)) {
        this.expVal[x.key] = '';
      }
    }
    this.formInit();
  }

  public ngOnInit(): void {}

  private formInit(): void {
    this.formProf1 = this.fb.group({
      autoArray: new FormArray([]),
      propertyArray: new FormArray([]),
    });
    this.addControls();
  }

  private addControls(): void {
    this.propertyData.forEach((o: LookupModel) => {
      const isChecked = (this.speciality && this.speciality.length > 0) ?
        this.speciality.some((val: SpecialitiesView) => val.specialitiesTypeID === o.key) : false;
      if (isChecked) {
        const control = new FormControl(true);
        this.propertyArray.push(control);
      } else {
        const control = new FormControl(false);
        this.propertyArray.push(control);
      }
    });

    this.autoData.forEach((o: LookupModel) => {
      const isChecked = (this.speciality && this.speciality.length > 0) ?
        this.speciality.some((val: SpecialitiesView) => val.specialitiesTypeID === o.key) : false;
      if (isChecked) {
        const control = new FormControl(true);
        this.autoArray.push(control);
      } else {
        const control = new FormControl(false);
        this.autoArray.push(control);
      }
    });
    this.checkValue();
    this.isReady = true;
  }

  public back(): void {
    localStorage.removeItem('indehire_Prelim');
    localStorage.setItem('indehire_Prelim', '1');
    this.backToFirst.emit();
  }

  public next(): void {
    this.checkValue();
    if (this.expValid === false) {
      this.experienceError = true;
      return;
    } else if (this.formProf1.invalid) {
      this.formProf1.controls.autoArray.markAsDirty();
      this.formProf1.controls.propertyArray.markAsDirty();
      return;
    }
    this.loader = true;
    const selectedAutoArray: string[] = !this.autoArray.disabled ? this.formProf1.value.autoArray.
      map((v: boolean, i: number) => v ? this.autoData[i].key : null).filter((v: boolean) => v !== null) : [];
    const selectedPropertyArray: string[] = !this.propertyArray.disabled ? this.formProf1.value.propertyArray.
      map((v: boolean, i: number) => v ? this.propertyData[i].key : null).filter((v: boolean) => v !== null) : [];
    const tempSpecialityArray = [];
    for (const sub of this.specialitySubType) {
      if (sub.key === 'SSAO') {
        selectedAutoArray.forEach((key: string) => {
          const tempObj = {
            specialitiesTypeID: key,
            specialitiesSubTypeID: sub.key
          };
          tempSpecialityArray.push(tempObj);
        });
      } else {
        selectedPropertyArray.forEach((key: string) => {
          const tempObj = {
            specialitiesTypeID: key,
            specialitiesSubTypeID: sub.key
          };
          tempSpecialityArray.push(tempObj);
        });
      }
    }
    const tempExperience = [];
    for (const x of this.experienceType) {
      tempExperience.push({
        experienceTypeID: x.key,
        experienceYearTypeID: this.expVal[x.key]
      });
    }
    this.prelimData.experiencesView = tempExperience;
    this.prelimData.specialitiesView = tempSpecialityArray;
    const postPrelim: PostPrelimModel = {
      preliminaryStepID: 3,
      ssnNumber: '',
      contractorType: this.prelimData.contractorTypeID,
      industryType: this.prelimData.industryTypeID,
      isFinalSubmit: false,
      jsonData: JSON.stringify(this.prelimData)
    };
    this.adjusterService.postPrelimInfo(postPrelim).subscribe(
      (res: boolean) => {
        if (res) {
          this.dialogService.openSnackbar(
            `${this.prelimMeta.IH_Prelim_Screen_1_Header_2} ${this.validatorService.validationMessage.IH_saved_Success}`, 'success'
          );
          localStorage.removeItem('indehire_Prelim');
          localStorage.setItem('indehire_Prelim', '3');
          this.secondSectionDone.emit();
        }
      }
    );
  }

  public checkValue(): void {
    if (this.contractorType === 'CTAD') {
      this.checkAutoSpeciality();
    }
    this.checkPropertySpeciality();
    this.checkExp();
  }

  private checkAutoSpeciality(): void {
    // This if case will enable or disable the auto speciality checkboxes
    // tslint:disable-next-line: no-string-literal
    if (this.expVal['EADP'] === 'ENON' && this.expVal['EAFA'] === 'ENON') {
      this.formProf1.controls.autoArray.setValidators(null);
      this.autoArray.disable();
      this.autoArray.reset();
    } else {
      this.formProf1.controls.autoArray.setValidators(this.validatorService.minSelectedCheckboxes(1));
      this.autoArray.enable();
    }
  }

  private checkPropertySpeciality(): void {
    // This if case will enable or disable the property speciality checkboxes.
    // tslint:disable-next-line: no-string-literal
    if (this.contractorType === 'CTAD' && this.expVal['EPDA'] === 'ENON' && this.expVal['EPFA'] === 'ENON') {
      this.formProf1.controls.propertyArray.setValidators(null);
      this.propertyArray.disable();
      this.propertyArray.reset();
    } else {
      this.formProf1.controls.propertyArray.setValidators(this.validatorService.minSelectedCheckboxes(1));
      this.propertyArray.enable();
    }
  }

  private checkExp(): void {
    // This if case will check if all the experience type has some value or not.
    const expArray = Object.values(this.expVal);
    const expNullCheck = expArray.length > 0 ?
      expArray.some((val: string) => val === '') : false;
    if (!expNullCheck) {
      this.expValid = true;
    } else {
      this.expValid = false;
    }
  }

}
