import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  constructor(private httpClient: HttpClient) {}
  getProfile(): Observable<any> {
    const token = localStorage.getItem('token');

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.httpClient.get(`${environment.API_DOMAIN}/user/profile`, { headers });
  }

  updateProfile(profileData: {
    username: string;
    name: string;
    dob: string;
    idNumber: string;
    gender: number;
  }) {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    return this.httpClient.put<any>(`${environment.API_DOMAIN}/user/profile`, profileData, { headers });
  }
}
