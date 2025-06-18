import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {Observable} from 'rxjs';
import {environment} from '../../environments/environment.development';
import {jwtDecode} from 'jwt-decode';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private httpClient: HttpClient,
              private router: Router
  ) {
  }

  userData: any = {};
  private tokenKey = 'authToken';

  sendLoginForm(data: object): Observable<any> {
    return this.httpClient.post(
      `${environment.API_DOMAIN}/auth/login`,
      data
    );
    this.saveUserInfo();
  }

  sendRegisterForm(data: object): Observable<any> {
    return this.httpClient.post(
      `${environment.API_DOMAIN}/user/register`,
      data
    )
  }

  sendOTPForm(username: string, otp: string, otpType: string): Observable<any> {
    return this.httpClient.post(
      `${environment.API_DOMAIN}/user/check-otp?username=${username}&otp=${otp}&otpType=${otpType}`,
      null
    );
  }

  sendForgotPassword(username: string): Observable<any> {
    return this.httpClient.post(
      `${environment.API_DOMAIN}/user/forgot-password?username=${username}`,
      null
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
      console.error('Lỗi giải mã token:', Error);
      return null; // Token không hợp lệ
    }
  }

  redirectToBasedOnRole(): void {
    const role = this.getUserRole();
    if (role === 'ROLE_ADMIN') {
      this.router.navigate(['/admin']);
    } else if (role === 'ROLE_ADMIN') {
      this.router.navigate(['/home']);
    } else {
      this.router.navigate(['/login']);
    }
  }

  saveUserInfo() {
    if (localStorage.getItem('token') !== null) {
      this.userData = jwtDecode(localStorage.getItem('token')!);
    }
  }

  signOut(): void {
    localStorage.removeItem('token');
    this.router.navigate(['/home']);
  }


}
