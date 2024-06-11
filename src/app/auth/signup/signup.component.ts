import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, ValidationErrors } from '@angular/forms';
import { Subscription } from 'rxjs';
import { IdentityResult, IdentityResponse } from 'src/app/models/command-api-res.model';
import { SignupMetaData } from 'src/app/models/signup.metadata';
import { ValidationMessage } from 'src/app/models/validation-message.metadata';
import { AdjusterService } from 'src/app/services/adjuster.service';
import { CmsService } from 'src/app/services/cms.service';
import { ValidatorService } from 'src/app/services/validator.service';
import { AuthService } from './../auth.service';
import { RegistrationContactInfo, SignupFormModel } from 'src/app/models/signup-form.model';
import { FormKeysModel } from 'src/app/models/form-keys.model';
import { LookupService } from 'src/app/services/lookup.service';
import { LookupModel } from 'src/app/models/lookup.model';
import { Router } from '@angular/router';

@Component({
  selector: 'inde-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})

export class SignupComponent implements OnInit, OnDestroy {

  public metaData: SignupMetaData;
  public registrationForm: FormGroup;
  public user: SignupFormModel;
  public loader: boolean;
  public error: string;
  public authErrorSubscription: Subscription;
  public authSucessSusbscription: Subscription;
  public isEmailExist: boolean;
  public validatorMessage: ValidationMessage;
  public websiteRoute: string;
  public termsRoute: string;
  public androidPath: string;
  public iosPath: string;
  public isDecrypted: boolean = true;
  public isDecryptedConfirm: boolean = true;
  public phoneMask: string;
  public rules: { [key: string]: RegExp };
  public stateDefaultItem: { value: string; key: string };
  public stateLookup: LookupModel[];
  public callingCodeLookup: LookupModel[];
  public phoneControlSubscription: Subscription;
  public phoneSubscription: Subscription;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private validatorService: ValidatorService,
    private cmsService: CmsService,
    private adjusterService: AdjusterService,
    private lookupService: LookupService,
    private router: Router
  ) { }

  public get keys(): FormKeysModel {
    return this.registrationForm.controls;
  }


  public ngOnInit(): void {
    this.websiteRoute = this.cmsService.websiteUrl;
    this.termsRoute = this.cmsService.websiteUrl + 'legal-terms/terms-conditions';
    this.androidPath = this.cmsService.androidLink;
    this.iosPath = this.cmsService.iosLink;
    this.phoneMask = this.validatorService.phoneMask;
    this.rules = this.validatorService.phoneRules;
    this.stateDefaultItem = { value: 'Select State', key: '' };
    this.formInit();
    this.getMetaData();
    this.lookupService.getStateLookUp().subscribe((data: LookupModel[]) => {
      if (data) {
        this.stateLookup = data;
      }
    });
    this.lookupService.getCallingCode().subscribe((data: LookupModel[]) => {
      if (data) {
        this.callingCodeLookup = data;
      }
    });
  }

  private formInit(): void {
    this.registrationForm = this.fb.group({
      firstName: new FormControl('', [
        Validators.required,
        Validators.pattern(this.validatorService.validation1)
      ]),
      lastName: new FormControl('', [
        Validators.required,
        Validators.pattern(this.validatorService.validation1)
      ]),
      email: new FormControl('', [
        Validators.required,
        Validators.pattern(this.validatorService.emailRegEx)
      ]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(10),
        Validators.pattern(this.validatorService.passwordRegEx)
      ]),
      confirmPassword: new FormControl('', [
        Validators.required
      ]),
      terms: new FormControl(false, [Validators.requiredTrue]),
      phone: new FormControl('', [Validators.required]),
      city: new FormControl('', [
        Validators.required,
        Validators.pattern(this.validatorService.validation1)
      ]),
      state: new FormControl('', [Validators.required]),
      callingCode: new FormControl({ value: '1', disabled: true }, [Validators.required]),
      zip: new FormControl('', [
        Validators.required,
        Validators.minLength(5),
        Validators.pattern(this.validatorService.zipcodeRegEx)
      ])
    },
    { validator: this.passwordMatchValidator }
    );
    this.phoneControlSubscribe();
  }

  private passwordMatchValidator(frm: FormGroup): ValidationErrors {
    if (frm.controls.password.valid) {
      if (frm.value.password === frm.value.confirmPassword) {
        frm.controls.confirmPassword.setErrors(null);
        return null;
      } else {
        frm.controls.confirmPassword.setErrors({
          mismatch: true
        });
        return {mismatch: true};
      }

    }
  }

  private getMetaData(): void {
    this.cmsService
      .getMetadata<SignupMetaData>('IH_SignUpPage')
      .subscribe((meta: SignupMetaData) => {
        this.metaData = meta;
        this.validatorMessage = this.validatorService.validationMessage;
        this.authErrorSubscription = this.auth.authError$.subscribe((err: string) => {
          if (err) {
            this.loader = false;
            this.error = this.metaData.IH_Sign_Up_Error_Invalid;
            this.registrationForm.setErrors({
              invalid: true
            });
          }
        });
        this.saveContactInfo();
      });
  }

  public signUp(): void {
    if (this.registrationForm.invalid) {
      this.registrationForm.markAllAsTouched();
      return;
    }
    if (this.registrationForm.valid) {
      this.user = this.registrationForm.value;
      this.loader = true;
      this.auth.signup(this.user);
      this.validatorService.emailVerGuard = true;
    }
  }

  public signupWithGoogle(): void {
    this.loader = true;
    this.auth.socialIdentity();
  }

  public signupWithApple(): void {
    this.loader = true;
    this.auth.socialIdentityApple();
  }

  public emailExist(): void {
    const email = this.keys.email.value;
    const emailControl = this.registrationForm.get('email');
    if (emailControl.valid) {
      this.adjusterService.emailExist(email).subscribe((res: IdentityResponse) => {
        if (res && !res.isError) {
          const result: IdentityResult = res.result;
          if (result.status) {
            emailControl.setErrors({
              isExisting: true
            });
          }
        }
      });
    }
  }

  private saveContactInfo(): void {
    this.authSucessSusbscription = this.auth.authRegSuccess$.subscribe((isSuccess: boolean) => {
      if (isSuccess) {
        const payload: RegistrationContactInfo = {
          email: this.registrationForm.value.email,
          city: this.registrationForm.value.city,
          state: this.registrationForm.value.state,
          phoneNumber: this.registrationForm.value.phone,
          zipCode: this.registrationForm.value.zip
        };
        this.adjusterService.insertUserContactInfo(payload).subscribe(
          (res: IdentityResponse) => {
            if (res && !res.isError) {
              const result: IdentityResult = res.result;
              if (result.status) {
                this.router.navigate(['/auth/email-verification']);
              } else {
                this.loader = false;
              }
            }
          }
        );
      }
    });
  }

  public ngOnDestroy(): void {
    this.auth.setAuthError(undefined);
    this.authErrorSubscription.unsubscribe();
    if (this.authSucessSusbscription) {
      this.authSucessSusbscription.unsubscribe();
    }
    if (this.phoneControlSubscription) {
      this.phoneControlSubscription.unsubscribe();
    }
  }

  public scroll(el: HTMLElement): void {
    el.scrollIntoView({behavior: 'smooth'});
  }

  // Added by Abhishek For phone number uniqueness
  private phoneControlSubscribe(): void {
    this.phoneControlSubscription = this.keys.phone.valueChanges.subscribe(
      (phone: string) => {
        if (phone && phone.trim().length === 10) {
          this.isPhoneNumberUnique(phone);
        }
      }
    );
  }

  public isPhoneNumberUnique(phone: string): void {
    if (this.phoneSubscription) {
      this.phoneSubscription.unsubscribe();
    }
    this.loader = true;
    this.phoneSubscription = this.adjusterService.phoneExist(phone).subscribe(
      (response: IdentityResponse) => {
        if (response) {
          if (!response.isError) {
            if (response.result.status) {
              this.registrationForm.controls.phone.setErrors({
                isDuplicate: true
              });
            }
          }
          this.loader = false;
        }
      }
    );
  }
  // Added by Abhishek For phone number uniqueness

}
