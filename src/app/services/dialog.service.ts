import { Injectable } from '@angular/core';
import { Subject, BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DialogService {

  private snackbar: Subject<SnackbarConfig> = new BehaviorSubject<SnackbarConfig>(undefined);
  public snackbar$: Observable<SnackbarConfig> = this.snackbar.asObservable();
  private collapseSnackbar: Subject<CollapseSnackbarConfig> = new BehaviorSubject<CollapseSnackbarConfig>(undefined);
  public collapseSnackbar$: Observable<CollapseSnackbarConfig> = this.collapseSnackbar.asObservable();
  private loader: Subject<boolean> = new BehaviorSubject<boolean>(undefined);
  public loader$: Observable<boolean> = this.loader.asObservable();
  public loadingState: boolean;
  constructor() { }

  public isLoading(value: boolean): void {
    this.loadingState = value;
  }

  public enableLoader(): void {
    this.loader.next(true);
  }

  public disableLoader(): void {
    this.loader.next(false);
  }

  // to open an snackbar with timer
  public openSnackbar(msg: string, type: 'none' | 'success' | 'warning' | 'error' | 'info', time?: number): void {
    const config: SnackbarConfig = {
      message: msg,
      theme: type,
      duration: time || 300
    };
    this.snackbar.next(config);
  }

  // to open an snackbar without timer
  // User can close it manually
  public openCollapsibleSnackbar(msg: string, type: 'none' | 'success' | 'warning' | 'error' | 'info'): void {
    const config: CollapseSnackbarConfig = {
      message: msg,
      theme: type
    };
    this.collapseSnackbar.next(config);
  }

}
export interface SnackbarConfig {
  message: string;
  theme: 'none' | 'success' | 'warning' | 'error' | 'info';
  duration?: number;
}

export interface CollapseSnackbarConfig {
  message: string;
  theme: 'none' | 'success' | 'warning' | 'error' | 'info';
}
