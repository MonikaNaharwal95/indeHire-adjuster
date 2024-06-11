import { Injectable } from '@angular/core';
import { FormGroup, ValidatorFn, FormArray, AbstractControl, Validators, ValidationErrors, FormControl, AsyncValidatorFn } from '@angular/forms';
import { ValidationMessage } from '../models/validation-message.metadata';
import { CrudService } from './crud.service';
import { CmsService } from './cms.service';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ValidatorService {

  public emailRegEx: RegExp =
  /^[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*(\.[a-zA-Z]{2,4})$/;
  public passwordRegEx: RegExp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$#@$!%*?&]).{4,}$/;
  public phoneMask: string = '(xyy) yyy-yyyy';
  public phoneRules: { [key: string]: RegExp } = { x: /[2-9]/, y: /[0-9]/ };
  public datePlaceholder: { year: string, month: string, day: string }  = { year: 'yyyy', month: 'mm', day: 'dd' };
  public ssnMask: string = '999-99-9999';
  public einMask: string = 'xx-xxxxxxx';
  public einRules: { [key: string]: RegExp } = { x: /[0-9]/};
  public formatCurrency: string = 'c0';
  public formatZip: string = '0:#.##';
  public zipcodeRegEx: RegExp = /(?!0{5})^[A-Z0-9][0-9]{4}$/;
  public formatPercent: string = '# \\%';
  public emailVerGuard: boolean;
  public validationMessage: ValidationMessage;
  public regexString: RegExp = /^[a-zA-Z '.]*$/;
  public regexNumber: RegExp = /^[a-zA-Z 0-9- .]*$/;
  public regexNumber2: RegExp = /^[a-zA-Z 0-9- '.]*$/;
  public regexAlphanumeric: RegExp = /^[a-zA-Z 0-9- ',.#]*$/;
  // New RegEx added according to updated msgs by Sanket.
  public validation1: RegExp = /^[a-zA-Z '.]*$/; // first name last name.
  public validation2: RegExp = /^[a-zA-Z 0-9- ',.#]*$/; // address line 1-2.
  public validation3: RegExp = /^[a-zA-Z 0-9- .]*$/; // City and certification number.
  public validation4: RegExp = /^[a-zA-Z- .'(),&]*$/; // Tiltle and job title.
  public validation5: RegExp = /^[a-zA-Z 0-9- .]*$/;
  public validation6: RegExp = /^[a-zA-Z 0-9- .',&]*$/; // Company name.
  public validation7: RegExp = /^[a-zA-Z- .'()]*$/; // area of study.

  constructor(
    private cmsService: CmsService
  ) {
    this.getValidationMessages();
  }

  public setDate(days: number): Date {
    const time = days * 24 * 60 * 60 * 1000;
    const today = new Date().setHours(0, 0, 0, 0);
    return new Date(new Date(today).getTime() + time);
  }

  public handleTimezone(date: Date): string {
    if (!date) {return ''; }
    const offset = new Date(date).getTimezoneOffset() * 60 * 1000;
    return new Date(new Date(date).getTime() - offset).toJSON().slice(0, 10);
  }

  public matchControl(group: FormGroup, originalKey: string, confirmatoryKey: string): ValidatorFn {
    const validator: ValidatorFn = () => {
      const originalControl = group.controls[originalKey].value;
      const confirmatoryControl = group.controls[confirmatoryKey].value;
      const error = (originalControl !== confirmatoryControl) ? { mismatch: true } : null;
      return error;
    };
    return validator;
  }

  public minSelectedCheckboxes(min: number = 1): ValidatorFn {
    const validator: ValidatorFn = (formArray: FormArray) => {
      const totalSelected = formArray.controls
        // get a list of checkbox values (boolean)
        .map((control: FormControl) => control.value)
        // total up the number of checked checkboxes
        .reduce((prev: number, next: number) => (next ? prev + next : prev), 0);

      // if the total is not greater than the minimum, return the error message
      return totalSelected >= min ? null : { required: true };
    };
    return validator;
  }

  private getValidationMessages(): void {
    this.cmsService
      .getMetadata<ValidationMessage>('IH_ValidationMessage')
      .subscribe((message: ValidationMessage) => {
        this.validationMessage = message;
      });
  }

}
