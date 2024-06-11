import { AuthService } from './auth.service';
import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, CanLoad, Route, UrlSegment, ActivatedRouteSnapshot,
  RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class IndehireAuthGuard implements CanActivate, CanActivateChild, CanLoad {

  constructor(private authService: AuthService, private router: Router) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      if (!this.authService.apiToken) {
        this.router.navigate(['/auth/login']);
        return false;
      }
      if (state.url === '/profile-creation' && +localStorage.getItem('indehire_Prelim') === 4) {
        this.router.navigate(['/']);
        return false;
      }
      if (state.url !== '/profile-creation' && +localStorage.getItem('indehire_Prelim') < 4) {
        this.router.navigate(['/profile-creation'], { replaceUrl: true });
      }
      return true;
  }

  canActivateChild(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return true;
  }

  canLoad(
    route: Route,
    segments: UrlSegment[]): Observable<boolean> | Promise<boolean> | boolean {
    if (this.authService.apiToken) {
      this.router.navigate([''], { replaceUrl: true });
      return false;
    }
    return true;
  }
}
