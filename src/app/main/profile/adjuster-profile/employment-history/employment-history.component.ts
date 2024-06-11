import { Component, OnInit, EventEmitter, Input, Output, ViewChild} from '@angular/core';
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
export interface EditEmployment {
  city: string;
  countryID: string;
  employerName: string;
  employmentExperince: string;
  employmentID: number;
  fromDate: string;
  jobTitle: string;
  notes: string;
  provinceID: string;
  toDate: string;
}

export interface ItemDis {
  dataItem: {
    key: string;
    value: string;
  };
  index: number;
}

export interface DeleteAlertEmp {
  id: number;
  type: number;
}
@Component({
  selector: 'inde-employment-history',
  templateUrl: './employment-history.component.html',
  styleUrls: ['./employment-history.component.scss'],
})
export class EmploymentHistoryComponent implements OnInit {
  @ViewChild('indeAlert', {static: false}) indeAlert;
  @Input() public metaData: CarrierViewMetaData;
  @Input() public publicView: CarrierViewData;
  @Output() employmentEvent: EventEmitter<boolean> = new EventEmitter<boolean>();
  public loader: boolean = false;

  public addWorkExperience: FormGroup;

  public isExpDescExpanded: boolean = false;
  public addWorkExperienceFlag: boolean = false;
  public editWorkExperienceFlag: boolean = false;
  public isEmploymentExpanded: boolean = false;

  public stateList: LookupModel[] = [];
  public countryLookup: LookupModel[] = [];
  public maxexpiryDate: Date;
  private deleteItemAlert: DeleteAlertEmp;
  public minexpiryDate: Date;
  public removeEmployment: string = '';
  public statedefaultItem: { value: string, key: string } = {
    value: '', key: null
  };
  public countryDefaultItem: { value: string; key: string } = {
    value: '',
    key: ''
  };
  public validationMsg: ValidationMessage;
  constructor( private adjService: AdjusterService,
               private cmsService: CmsService,
               private dialog: DialogService,
               private ac: FormBuilder,
               private validatorService: ValidatorService,
               private lookupService: LookupService,

    ) { }

  ngOnInit(): void {
    this.lookupService.getStateLookUp().subscribe((data: LookupModel[]) => {
      this.stateList = data;
    });

    this.lookupService.getCountryLookUp().subscribe((data: LookupModel[]) => {
      this.countryLookup = data;
    });

    this.statedefaultItem.value = this.metaData.IH_AdjusterPage_State;
    this.countryDefaultItem.value = this.metaData.IH_AdjusterPage_Select_Country;

    this.maxexpiryDate = new Date();
    // this.countryDefaultItem.value = this.metaData.IH_AdjusterPage_State;
    this.validationMsg = this.validatorService.validationMessage;
  }
  public onAddEmploymentHistory(): void {
    this.buildWorkExperienceForm();
    this.addWorkExperienceFlag = true;
    this.editWorkExperienceFlag = false;
    this.dateValidator();
   }

    private buildWorkExperienceForm(): void {

      this.addWorkExperience = this.ac.group({
        employerName: new FormControl('', [Validators.required, Validators.pattern(this.validatorService.validation6)]),
        jobtitle: new FormControl('', [Validators.required, Validators.pattern(this.validatorService.validation4 )]),
        notes: new FormControl(''),
        fromDate: new FormControl('', [Validators.required]),
        toDate: new FormControl(''),
        city: new FormControl('', [Validators.required, Validators.pattern(this.validatorService.validation3  )]),
        provinceID: new FormControl('', [Validators.required]),
        countryID: new FormControl({value: 'US', disabled: true}),
      });
      this.addWorkExperience.valueChanges.subscribe(
        change => {
          if (change.employerName.trim().length === 0 && change.employerName.trim() !== change.employerName) {
            const trimVal = change.employerName.trim();
            this.addWorkExperience.controls.employerName.setValue(trimVal);
          }
          if (change.jobtitle.trim().length === 0 && change.jobtitle.trim() !== change.jobtitle) {
            const trimVal = change.jobtitle.trim();
            this.addWorkExperience.controls.jobtitle.setValue(trimVal);
          }
          if (change.notes.trim().length === 0 && change.notes.trim() !== change.notes) {
            const trimVal = change.notes.trim();
            this.addWorkExperience.controls.notes.setValue(trimVal);
          }
          if (change.city.trim().length === 0 && change.city.trim() !== change.city) {
            const trimVal = change.city.trim();
            this.addWorkExperience.controls.city.setValue(trimVal);
          }
        }
      );
    }

    public onEditEmploymentHistory(employmentJSON: EditEmployment): void {
      this.buildEditWorkExperienceForm(employmentJSON);
      this.addWorkExperienceFlag = true;
      this.editWorkExperienceFlag = true;
      // this.stateList = Lookups.States;
      this.dateValidator();
     }

      private buildEditWorkExperienceForm(employmentJSON: EditEmployment): void {
        this.addWorkExperience = this.ac.group({
          employerName: new FormControl(employmentJSON.employerName,
          [Validators.required , Validators.pattern(this.validatorService.validation6)]),
          jobtitle: new FormControl(employmentJSON.jobTitle, [Validators.required, Validators.pattern(this.validatorService.validation4 )]),
          notes: new FormControl(employmentJSON.notes),
          fromDate: new FormControl(new Date(employmentJSON.fromDate), [Validators.required]),
          toDate: new FormControl( (employmentJSON.toDate === null) ? '' : new Date(employmentJSON.toDate)),
          city: new FormControl(employmentJSON.city, [Validators.required, Validators.pattern(this.validatorService.validation3  )]),
          provinceID: new FormControl(employmentJSON.provinceID, [Validators.required]),
          countryID: new FormControl({value: employmentJSON.countryID, disabled: true}, [Validators.required]),
          employmentID: new FormControl(employmentJSON.employmentID, [Validators.required]),
        });
        this.addWorkExperience.valueChanges.subscribe(
          change => {
            if (change.employerName.trim().length === 0 && change.employerName.trim() !== change.employerName) {
              const trimVal = change.employerName.trim();
              this.addWorkExperience.controls.employerName.setValue(trimVal);
            }
            if (change.jobtitle.trim().length === 0 && change.jobtitle.trim() !== change.jobtitle) {
              const trimVal = change.jobtitle.trim();
              this.addWorkExperience.controls.jobtitle.setValue(trimVal);
            }
            if (change.notes.trim().length === 0 && change.notes.trim() !== change.notes) {
              const trimVal = change.notes.trim();
              this.addWorkExperience.controls.notes.setValue(trimVal);
            }
            if (change.city.trim().length === 0 && change.city.trim() !== change.city) {
              const trimVal = change.city.trim();
              this.addWorkExperience.controls.city.setValue(trimVal);
            }
          }
        );
      }

      private dateValidator(): void {
        const expirationDate = this.addWorkExperience.get('toDate');
        const fromDate = this.addWorkExperience.get('fromDate');
        if (fromDate.value === '') {expirationDate.disable(); } else {
           this.minexpiryDate = fromDate.value;
           expirationDate.enable();

        }
        this.addWorkExperience.controls.fromDate.valueChanges
         .subscribe(value => {
           const expdate = new Date(expirationDate.value);
           const startdate = new Date(fromDate.value);
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
              // this.minexpiryDate = fromDate.value;
              expirationDate.markAsTouched();
              expirationDate.setErrors(null);
            }
            if(startdate <= this.maxexpiryDate) {
              this.minexpiryDate = startdate;
            }
          }
        });

        this.addWorkExperience.controls.toDate.valueChanges
        .subscribe(value => {
           const expdate = new Date(expirationDate.value);
           const startdate = new Date(fromDate.value);
           const tempstart = startdate.getFullYear().toString() + this.getMonth(startdate);
           const tempexp = expdate.getFullYear().toString() + this.getMonth(expdate);

           if (expirationDate.value === null) {
            expirationDate.setErrors(null);
           } else if (expirationDate.value !== '' && (parseInt(tempstart, 10) > parseInt(tempexp, 10))) {
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
          return (tempMonth).toString();
        }
      }



    public addWorkExperience_func(): void {
      this.dialog.isLoading(true);
      this.loader = true;
      this.addWorkExperience.controls.toDate.setValue(
        (this.addWorkExperience.controls.toDate.value === null) ? '' : this.addWorkExperience.controls.toDate.value
        );
      if (!this.editWorkExperienceFlag) {
      this.adjService.postEmployment(this.addWorkExperience.getRawValue()).subscribe(
        (data: boolean) => {
          if (data) {
            this.employmentEvent.emit();
            this.loader = false;
            this.cancelEmployment();
            this.dialog.isLoading(false);
            this.dialog.openSnackbar(`
            ${this.metaData.IH_AdjusterPage_Employment_History} ${this.validationMsg.IH_added_Success}`, 'success');
          } else {
            this.dialog.isLoading(false);
            this.loader = false;
          }


        }
      );
      } else {
        this.adjService.putEmployment(this.addWorkExperience.getRawValue()).subscribe(
          (data: boolean) => {
            if (data) {
              this.employmentEvent.emit();
              this.loader = false;
              this.cancelEmployment();
              this.dialog.isLoading(false);
              this.dialog.openSnackbar(`
              ${this.metaData.IH_AdjusterPage_Employment_History} ${this.validationMsg.IH_updated_Success}`, 'success');
            } else {
              this.loader = false;
              this.dialog.isLoading(false);
            }
          }
        );
      }
    }
    get keysWorkExperience(): FormKeysModel {
      return this.addWorkExperience.controls;
    }

    private deleteEmployment(): void {
      this.dialog.isLoading(true);
      this.adjService.deleteEmployment(this.deleteItemAlert.id).subscribe(
        (data: boolean) => {
          if (data) {
            this.employmentEvent.emit();
            this.indeAlert.close();
            this.dialog.isLoading(false);
            this.dialog.openSnackbar(`${this.metaData.IH_AdjusterPage_Employment_History}
              ${this.validationMsg.IH_Validation_Delete_Success}`, 'success');
          } else {
            this.hideAlert();
            this.dialog.isLoading(false);
          }

        }
      );
    }

    public cancelEmployment(): void {
      this.addWorkExperienceFlag = false;
      this.editWorkExperienceFlag = false;
      this.removeEmployment = '';
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
        case 3:
          this.deleteEmployment();
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
    if (filterArr.length > 0) {  return filterArr[0].value; }
    return '';
  }

}
