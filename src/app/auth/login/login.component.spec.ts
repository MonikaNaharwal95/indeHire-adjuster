import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { async, ComponentFixture, TestBed} from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { ReactiveFormsModule } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { FooterComponent } from 'src/app/shared/footer/footer.component';
import { CmsService } from 'src/app/services/cms.service';
import { ValidatorService } from 'src/app/services/validator.service';
import { AdjusterService } from 'src/app/services/adjuster.service';


class BypassService {
  getMetadata(): Observable<any> {
    return of([]);
  }
  get() {
    return '';
  }
}

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, RouterTestingModule, HttpClientTestingModule],
      declarations: [LoginComponent, FooterComponent]
    });
    TestBed.overrideComponent(LoginComponent, {
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
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // should have the component
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // should contains 2 controls in login form
  it('should create a form with 2 controls', () => {
    expect(component.loginForm.contains('email')).toBeTruthy();
    expect(component.loginForm.contains('password')).toBeTruthy();
  });

  // form should be invalid when empty
  it('form invalid when empty', () => {
    expect(component.loginForm.valid).toBeFalsy();
  });

  // email should not be empty
  it('Email field is required', () => {
    const email = component.loginForm.get('email');
    email.setValue('');
    expect(email.valid).toBeFalsy();
  });

  // password should not be empty
  it('Password field is required', () => {
    const password = component.loginForm.get('password');
    password.setValue('');
    expect(password.valid).toBeFalsy();
  });

  // email should be valid
  it('Enter a valid E-mail', () => {
    const email = component.loginForm.get('email');
    email.setValue('john123@gmail.com');
    expect(email.valid).toBeTruthy();
  });

  // password should be valid
  it('Enter a valid Password', () => {
    const password = component.loginForm.get('password');
    password.setValue('John@12345');
    expect(password.valid).toBeTruthy();
  });

  // credentials should be matched for login
  it('submitting a form emits a user', () => {
    expect(component.loginForm.valid).toBeFalsy();

    // Trigger the login function
    component.loginWithAuth0();
    expect(component.loginForm.touched).toBeTruthy();
    component.loginForm.controls.email.setValue('john123@gmail.com');
    component.loginForm.controls.password.setValue('John@12345');

  });
});
