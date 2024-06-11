import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { Observable, of } from 'rxjs';
import { AdjusterService } from 'src/app/services/adjuster.service';
import { CmsService } from 'src/app/services/cms.service';
import { DataChangeService } from 'src/app/services/data-change.service';
import { DialogService } from 'src/app/services/dialog.service';
import { LookupService } from 'src/app/services/lookup.service';
import { ValidatorService } from 'src/app/services/validator.service';
import { DialogComponent } from 'src/app/shared/dialog/dialog.component';

import { ContractOverviewComponent } from './contract-overview.component';

class BypassService {
  terminateReason(): Observable<any> {
    return of([]);
  }
  getMetadata(): Observable<any> {
    return of([]);
  }
  getLookupData(): Observable<any> {
    return of([]);
  }
  getAssignmentId(): Observable<any> {
    return of([]);
  }
}

describe('ContractOverviewComponent', () => {
  let component: ContractOverviewComponent;
  let fixture: ComponentFixture<ContractOverviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, FormsModule, RouterTestingModule, HttpClientTestingModule],
      declarations: [ ContractOverviewComponent, DialogComponent ],
      providers: [BypassService],
      schemas: [NO_ERRORS_SCHEMA],
    });
    TestBed.overrideComponent(ContractOverviewComponent, {
      set: {
        providers: [
          { provide: AdjusterService, useClass: BypassService },
          { provide: ValidatorService, useClass: BypassService },
          { provide: DialogService, useClass: BypassService},
          { provide: CmsService, useClass: BypassService },
          { provide: DataChangeService, useClass: BypassService},
          { provide: Router, useClass: BypassService },
          { provide: LookupService, useClass: BypassService}
        ]
      }
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContractOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
