import { Component, OnInit, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import {DialogService} from '.././../../../services/dialog.service';

import {Lookups} from '.././../../../services/lookups';

import { LookupService } from '.././../../../services/lookup.service';
import { CmsService } from 'src/app/services/cms.service';
import { ValidatorService } from 'src/app/services/validator.service';
import { AdjusterService } from '.././../../../services/adjuster.service';
import { FormGroup, FormControl, Validators, FormBuilder, FormArray } from '@angular/forms';
import { LookupModel } from 'src/app/models/lookup.model';
import * as _ from 'lodash';
import { ValidationMessage } from '../../../../models/validation-message.metadata';
import { CarrierViewMetaData } from 'src/app/models/carrier-view.metadata';
import { CarrierViewData } from 'src/app/models/carrier-view.model';
import { FormKeysModel } from 'src/app/models/form-keys.model';
export interface EditEducation {
  city: string;
  countryID: string;
  degreeTypeID: string;
  educationID: number;
  endDate: string;
  notes: string;
  provinceID: string;
  schoolName: string;
  specialization: string;
  startDate: string;
}


export interface ItemDis {
  dataItem: {
    key: string;
    value: string;
  };
  index: number;
}

export interface DeleteAlertEdu {
  id: number;
  type: number;
}
@Component({
  selector: 'inde-education',
  templateUrl: './education.component.html',
  styleUrls: ['./education.component.scss']
})
export class EducationComponent implements OnInit {
  @ViewChild('indeAlert', {static: false}) indeAlert;
  @Input() public metaData: CarrierViewMetaData;
  @Input() public publicView: CarrierViewData;
  @Output() educationEvent: EventEmitter<boolean> = new EventEmitter<boolean>();
  public loader: boolean = false;
  public addEducation: FormGroup;

  public isExpDescExpanded: boolean = false;
  public addEducationFlag: boolean = false;
  public editEducationFlag: boolean = false;
  public isEducationExpanded: boolean = false;
  public minexpiryDate: string = '';
  public removeEducation: string = '';
  public maxexpiryDate: Date;
  private deleteItemAlert: DeleteAlertEdu;
  public degreeLookup: LookupModel[] = [];
  public stateList: LookupModel[] = [];
  public countryLookup: LookupModel[] = [];
  public validationMsg: ValidationMessage;
  public statedefaultItem: { value: string, key: string } = { value: '', key: null };
  public degreedefaultItem: { value: string, key: string } = { value: '', key: null };
  public countryDefaultItem: { value: string; key: string } = {value: '', key: ''};
  constructor( private adjService: AdjusterService,
               private cmsService: CmsService,
               private dialog: DialogService,
               private ac: FormBuilder,
               private validatorService: ValidatorService,
               private lookupService: LookupService,
) { }

  ngOnInit(): void {
    this.lookupService.getDegreeTypeLookUp().subscribe((data: LookupModel[]) => {
      this.degreeLookup = data;
    });

    this.lookupService.getStateLookUp().subscribe((data: LookupModel[]) => {
      this.stateList = data;
    });

    this.lookupService.getCountryLookUp().subscribe((data: LookupModel[]) => {
      this.countryLookup = data;
    });

    this.statedefaultItem.value = this.metaData.IH_AdjusterPage_State;
    this.degreedefaultItem.value = this.metaData.IH_AdjusterPage_Select_Degree;
    this.countryDefaultItem.value = this.metaData.IH_AdjusterPage_Select_Country;
    this.maxexpiryDate = new Date();
    this.validationMsg = this.validatorService.validationMessage;
  }

  public onAddEducation(): void {
    this.buildEducationForm();
    this.addEducationFlag = true;
    this.editEducationFlag = false;
    this.dateValidator();

  }

  private buildEducationForm(): void {
    this.addEducation = this.ac.group({
      schoolName: new FormControl('', [Validators.required, Validators.pattern(this.validatorService.validation6 )]),
      startDate: new FormControl('', [Validators.required]),
      endDate: new FormControl('', [Validators.required]),
      degreeTypeID: new FormControl('', [Validators.required]),
      specialization: new FormControl('', [Validators.required, Validators.pattern(this.validatorService.validation7 )]),
      notes: new FormControl(''),
      city: new FormControl('', [Validators.required, Validators.pattern(this.validatorService.validation3  )]),
      provinceID: new FormControl('', [Validators.required]),
      countryID: new FormControl({value: 'US', disabled: true}),
    });
    this.addEducation.valueChanges.subscribe(
      change => {
        if (change.schoolName.trim().length === 0 && change.schoolName.trim() !== change.schoolName) {
          const trimVal = change.schoolName.trim();
          this.addEducation.controls.schoolName.setValue(trimVal);
        }
        if (change.specialization.trim().length === 0 && change.specialization.trim() !== change.specialization) {
          const trimVal = change.specialization.trim();
          this.addEducation.controls.specialization.setValue(trimVal);
        }
        if (change.notes.trim().length === 0 && change.notes.trim() !== change.notes) {
          const trimVal = change.notes.trim();
          this.addEducation.controls.notes.setValue(trimVal);
        }
        if (change.city.trim().length === 0 && change.city.trim() !== change.city) {
          const trimVal = change.city.trim();
          this.addEducation.controls.city.setValue(trimVal);
        }
      }
    );
  }


  public onEditEducation(educationJSON: EditEducation): void {
    this.buildEditEducationForm(educationJSON);
    this.addEducationFlag = true;
    this.editEducationFlag = true;
    // this.stateList = Lookups.States;
    this.dateValidator();
  }

  private buildEditEducationForm(educationJSON: EditEducation): void {
    this.addEducation = this.ac.group({
      schoolName: new FormControl(educationJSON.schoolName, [Validators.required, Validators.pattern(this.validatorService.validation6)]),
      startDate: new FormControl(new Date(educationJSON.startDate), [Validators.required]),
      endDate: new FormControl(new Date(educationJSON.endDate), [Validators.required]),
      degreeTypeID: new FormControl(educationJSON.degreeTypeID, [Validators.required]),
      specialization: new FormControl(educationJSON.specialization,
        [Validators.required, Validators.pattern(this.validatorService.validation7)]),
      notes: new FormControl(educationJSON.notes),
      city: new FormControl(educationJSON.city, [Validators.required, Validators.pattern(this.validatorService.validation3)]),
      provinceID: new FormControl(educationJSON.provinceID, [Validators.required]),
      countryID: new FormControl({value: educationJSON.countryID, disabled: true}, [Validators.required]),
      educationID: new FormControl(educationJSON.educationID, [Validators.required]),
    });
    this.addEducation.valueChanges.subscribe(
      change => {
        if (change.schoolName.trim().length === 0 && change.schoolName.trim() !== change.schoolName) {
          const trimVal = change.schoolName.trim();
          this.addEducation.controls.schoolName.setValue(trimVal);
        }
        if (change.specialization.trim().length === 0 && change.specialization.trim() !== change.specialization) {
          const trimVal = change.specialization.trim();
          this.addEducation.controls.specialization.setValue(trimVal);
        }
        if (change.notes.trim().length === 0 && change.notes.trim() !== change.notes) {
          const trimVal = change.notes.trim();
          this.addEducation.controls.notes.setValue(trimVal);
        }
        if (change.city.trim().length === 0 && change.city.trim() !== change.city) {
          const trimVal = change.city.trim();
          this.addEducation.controls.city.setValue(trimVal);
        }
      }
    );
  }




  private dateValidator(): void {
    const expirationDate = this.addEducation.get('endDate');
    const startDate = this.addEducation.get('startDate');
    if (startDate.value === '') {expirationDate.disable(); } else {
      this.minexpiryDate = startDate.value;
      // this.validatorService.handleTimezone(data.expirationDate);
      expirationDate.enable();
    }
    this.addEducation.controls.startDate.valueChanges
     .subscribe(value => {
       const expdate = new Date(expirationDate.value);
       const startdate = new Date(startDate.value);
      //  this.minexpiryDate = startDate.value;
       const tempstart = startdate.getFullYear().toString() + this.getMonth(startdate);
       const tempexp = expdate.getFullYear().toString() + this.getMonth(expdate);
       if (value === null) {
        expirationDate.disable();
        expirationDate.setValue('');
        expirationDate.markAsUntouched();
       } else {
         expirationDate.enable();
         if (expirationDate.value !== '' && (parseInt(tempstart, 10) > parseInt(tempexp, 10))) {
           expirationDate.markAsTouched();
           expirationDate.setErrors({
            minError: true
          });
         } else if ((parseInt(tempstart, 10) === parseInt(tempexp, 10))) {
          expirationDate.markAsTouched();
          expirationDate.setErrors(null);
        }
        if(startdate <= this.maxexpiryDate) {
          this.minexpiryDate = startDate.value;
        }
        }
    });

    this.addEducation.controls.endDate.valueChanges
    .subscribe(value => {
        const expdate = new Date(expirationDate.value);
        const startdate = new Date(startDate.value);
        const tempstart = startdate.getFullYear().toString() + this.getMonth(startdate);
        const tempexp = expdate.getFullYear().toString() + this.getMonth(expdate);
        if (expirationDate.value !== '' && (parseInt(tempstart, 10) > parseInt(tempexp, 10))) {
          expirationDate.markAsTouched();
          expirationDate.setErrors({
           minError: true
         });
        } else if ((parseInt(tempstart, 10) === parseInt(tempexp, 10))) {
          expirationDate.markAsTouched();
          expirationDate.setErrors(null);
        }
   });
  }

   private getMonth(month: Date): string {
        const tempMonth = month.getMonth() + 1;
        if (tempMonth.toString().length < 2) {
          return '0' + (tempMonth );
        } else {
          return (tempMonth ).toString();
        }
      }

  get keysEducation(): FormKeysModel {
    return this.addEducation.controls;
  }


  public addEducation_func(): void {
    this.dialog.isLoading(true);
    this.loader = true;
    if (!this.editEducationFlag) {
    this.adjService.postEducation(this.addEducation.getRawValue()).subscribe(
      (data: boolean) => {
        if (data) {
          this.educationEvent.emit();
          this.cancelEducation();
          this.loader = false;
          this.dialog.isLoading(false);
          this.dialog.openSnackbar(`${this.metaData.IH_AdjusterPage_Education} ${this.validationMsg.IH_added_Success}`, 'success');
        } else {
          this.dialog.isLoading(false);
          this.loader = false;
        }


      }
    );
    } else {
      this.adjService.putEducation(this.addEducation.getRawValue()).subscribe(
        (data: boolean) => {
          if (data) {
            this.educationEvent.emit();
            this.cancelEducation();
            this.loader = false;
            this.dialog.isLoading(false);
            this.dialog.openSnackbar(`${this.metaData.IH_AdjusterPage_Education} ${this.validationMsg.IH_updated_Success}`, 'success');
          } else {
              this.loader = false;
              this.dialog.isLoading(false);
          }
        }
      );
    }
  }

  private deleteEducation(): void {
    this.dialog.isLoading(true);
    this.adjService.deleteEducation(this.deleteItemAlert.id).subscribe(
      (data: boolean) => {
        if (data) {
        this.educationEvent.emit();
        this.indeAlert.close();
        this.dialog.isLoading(false);
        this.dialog.openSnackbar(`${this.metaData.IH_AdjusterPage_Education}
                                  ${this.validationMsg.IH_Validation_Delete_Success}`, 'success');
        } else {
          this.hideAlert();
          this.dialog.isLoading(false);
        }
      }
    );
  }


public cancelEducation(): void {
  this.addEducationFlag = false;
  this.editEducationFlag = false;
  this.removeEducation = '';
}
public showAlertBox(ids: number, key2: number): void {
    this.indeAlert.show();
    this.deleteItemAlert = {
      id: ids,
      type: key2
    };
  }

 public deleteRecord(): void {
    switch (this.deleteItemAlert.type) {
      case 2:
        this.deleteEducation();
        break;

    }
  }

 public hideAlert(): void {
    this.indeAlert.close();
  }

  public itemDisabled(itemArgs: ItemDis): boolean {
    return itemArgs.index === -1;
   }

   public getValueByKey(key: string, arr: LookupModel[]): string {
    if (!key) {
      return '';
    }
    const filterArr = arr.filter((val: LookupModel) => val.key === key);
    if (filterArr.length > 0)  {return filterArr[0].value; }
    return '';
  }
}
