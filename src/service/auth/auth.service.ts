import {Injectable} from '@angular/core';

import {HttpClient, HttpParams} from '@angular/common/http';

import {Router} from '@angular/router';

import {Observable} from 'rxjs';

import {environment} from '../../environments/environment.development';

import {jwtDecode} from 'jwt-decode';


@Injectable({

  providedIn: 'root',

})

export class AuthService {

  private tokenKey = 'authToken';

  userData: any = {};


  constructor(
    private httpClient: HttpClient,
    private router: Router
  ) {

    this.saveUserInfo();

  }


  sendLoginForm(data: object): Observable<any> {

    return this.httpClient.post(
      `${environment.API_DOMAIN}/auth/login`,

      data
    );

  }


  sendRegisterForm(data: object): Observable<any> {

    return this.httpClient.post(
      `${environment.API_DOMAIN}/user/register`,

      data
    );

  }


  sendOTPForm(username: string, otp: string, otpType: string): Observable<any> {

    const params = new HttpParams()

      .set('username', username)

      .set('otp', otp)

      .set('otpType', otpType);


    return this.httpClient.post(
      `${environment.API_DOMAIN}/user/check-otp`,

      null,

      {params: params}
    );

  }


  sendForgotPassword(username: string): Observable<any> {

    const params = new HttpParams().set('username', username);

    return this.httpClient.post(
      `${environment.API_DOMAIN}/user/forgot-password`,

      null,

      {params: params}
    );

  }


  sendResetPassword(token: string, password: string, confirmPassword: string): Observable<any> {

    const body = {

      token,

      password,

      confirmPassword

    };


    return this.httpClient.post(
      `${environment.API_DOMAIN}/user/reset-password`,

      body
    );

  }


  setToken(token: string): void {

    localStorage.setItem(this.tokenKey, token);

    this.saveUserInfo();

  }


  getToken(): string | null {

    return localStorage.getItem(this.tokenKey);

  }


  removeToken(): void {

    localStorage.removeItem(this.tokenKey);

    this.userData = {};

  }


  isLoggedIn(): boolean {

    const token = this.getToken();

    return !!token && !this.isTokenExpired(token);

  }


  getUserRole(): string | null {

    const decodedToken = this.getDecodedToken();

    return decodedToken ? decodedToken.role : null;

  }

  getUsername(): string | null {

    const decodedToken = this.getDecodedToken();

    return decodedToken ? decodedToken.sub : null;

  }


  isTokenExpired(token: string): boolean {

    try {

      const decoded: any = jwtDecode(token);

      if (decoded.exp === undefined) {

        return false;

      }

      const date = new Date(0);

      date.setUTCSeconds(decoded.exp);

      return !(date.valueOf() > new Date().valueOf());

    } catch (e) {

      return true;

    }

  }


  getDecodedToken(): any {

    const token = this.getToken();

    try {

      return token ? jwtDecode(token) : null;

    } catch (Error) {

      return null;

    }

  }


  redirectToBasedOnRole(): void {

    const role = this.getUserRole();

    if (role === 'ROLE_ADMIN') {

      this.router.navigate(['/admin']);

    } else if (role === 'ROLE_USER') {

      this.router.navigate(['/home']);

    } else {

      this.router.navigate(['/login']);

    }

  }


  saveUserInfo() {

    const token = this.getToken();

    if (token) {

      this.userData = this.getDecodedToken();

    } else {

      this.userData = {};

    }

  }


  signOut(): void {

    this.removeToken();

    this.router.navigate(['/home']);

  }

}
