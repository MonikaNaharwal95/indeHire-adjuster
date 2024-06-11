import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailConfirmationComponent } from './email-confirmation.component';
import { ValidatorService } from 'src/app/services/validator.service';
import { CmsService } from 'src/app/services/cms.service';
import { AdjusterService } from 'src/app/services/adjuster.service';
import { Observable, of } from 'rxjs';
import { Router } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

class BypassService {
  getMetaData(): Observable<any> {
    return of([]);
  }
  navigate(): Observable<any> {
    return of([]);
  }
  resendVerificationEmail(): Observable<any> {
    return of([]);
  }
  sendVerificationEmail(): Observable<any> {
    return of([]);
  }
  get() {
    return '';
  }
}

describe('EmailConfirmationComponent', () => {
  let component: EmailConfirmationComponent;
  let fixture: ComponentFixture<EmailConfirmationComponent>;
  const routerKey = 'rttyuiughjk';

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientTestingModule],
      declarations: [EmailConfirmationComponent],
      providers: [BypassService]
    }); TestBed.overrideComponent(EmailConfirmationComponent, {
      set: {
        providers: [
          { provide: CmsService, useClass: BypassService },
          { provide: ValidatorService, useClass: BypassService },
          { provide: AdjusterService, useClass: BypassService },
          { provide: Router, useClass: BypassService },
        ]
      }
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmailConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have the correct email', () => {
    expect(component.email);
    component.resendVerificationEmail();
    expect(component.email);
  });

  it('should run the loader when credentials are correct', () => {
    expect(component.loader);
    component.resendVerificationEmail();
    expect(component.loader);
  });

  it('should be successful when email is confirmed', () => {
    expect(component.success);
    component.resendVerificationEmail();
    expect(component.success);
  });

});
