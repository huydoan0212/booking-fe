import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import { Router } from '@angular/router';
import {Observable} from 'rxjs';
import {environment} from '../../environments/environment.development';
import { jwtDecode } from 'jwt-decode';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private httpClient: HttpClient,
              private router: Router
  ) {}
  userData: any = {};
  sendLoginForm(data: object): Observable<any> {
    return this.httpClient.post(
      `${environment.API_DOMAIN}/api/auth/login`,
      data
    );
  }
  sendRegisterForm(data: object): Observable<any> {
    return this.httpClient.post(
      `${environment.API_DOMAIN}/api/user/register`,
      data
    )
  }

  sendOTPForm(username: string, otp: string, otpType: string): Observable<any> {
    return this.httpClient.post(
      `${environment.API_DOMAIN}/api/user/check-otp?username=${username}&otp=${otp}&otpType=${otpType}`,
      null
    );
  }

  sendForgotPassword(username: string): Observable<any> {
    return this.httpClient.post(
      `${environment.API_DOMAIN}/api/user/forgot-password?username=${username}`,
      null
    );
  }

  saveUserInfo() {
    if (localStorage.getItem('token') !== null) {
      this.userData = jwtDecode(localStorage.getItem('token')!);
    }
  }
  signOut(): void {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}
