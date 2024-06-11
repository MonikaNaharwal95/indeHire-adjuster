import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UnverifiedUserActionComponent } from './unverified-user-action.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { CmsService } from '../services/cms.service';
import { ConfigService } from '../services/config.service';
import { CrudService } from '../services/crud.service';
import { Observable, of } from 'rxjs';

class BypassService {
  getMetadata(): Observable<any> {
    return of([]);
  }
  get() {
    return '';
  }
  getApiUrls() {
    return '';
  }
}

describe('UnverifiedUserActionComponent', () => {
  let component: UnverifiedUserActionComponent;
  let fixture: ComponentFixture<UnverifiedUserActionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UnverifiedUserActionComponent ],
      schemas: [NO_ERRORS_SCHEMA],
      imports: [RouterTestingModule, HttpClientTestingModule],
      providers: [BypassService]
    });
    TestBed.overrideComponent(UnverifiedUserActionComponent, {
      set: {
        providers: [
          { provide: CrudService, useClass: BypassService },
          { provide: ConfigService, useClass: BypassService },
          { provide: CmsService, useClass: BypassService },
        ]
      }
    });

  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UnverifiedUserActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
