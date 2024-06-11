import { ValidationMockService } from './../../../services/mock-validator';
import { AdjusterService } from './../../../services/adjuster.service';
import { DialogComponent } from './../../../shared/dialog/dialog.component';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SsnDialogComponent } from './ssn-dialog.component';
import { Observable, of } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { CmsService } from 'src/app/services/cms.service';
import { ValidatorService } from 'src/app/services/validator.service';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { NO_ERRORS_SCHEMA } from '@angular/core';

class BypassService {

  getMetadata(): Observable<any> {
    return of([]);
  }
  get() {
    return '';
  }

  putSsnDetails(): Observable<any> {
    return of({
      status: 'success'
    });
  }
}

describe('SsnDialogComponent', () => {
  let component: SsnDialogComponent;
  let fixture: ComponentFixture<SsnDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
        ReactiveFormsModule,
        InputsModule
      ],
      declarations: [
        SsnDialogComponent,
        DialogComponent
      ],
      schemas: [NO_ERRORS_SCHEMA]
    });
    TestBed.overrideComponent(SsnDialogComponent, {
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
    fixture = TestBed.createComponent(SsnDialogComponent);
    component = fixture.componentInstance;
    component.showDialog();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('when dialog is called, should create a form that contains two field', () => {
    component.showDialog();
    expect(component.ssnForm.contains('ss_number')).toBeTruthy();
    expect(component.ssnForm.contains('confirmSsn')).toBeTruthy();
  });

  it('User should not be able to submit form if form is not valid', () => {
    component.showDialog();
    // call the function to save the form without filling information
    component.saveSsn();
    expect(component.ssnForm.invalid).toBeTruthy();
    expect(component.ssnForm.markAllAsTouched).toBeTruthy();
  });

  it('Form should be invalid if ss_number and confirmSsn does not match', () => {
    component.showDialog();
    const form = component.keys;
    form.ss_number.setValue('123456789');
    form.confirmSsn.setValue('123456788');
    expect(component.ssnForm.invalid).toBeTruthy();
    expect(form.confirmSsn.hasError('NoPassswordMatch')).toBeTruthy();
  });

  it('User should able to submit form if form is valid', () => {
    component.showDialog();
    const form = component.keys;
    form.ss_number.setValue('123456789');
    form.confirmSsn.setValue('123456789');
    // call the function to save the form without filling information
    component.saveSsn();
    expect(component.saveLoader).toBeFalsy();
  });

  it('When user closes dialog all value should be reset to defualt', () => {
    component.showDialog();
    component.closeDialog();
    expect(component.isDecrypted).toBeFalsy();
    expect(component.saveLoader).toBeFalsy();
  });

});
