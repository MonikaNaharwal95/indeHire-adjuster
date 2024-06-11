import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ReactiveFormsModule, FormsModule, ValidationErrors } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { Observable, of } from 'rxjs';
import { CmsService } from 'src/app/services/cms.service';
import { ValidatorService } from 'src/app/services/validator.service';
import { AdjusterService } from 'src/app/services/adjuster.service';
import { ResetPasswordEmailComponent } from './reset-password-email.component';

class BypassService {
  static getData(getData: any) {
    throw new Error('Method not implemented.');
  }
  getMetadata(): Observable<any> {
    return of([
    ]);
  }
  sendResetPasswordLink(): Observable<any> {
    return of([]);
  }
  get() {
    return '';
  }
}

describe('ResetPasswordEmailComponent', () => {
  let component: ResetPasswordEmailComponent;
  let fixture: ComponentFixture<ResetPasswordEmailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientTestingModule, ReactiveFormsModule],
      declarations: [ResetPasswordEmailComponent],
      providers: [BypassService]
    });
    TestBed.overrideComponent(ResetPasswordEmailComponent, {
      set: {
        providers: [
          { provide: CmsService, useClass: BypassService },
          { provide: ValidatorService, useClass: BypassService },
          { provide: AdjusterService, useClass: BypassService },
        ]
      }
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResetPasswordEmailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // should contain a field of reset email form
  it('should create a control with name sendEmail', () => {
    expect(component.sendEmail).toBeTruthy();
  });

  // form should be invalid when empty
  it('form invalid when empty', () => {
    expect(component.sendEmail.valid).toBeFalsy();
  });

  // email should not be empty
  it('Email field is required', () => {
    component.sendEmail.setValue('');
    expect(component.sendEmail.valid).toBeFalsy();
  });

  // email should be valid
  it('Enter a valid E-mail', () => {
    component.sendEmail.setValue('john123@gmail.com');
    expect(component.sendEmail.valid).toBeTruthy();
  });

  // credentials should be matched for reset email
  it('submitting a form emits a user', () => {
    expect(component.sendEmail.valid).toBeFalsy();
    component.sendEmail.setValue(true);
    component.sendEmail.setValue('Email is invalid');
    expect(component.sendEmail.valid).toBeTruthy();

  // Trigger the function
    component.requestResetPassword();
    expect(component.sendEmail.touched).toBeFalsy();
  });
});
