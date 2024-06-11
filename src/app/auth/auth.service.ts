import { RefreshBody } from './../services/adjuster.service';
import { Injectable, Injector } from '@angular/core';
import { WebAuth } from 'auth0-js';
import { AuthConfig } from '../models/auth-config.model';
import { Router } from '@angular/router';
import { of, timer, Subscription, Subject, BehaviorSubject, Observable } from 'rxjs';
import { LoginFormModel } from './login/login.component';
import { StorageKeysModel, IntStorageKeysModel } from './auth-keys.model';
import { SignupFormModel } from '../models/signup-form.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private webAuth: WebAuth;
  private authConfig: AuthConfig;
  private refreshSubscription: Subscription;

  private authAccess: Subject<string> = new BehaviorSubject<string>(undefined);
  public authAccess$: Observable<string> = this.authAccess.asObservable();
  private authError: Subject<string> = new BehaviorSubject<string>(undefined);
  public authError$: Observable<string> = this.authError.asObservable();
  private authRegSuccess: Subject<boolean> = new BehaviorSubject<boolean>(undefined);
  public authRegSuccess$: Observable<boolean> = this.authRegSuccess.asObservable();

  private storageKeys: StorageKeysModel = {
    accessToken: 'indehire-auth-access-token',
    idToken: 'indehire-auth-id-token',
    expiresAt: 'indehire-auth-expires-at',
    scopes: 'indehire-auth-scopes'
  };

  public intStorageKeys: IntStorageKeysModel = {
    apiToken: 'indehire-api-token',
    apiExpiresAt: 'indehire-api-expire-at',
    refreshToken: 'indehire-refresh-token',
    contractorType: 'indehire-ContractorType'
  };

  private get router(): Router {
    return this.injector.get(Router);
  }

  constructor(
    private injector: Injector
  ) {
  }

  public setAuthError(arg: string): void {
    this.authError.next(arg);
  }

  // To get the database connection based on environment
  get authDatabase(): string {
    return this.authConfig.database;
  }

  get apiToken(): string {
    return localStorage.getItem(this.intStorageKeys.apiToken);
  }

  get refreshToken(): string {
    return localStorage.getItem(this.intStorageKeys.refreshToken);
  }

  public configure(authConfig: AuthConfig): void {
    this.authConfig = authConfig;

    this.webAuth = new WebAuth({
      clientID: authConfig.clientID,
      domain: authConfig.domain,
      responseType: authConfig.responseType,
      redirectUri: authConfig.redirectUri,
      scope: authConfig.scope,
      prompt: 'none',
      databaseConnection: authConfig.database
      // audience: authConfig.audience
    });
  }

  // DON'T TOUCH THIS FUNCTION
  public signup(userInfo: SignupFormModel): void {
    this.webAuth.signup({
      connection: this.authDatabase,
      email: userInfo.email,
      password: userInfo.password,
      user_metadata: {
        firstName: userInfo.firstName,
        lastName: userInfo.lastName,
        userType: 'AD'
      }
    },
    (err, authResult) => {
      if (err) {
        this.authError.next(err.code);
      }
      sessionStorage.removeItem('userID');
      sessionStorage.setItem('userID', authResult.email);
      this.authRegSuccess.next(true);
      // this.router.navigate(['/auth/email-verification']);
    });
  }

  // DON'T TOUCH THIS FUNCTION
  public socialIdentity(): void {
    this.webAuth.authorize({
      connection: 'google-oauth2',
    });
  }

  public socialIdentityApple(): void {
    this.webAuth.authorize({
      connection: 'apple',
    });
  }

  public universalLogin(): void {
    this.webAuth.authorize({
      connection: this.authDatabase,
      allow_sign_up: false,
      prompt: 'login'
    });
  }

  public login(userInfo: LoginFormModel): void {
    this.webAuth.login(
      {
        realm: this.authDatabase,
        email: userInfo.email,
        password: userInfo.password,
      },
      (user, context, callback) => {
        if (!user.email_verified || user.code === 'access_denied' || user.code === 'too_many_attempts') {
          this.authError.next(user.code);
        } else {
          return callback(null, user, context);
        }
      }
    );
  }

  public handleAuthentication(): Promise<string> {
    return new Promise((resolve, reject) => {
      this.webAuth.parseHash((err: any, authResult: { accessToken: string; idToken: string; idTokenPayload: any }) => {
        if (authResult && authResult.accessToken && authResult.idToken) {
            window.location.hash = '';
            this.setSession(authResult);
            resolve('resolved');
            this.authAccess.next(authResult.idToken);
          } else if (err) {
            reject();
            if (err.error) {
              if (err.errorDescription === 'Please verify your email before logging in.') {
                this.router.navigate(['/unverifieduser-fallback']);
                return;
              }
              if (err.errorDescription === 'Unable to configure verification page.') {
                this.router.navigate(['/cross-origin-fallback']);
                return;
              }
            }
            this.router.navigate(['/auth/login']);
          } else {
            this.router.navigate(['/auth/login']);
          }
        });
    });
  }

  private setSession(authResult: any): void {
    localStorage.removeItem(this.storageKeys.accessToken);
    localStorage.removeItem(this.storageKeys.idToken);
    localStorage.removeItem(this.storageKeys.expiresAt);
    localStorage.removeItem(this.storageKeys.scopes);

    const expiresAt = JSON.stringify((authResult.expiresIn * 1000) + new Date().getTime());

    localStorage.setItem(this.storageKeys.accessToken, authResult.accessToken);
    localStorage.setItem(this.storageKeys.idToken, authResult.idToken);
    localStorage.setItem(this.storageKeys.expiresAt, expiresAt);
    localStorage.setItem(this.storageKeys.scopes, authResult.scope);
  }

  public logout(): void {
    localStorage.removeItem(this.storageKeys.accessToken);
    localStorage.removeItem(this.storageKeys.idToken);
    localStorage.removeItem(this.storageKeys.expiresAt);
    localStorage.removeItem(this.storageKeys.scopes);
    localStorage.removeItem(this.intStorageKeys.apiToken);
    localStorage.removeItem(this.intStorageKeys.apiExpiresAt);
    localStorage.removeItem(this.intStorageKeys.refreshToken);

    localStorage.clear();
    this.webAuth.logout({
      federated: false,
      clientID: this.authConfig.clientID,
      returnTo: `https://${window.location.host}/auth/login`
    });
  }

  public getJwtInjectionConfig(): RefreshBody {
    return {
      accessToken: this.apiToken,
      refreshToken: this.refreshToken
    };
  }

  public isAuthenticated(): boolean {
    const expiresAt = JSON.parse(localStorage.getItem(this.intStorageKeys.apiExpiresAt));
    return new Date().getTime() < expiresAt;
  }


}

