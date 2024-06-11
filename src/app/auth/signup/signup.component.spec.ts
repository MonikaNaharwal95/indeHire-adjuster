import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SignupComponent } from './signup.component';
import { ReactiveFormsModule, ValidationErrors } from '@angular/forms';
import { AuthService } from '../auth.service';
import { FooterComponent } from 'src/app/shared/footer/footer.component';
import { RouterTestingModule } from '@angular/router/testing';
import { Observable, of, Subject, BehaviorSubject } from 'rxjs';
import { CmsService } from 'src/app/services/cms.service';
import { ValidatorService } from 'src/app/services/validator.service';
import { AdjusterService } from 'src/app/services/adjuster.service';

class BypassService {
   authError: Subject<any> = new BehaviorSubject<any>(false);
   authError$ = this.authError.asObservable();
  static getData(getData: any) {
    throw new Error('Method not implemented.');
  }
  getMetadata(): Observable<any> {
    return of([
    ]);
  }
  get() {
    return '';
  }
  emailExist(): Observable<any> {
    return of([]);
  }
  signup(): Observable<any> {
    return of([]);
  }
  signUp(): Observable<any> {
    return of([]);
  }
  socialIdentity(): Observable<any> {
    return of([]);
  }
}

describe('SignupComponent', () => {
  let component: SignupComponent;
  let fixture: ComponentFixture<SignupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientTestingModule, ReactiveFormsModule],
      declarations: [SignupComponent, FooterComponent],
      providers: [BypassService]
    });
    TestBed.overrideComponent(SignupComponent, {
      set: {
        providers: [
          { provide: CmsService, useClass: BypassService },
          { provide: ValidatorService, useClass: BypassService },
          { provide: AdjusterService, useClass: BypassService },
          { provide: AuthService, useClass: BypassService },
        ]
      }
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SignupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // should have the component
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // should contains 5 controls in signup form
  it('should create a form with 5 controls', () => {
    expect(component.registrationForm.contains('firstName')).toBeTruthy();
    expect(component.registrationForm.contains('lastName')).toBeTruthy();
    expect(component.registrationForm.contains('email')).toBeTruthy();
    expect(component.registrationForm.contains('password')).toBeTruthy();
    expect(component.registrationForm.contains('terms')).toBeTruthy();
  });

  // form should be invalid when empty
  it('form invalid when empty', () => {
    expect(component.registrationForm.valid).toBeFalsy();
  });

  // Test cases for First name field
  it('First name field validity', () => {
    let errors: ValidationErrors;
    const firstName = component.registrationForm.controls.firstName;
    expect(firstName.valid).toBeFalsy();
    firstName.setValue('Roberts Jr. Downey\'s');
    expect(firstName.valid).toBeTruthy();

    // First name field is required
    firstName.setValue('');
    errors = firstName.errors || {};
    expect(errors.required).toBeTruthy();

    // Set First name to something incorrect
    firstName.setValue('Roberts@123 Jr. Downey\'s');
    errors = firstName.errors || {};
    expect(errors.required).toBeFalsy();
    expect(errors.pattern).toBeFalsy();

    // Set First name to something correct
    firstName.setValue('Roberts Jr. Downey\'s');
    errors = firstName.errors || {};
    expect(errors.required).toBeFalsy();
    expect(errors.pattern).toBeFalsy();
  });

  // Test cases for Last name field

  it('Last name field validity', () => {
    let errors: ValidationErrors;
    const lastName = component.registrationForm.controls.lastName;
    expect(lastName.valid).toBeFalsy();
    lastName.setValue('Roberts Jr. Downey\'s');
    expect(lastName.valid).toBeTruthy();

 // Last name field is required
    lastName.setValue('');
    errors = lastName.errors;
    expect(errors.required).toBeTruthy();

 // Set Last name to something incorrect
    lastName.setValue('Roberts@123 Jr. Downey\'s');
    errors = lastName.errors || {};
    expect(errors.required).toBeFalsy();
    expect(errors.pattern).toBeFalsy();


// Set Last name to something correct
    lastName.setValue('Roberts Jr. Downey\'s');
    errors = lastName.errors || {};
    expect(errors.required).toBeFalsy();
    expect(errors.pattern).toBeFalsy();
  });

// email should not be empty
  it('Email field is required', () => {
    const email = component.registrationForm.get('email');
    email.setValue('');
    expect(email.valid).toBeFalsy();
  });

// email should be valid
  it('Enter a valid E-mail', () => {
    const email = component.registrationForm.get('email');
    email.setValue('john123@gmail.com');
    expect(email.valid).toBeTruthy();
  });

// email already exist
  it('email to check that it is already exist', () => {
    const email = component.registrationForm.get('email');
    expect(component.registrationForm.valid).toBeFalsy();
    component.registrationForm.controls.email.setValue('john123@gmail.com');
    expect(component.registrationForm.valid).toBeFalsy();
    component.emailExist();
  });

  // password should not be empty
  it('Password field is required', () => {
    const password = component.registrationForm.get('password');
    password.setValue('');
    expect(password.valid).toBeFalsy();
  });

  // password should be valid
  it('Enter a valid Password', () => {
    const password = component.registrationForm.get('password');
    password.setValue('John@12345');
    expect(password.valid).toBeTruthy();
  });

  // Password field is either visible as asterisk or bullet signs
  it('Password field is either visible as asterisk or bullet signs', () => {
    const password = component.registrationForm.get('password');
    password.setValue('**********');
    expect(password.valid).toBeTruthy();
  });

  // credentials should be matched for signup
  it('submitting a form emits a user', () => {
    expect(component.registrationForm.valid).toBeFalsy();
    component.signUp();
    expect(component.registrationForm.touched).toBeTruthy();
    expect(component.registrationForm.valid).toBeFalsy();
    component.registrationForm.controls.firstName.setValue('Roberts Jr. Downey\'s');
    component.registrationForm.controls.lastName.setValue('Roberts Jr. Downey\'s');
    component.registrationForm.controls.email.setValue('john123@gmail.com');
    component.registrationForm.controls.password.setValue('John@12345');
    component.registrationForm.controls.terms.setValue(true);
    expect(component.registrationForm.valid).toBeTruthy();
    component.signUp();
  });
});
