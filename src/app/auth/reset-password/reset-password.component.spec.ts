import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CmsService } from 'src/app/services/cms.service';
import { ValidatorService } from 'src/app/services/validator.service';
import { AdjusterService } from 'src/app/services/adjuster.service';
import { ResetPasswordComponent } from './reset-password.component';
import { ReactiveFormsModule } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

class BypassService {
  static getData(getData: any) {
    throw new Error("Method not implemented.");
  }
  getMetadata(): Observable<any> {
    return of([
    ]);
  }
  updateUserPassword(): Observable<any> {
    return of([]);
  }
  get() {
    return '';
  }
}

describe('ResetPasswordComponent', () => {
  let component: ResetPasswordComponent;
  let fixture: ComponentFixture<ResetPasswordComponent>;
  const routerKey = 'rttyuiughjk';

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientTestingModule, ReactiveFormsModule],
      declarations: [ResetPasswordComponent],
      providers: [BypassService]
    });
    TestBed.overrideComponent(ResetPasswordComponent, {
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
    fixture = TestBed.createComponent(ResetPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // should contain a control in reset password form
  it('should create a form with reset password control', () => {
    expect(component.changePasswordForm.contains('newPassword')).toBeTruthy();
    expect(component.changePasswordForm.contains('confirmPassword')).toBeTruthy();

  });

  // form should be invalid when empty
  it('form invalid when empty', () => {
    expect(component.changePasswordForm.valid).toBeFalsy();
  });

  // reset password should not be empty
  it('Reset Password field is required', () => {
    const password = component.changePasswordForm.get('newPassword');
    password.setValue('');
    expect(password.valid).toBeFalsy();
  });

  // reset password should be valid
  it('Enter a valid reset Password', () => {
    const password = component.changePasswordForm.get('newPassword');
    password.setValue('John@12345');
    expect(password.valid).toBeTruthy();
  });

  // Reset Password field is either visible as asterisk or bullet signs
  it('Reset Password field is either visible as asterisk or bullet signs', () => {
    const password = component.changePasswordForm.get('newPassword');
    password.setValue('**********');
    expect(password.valid).toBeTruthy();
  });

  // credentials should be matched for reset password
  it('submitting a form emits a user', () => {

    // Check if user not entered the data in the form
    expect(component.changePasswordForm.valid).toBeFalsy();

    // Trigger the function
    component.resetPassword();
    expect(component.changePasswordForm.touched).toBeTruthy();
    expect(component.changePasswordForm.valid).toBeFalsy();
    const password = component.changePasswordForm.get('newPassword');
    const confirmPassword = component.changePasswordForm.get('confirmPassword');
    password.setValue('Primus1234$');
    confirmPassword.setValue('Primus1234$');
    expect(component.changePasswordForm.valid).toBeTruthy();
    component.resetPassword();
  });

});
