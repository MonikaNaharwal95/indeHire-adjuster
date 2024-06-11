import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SendVerificationEmailComponent } from './send-verification-email.component';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { Observable, of } from 'rxjs';
import { CmsService } from 'src/app/services/cms.service';
import { ValidatorService } from 'src/app/services/validator.service';
import { AdjusterService } from 'src/app/services/adjuster.service';

class BypassService {
  getMetadata(): Observable<any> {
    return of([{
      result: {
        status: 200,
      }
    }]);
  }
  sendVerificationEmail(): Observable<any> {
    return of([{
      result: {
        isError: true,
        status: 200,
      }
    }]);
  }
  get() {
    return '';
  }
}

describe('SendVerificationEmailComponent', () => {
  let component: SendVerificationEmailComponent;
  let fixture: ComponentFixture<SendVerificationEmailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, RouterTestingModule, HttpClientTestingModule],
      declarations: [SendVerificationEmailComponent]
    });
    TestBed.overrideComponent(SendVerificationEmailComponent, {
      set: {
        providers: [
          { provide: CmsService, useClass: BypassService },
          { provide: ValidatorService, useClass: BypassService },
          { provide: AdjusterService, useClass: BypassService }
        ]
      }
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SendVerificationEmailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create a control with name sendEmail', () => {
    expect(component.sendEmail).toBeTruthy();
  });

  it('sendEmail should be invalid', () => {
    expect(component.sendEmail.invalid).toBeTruthy();
  });

  it('sendEmail should have two validations', () => {
    component.ngOnInit();
    expect(component.sendEmail.hasError('required')).toBeTruthy();
    component.sendEmail.setValue('indehire');
  });

  it('sendEmail should not be empty', () => {
    component.sendEmail.setValue('');
    expect(component.sendEmail.valid).toBeFalsy();
  });

  it('sendEmail should match pattern', () => {
    component.sendEmail.setValue('qwerty@indehire.com');
    expect(component.sendEmail.valid).toBeTruthy();
  });

  it('submit the email and validate form control', () => {
    expect(component.sendEmail.valid).toBeFalsy();
    component.resendVerificationEmail();
    expect(component.sendEmail.touched).toBeTruthy();
  });

  it('submit the email and validate form control', () => {
    expect(component.sendEmail.setValue('qwerty@indehire.com'));
    expect(component.sendEmail.valid).toBeTruthy();
    component.resendVerificationEmail();
    expect(component.loader).toBeFalsy();
  });

  it('submit the email and validate form control', () => {
    component.sendEmail.setValue('user@indehire.com');
    component.resendVerificationEmail();
    expect(component.success);
  });
});
