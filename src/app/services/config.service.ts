import { Injectable, ResolvedReflectiveFactory } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { of, Subject, BehaviorSubject, Observable } from 'rxjs';
import { Config, ApiUrls, UrlGroup } from '../models/config.model';
import { AuthConfig } from '../models/auth-config.model';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  private configVal: Config;
  private config: Subject<Config> = new BehaviorSubject<Config>(undefined);
  public config$: Observable<Config> = this.config.asObservable();

  constructor(private http: HttpClient) {
  }

  public load(): Promise<boolean> {
    return new Promise((resolve: Function, reject: Function): void => {
      this.http.get<Config>(`assets/config/config.json`).subscribe(
        (config: Config) => {
        this.configVal = config;
        this.config.next(config);
        resolve(true);
      });
    });
  }

  // public getConfig(): Config {
  //   return this.configVal;
  // }

  public getApiUrls(type: string): UrlGroup {
    return this.configVal.apiUrls[type];
  }

  public getAuthConfig(): AuthConfig {
    return this.configVal.auth;
  }

  public getWebsiteUrl(): string {
    return this.configVal.websiteUrl;
  }

  public getSignupUrl(): string {
    return this.configVal.signupUrl;
  }

  public getMobileLink(type: 'ios' | 'android'): string {
    const iosLink = this.configVal.appStorePath;
    const androidLink = this.configVal.playStorePath;
    switch (type) {
      case 'ios':
      return iosLink;
      case 'android':
      return androidLink;
    }
  }

}
