import { DialogComponent } from 'src/app/shared/dialog/dialog.component';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { JobDetailComponent } from './job-detail.component';
import { NO_ERRORS_SCHEMA, Component } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { RouterTestingModule } from '@angular/router/testing';
import { Observable, of, Subscription } from 'rxjs';
import { ValidationMockService } from 'src/app/services/mock-validator';
import { AdjusterService } from 'src/app/services/adjuster.service';
import { ValidatorService } from 'src/app/services/validator.service';
import { DialogService } from 'src/app/services/dialog.service';

class BypassService {
  getMetadata(): Observable<any> {
    return of([]);
  }
  jobWithdraw(): Observable<any> {
    return of([]);
  }
  jobApply(): Observable<any> {
    return of([]);
  }
}

describe('JobDetailComponent', () => {
  let component: JobDetailComponent;
  let fixture: ComponentFixture<JobDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        FormsModule,
        DropDownsModule,
        ReactiveFormsModule,
        RouterTestingModule
      ],
      declarations: [JobDetailComponent, DialogComponent ],
      providers: [BypassService],
      schemas: [NO_ERRORS_SCHEMA]
    });
    TestBed.overrideComponent(JobDetailComponent, {
      set: {
        providers: [
          { provide: ValidatorService, useClass: ValidationMockService },
          { provide: AdjusterService, useClass: BypassService },
          {provide: DialogService, useClass: BypassService},
        ]
      }
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JobDetailComponent);
    component = fixture.componentInstance;
    component.dialogRef = new DialogComponent();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // it('form should be define and should have 3 controls', () => {
  //   component.formInit();
  //   expect(component.jobGroup).toBeDefined();
  //   expect(component.jobGroup.contains('jobID')).toBeTruthy();
  //   expect(component.jobGroup.contains('rateAmount')).toBeTruthy();
  //   expect(component.jobGroup.contains('contractorNotes')).toBeTruthy();
  //   if (!component.jobDetail.isRateNegotiable) {
  //     expect(component.formKey.and.disable());
  //   }
  // });

});
