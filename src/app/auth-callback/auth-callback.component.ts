import { AdjusterService } from './../services/adjuster.service';
import { Router } from '@angular/router';
import { AuthService } from './../auth/auth.service';
import { Component, OnInit } from '@angular/core';
import { LoginResponse, AccessToken } from '../models/login.model';
import { IdentityResponse } from '../models/command-api-res.model';
import { CallbackMessageModel } from '../auth/login/login.component';

@Component({
  selector: 'inde-auth-callback',
  templateUrl: './auth-callback.component.html',
  styleUrls: ['./auth-callback.component.scss']
})
export class AuthCallbackComponent implements OnInit {

  userName: string;
  errorRes: string;
  timeoutCount: number = 5;
  private callbackMessage: CallbackMessageModel = {
    loginSuccess: 'IH_Login_Success',
    welcomeMsg1: 'IH_Login_Hi',
    welcomeMsg2: 'IH_Login_Welcome',
    unauthorized: 'IH_Login_UnauthorizedUser',
    redirect: 'IH_Login_Redirect'
  };
  loginMessages: LoginMessage;
  constructor(
    private authService: AuthService,
    private router: Router,
    private adjusterService: AdjusterService
  ) {
    this.getSessionMessages();
    this.authService.handleAuthentication();
    this.authService.authAccess$.subscribe((idToken: string) => {
      if (idToken) {
        this.validateAuth(idToken);
      }
    });
  }

  public ngOnInit(): void {
  }

  private getSessionMessages(): void {
    this.loginMessages = {
      loginSuccess: sessionStorage.getItem(this.callbackMessage.loginSuccess),
      loginHi: sessionStorage.getItem(this.callbackMessage.welcomeMsg1),
      loginWelcome: sessionStorage.getItem(this.callbackMessage.welcomeMsg2),
      loginUnauthorized: sessionStorage.getItem(this.callbackMessage.unauthorized),
      loginRedirect: sessionStorage.getItem(this.callbackMessage.redirect)
    };
  }

  private validateAuth(idToken: string): void {
    const body = {
      jwToken: idToken
    };
    this.adjusterService.validateAuth0(body).subscribe(
      (signRes: IdentityResponse) => {
        if (signRes && !signRes.isError) {
          const authResult: LoginResponse = signRes.result;
          const authData: AccessToken = authResult.accessToken;
          this.userName = authData.firstName ? authData.firstName + ' ' + authData.lastName : 'Adjuster';
          localStorage.setItem('indehire_profileID', authData.profileImageID);
          localStorage.setItem('indehire_Prelim', JSON.stringify(authData.prelimStatusID));
          localStorage.setItem(this.authService.intStorageKeys.contractorType, authData.contractorType ? authData.contractorType : '');
          localStorage.setItem(this.authService.intStorageKeys.apiToken, authData.token);
          const expiresAt = JSON.stringify((authData.expiresIn * 1000) + new Date().getTime());
          localStorage.setItem(this.authService.intStorageKeys.apiExpiresAt, expiresAt);
          localStorage.setItem(this.authService.intStorageKeys.refreshToken, authResult.refreshToken);
          setTimeout(() => {
            if (authData.prelimStatusID > 3) {
              this.router.navigateByUrl('/', { replaceUrl: true });
            } else {
              this.router.navigateByUrl('/profile-creation', { replaceUrl: true });
            }
          }, 100);
        } else {
          if (signRes && signRes.message.split('|')[0].trim() === 'ACNA') {
            this.errorRes = signRes.message.split('|')[1].trim() + ' ' + this.loginMessages.loginRedirect;
            this.redirectToLogin(20);
          } else if (signRes && signRes.message.trim() === 'Invalid user') {
            this.errorRes = this.loginMessages.loginUnauthorized;
            this.redirectToLogin(5);
          } else {
            this.router.navigate(['/auth']);
          }
        }
      },
      (err: Error) => {
        this.router.navigate(['/auth']);
      }
    );
    sessionStorage.removeItem(this.callbackMessage.loginSuccess);
    sessionStorage.removeItem(this.callbackMessage.welcomeMsg1);
    sessionStorage.removeItem(this.callbackMessage.welcomeMsg2);
    sessionStorage.removeItem(this.callbackMessage.unauthorized);
    sessionStorage.removeItem(this.callbackMessage.redirect);
  }

  private redirectToLogin(timer: number): void {
    this.timeoutCount = timer;
    const interval = setInterval(() => {
      this.timeoutCount--;
      if (this.timeoutCount === 0) {
        this.router.navigate(['/auth']);
        clearInterval(interval);
      }
    }, 1000);
  }

}

export interface LoginMessage {
  loginSuccess: string;
  loginHi: string;
  loginWelcome: string;
  loginUnauthorized: string;
  loginRedirect: string;
}
export interface JwtTokenModel {
  jwToken: string;
}

