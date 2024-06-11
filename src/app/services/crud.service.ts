import { Culture, Country } from './../models/culture-country.model';
import { Injectable } from '@angular/core';
import { Subject, BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { ConfigService } from './config.service';
// import { Config } from 'protractor';
import { catchError, map, tap } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { DialogService } from './dialog.service';
import { IdentityResponse } from '../models/command-api-res.model';
import { saveAs, encodeBase64 } from '@progress/kendo-file-saver';
@Injectable({
  providedIn: 'root'
})
export class CrudService {

  private cacheEnabled: boolean = true;
  private isDisconnected: boolean = false;
  private lang: Subject<any> = new BehaviorSubject<any>(undefined);
  public language$: Observable<any> = this.lang.asObservable();
  private language!: string;
  private countryName!: string;
  private cultureDesc!: string;
  private countryIcon!: string;
  private dateFormat!: string;
  // tslint:disable-next-line:max-line-length
  private readonly FLAG_US =
    'data:image/png;base64,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';

  constructor(
    private http: HttpClient,
    private configService: ConfigService,
    private dialogService: DialogService,
    private router: Router) {
    this.updateCultureAndLanguageSettings();

    this.configService.config$.subscribe((config: any) => {
      if (config) {
        this.cacheEnabled = config.enableCacheAspect && config.enableCacheAspect === 'true';
      }
    });
  }

  private updateCultureAndLanguageSettings(): void {
    this.language = sessionStorage.getItem('language') || 'en-us';
    this.countryName = sessionStorage.getItem('country') || 'US';
    this.countryIcon = sessionStorage.getItem('countryIcon') || this.FLAG_US;
    this.cultureDesc = sessionStorage.getItem('cultureDesc') || 'English';
    this.dateFormat = sessionStorage.getItem('dateFormat') || 'dd-MMM-yyyy';
    this.lang.next({
      language: this.language,
      country: this.countryName,
      countryIcon: this.countryIcon,
      cultureDesc: this.cultureDesc
    });
  }

  public changeCulture(
    culture: Culture,
    country: Country): void {
    this.language = culture.name;
    this.countryName = country.name;
    this.cultureDesc = culture.description;
    this.countryIcon = country.countryIcon;
    this.dateFormat = culture.dateFormat;
    sessionStorage.setItem('language', this.language);
    sessionStorage.setItem('country', this.countryName);
    sessionStorage.setItem('cultureDesc', this.cultureDesc);
    sessionStorage.setItem('countryIcon', this.countryIcon);
    sessionStorage.setItem('dateFormat', this.dateFormat);
    this.lang.next({
      language: this.language,
      country: this.countryName,
      cultureDesc: this.cultureDesc,
      countryIcon: country.countryIcon,
      dateFormat: this.dateFormat
    });
    location.reload();
  }

  post<T>(url: string, body?: any, option?: any): Observable<any> {
    return this.http
      .post(url, body, { ...option })
      .pipe(
        map((response: any) => {
          return this.handleCommand(response);
        }),
        catchError(this.handleError(`POST: ${url}`, null)));
  }

  put<T>(url: string, body: any, option?: any): Observable<any> {
    return this.http
      .put(url, body, { ...option, headers: {} })
      .pipe(
        map((response: any) => {
          return this.handleCommand(response);
        }),
        catchError(this.handleError(`PUT: ${url}`, null)));
  }

  public delete<T>(url: string, option?: any): Observable<any> {
    return this.http
    .delete(url, { ...option })
    .pipe(
      map((response: any) => {
        return this.handleCommand(response);
      }),
      catchError(this.handleError(`DELETE: ${url}`, null)));
  }

  public postIdentity(url: string, body: any, option?: any): Observable<any> {
    return this.http.post(url, body, { ...option })
      .pipe(catchError(this.handleError(`POST: ${url}`, null)));
  }


  public get<T>(url: string): Observable<any> {
    return this.http.get<any>(url).pipe(
      tap(_ => this.log(`fetched ${url}`)),
      catchError(this.handleError<any>(`GET: ${url}`, null))
    );
  }


  public customPDFDowload(url: string, type: string, name: string): Observable<any> {
    return this.http.get(url, {
      responseType: 'arraybuffer',
    }).pipe(
      map((response: ArrayBuffer) => {
        if (type === 'download') {
          const mediaType = 'application/pdf';
          const blob = new Blob([response], { type: mediaType });
          const filename = `${name}`;
          saveAs(blob, filename);
        } else {
          return response;
        }
      }));
  }


  public getFromCache<T>(url: string, option?: any): Observable<T> {
    return this.getCachedData<T>(url, option);
  }

  private getCachedData<T>(url: string, option?: any): Observable<T> {
      if (this.cacheEnabled && sessionStorage.getItem(url)) {
          //   console.log(`${url} returned from cache`);
          return of<any>(sessionStorage.getItem(url));
      } else {
          return this.http.get<T>(url).pipe(
              tap(_ => {
                  // console.log(this.cacheEnabled, url)
                  if (this.cacheEnabled) {
                      sessionStorage.setItem(url, JSON.stringify(_));
                  }
                  this.log(`fetched ${url}`);
              }),
              catchError(this.handleError<any>(`GET: ${url}`, null))
          );
      }
  }

  private handleCommand(response: IdentityResponse): any {
    if (response && !response.isError) {
      return response.result;
    } else if (response && response.isError) {
      this.dialogService.openSnackbar(response.message, 'error');
      return false;
    }
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead
      if (error.status === 0 && !this.isDisconnected) {
        this.isDisconnected = true;
        this.dialogService.openSnackbar('Network Connection: oh! Seems like you lost your internet connection, try again?',
          'info', 100);
      } else {
        this.dialogService.openSnackbar('We’re sorry! Something went wrong', 'error', 1000);
      }
      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  private handleErrorPassthrough(operation = 'operation') {
    return (error: any): Observable<any> => {
      console.error(error);
      if (error.status === 500) {
        this.dialogService.openCollapsibleSnackbar('We’re sorry! Something went wrong', 'error');
      }
      // this.log(`${operation} failed: ${error.message}`);
      return throwError(error);
    };
  }

  private log(message: string): void {
    return;
    console.log(message);
  }

  protected sanitizeUrl(url: string): string {
    return url.endsWith('/') ? url : url + '/';
  }

}
