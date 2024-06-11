import { IdentityResponse } from './../models/command-api-res.model';
import { ApiUrls } from './../models/config.model';
import { RefreshBody } from './../services/adjuster.service';
import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { AuthService } from './auth.service';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { parse } from 'url';
import { catchError, filter, take, switchMap } from 'rxjs/operators';
import { AdjusterService } from '../services/adjuster.service';
import { ConfigService } from '../services/config.service';
import { CrudService } from '../services/crud.service';
import { AccessToken, LoginResponse } from '../models/login.model';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  private isRefreshing: boolean = false;
  private refreshTokenSubject: BehaviorSubject<string> = new BehaviorSubject<string>(null);

  constructor(
      private authService: AuthService,
      private configService: ConfigService,
      private crudService: CrudService
    ) {}

  public intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    if (request.url === 'assets/config/config.json') {
      return next.handle(request);
    }

    if (request.url.match(this.configService.getApiUrls('cms').read)
    || request.url.match(this.configService.getApiUrls('identity').command)) {
        return next.handle(request);
    }

    if (this.authService.intStorageKeys.apiToken && this.authService.isAuthenticated()) {
        request = this.addToken(request, localStorage.getItem(this.authService.intStorageKeys.apiToken));
    }

    return next.handle(request).pipe<any>(catchError((error: Error) => {
        if (error instanceof HttpErrorResponse && error.status === 401) {
          return this.handle401Error(request, next);
        } else {
          return throwError(error);
        }
    }));
  }

  private addToken(request: HttpRequest<any>, token: string): HttpRequest<any> {
    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler) {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);
      const jwtInjectionConfig = this.authService.getJwtInjectionConfig();
      return this.refreshToken(jwtInjectionConfig).pipe(
        switchMap(refresh => {
          if (refresh && !refresh.isError) {
            const tokenRes: LoginResponse = refresh.result;
            this.isRefreshing = false;
            this.refreshTokenSubject.next(tokenRes.accessToken.token);
            this.setLocalhost(tokenRes);
            return next.handle(this.addToken(request, tokenRes.accessToken.token));
          } else if (refresh && refresh.isError) {
            localStorage.clear();
            this.authService.logout();
          } else {
            localStorage.clear();
            this.authService.logout();
          }
        }));
    } else {
      return this.refreshTokenSubject.pipe(
        filter(token => token != null),
        take(1),
        switchMap(jwt => {
          return next.handle(this.addToken(request, jwt));
        }));
    }
  }

  private refreshToken(refreshData: RefreshBody): Observable<IdentityResponse> {
    const url = this.configService.getApiUrls('identity').command + `api/Auth/refreshtoken`;
    return this.crudService.postIdentity(url, refreshData);
  }

  private setLocalhost(tokenDetails: LoginResponse): void {
    // Remove current token
    localStorage.removeItem(this.authService.intStorageKeys.apiToken);
    localStorage.removeItem(this.authService.intStorageKeys.apiExpiresAt);
    localStorage.removeItem(this.authService.intStorageKeys.refreshToken);
    // update new token
    const expiresAt = JSON.stringify((tokenDetails.accessToken.expiresIn * 1000) + new Date().getTime());
    localStorage.setItem(this.authService.intStorageKeys.apiToken, tokenDetails.accessToken.token);
    localStorage.setItem(this.authService.intStorageKeys.apiExpiresAt, expiresAt);
    localStorage.setItem(this.authService.intStorageKeys.refreshToken, tokenDetails.refreshToken);
  }

}
