import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { Observable, of } from 'rxjs';
import { CmsService } from 'src/app/services/cms.service';
import { LookupService } from 'src/app/services/lookup.service';

import { ContractsComponent } from './contracts.component';

class BypassService {
  getMetaData(): Observable<any> {
    return of([]);
  }
  getAssignmentType(): Observable<any> {
    return of([]);
  }
}

describe('ContractsComponent', () => {
  let component: ContractsComponent;
  let fixture: ComponentFixture<ContractsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, FormsModule, RouterTestingModule, HttpClientTestingModule],
      declarations: [ ContractsComponent ],
      providers: [BypassService],
      schemas: [NO_ERRORS_SCHEMA],
    });
    TestBed.overrideComponent(ContractsComponent, {
      set: {
        providers: [
          { provide: Router, useClass: BypassService },
          { provide: ActivatedRoute, useClass: BypassService},
          { provide: CmsService, useClass: BypassService},
          { provide: LookupService, useClass: BypassService}
        ]
      }
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContractsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
