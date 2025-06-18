import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment.development';
import {AuthService} from '../../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  constructor(
    private httpClient: HttpClient,
    private authService: AuthService
  ) {}

  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    if (!token) {
      throw new Error('No authentication token found. Please log in.');
    }

    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  getProfile(): Observable<any> {
    try {
      const headers = this.getAuthHeaders();
      return this.httpClient.get(`${environment.API_DOMAIN}/user/profile`, { headers }).pipe(
        catchError(error => {
          if (error.status === 401 || error.status === 403) {
            this.authService.signOut();
          }
          return throwError(() => new Error('Failed to fetch profile: ' + error.message));
        })
      );
    } catch (error) {
      return throwError(() => error);
    }
  }

  updateProfile(profileData: {
    username: string;
    name: string;
    dob: string;
    idNumber: string;
    gender: number;
  }): Observable<any> {
    try {
      const headers = this.getAuthHeaders();
      return this.httpClient.put<any>(`${environment.API_DOMAIN}/user/profile`, profileData, { headers }).pipe(
        catchError(error => {
          if (error.status === 401 || error.status === 403) {
            this.authService.signOut();
          }
          return throwError(() => new Error('Failed to update profile: ' + error.message));
        })
      );
    } catch (error) {
      return throwError(() => error);
    }
  }
}
