import { Injectable } from '@angular/core';
import { ConfigService } from './config.service';
import { UrlGroup } from '../models/config.model';
import { CrudService } from './crud.service';
import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { Country } from '../models/culture-country.model';

@Injectable({
  providedIn: 'root'
})
export class CmsService {

  private language: string = '';
  private countryName: string = '';
  private applicationName: string = 'IndeHire';
  private cmsConfig: Subject<Country[]> = new BehaviorSubject<Country[]>(undefined);
  public cmsConfig$: Observable<Country[]> = this.cmsConfig.asObservable();

  constructor(private config: ConfigService, private crudService: CrudService) {
    this.language = sessionStorage.getItem('language') || 'en-us';
    this.countryName = sessionStorage.getItem('country') || 'US';
  }

  public get websiteUrl(): string {
    return this.config.getWebsiteUrl();
  }

  public get androidLink(): string {
    return this.config.getMobileLink('android');
  }

  public get iosLink(): string {
    return this.config.getMobileLink('ios');
  }

  get metadataUrls(): UrlGroup {
    return this.config.getApiUrls('cms');
  }

  get lookupUrls(): UrlGroup {
    return this.config.getApiUrls('cms');
  }

  get contractorTypeKey(): string {
    return localStorage.getItem('indehire-ContractorType');
  }

  public getLookupData<T>(lookupName: string, option?: any): Observable<T> {
    const relativeUrl = `v1/lookups/${this.language}/${lookupName}`;
    const queryString = `?applicationName=${this.applicationName}&countryName=${this.countryName}`;
    return this.crudService.getFromCache<T>(this.lookupUrls.read + relativeUrl + queryString, option);
  }

  public getLookupByContractor<T>(lookupName: string, option?: any): Observable<T> {
    const relativeUrl = `v1/lookups/${this.language}/${lookupName}`;
    const queryString =
    `?applicationName=${this.applicationName}&countryName=${this.countryName}&contractorTypeLookupCode=${this.contractorTypeKey}`;
    return this.crudService.getFromCache<T>(this.lookupUrls.read + relativeUrl + queryString, option);
  }

  public getMetadata<T>(metadataName: string, option?: any): Observable<T> {
    const relativeUrl = `v1/metadata/${this.language}/${metadataName}`;
    const queryString = `?applicationName=${this.applicationName}&countryName=${this.countryName}`;
    return this.crudService.getFromCache<T>(this.metadataUrls.read + relativeUrl + queryString, option);
  }

  public configureApplication<T>(culture: string, option?: any): Observable<T> {
    const url = `${this.metadataUrls.read}v1/applications/${this.applicationName}/${culture}`;
    return this.crudService.getFromCache<T>(url, option);
  }

  public setUpCms(): void {
    this.configureApplication<Country[]>('cultures').subscribe(
      (countries: Country[]) => {
        if (countries.length > 0) {
          this.cmsConfig.next(countries);
        }
      }
    );
  }

}
