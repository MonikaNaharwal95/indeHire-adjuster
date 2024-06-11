import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { JobsComponent } from './jobs.component';
import { Observable, of } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { JobDetailComponent } from './job-detail/job-detail.component';
import { CmsService } from 'src/app/services/cms.service';
import { ValidatorService } from 'src/app/services/validator.service';
import { ValidationMockService } from 'src/app/services/mock-validator';
import { AdjusterService } from 'src/app/services/adjuster.service';
import { RouterModule } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { LookupModel } from 'src/app/models/lookup.model';
import { LookupService } from 'src/app/services/lookup.service';

class BypassService {
  getMetadata(): Observable<any> {
    return of([]);
  }
  getJobs() {
    return of([]);
  }
  openDialog(): void {}
}

class LookupMockService {
  getJobTypeLookUp(): Observable<LookupModel[]> {
    return of([]);
  }
  getCertificateTypeLookUp(): Observable<LookupModel[]> {
    return of([]);
  }
  getChildCertificateLookUp(): Observable<LookupModel[]> {
    return of([]);
  }
  getStateLookUp(): Observable<LookupModel[]> {
    return of([]);
  }
  getJobWeekLookup(): Observable<LookupModel[]> {
    return of([]);
  }
  getRateTypeLookup(): Observable<LookupModel[]> {
    return of([]);
  }
  getLocationTypeLookup(): Observable<LookupModel[]> {
    return of([]);
  }
  getDurationTypeLookup(): Observable<LookupModel[]> {
    return of([]);
  }
  getSoftwareKnowledgeLookUp(): Observable<LookupModel[]> {
    return of([]);
  }
  getSpecialityTypeLookUp(): Observable<LookupModel[]> {
    return of([]);
  }
  getLanguageTypeLookUp(): Observable<LookupModel[]> {
    return of([]);
  }
  getRelevanceLookUp(): Observable<LookupModel[]> {
    return of([]);
  }
}

describe('JobsComponent', () => {
  let component: JobsComponent;
  let fixture: ComponentFixture<JobsComponent>;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        FormsModule,
        DropDownsModule,
        ReactiveFormsModule,
        RouterTestingModule
      ],
      declarations: [ JobsComponent, JobDetailComponent ],
      providers: [BypassService],
      schemas: [NO_ERRORS_SCHEMA]
    });
    TestBed.overrideComponent(JobsComponent, {
      set: {
        providers: [
          { provide: CmsService, useClass: BypassService },
          { provide: LookupService, useClass: LookupMockService },
          { provide: ValidatorService, useClass: ValidationMockService },
          { provide: AdjusterService, useClass: BypassService },
        ]
      }
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JobsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('refresh all jobs', () => {
    component.refreshJobs();
  });

});
