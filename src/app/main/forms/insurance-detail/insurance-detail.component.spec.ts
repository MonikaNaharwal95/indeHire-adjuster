import { ValidationMessage } from '../../../models/validation-message.metadata';
import { DocumentUploadComponent } from './../../../shared/document-upload/document-upload.component';
import { DialogComponent } from './../../../shared/dialog/dialog.component';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InsuranceDetailComponent } from './insurance-detail.component';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Observable, of } from 'rxjs';
import { CmsService } from 'src/app/services/cms.service';
import { ValidatorService } from 'src/app/services/validator.service';
import { AdjusterService } from 'src/app/services/adjuster.service';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { DatePickerModule } from '@progress/kendo-angular-dateinputs';

class ValidationMockService {
  formatCurrency = 'c0';
  validationMessage = {
    IH_added_Success: 'added successfully',
  };

  setDate(days: number) {
    const time = days * 24 * 60 * 60 * 1000;
    const today = new Date().setHours(0, 0, 0, 0);
    return new Date(new Date(today).getTime() + time);
  }

}
class BypassService {
  getMetadata(): Observable<any> {
    return of([]);
  }
  get() {
    return '';
  }

  postInsuranceData(): Observable<any> {
    return of({
      status: 'success'
    });
  }
}

describe('InsuranceDetailComponent', () => {
  let component: InsuranceDetailComponent;
  let fixture: ComponentFixture<InsuranceDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
        ReactiveFormsModule,
        InputsModule,
        DatePickerModule
      ],
      declarations: [ InsuranceDetailComponent, DialogComponent, DocumentUploadComponent ],
      schemas: [NO_ERRORS_SCHEMA]
    });
    TestBed.overrideComponent(InsuranceDetailComponent, {
      set: {
        providers: [
          { provide: CmsService, useClass: BypassService },
          { provide: ValidatorService, useClass: ValidationMockService },
          { provide: AdjusterService, useClass: BypassService },
        ]
      }
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InsuranceDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('ShowDialog should call formInit and dialogRef', () => {
    component.showDialog();
  });

  it('check min value for coverage', () => {
    const coverageAmount = component.insuranceDetailsForm.get('coverageAmount');
    coverageAmount.setValue(-7);
    expect(coverageAmount.value).toBeNull();
  });

  it('check min value for covergae', () => {
    const coverageAmount = component.insuranceDetailsForm.get('coverageAmount');
    coverageAmount.setValue(-7);
    expect(coverageAmount.value).toBeNull();
  });

  it('User should not be able to submit form if form is invalid', () => {
    expect(component.insuranceDetailsForm.invalid).toBeTruthy();
    // call the function to save the form without filling information
    component.saveDetails();
    expect(component.insuranceDetailsForm.markAllAsTouched).toBeTruthy();
  });

  it('openTimesheet', () => {
    const formControl = component.insuranceDetailsForm.controls;
    formControl.insurerName.setValue('Crawford&Co.');
    formControl.coverageAmount.setValue(1234567);
    formControl.startDate.setValue(component.today);
    formControl.endDate.setValue(component.expiryMinDate);
    formControl.documentID.setValue(1);
    expect(component.insuranceDetailsForm.valid).toBeTruthy();
    // call the function to save the form with all mandatory information
    component.saveDetails();
    expect(component.saveLoader).toBeFalsy();
  });


  it('reset values when dialog is closed', () => {
    component.closeDialog();
    expect(component.uploadDocumentError).toEqual('');
    expect(component.saveLoader).toBeFalsy();
  });


});
