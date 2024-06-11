import { AuthConfig } from './auth-config.model';

export interface Config {
  apiUrls: ApiUrls;
  splashScreenStatus: 'everytime' | 'firsttime' | 'never';
  splashScreenDurationInSec: string;
  enableCacheAspect: string;
  websiteUrl: string;
  appStorePath: string;
  playStorePath: string;
  signupUrl: string;
  auth: AuthConfig;
}

export interface ApiUrls {
  adjuster: UrlGroup;
  identity: UrlGroup;
  cms: UrlGroup;
  notification: UrlGroup;
}

export interface UrlGroup {
  read: string;
  command: string;
}
