import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import {AuthService} from '../../../service/auth/auth.service';


@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const requiredRole = route.data['role'] as string;

    if (this.authService.isLoggedIn()) {
      const userRole = this.authService.getUserRole();

      if (requiredRole) {
        if (userRole === requiredRole) {
          return true;
        } else {
          return this.router.createUrlTree(['/home']);
        }
      } else {
        return true;
      }
    } else {
      return this.router.createUrlTree(['/home']);
    }
  }
}
