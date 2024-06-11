import { ValidatorService } from './../../services/validator.service';
import { AuthService } from './../auth.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { CmsService } from 'src/app/services/cms.service';
import { LoginMetaData } from 'src/app/models/login.metadata';
import { Subscription } from 'rxjs';
import { ValidationMessage } from 'src/app/models/validation-message.metadata';
import { FormKeysModel } from 'src/app/models/form-keys.model';
import { ConfigService } from 'src/app/services/config.service';
@Component({
  selector: 'inde-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {

  public loginForm: FormGroup;
  public loginMeta: LoginMetaData;
  public loader: boolean;
  public error: string;
  public authCallBackSubscription: Subscription;
  public validatorMessage: ValidationMessage;
  public iosPath: string;
  public androidPath: string;
  public websiteRoute: string;
  public signupUrl: string;

  private callbackMessage: CallbackMessageModel = {
    loginSuccess: 'IH_Login_Success',
    welcomeMsg1: 'IH_Login_Hi',
    welcomeMsg2: 'IH_Login_Welcome',
    unauthorized: 'IH_Login_UnauthorizedUser',
    redirect: 'IH_Login_Redirect'
  };

  public isDecrypted: boolean = true;
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private validatorService: ValidatorService,
    private cmsService: CmsService,
    private config: ConfigService
  ) { }

  // To get all form keys
  public get keys(): FormKeysModel {
    return this.loginForm.controls;
  }

  public ngOnInit(): void {
    this.websiteRoute = this.cmsService.websiteUrl;
    this.androidPath = this.cmsService.androidLink;
    this.iosPath = this.cmsService.iosLink;
    this.signupUrl = this.config.getSignupUrl();
    this.formInit();
    this.getMetaData();
    this.loginCallback();
  }

  // for build form
  private formInit(): void {
    this.loginForm = this.fb.group({
      email: new FormControl('', [
        Validators.required,
        Validators.pattern(this.validatorService.emailRegEx)
      ]),
      password: new FormControl('', [
        Validators.required
      ])
    });
  }

  // To set all session messages
  private setSessionMessage(): void {
    sessionStorage.setItem(this.callbackMessage.loginSuccess, this.loginMeta.IH_Login_Success_Message);
    sessionStorage.setItem(this.callbackMessage.welcomeMsg1, this.loginMeta.IH_Login_Hi);
    sessionStorage.setItem(this.callbackMessage.welcomeMsg2, this.loginMeta.IH_Login_Welcome);
    sessionStorage.setItem(this.callbackMessage.unauthorized, this.loginMeta.IH_Login_UnauthorizedUser);
    sessionStorage.setItem(this.callbackMessage.redirect, this.loginMeta.IH_Login_Redirect);
  }

  // for get all metadata of login page
  private getMetaData(): void {
    this.cmsService
      .getMetadata<LoginMetaData>('IH_LoginPage')
      .subscribe((metaData: LoginMetaData) => {
        this.loginMeta = metaData;
        this.setSessionMessage();
        this.validatorMessage = this.validatorService.validationMessage;
      });
  }

  // for login with Auth0
  public loginWithAuth0(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }
    if (this.loginForm.valid) {
      this.loader = true;
      this.authService.login(this.loginForm.value);
    }
  }

  public universalLogin(): void {
    this.authService.universalLogin();
  }

  // for login with google
  public loginWithGoogle(): void {
    this.loader = true;
    this.authService.socialIdentity();
  }

  public loginWithAppleID(): void {
    this.loader = true;
    this.authService.socialIdentityApple();
  }

  private loginCallback(): void {
    this.authCallBackSubscription = this.authService.authError$.subscribe(
      (response: string) => {
        this.loader = false;
        if (response) {
          if (response === 'too_many_attempts') {
            this.error = this.loginMeta.IH_LoginPage_Email_Blocked;
            this.loginForm.setErrors({
              isBlocked: true
            });
          } else if (response) {
            this.error = this.loginMeta.IH_Login_Incorrect;
            this.loginForm.setErrors({
              isWrong: true
            });
          } else {
            this.error = this.loginMeta.IH_LoginPage_Email_Blocked;
          }
        }
      }
    );
  }

  ngOnDestroy(): void {
    this.authService.setAuthError(undefined);
    this.authCallBackSubscription.unsubscribe();
  }

}

export interface LoginFormModel {
  email: string;
  password: string;
}

export interface CallbackMessageModel {
  loginSuccess: string;
  welcomeMsg1: string;
  welcomeMsg2: string;
  unauthorized: string;
  redirect: string;
}
