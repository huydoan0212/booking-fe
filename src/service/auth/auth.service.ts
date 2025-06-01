import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
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
    console.log(data);
    return this.httpClient.post(
      `${environment.API_DOMAIN}/api/auth/login`,
      data
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
